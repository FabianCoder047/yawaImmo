<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyRequestController extends Controller
{
    public function showRequestForm(Property $property)
    {
        return Inertia::render('client/property-request', [
            'property' => $property->load(['user', 'categorie']),
        ]);
    }

    public function store(Request $request, Property $property)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        PropertyRequest::create([
            'property_id' => $property->id,
            'user_id' => auth()->id(),
            'message' => $request->message,
        ]);

        return redirect()->back()->with('success', 'Votre demande a été envoyée avec succès !');
    }

    public function index()
    {
        $requests = PropertyRequest::with(['property', 'property.user'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('client/my-requests', [
            'requests' => $requests,
        ]);
    }
}
