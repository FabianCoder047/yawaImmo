<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use App\Models\Subscription;
use App\Models\UserSubscription;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_clients' => User::where('role', 'client')->count(),
            'total_owners' => User::where('role', 'proprietaire')->count(),
            'total_properties' => Property::count(),
            'total_subscriptions' => \App\Models\UserSubscription::count(),
            'pending_properties' => Property::where('status', 'En attente')->count(),
            'approved_properties' => Property::where('status', 'Approuvé')->count(),
            'rejected_properties' => Property::where('status', 'Rejeté')->count(),
            'active_subscriptions' => \App\Models\UserSubscription::where('end_date', '>=', now())->count(),
            'expired_subscriptions' => \App\Models\UserSubscription::where('end_date', '<', now())->count(),
        ];

        $recentProperties = Property::with(['user'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($property) {
                // Nettoyer le chemin de l'image principale
                $mainImage = $property->image 
                    ? (str_starts_with($property->image, 'http') 
                        ? $property->image 
                        : (str_starts_with($property->image, '/storage/') 
                            ? asset($property->image) 
                            : asset('storage/' . ltrim($property->image, '/'))))
                    : null;

                // Préparer les images supplémentaires
                $additionalImages = collect($property->additional_images ?? [])
                    ->map(function($image) {
                        return str_starts_with($image, 'http') 
                            ? $image 
                            : (str_starts_with($image, '/storage/') 
                                ? asset($image) 
                                : asset('storage/' . ltrim($image, '/')));
                    })
                    ->filter()
                    ->toArray();

                // Toutes les images (image principale + images supplémentaires)
                $allImages = array_filter([$mainImage, ...$additionalImages]);

                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'price' => $property->price,
                    'status' => $property->status,
                    'image' => $mainImage,
                    'all_images' => $allImages,
                    'additional_images' => $additionalImages,
                    'created_at' => $property->created_at->toDateTimeString(),
                    'user' => $property->user ? [
                        'id' => $property->user->id,
                        'nom' => $property->user->nom,
                        'prenom' => $property->user->prenom,
                        'email' => $property->user->email,
                    ] : null
                ];
            });

        $recentUsers = User::select(['id', 'nom', 'prenom', 'email', 'role', 'created_at'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at->toDateTimeString(),
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentProperties' => $recentProperties,
            'recentUsers' => $recentUsers,
            'auth' => [
                'user' => [
                    'nom' => auth()->user()->nom,
                    'prenom' => auth()->user()->prenom,
                    'email' => auth()->user()->email,
                    'role' => auth()->user()->role,
                ]
            ]
        ]);
    }
}
