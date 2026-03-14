<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Identity
            $table->string('name_en');
            $table->string('name_ne')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('pan_number', 20)->nullable();
            $table->string('vat_number', 20)->nullable();
            $table->string('company_type', 20); // CompanyType enum
            $table->date('incorporation_date')->nullable();

            // Address
            $table->string('district_en')->nullable();
            $table->string('district_ne')->nullable();
            $table->string('municipality_en')->nullable();
            $table->string('municipality_ne')->nullable();
            $table->string('ward')->nullable();
            $table->string('tole_en')->nullable();
            $table->string('tole_ne')->nullable();

            // Capital & Shares
            $table->bigInteger('authorized_capital')->nullable(); // in paisa
            $table->bigInteger('paid_up_capital')->nullable(); // in paisa
            $table->bigInteger('share_value')->nullable(); // per share, in paisa
            $table->integer('total_shares')->nullable();

            // Fiscal year (month-day format, e.g. "04-01" for Shrawan 1)
            $table->string('fiscal_year_start', 5)->nullable();
            $table->string('fiscal_year_end', 5)->nullable();

            // Contact
            $table->string('sector')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();

            // Banking
            $table->string('bank_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_branch')->nullable();

            // Auditor
            $table->string('auditor_name')->nullable();
            $table->string('auditor_firm')->nullable();
            $table->string('auditor_ican_number')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('company_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
