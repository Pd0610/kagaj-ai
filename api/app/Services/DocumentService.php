<?php

namespace App\Services;

use App\Contracts\PdfGenerator;
use App\Enums\Plan;
use App\Exceptions\TierLimitException;
use App\Models\Company;
use App\Models\Document;
use App\Models\Template;
use App\Models\TemplateVersion;
use App\Models\User;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class DocumentService
{
    /** @var array<string, string> */
    private const COMPANY_FIELD_MAP = [
        'company_name' => 'name',
        'company_name_ne' => 'name_ne',
        'registration_number' => 'registration_number',
        'pan_number' => 'pan_number',
        'address' => 'address',
    ];

    public function __construct(
        private readonly PdfGenerator $pdfGenerator,
    ) {}

    /**
     * @param  array<string, string>  $slotData
     *
     * @throws TierLimitException
     * @throws ValidationException
     */
    public function generate(User $user, Template $template, array $slotData, ?Company $company = null): Document
    {
        // 1. Tier check
        $currentMonthCount = $user->documents()->currentMonth()->count();
        if (! TierService::canGenerateDocument($user->plan, $currentMonthCount)) {
            throw new TierLimitException(
                'Monthly document limit reached for your plan. Upgrade to generate more documents.'
            );
        }

        // 2. Premium check
        if ($template->is_premium && ! TierService::canAccessPremiumTemplates($user->plan)) {
            throw new HttpException(403, 'Premium templates require a Pro or Enterprise plan.');
        }

        // 3. Resolve version
        /** @var TemplateVersion|null $version */
        $version = $template->latestPublishedVersion;
        if ($version === null) {
            throw new HttpException(422, 'This template has no published version.');
        }

        // 4. Validate required slots
        /** @var array{slots: list<array{name: string, type: string, label: string, required: bool, source?: string}>} $schema */
        $schema = $version->schema;
        $this->validateRequiredSlots($schema['slots'], $slotData);

        // 5. Merge company data
        $mergedSlotData = $this->mergeCompanyData($schema['slots'], $slotData, $company);

        // 6. Generate reference number
        $referenceNumber = $this->generateReferenceNumber();

        // 7. Render HTML
        $html = Blade::render($version->blade_template, $mergedSlotData);

        // 8. Watermark for free tier
        if ($user->plan === Plan::Free) {
            $html = $this->appendWatermark($html);
        }

        // 9. Generate PDF
        $storagePath = 'documents/'.$referenceNumber.'.pdf';
        $fullPath = Storage::disk('local')->path($storagePath);

        // Ensure directory exists
        $dir = dirname($fullPath);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $this->pdfGenerator->generate($html, $fullPath);

        // 10. Create document record
        $title = $template->name.' - '.now()->format('Y-m-d');

        /** @var Document $document */
        $document = $user->documents()->create([
            'company_id' => $company?->id,
            'template_id' => $template->id,
            'template_version_id' => $version->id,
            'title' => $title,
            'reference_number' => $referenceNumber,
            'slot_data' => $mergedSlotData,
            'pdf_path' => $storagePath,
        ]);

        return $document;
    }

    /**
     * @param  list<array{name: string, type: string, label: string, required: bool, source?: string}>  $slots
     * @param  array<string, string>  $slotData
     *
     * @throws ValidationException
     */
    private function validateRequiredSlots(array $slots, array $slotData): void
    {
        $errors = [];

        foreach ($slots as $slot) {
            if ($slot['required'] && empty($slotData[$slot['name']] ?? null)) {
                // Skip company-source slots — they'll be filled from the company
                if (($slot['source'] ?? '') === 'company') {
                    continue;
                }
                $errors['slot_data.'.$slot['name']] = [$slot['label'].' is required.'];
            }
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }

    /**
     * @param  list<array{name: string, type: string, label: string, required: bool, source?: string}>  $slots
     * @param  array<string, string>  $slotData
     * @return array<string, string>
     */
    private function mergeCompanyData(array $slots, array $slotData, ?Company $company): array
    {
        $merged = $slotData;

        if ($company === null) {
            return $merged;
        }

        foreach ($slots as $slot) {
            if (($slot['source'] ?? '') !== 'company') {
                continue;
            }

            // Don't override user-provided values
            if (! empty($merged[$slot['name']] ?? null)) {
                continue;
            }

            $companyField = self::COMPANY_FIELD_MAP[$slot['name']] ?? null;
            if ($companyField !== null) {
                $value = $company->getAttribute($companyField);
                if ($value !== null) {
                    $merged[$slot['name']] = (string) $value;
                }
            }
        }

        return $merged;
    }

    private function generateReferenceNumber(): string
    {
        $count = Document::count() + 1;

        return 'KAG-'.now()->format('Y').'-'.str_pad((string) $count, 5, '0', STR_PAD_LEFT);
    }

    private function appendWatermark(string $html): string
    {
        $watermark = '<div style="position:fixed;bottom:10mm;left:0;right:0;text-align:center;font-size:8pt;opacity:0.4;color:#666;">Generated with KagajAI &middot; kagaj.ai</div>';

        return $html.$watermark;
    }
}
