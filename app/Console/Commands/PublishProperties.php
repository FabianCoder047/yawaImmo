<?php

namespace App\Console\Commands;

use App\Models\Property;
use Illuminate\Console\Command;

class PublishProperties extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'properties:publish';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publier automatiquement les propriétés après 24h';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $properties = Property::where('status', 'En attente')
            ->where('published_at', '<=', now())
            ->get();

        $count = 0;
        foreach ($properties as $property) {
            $property->update(['status' => 'approuvé']);
            $count++;
        }

        $this->info("{$count} propriétés ont été publiées automatiquement.");
    }
} 