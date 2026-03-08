<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('name_en');
            $table->string('name_ne');
            $table->string('category', 50);
            $table->text('description_en')->nullable();
            $table->text('description_ne')->nullable();
            $table->json('schema');
            $table->longText('html_body');
            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_published')->default(false);
            $table->unsignedInteger('price')->default(0);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('category');
            $table->index('is_published');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
