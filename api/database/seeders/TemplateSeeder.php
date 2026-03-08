<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        Template::create([
            'slug' => 'company-userid-password-change',
            'name_en' => 'Company User ID / Password Change Request',
            'name_ne' => 'कम्पनीको नयाँ यूजर आईडी तथा पासवर्ड परिवर्तन',
            'category' => 'ocr',
            'description_en' => 'Application letter to the Company Registrar for changing company user ID, email, and phone number — includes board resolution.',
            'description_ne' => 'कम्पनी रजिष्ट्रारको कार्यालयमा यूजर आईडी, इमेल तथा फोन नम्बर परिवर्तनको लागि निवेदन — संचालक समितिको निर्णय सहित।',
            'schema' => self::userIdChangeSchema(),
            'html_body' => self::userIdChangeHtml(),
            'version' => 1,
            'is_published' => true,
            'price' => 0,
            'sort_order' => 1,
        ]);

        Template::create([
            'slug' => 'board-meeting-minute',
            'name_en' => 'Board Meeting Minute',
            'name_ne' => 'सञ्चालक समिति बैठक मिनेट',
            'category' => 'ocr',
            'description_en' => 'Standard board meeting minute for any company resolution — bank account opening, director changes, share transfers, etc.',
            'description_ne' => 'कुनै पनि कम्पनी प्रस्तावको लागि मानक सञ्चालक समिति बैठक मिनेट',
            'schema' => [
                'slots' => [
                    ['key' => 'company_name', 'label_en' => 'Company Name', 'label_ne' => 'कम्पनीको नाम', 'type' => 'text', 'required' => true, 'ai_hint' => 'Full registered company name including Pvt. Ltd.', 'group' => 'company_details'],
                    ['key' => 'meeting_date', 'label_en' => 'Meeting Date (BS)', 'label_ne' => 'बैठक मिति', 'type' => 'date_bs', 'required' => true, 'ai_hint' => 'Date of the board meeting in Bikram Sambat', 'group' => 'meeting_details'],
                    ['key' => 'meeting_time', 'label_en' => 'Meeting Time', 'label_ne' => 'बैठक समय', 'type' => 'text', 'required' => true, 'ai_hint' => 'Time the meeting started, e.g. दिनको २:०० बजे', 'group' => 'meeting_details'],
                    ['key' => 'meeting_venue', 'label_en' => 'Meeting Venue', 'label_ne' => 'बैठक स्थान', 'type' => 'text', 'required' => true, 'ai_hint' => 'Where the meeting was held, typically registered office', 'group' => 'meeting_details'],
                    ['key' => 'chairperson_name', 'label_en' => 'Chairperson Name', 'label_ne' => 'अध्यक्षको नाम', 'type' => 'text', 'required' => true, 'ai_hint' => 'Name of the person chairing the meeting', 'group' => 'meeting_details'],
                    ['key' => 'resolution_type', 'label_en' => 'Resolution Type', 'label_ne' => 'प्रस्ताव प्रकार', 'type' => 'text', 'required' => true, 'ai_hint' => 'Type of resolution being passed', 'group' => 'resolution'],
                    ['key' => 'resolution_details', 'label_en' => 'Resolution Details', 'label_ne' => 'प्रस्ताव विवरण', 'type' => 'textarea', 'required' => true, 'ai_hint' => 'Full text of the resolution', 'group' => 'resolution'],
                    ['key' => 'attendees', 'label_en' => 'Attendees', 'label_ne' => 'उपस्थित सदस्यहरू', 'type' => 'repeatable', 'required' => true, 'min_items' => 2, 'fields' => [
                        ['key' => 'name', 'label_en' => 'Name', 'label_ne' => 'नाम', 'type' => 'text', 'required' => true],
                        ['key' => 'designation', 'label_en' => 'Designation', 'label_ne' => 'पद', 'type' => 'text', 'required' => true],
                    ], 'group' => 'meeting_details'],
                ],
                'groups' => [
                    ['key' => 'company_details', 'label_en' => 'Company Details', 'label_ne' => 'कम्पनी विवरण', 'order' => 1],
                    ['key' => 'meeting_details', 'label_en' => 'Meeting Details', 'label_ne' => 'बैठक विवरण', 'order' => 2],
                    ['key' => 'resolution', 'label_en' => 'Resolution', 'label_ne' => 'प्रस्ताव', 'order' => 3],
                ],
            ],
            'html_body' => '<h1>Board Meeting Minute</h1><p>Company: {{ $company_name }}</p>',
            'version' => 1,
            'is_published' => true,
            'price' => 0,
            'sort_order' => 2,
        ]);

        Template::create([
            'slug' => 'house-rental-agreement',
            'name_en' => 'House Rental Agreement',
            'name_ne' => 'घर भाडा सम्झौता',
            'category' => 'rental',
            'description_en' => 'Standard house rental agreement between landlord and tenant with all legal provisions under Nepal law.',
            'description_ne' => 'घरधनी र भाडावालबीचको मानक घर भाडा सम्झौता',
            'schema' => [
                'slots' => [
                    ['key' => 'landlord_name', 'label_en' => 'Landlord Name', 'label_ne' => 'घरधनीको नाम', 'type' => 'text', 'required' => true, 'ai_hint' => 'Full name of the property owner', 'group' => 'landlord'],
                    ['key' => 'tenant_name', 'label_en' => 'Tenant Name', 'label_ne' => 'भाडावालको नाम', 'type' => 'text', 'required' => true, 'ai_hint' => 'Full name of the tenant', 'group' => 'tenant'],
                    ['key' => 'property_address', 'label_en' => 'Property Address', 'label_ne' => 'सम्पत्ति ठेगाना', 'type' => 'text', 'required' => true, 'ai_hint' => 'Full address of the rental property', 'group' => 'property'],
                    ['key' => 'monthly_rent', 'label_en' => 'Monthly Rent (NPR)', 'label_ne' => 'मासिक भाडा', 'type' => 'currency', 'required' => true, 'ai_hint' => 'Monthly rent amount in Nepali Rupees', 'group' => 'terms'],
                    ['key' => 'agreement_start', 'label_en' => 'Start Date', 'label_ne' => 'सुरु मिति', 'type' => 'date_bs', 'required' => true, 'ai_hint' => 'Agreement start date in BS', 'group' => 'terms'],
                    ['key' => 'agreement_duration', 'label_en' => 'Duration (months)', 'label_ne' => 'अवधि (महिना)', 'type' => 'number', 'required' => true, 'ai_hint' => 'Duration of the rental agreement in months', 'group' => 'terms'],
                ],
                'groups' => [
                    ['key' => 'landlord', 'label_en' => 'Landlord Details', 'label_ne' => 'घरधनी विवरण', 'order' => 1],
                    ['key' => 'tenant', 'label_en' => 'Tenant Details', 'label_ne' => 'भाडावाल विवरण', 'order' => 2],
                    ['key' => 'property', 'label_en' => 'Property Details', 'label_ne' => 'सम्पत्ति विवरण', 'order' => 3],
                    ['key' => 'terms', 'label_en' => 'Agreement Terms', 'label_ne' => 'सम्झौता सर्तहरू', 'order' => 4],
                ],
            ],
            'html_body' => '<h1>House Rental Agreement</h1><p>Between {{ $landlord_name }} and {{ $tenant_name }}</p>',
            'version' => 1,
            'is_published' => true,
            'price' => 0,
            'sort_order' => 3,
        ]);
    }

    /**
     * Full slot schema for Company User ID/Password Change Request.
     *
     * This document is a bundle: application letter + board resolution.
     * Based on real CA partner document (saplr.docx).
     */
    private static function userIdChangeSchema(): array
    {
        return [
            'slots' => [
                // Company details
                [
                    'key' => 'company_name_ne',
                    'label_en' => 'Company Name (Nepali)',
                    'label_ne' => 'कम्पनीको नाम',
                    'type' => 'text_ne',
                    'required' => true,
                    'ai_hint' => 'Registered company name in Devanagari, e.g. टिकट सञ्जाल प्रा. लि.',
                    'group' => 'company',
                    'display_order' => 1,
                ],
                [
                    'key' => 'company_registration_no',
                    'label_en' => 'Company Registration Number',
                    'label_ne' => 'कम्पनी दर्ता नम्बर',
                    'type' => 'registration_no',
                    'required' => true,
                    'ai_hint' => 'OCR registration number, e.g. 308132',
                    'group' => 'company',
                    'display_order' => 2,
                ],

                // Application letter details
                [
                    'key' => 'application_date_bs',
                    'label_en' => 'Application Date (BS)',
                    'label_ne' => 'निवेदन मिति',
                    'type' => 'date_bs',
                    'required' => true,
                    'ai_hint' => 'Date on the application letter in BS, e.g. २०८२/०८/०७',
                    'default' => '$TODAY_BS',
                    'group' => 'application',
                    'display_order' => 3,
                ],
                [
                    'key' => 'change_reason',
                    'label_en' => 'Reason for Change',
                    'label_ne' => 'परिवर्तनको कारण',
                    'type' => 'textarea',
                    'required' => true,
                    'ai_hint' => 'Why the user ID/password change is needed, e.g. old mobile number no longer in use',
                    'group' => 'application',
                    'display_order' => 4,
                ],
                [
                    'key' => 'applicant_name_ne',
                    'label_en' => 'Applicant Name (Nepali)',
                    'label_ne' => 'निवेदकको नाम',
                    'type' => 'text_ne',
                    'required' => true,
                    'ai_hint' => 'Name of the person submitting the application in Devanagari',
                    'group' => 'application',
                    'display_order' => 5,
                ],
                [
                    'key' => 'applicant_designation',
                    'label_en' => 'Applicant Designation',
                    'label_ne' => 'निवेदकको पद',
                    'type' => 'text_ne',
                    'required' => true,
                    'ai_hint' => 'Position of applicant, e.g. संचालक (Director)',
                    'group' => 'application',
                    'display_order' => 6,
                ],

                // New credentials
                [
                    'key' => 'new_user_id',
                    'label_en' => 'New User ID',
                    'label_ne' => 'नयाँ यूजर आईडी',
                    'type' => 'text',
                    'required' => true,
                    'ai_hint' => 'Proposed new user ID for the OCR portal',
                    'group' => 'credentials',
                    'display_order' => 7,
                ],
                [
                    'key' => 'new_email',
                    'label_en' => 'New Email Address',
                    'label_ne' => 'नयाँ इमेल ठेगाना',
                    'type' => 'email',
                    'required' => true,
                    'ai_hint' => 'New email address to register with OCR portal',
                    'group' => 'credentials',
                    'display_order' => 8,
                ],
                [
                    'key' => 'new_phone',
                    'label_en' => 'New Phone Number',
                    'label_ne' => 'नयाँ फोन नम्बर',
                    'type' => 'phone',
                    'required' => true,
                    'ai_hint' => 'New mobile number, Nepal format e.g. 9841XXXXXX',
                    'group' => 'credentials',
                    'display_order' => 9,
                ],

                // Board resolution details
                [
                    'key' => 'resolution_date_bs',
                    'label_en' => 'Board Resolution Date (BS)',
                    'label_ne' => 'संचालक समिति बैठक मिति',
                    'type' => 'date_bs',
                    'required' => true,
                    'ai_hint' => 'Date of the board meeting that passed the resolution, in BS',
                    'group' => 'resolution',
                    'display_order' => 10,
                ],
                [
                    'key' => 'resolution_time',
                    'label_en' => 'Meeting Time',
                    'label_ne' => 'बैठक समय',
                    'type' => 'text',
                    'required' => true,
                    'ai_hint' => 'Time the board meeting started, e.g. दिनको २:०० बजे',
                    'group' => 'resolution',
                    'display_order' => 11,
                ],
                [
                    'key' => 'meeting_venue_ne',
                    'label_en' => 'Meeting Venue',
                    'label_ne' => 'बैठक स्थान',
                    'type' => 'text_ne',
                    'required' => true,
                    'ai_hint' => 'Where the meeting was held, typically कम्पनीको रजिष्टर्ड कार्यालय',
                    'default' => 'कम्पनीको रजिष्टर्ड कार्यालय',
                    'group' => 'resolution',
                    'display_order' => 12,
                ],
                [
                    'key' => 'chairperson_name_ne',
                    'label_en' => 'Chairperson Name',
                    'label_ne' => 'अध्यक्षको नाम',
                    'type' => 'text_ne',
                    'required' => true,
                    'ai_hint' => 'Name of the person chairing the board meeting, in Nepali',
                    'group' => 'resolution',
                    'display_order' => 13,
                ],
                [
                    'key' => 'authorized_person_ne',
                    'label_en' => 'Authorized Person for Verification',
                    'label_ne' => 'सनाखतको लागि अख्तियारी पाउने व्यक्ति',
                    'type' => 'text_ne',
                    'required' => true,
                    'ai_hint' => 'Director/shareholder authorized to appear at OCR for identity verification',
                    'group' => 'resolution',
                    'display_order' => 14,
                ],

                // Attendees (repeatable)
                [
                    'key' => 'board_attendees',
                    'label_en' => 'Board Meeting Attendees',
                    'label_ne' => 'बैठकमा उपस्थित सदस्यहरू',
                    'type' => 'repeatable',
                    'required' => true,
                    'min_items' => 2,
                    'max_items' => 20,
                    'ai_hint' => 'Directors/shareholders present at the board meeting',
                    'fields' => [
                        [
                            'key' => 'name_ne',
                            'label_en' => 'Name (Nepali)',
                            'label_ne' => 'नाम',
                            'type' => 'text_ne',
                            'required' => true,
                        ],
                        [
                            'key' => 'designation_ne',
                            'label_en' => 'Designation',
                            'label_ne' => 'पद',
                            'type' => 'text_ne',
                            'required' => true,
                            'ai_hint' => 'e.g. अध्यक्ष/संचालक, संचालक/शेयरधनी',
                        ],
                    ],
                    'group' => 'resolution',
                    'display_order' => 15,
                ],

                // Attached documents checklist
                [
                    'key' => 'attached_documents',
                    'label_en' => 'Attached Documents',
                    'label_ne' => 'संलग्न कागजातहरू',
                    'type' => 'repeatable',
                    'required' => true,
                    'min_items' => 1,
                    'max_items' => 10,
                    'ai_hint' => 'List of documents attached with the application',
                    'fields' => [
                        [
                            'key' => 'document_name_ne',
                            'label_en' => 'Document Name',
                            'label_ne' => 'कागजातको नाम',
                            'type' => 'text_ne',
                            'required' => true,
                        ],
                    ],
                    'default' => [
                        ['document_name_ne' => 'संचालक समितिको निर्णयको प्रतिलिपिहरु'],
                        ['document_name_ne' => 'अनुसूची १ बमोजिमको फाराम'],
                        ['document_name_ne' => 'कम्पनीको दर्ता प्रमाण पत्रको प्रतिलिपि'],
                        ['document_name_ne' => 'सनाखतमा उपस्थित हुने सञ्चालक/शेयरधनीको नागरिकता प्रमाणपत्रको प्रतिलिपि'],
                    ],
                    'group' => 'application',
                    'display_order' => 16,
                ],
            ],
            'groups' => [
                ['key' => 'company', 'label_en' => 'Company Details', 'label_ne' => 'कम्पनी विवरण', 'order' => 1],
                ['key' => 'credentials', 'label_en' => 'New Credentials', 'label_ne' => 'नयाँ विवरणहरू', 'order' => 2],
                ['key' => 'application', 'label_en' => 'Application Letter', 'label_ne' => 'निवेदन', 'order' => 3],
                ['key' => 'resolution', 'label_en' => 'Board Resolution', 'label_ne' => 'संचालक समिति निर्णय', 'order' => 4],
            ],
        ];
    }

    /**
     * HTML body template for User ID/Password Change Request.
     * Two-part document: application letter + board resolution.
     */
    private static function userIdChangeHtml(): string
    {
        return <<<'HTML'
<div class="document" lang="ne">

  <!-- Part 1: Application Letter -->
  <div class="page application-letter">
    <div class="letterhead">
      <h2>{{ $company_name_ne }}</h2>
    </div>

    <p class="date">मिति: {{ $application_date_bs }}</p>

    <div class="addressee">
      <p>श्रीमान् कम्पनी रजिष्ट्रार ज्यू</p>
      <p>कम्पनी रजिष्ट्रारको कार्यालय</p>
      <p>त्रिपुरेश्वर, काठमाण्डौ।</p>
    </div>

    <p class="subject"><strong>विषय: कम्पनीको नयाँ यूजर आईडी तथा पासवर्ड सम्बन्धमा।</strong></p>

    <p>महोदय,</p>

    <p>उपरोक्त सम्बन्धमा यस {{ $company_name_ne }} ({{ $company_registration_no }}) को {{ $change_reason }} उक्त विवरण परिवर्तन गर्न आवश्यक पर्ने तपसिल बमोजिमका कागजातहरु संलग्न गरी यो निवेदन पेश गरेको छु। कागजातहरु रुजु गरी कम्पनीको यूजर आईडी, इमेल ठेगाना तथा मोवाइल नम्बर परिवर्तन गरी पाउँन सादर अनुरोध गर्दछु।</p>

    <div class="attachments">
      <p><strong>संलग्न कागजातहरू</strong></p>
      <ol>
        @foreach($attached_documents as $index => $doc)
        <li>{{ $doc['document_name_ne'] }}</li>
        @endforeach
      </ol>
    </div>

    <div class="signature-block">
      <p>निवेदक</p>
      <p class="name">{{ $applicant_name_ne }}</p>
      <p class="designation">{{ $applicant_designation }}</p>
    </div>
  </div>

  <!-- Part 2: Board Resolution -->
  <div class="page board-resolution" style="page-break-before: always;">
    <div class="resolution-header">
      <h2>{{ $company_name_ne }}</h2>
      <p>को</p>
      <h3>संचालक समितिको बैठकको निर्णय</h3>
    </div>

    <p>आज मिति {{ $resolution_date_bs }} गतेका दिन {{ $resolution_time }} यस {{ $company_name_ne }} को संचालक समितिको बैठक {{ $meeting_venue_ne }}मा अध्यक्ष {{ $chairperson_name_ne }} को अध्यक्षतामा बसी तपसिल बमोजिम निर्णयहरू पारित गरियो।</p>

    <div class="attendees">
      <p><strong>उपस्थितीः</strong></p>
      <table class="attendee-table">
        <thead>
          <tr>
            <th>क्र.सं.</th>
            <th>नाम</th>
            <th>पद</th>
            <th>दस्तखत</th>
          </tr>
        </thead>
        <tbody>
          @foreach($board_attendees as $index => $attendee)
          <tr>
            <td>{{ $index + 1 }}.</td>
            <td>{{ $attendee['name_ne'] }}</td>
            <td>{{ $attendee['designation_ne'] }}</td>
            <td></td>
          </tr>
          @endforeach
        </tbody>
      </table>
    </div>

    <div class="quorum">
      <p><strong>बैठकको गणपूरक संख्या</strong></p>
      <p>कम्पनी ऐन तथा कम्पनीको नियमावली बमोजिम सञ्चालक समितिको बैठक बस्नको लागि आवश्यक गणपूरक संख्या पुगेको हुँदा आजको यस बैठकको काम कारवाही अगाडि बढाइयो।</p>
    </div>

    <div class="agenda">
      <p><strong>छलफलका लागि प्रस्ताव गरिएका विषयहरुः</strong></p>
      <ol>
        <li>कम्पनीको नयाँ यूजर आईडी तथा पासवर्ड सम्बन्धमा।</li>
        <li>सनाखतको अख्तियारी सम्बन्धमा।</li>
        <li>विविध।</li>
      </ol>
    </div>

    <div class="decisions">
      <p><strong>निर्णयहरुः</strong></p>

      <p><strong>१.</strong> प्रस्ताव नं.१ माथि छलफल हुँदा यस प्रा.लि. को साविकमा कायम रहेको यूजर आईडी तथा पासवर्ड, मोबाइल नम्बर हाल प्रयोगमा नरहेको हुँदा उक्त विवरण परिवर्तन गर्न आवश्यक भएको हुँदा तपसिल बमोजिम हुने गरी विवरणहरु परिवर्तन गर्ने निर्णय गरियो।</p>

      <div class="new-credentials">
        <p>कम्पनीको प्रस्तावित नयाँ</p>
        <p>यूजर आई डिः {{ $new_user_id }}</p>
        <p>इमेल ठेगाना: {{ $new_email }}</p>
        <p>फोन नम्बर: {{ $new_phone }}</p>
      </div>

      <p><strong>२.</strong> प्रस्ताव नं.२ माथि छलफल हुँदा निर्णय नम्बर १ बमोजिमको कार्य गर्नको लागि कम्पनी रजिष्ट्रारको कार्यालयमा उपस्थित भई सनाखत गर्नको लागि सञ्चालक श्री {{ $authorized_person_ne }} लाई अख्तियारी प्रदान गर्ने निर्णय गरियो।</p>

      <p><strong>३.</strong> अन्त्यमा, छलफलका अन्य विषय नभएकाले अध्यक्षज्यूले उपस्थित सबै महानुभावहरुलाई धन्यवाद ज्ञापन गर्दै बैठक समापन भएको घोषणा गर्नुभयो।</p>
    </div>
  </div>

</div>
HTML;
    }
}
