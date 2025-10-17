<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        // Vérifier si l'utilisateur est un propriétaire
        if ($user && $user->role === 'proprietaire') {
            // Vérifier si le compte est actif
            if (!$user->isActive) {
                return redirect()->route('proprietaire.subscription')
                    ->with('error', 'Votre compte n\'est pas encore activé. Veuillez souscrire à un abonnement.');
            }

            // Vérifier si l'abonnement est valide
            if (!$user->hasValidSubscription()) {
                return redirect()->route('proprietaire.subscription')
                    ->with('error', 'Votre abonnement a expiré. Veuillez le renouveler.');
            }
        }

        return $next($request);
    }
} 