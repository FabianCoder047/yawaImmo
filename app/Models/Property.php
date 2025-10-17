<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id', 'categorie_id', 'image', 'title', 'description', 'location', 
        'price', 'offre', 'status', 'published_at', 'additional_images',
        'client_name', 'client_surname', 'client_phone', 'reactivation_requested', 'reactivation_reason'
    ];

    protected $casts = [
    'published_at' => 'datetime',
    'additional_images' => 'array',
    'reactivation_requested' => 'boolean'
];
    
    protected $appends = ['all_image_urls'];
    
    /**
     * Récupère toutes les images du bien (image principale + images supplémentaires)
     */
    public function getAllImagesAttribute()
    {
        $images = [];
        
        // Ajouter l'image principale si elle existe
        if (!empty($this->image)) {
            $images[] = $this->image;
        }
        
        // Ajouter les images supplémentaires si elles existent
        if (!empty($this->additional_images) && is_array($this->additional_images)) {
            $images = array_merge($images, $this->additional_images);
        }
        
        // S'assurer qu'il n'y a pas de doublons
        return array_values(array_unique($images));
    }
    
    /**
     * Récupère l'URL complète de l'image
     */
    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
    
    /**
     * Récupère les URLs complètes des images supplémentaires
     */
    public function getAdditionalImagesUrlsAttribute()
    {
        if (empty($this->additional_images)) {
            return [];
        }
        
        return array_map(function($image) {
            return asset('storage/' . $image);
        }, $this->additional_images);
    }
    
    /**
     * Récupère toutes les URLs d'images (principale + supplémentaires)
     */
    public function getAllImageUrlsAttribute()
    {
        $urls = [];
        
        if (!empty($this->image)) {
            // Nettoyer le chemin de l'image principale
            $cleanImage = ltrim($this->image, '/');
            $cleanImage = str_replace('storage/', '', $cleanImage);
            $urls[] = asset('storage/' . $cleanImage);
        }
        
        if (!empty($this->additional_images) && is_array($this->additional_images)) {
            foreach ($this->additional_images as $image) {
                if (!empty($image)) {
                    // Nettoyer le chemin des images supplémentaires
                    $cleanImage = ltrim($image, '/');
                    $cleanImage = str_replace('storage/', '', $cleanImage);
                    $urls[] = asset('storage/' . $cleanImage);
                }
            }
        }
        
        return array_values(array_unique($urls));
    }
    
    /**
     * Supprime les fichiers images lors de la suppression du bien
     */
    protected static function boot()
    {
        parent::boot();
        
        static::deleting(function($property) {
            // Supprimer l'image principale
            if ($property->image) {
                \Storage::disk('public')->delete($property->image);
            }
            
            // Supprimer les images supplémentaires
            if (!empty($property->additional_images) && is_array($property->additional_images)) {
                foreach ($property->additional_images as $image) {
                    if (!empty($image)) {
                        \Storage::disk('public')->delete($image);
                    }
                }
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    public function isVisible(): bool
    {
        return $this->status === 'approuvé' &&
               $this->published_at !== null &&
               $this->published_at->lte(now());
    }
}

