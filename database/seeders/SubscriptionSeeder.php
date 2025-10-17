<?php

namespace Database\Seeders;

use App\Models\Subscription;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Subscription::create([
            'name' => 'Plan Basique',
            'description' => 'Accès aux fonctionnalités de base pour publier vos biens',
            'price' => 5000.00,
            'duration_months' => 1,
            'is_active' => true,
        ]);

        Subscription::create([
            'name' => 'Plan Premium',
            'description' => 'Accès complet avec fonctionnalités avancées',
            'price' => 10000.00,
            'duration_months' => 1,
            'is_active' => true,
        ]);

        Subscription::create([
            'name' => 'Plan Annuel',
            'description' => 'Économisez avec notre plan annuel',
            'price' => 100000.00,
            'duration_months' => 12,
            'is_active' => true,
        ]);
    }
} 