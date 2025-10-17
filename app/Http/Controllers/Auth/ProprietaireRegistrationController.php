<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ProprietaireRegistrationController extends Controller
{
    public function showRegistrationForm()
    {
        return Inertia::render('auth/register-proprietaire');
    }

    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'telephone' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Création de l'utilisateur avec le rôle propriétaire
        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'role' => 'proprietaire',
            'isActive' => false, // Le compte sera activé après souscription à un abonnement
        ]);

        // Connexion de l'utilisateur
        Auth::login($user);

        // Journalisation pour le débogage
        Log::info('Nouvel utilisateur inscrit et connecté', [
            'user_id' => $user->id,
            'email' => $user->email,
            'isActive' => $user->isActive
        ]);
        
        // Redirection vers la page de souscription avec un message
        return redirect()->route('proprietaire.subscription')
            ->with([
                'message' => 'Inscription réussie ! Veuillez souscrire à un abonnement pour activer votre compte.',
                'status' => 'success'
            ]);
    }
}