<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index()
    {
        return inertia('admin/planAbonnements', [
            'subscriptions' => Subscription::all(),
            'activeTab' => 'Abonnements',
            'auth' => ['user' => auth()->user()],
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'duration_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
        ]);

        Subscription::create($request->all());

        return back()->with('success', 'Abonnement créé.');
    }

    public function update(Request $request, Subscription $subscription)
    {
        $request->validate([
            'name' => 'required|string',
            'duration_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
        ]);

        $subscription->update($request->only(['name', 'duration_months', 'price', 'description']));

        return back()->with('success', 'Abonnement mis à jour.');
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();

        return back()->with('success', 'Abonnement supprimé.');
    }
}

