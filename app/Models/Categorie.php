<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Property;

class Categorie extends Model
{
    protected $fillable = [
        'name',
    ];

    /**
     * Get the properties for the category.
     */
    public function properties()
    {
        return $this->hasMany(Property::class);
    }
}
