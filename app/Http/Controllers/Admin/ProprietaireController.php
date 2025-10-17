<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProprietaireController extends Controller
{
    public function index()
    {
        $proprietaires = User::where('role', 'proprietaire')
            ->with(['userSubscriptions' => function($query) {
                $query->with('subscription')
                    ->orderBy('end_date', 'desc')
                    ->latest();
            }])
            ->get()
            ->map(function($owner) {
                $latestSubscription = $owner->userSubscriptions->first();
                
                return [
                    'id' => $owner->id,
                    'nom' => $owner->nom,
                    'prenom' => $owner->prenom,
                    'email' => $owner->email,
                    'telephone' => $owner->telephone,
                    'role' => $owner->role,
                    'status' => $owner->status,
                    'isActive' => $owner->isActive,
                    'created_at' => $owner->created_at->format('d/m/Y'),
                    'subscription' => $latestSubscription ? [
                        'status' => $latestSubscription->status,
                        'type' => $latestSubscription->subscription->name ?? 'Non défini',
                        'start_date' => $latestSubscription->start_date ? \Carbon\Carbon::parse($latestSubscription->start_date)->format('d/m/Y') : null,
                        'end_date' => $latestSubscription->end_date ? \Carbon\Carbon::parse($latestSubscription->end_date)->format('d/m/Y') : null,
                        'isActive' => $latestSubscription->status === 'actif' && \Carbon\Carbon::parse($latestSubscription->end_date)->isFuture(),
                        'days_remaining' => $latestSubscription->end_date ? \Carbon\Carbon::parse($latestSubscription->end_date)->diffInDays(now()) : null,
                    ] : null,
                    'has_active_subscription' => $latestSubscription && 
                                              $latestSubscription->status === 'actif' && 
                                              \Carbon\Carbon::parse($latestSubscription->end_date)->isFuture()
                ];
            });

        return Inertia::render('admin/proprietaires', [
            'proprietaires' => $proprietaires,
            'user' => auth()->user(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
                'info' => session('info'),
            ],
        ]);
    }
    public function search(Request $request)
    {
        $query = User::query(); 

        // Recherche
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                ->orWhere('prenom', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%");
            });
        }

        // Tri par date
        if ($request->has('order') && $request->order === 'ancien') {
            $query->orderBy('created_at', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $users = $query->paginate(10);

        return Inertia::render('admin/proprietaires', [
            'users' => $users,
            'filters' => $request->only('search', 'order'),
        ]);
    }
}

