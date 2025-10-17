<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categorie;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer des catégories de base
        Categorie::create(['name' => 'Appartement']);
        Categorie::create(['name' => 'Maison']);
        Categorie::create(['name' => 'Terrain']);
        Categorie::create(['name' => 'Bureau']);
        Categorie::create(['name' => 'Magasin']);
        
        // Créer des abonnements par défaut
        $this->call(SubscriptionSeeder::class);
    }
}
