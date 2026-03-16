<?php

namespace Database\Seeders;

use App\Enums\TemplateCategory;
use App\Models\Template;
use App\Models\TemplateVersion;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Board Resolution',
                'name_ne' => 'बोर्ड प्रस्ताव',
                'category' => TemplateCategory::BoardResolution,
                'description' => 'Standard board resolution for company decisions',
                'description_ne' => 'कम्पनी निर्णयहरूको लागि मानक बोर्ड प्रस्ताव',
                'is_premium' => false,
                'schema' => [
                    'slots' => [
                        ['name' => 'company_name', 'type' => 'text', 'label' => 'Company Name', 'label_ne' => 'कम्पनीको नाम', 'required' => true, 'source' => 'company'],
                        ['name' => 'registration_number', 'type' => 'text', 'label' => 'Registration Number', 'label_ne' => 'दर्ता नम्बर', 'required' => true, 'source' => 'company'],
                        ['name' => 'meeting_date', 'type' => 'date', 'label' => 'Meeting Date', 'label_ne' => 'बैठक मिति', 'required' => true],
                        ['name' => 'resolution_text', 'type' => 'textarea', 'label' => 'Resolution Text', 'label_ne' => 'प्रस्ताव पाठ', 'required' => true],
                        ['name' => 'chairperson_name', 'type' => 'text', 'label' => 'Chairperson Name', 'label_ne' => 'अध्यक्षको नाम', 'required' => true],
                    ],
                ],
                'blade_template' => '<h1>Board Resolution</h1><p>Company: {{ $company_name }} ({{ $registration_number }})</p><p>Date: {{ $meeting_date }}</p><p>{{ $resolution_text }}</p><p>Chairperson: {{ $chairperson_name }}</p>',
            ],
            [
                'name' => 'Company Registration Form',
                'name_ne' => 'कम्पनी दर्ता फारम',
                'category' => TemplateCategory::CompanyRegistration,
                'description' => 'Application form for company registration at OCR',
                'description_ne' => 'कम्पनी रजिस्ट्रार कार्यालयमा कम्पनी दर्ताको लागि आवेदन फारम',
                'is_premium' => false,
                'schema' => [
                    'slots' => [
                        ['name' => 'company_name', 'type' => 'text', 'label' => 'Proposed Company Name', 'label_ne' => 'प्रस्तावित कम्पनीको नाम', 'required' => true],
                        ['name' => 'company_type', 'type' => 'select', 'label' => 'Company Type', 'label_ne' => 'कम्पनीको प्रकार', 'required' => true, 'options' => ['private_limited', 'public_limited', 'single_person']],
                        ['name' => 'address', 'type' => 'text', 'label' => 'Registered Address', 'label_ne' => 'दर्ता ठेगाना', 'required' => true],
                        ['name' => 'objectives', 'type' => 'textarea', 'label' => 'Company Objectives', 'label_ne' => 'कम्पनीको उद्देश्य', 'required' => true],
                        ['name' => 'authorized_capital', 'type' => 'number', 'label' => 'Authorized Capital (NPR)', 'label_ne' => 'अधिकृत पूँजी (रु.)', 'required' => true],
                        ['name' => 'applicant_name', 'type' => 'text', 'label' => 'Applicant Name', 'label_ne' => 'निवेदकको नाम', 'required' => true],
                    ],
                ],
                'blade_template' => '<h1>Company Registration Application</h1><p>Name: {{ $company_name }}</p><p>Type: {{ $company_type }}</p><p>Address: {{ $address }}</p><p>Objectives: {{ $objectives }}</p><p>Capital: NPR {{ $authorized_capital }}</p><p>Applicant: {{ $applicant_name }}</p>',
            ],
            [
                'name' => 'Tax Clearance Request',
                'name_ne' => 'कर चुक्ता प्रमाणपत्र अनुरोध',
                'category' => TemplateCategory::TaxCompliance,
                'description' => 'Request letter for tax clearance certificate from IRD',
                'description_ne' => 'आन्तरिक राजस्व विभागबाट कर चुक्ता प्रमाणपत्रको लागि अनुरोध पत्र',
                'is_premium' => false,
                'schema' => [
                    'slots' => [
                        ['name' => 'company_name', 'type' => 'text', 'label' => 'Company Name', 'label_ne' => 'कम्पनीको नाम', 'required' => true, 'source' => 'company'],
                        ['name' => 'pan_number', 'type' => 'text', 'label' => 'PAN Number', 'label_ne' => 'स्थायी लेखा नम्बर', 'required' => true, 'source' => 'company'],
                        ['name' => 'fiscal_year', 'type' => 'text', 'label' => 'Fiscal Year', 'label_ne' => 'आर्थिक वर्ष', 'required' => true],
                        ['name' => 'purpose', 'type' => 'text', 'label' => 'Purpose of Clearance', 'label_ne' => 'कर चुक्ताको उद्देश्य', 'required' => true],
                        ['name' => 'date', 'type' => 'date', 'label' => 'Date', 'label_ne' => 'मिति', 'required' => true],
                    ],
                ],
                'blade_template' => '<h1>Tax Clearance Request</h1><p>To: Inland Revenue Department</p><p>Company: {{ $company_name }} (PAN: {{ $pan_number }})</p><p>Fiscal Year: {{ $fiscal_year }}</p><p>Purpose: {{ $purpose }}</p><p>Date: {{ $date }}</p>',
            ],
            [
                'name' => 'Employment Agreement',
                'name_ne' => 'रोजगारी सम्झौता',
                'category' => TemplateCategory::HrDocument,
                'description' => 'Standard employment agreement as per Nepal Labor Act',
                'description_ne' => 'नेपाल श्रम ऐन अनुसार मानक रोजगारी सम्झौता',
                'is_premium' => false,
                'schema' => [
                    'slots' => [
                        ['name' => 'company_name', 'type' => 'text', 'label' => 'Company Name', 'label_ne' => 'कम्पनीको नाम', 'required' => true, 'source' => 'company'],
                        ['name' => 'employee_name', 'type' => 'text', 'label' => 'Employee Name', 'label_ne' => 'कर्मचारीको नाम', 'required' => true],
                        ['name' => 'position', 'type' => 'text', 'label' => 'Position', 'label_ne' => 'पद', 'required' => true],
                        ['name' => 'salary', 'type' => 'number', 'label' => 'Monthly Salary (NPR)', 'label_ne' => 'मासिक तलब (रु.)', 'required' => true],
                        ['name' => 'start_date', 'type' => 'date', 'label' => 'Start Date', 'label_ne' => 'सुरु मिति', 'required' => true],
                        ['name' => 'probation_months', 'type' => 'number', 'label' => 'Probation Period (months)', 'label_ne' => 'परीक्षण अवधि (महिना)', 'required' => false],
                    ],
                ],
                'blade_template' => '<h1>Employment Agreement</h1><p>Employer: {{ $company_name }}</p><p>Employee: {{ $employee_name }}</p><p>Position: {{ $position }}</p><p>Salary: NPR {{ $salary }}/month</p><p>Start: {{ $start_date }}</p>',
            ],
            [
                'name' => 'Partnership Deed',
                'name_ne' => 'साझेदारी विलेख',
                'category' => TemplateCategory::LegalAgreement,
                'description' => 'Partnership deed for firm registration',
                'description_ne' => 'फर्म दर्ताको लागि साझेदारी विलेख',
                'is_premium' => false,
                'schema' => [
                    'slots' => [
                        ['name' => 'firm_name', 'type' => 'text', 'label' => 'Firm Name', 'label_ne' => 'फर्मको नाम', 'required' => true],
                        ['name' => 'partner_1_name', 'type' => 'text', 'label' => 'Partner 1 Name', 'label_ne' => 'साझेदार १ को नाम', 'required' => true],
                        ['name' => 'partner_2_name', 'type' => 'text', 'label' => 'Partner 2 Name', 'label_ne' => 'साझेदार २ को नाम', 'required' => true],
                        ['name' => 'business_type', 'type' => 'text', 'label' => 'Nature of Business', 'label_ne' => 'व्यवसायको प्रकृति', 'required' => true],
                        ['name' => 'capital_contribution', 'type' => 'number', 'label' => 'Total Capital (NPR)', 'label_ne' => 'कुल पूँजी (रु.)', 'required' => true],
                        ['name' => 'profit_sharing_ratio', 'type' => 'text', 'label' => 'Profit Sharing Ratio', 'label_ne' => 'नाफा बाँडफाँड अनुपात', 'required' => true],
                        ['name' => 'date', 'type' => 'date', 'label' => 'Date', 'label_ne' => 'मिति', 'required' => true],
                    ],
                ],
                'blade_template' => '<h1>Partnership Deed</h1><p>Firm: {{ $firm_name }}</p><p>Partners: {{ $partner_1_name }}, {{ $partner_2_name }}</p><p>Business: {{ $business_type }}</p><p>Capital: NPR {{ $capital_contribution }}</p><p>Profit Ratio: {{ $profit_sharing_ratio }}</p><p>Date: {{ $date }}</p>',
            ],
        ];

        foreach ($templates as $data) {
            $schema = $data['schema'];
            $bladeTemplate = $data['blade_template'];
            unset($data['schema'], $data['blade_template']);

            $template = Template::create($data);

            TemplateVersion::create([
                'template_id' => $template->id,
                'version' => 1,
                'schema' => $schema,
                'blade_template' => $bladeTemplate,
                'published_at' => now(),
            ]);
        }
    }
}
