<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Subscription;

class UserSubscription extends Model
{
    protected $fillable = [
        'user_id', 
        'subscription_id', 
        'start_date', 
        'end_date', 
        'status',
        'payment_method',
        'payment_phone',
        'payment_status',
        'payment_date',
        'transaction_id'
    ];

    protected $dates = [
        'start_date',
        'end_date',
        'payment_date'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
}
