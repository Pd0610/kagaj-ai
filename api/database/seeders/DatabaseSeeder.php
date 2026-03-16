<?php

namespace Database\Seeders;

use App\Enums\CompanyType;
use App\Enums\Plan;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ── Primary test user (Free plan) ──
        $surya = User::factory()->create([
            'name' => 'Surya Sharma',
            'email' => 'surya@test.com',
            'plan' => Plan::Free,
        ]);

        Company::create([
            'name' => 'Nepal Tech Pvt. Ltd.',
            'name_ne' => 'नेपाल टेक प्रा. लि.',
            'type' => CompanyType::PvtLtd,
            'registration_number' => 'REG-123456',
            'pan_number' => '601234567',
            'address' => 'Putalisadak, Kathmandu',
            'user_id' => $surya->id,
        ]);

        Company::create([
            'name' => 'Himalayan Traders',
            'name_ne' => 'हिमालयन ट्रेडर्स',
            'type' => CompanyType::SoleProprietorship,
            'registration_number' => null,
            'pan_number' => '602345678',
            'address' => 'New Road, Kathmandu',
            'user_id' => $surya->id,
        ]);

        // ── Pro user (for testing tier limits) ──
        $priya = User::factory()->pro()->create([
            'name' => 'Priya Adhikari',
            'email' => 'priya@test.com',
        ]);

        Company::create([
            'name' => 'Everest Consulting Group Pvt. Ltd.',
            'name_ne' => 'एभरेस्ट कन्सल्टिङ ग्रुप प्रा. लि.',
            'type' => CompanyType::PvtLtd,
            'registration_number' => 'REG-789012',
            'pan_number' => '603456789',
            'address' => 'Durbar Marg, Kathmandu',
            'user_id' => $priya->id,
        ]);

        Company::create([
            'name' => 'Lumbini Agro Partnership',
            'name_ne' => 'लुम्बिनी एग्रो साझेदारी',
            'type' => CompanyType::Partnership,
            'registration_number' => 'REG-345678',
            'pan_number' => '604567890',
            'address' => 'Siddharthanagar, Rupandehi',
            'user_id' => $priya->id,
        ]);

        Company::create([
            'name' => 'Pokhara IT Solutions Pvt. Ltd.',
            'name_ne' => 'पोखरा आईटी सोलुसन्स प्रा. लि.',
            'type' => CompanyType::PvtLtd,
            'registration_number' => 'REG-567890',
            'pan_number' => '605678901',
            'address' => 'Lakeside, Pokhara',
            'user_id' => $priya->id,
        ]);

        // ── Templates ──
        $this->call(TemplateSeeder::class);
    }
}
