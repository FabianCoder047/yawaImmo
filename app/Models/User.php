<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\UserSubscription;
use App\Models\Property;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'role',
        'isActive',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'isActive' => 'boolean',
    ];

    /**
     * Get the user's subscriptions.
     */
    public function userSubscriptions(): HasMany
    {
        return $this->hasMany(UserSubscription::class);
    }

    /**
     * Get the user's properties.
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    /**
     * Check if the user has a valid subscription.
     */
    public function hasValidSubscription(): bool
    {
        return $this->userSubscriptions()
            ->where('status', 'actif')
            ->where('end_date', '>=', now())
            ->exists();
    }

    /**
     * Check if the user is an administrator.
     */
    public function checkIsAdmin(): bool
    {
        return $this->role === 'admin';
    }
    
    /**
     * @deprecated Use checkIsAdmin() instead
     */
    public function isAdmin(): bool
    {
        return $this->checkIsAdmin();
    }
    
    // Clear any cached version of this class
    public static function boot()
    {
        parent::boot();
        
        static::saved(function ($model) {
            clearstatcache();
        });
    }
}
