<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        $clients = User::where('role', 'client')->get(); 

        return Inertia::render('admin/clients', [
            'clients' => $clients
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

        return Inertia::render('admin/clients', [
            'users' => $users,
            'filters' => $request->only('search', 'order'),
        ]);
    }

}

