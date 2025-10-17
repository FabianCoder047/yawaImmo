<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CategorieController extends Controller
{
    /**
     * Affiche la liste des catégories
     */
    public function index(Request $request)
    {
        $categories = Categorie::select(['id', 'name', 'created_at', 'updated_at'])
            ->orderBy('name')
            ->paginate(3);

        // Si c'est une requête API (AJAX) ou si l'en-tête Accept contient application/json
        if ($request->wantsJson() || $request->ajax() || $request->expectsJson() || $request->header('Accept') === 'application/json') {
            return response()->json([
                'success' => true,
                'data' => array_values($categories->items()), // s'assurer que c'est un tableau indexé numériquement
                'pagination' => [
                    'total' => $categories->total(),
                    'per_page' => $categories->perPage(),
                    'current_page' => $categories->currentPage(),
                    'last_page' => $categories->lastPage(),
                ]
            ]);
        }

        // Pour les requêtes normales, renvoyer la vue Inertia
        return Inertia::render('admin/categories', [
            'categories' => $categories->items(),
            'pagination' => [
                'total' => $categories->total(),
                'per_page' => $categories->perPage(),
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
            ]
        ]);
    }

    /**
     * Enregistre une nouvelle catégorie
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        try {
            $categorie = Categorie::create($validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Catégorie créée avec succès',
                'data' => $categorie
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Met à jour une catégorie existante
     */
    public function update(Request $request, Categorie $categorie)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $categorie->id,
        ]);

        try {
            $categorie->update($validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Catégorie mise à jour avec succès',
                'data' => $categorie
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime une catégorie
     */
    public function destroy(Categorie $categorie)
    {
        try {
            // Vérifier d'abord si la catégorie est utilisée dans des biens
            $usedInBiens = DB::table('biens')->where('categorie_id', $categorie->id)->exists();
            
            if ($usedInBiens) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer cette catégorie car elle est utilisée par un ou plusieurs biens',
                ], 422);
            }

            $categorie->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Catégorie supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}