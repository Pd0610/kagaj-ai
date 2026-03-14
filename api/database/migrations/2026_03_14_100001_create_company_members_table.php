<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_members', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();

            // Role
            $table->string('role', 20); // MemberRole enum

            // Identity
            $table->string('name_en');
            $table->string('name_ne')->nullable();
            $table->string('father_name_en')->nullable();
            $table->string('father_name_ne')->nullable();
            $table->string('grandfather_name_en')->nullable();
            $table->string('grandfather_name_ne')->nullable();

            // Citizenship
            $table->string('citizenship_number')->nullable();
            $table->string('citizenship_issued_district')->nullable();
            $table->date('citizenship_issued_date')->nullable();

            // Address
            $table->string('district_en')->nullable();
            $table->string('district_ne')->nullable();
            $table->string('municipality_en')->nullable();
            $table->string('municipality_ne')->nullable();
            $table->string('ward')->nullable();

            // Contact
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();

            // Shares (for shareholders)
            $table->integer('share_count')->nullable();
            $table->decimal('share_percentage', 5, 2)->nullable();

            // Appointment
            $table->date('appointment_date')->nullable();
            $table->date('resignation_date')->nullable();
            $table->boolean('is_chairperson')->default(false);
            $table->boolean('is_managing_director')->default(false);

            $table->timestamps();
            $table->softDeletes();

            $table->index('company_id');
            $table->index('role');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_members');
    }
};
