<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PropertyPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, Property $property)
    {
        return $user->id === $property->user_id || $user->isAdmin();
    }

    public function create(User $user)
    {
        return $user->isProprietaire();
    }

    public function update(User $user, Property $property)
    {
        // Seul le propriétaire peut modifier, et seulement si le bien n'est pas approuvé
        return $user->id === $property->user_id && $property->status !== 'Approuvé';
    }

    public function delete(User $user, Property $property)
    {
        return $user->id === $property->user_id;
    }
}