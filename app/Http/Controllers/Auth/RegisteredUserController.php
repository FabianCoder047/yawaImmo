<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'      => 'required|string|max:255',
            'prenom'   => 'required|string|max:255',
            'telephone'=> 'required|string|max:20',
            'email'    => 'required|string|email|max:255|unique:users',
            'role'     => ['required', Rule::in(['client', 'proprietaire'])],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'nom'      => $request->nom,
            'prenom'   => $request->prenom,
            'telephone'=> $request->telephone,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'isActive' => $request->role === 'client' ? true : false,
        ]);

        // Connecter automatiquement l'utilisateur
        auth()->login($user);

        // Rediriger selon le rôle
        if ($request->role === 'client') {
            return redirect()->intended('/dashboard')
                ->with('success', 'Compte créé avec succès ! Bienvenue sur YawaImmo.');
        } else {
            return redirect()->route('proprietaire.subscription')
                ->with('success', 'Compte créé avec succès ! Veuillez souscrire à un abonnement pour activer votre compte.');
        }
    }
}
