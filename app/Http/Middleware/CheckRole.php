<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Vérifier si l'utilisateur est connecté
        if (!auth()->check()) {
            Log::warning('Tentative d\'accès non authentifiée à une ressource protégée', [
                'path' => $request->path(),
                'ip' => $request->ip()
            ]);
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        // Vérifier si l'utilisateur a le rôle requis
        if ($user->role !== $role) {
            Log::warning('Tentative d\'accès non autorisée', [
                'user_id' => $user->id,
                'user_role' => $user->role,
                'required_role' => $role,
                'path' => $request->path()
            ]);
            
            // Rediriger vers la page d'accueil avec un message d'erreur
            return redirect()
                ->route('home')
                ->with('error', 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page.');
        }

        // Ajouter des informations de débogage
        Log::debug('Accès autorisé', [
            'user_id' => $user->id,
            'role' => $user->role,
            'path' => $request->path()
        ]);

        return $next($request);
    }
}
