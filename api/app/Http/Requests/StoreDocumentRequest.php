<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->filled('company_id')) {
            /** @var User $user */
            $user = $this->user();

            return Company::where('id', $this->input('company_id'))
                ->where('user_id', $user->id)
                ->exists();
        }

        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'template_id' => ['required', 'uuid', 'exists:templates,id'],
            'company_id' => ['nullable', 'uuid', 'exists:companies,id'],
            'slot_data' => ['required', 'array'],
            'slot_data.*' => ['nullable', 'string'],
        ];
    }
}
