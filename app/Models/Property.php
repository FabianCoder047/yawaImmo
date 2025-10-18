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
    
    protected static function booted()
    {
        static::retrieved(function ($property) {
            // S'assurer que additional_images est toujours un tableau
            if (is_string($property->additional_images)) {
                $property->additional_images = json_decode($property->additional_images, true) ?? [];
            } elseif (is_null($property->additional_images)) {
                $property->additional_images = [];
            }
        });
    }
    
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
    public function getFormattedAdditionalImagesAttribute()
    {
        if (empty($this->additional_images) || !is_array($this->additional_images)) {
            return [];
        }
        
        return array_map(function($image) {
            if (empty($image)) return null;
            
            // Nettoyer le chemin de l'image
            $cleanImage = ltrim($image, '/');
            $cleanImage = str_replace('storage/', '', $cleanImage);
            
            return [
                'original' => $image,
                'clean' => $cleanImage,
                'url' => asset('storage/' . $cleanImage),
                'exists' => \Storage::disk('public')->exists($cleanImage)
            ];
        }, $this->additional_images);
    }
    
    public function getAllImageUrlsAttribute()
    {
        $urls = [];
        
        // Ajouter l'image principale
        if (!empty($this->image)) {
            $cleanImage = ltrim($this->image, '/');
            $cleanImage = str_replace('storage/', '', $cleanImage);
            $urls[] = asset('storage/' . $cleanImage);
        }
        
        // Ajouter les images supplémentaires formatées
        $formattedAdditional = $this->formatted_additional_images;
        if (!empty($formattedAdditional)) {
            foreach ($formattedAdditional as $image) {
                if (!empty($image['url'])) {
                    $urls[] = $image['url'];
                }
            }
        }
        
        // Filtrer les doublons et réinitialiser les clés
        return array_values(array_unique(array_filter($urls)));
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

