
import LayoutAdmin from '@/layouts/layoutAdmin';
import { Edit, Plus, Trash2, X } from 'lucide-react';
import React, { JSX, ReactNode, useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
import Pagination from '@/components/ui/Pagination';

type Category = {
    id: number;
    name: string;
};

interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface CategoriesProps {
    categories: Category[];
    pagination: Pagination;
}

export default function Categories({ 
    categories: initialCategories = [], 
    pagination: initialPagination = {
        total: 0,
        per_page: 5,
        current_page: 1,
        last_page: 1
    } 
}: CategoriesProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [pagination, setPagination] = useState<Pagination>(initialPagination);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
    });

    const fetchCategories = useCallback(async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`/admin/api/categories?page=${page}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Données reçues de l\'API:', responseData);

            if (responseData && responseData.success && Array.isArray(responseData.data)) {
                setCategories(responseData.data);
                
                if (responseData.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        total: responseData.pagination.total || 0,
                        per_page: responseData.pagination.per_page || 5,
                        current_page: responseData.pagination.current_page || 1,
                        last_page: responseData.pagination.last_page || 1
                    }));
                }
            } else {
                console.error('Format de réponse inattendu:', responseData);
                throw new Error('Format de réponse inattendu du serveur');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
            
            await MySwal.fire({
                title: 'Erreur',
                text: 'Impossible de charger les catégories',
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Charger les catégories au montage du composant
    useEffect(() => {
        fetchCategories(pagination.current_page);
    }, [pagination.current_page, fetchCategories]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.last_page) {
            fetchCategories(page);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            console.log('CSRF Token:', csrfToken);

            const response = await fetch('/admin/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const newCategory = await response.json();
                setCategories((prev) => [...prev, newCategory]);
                setFormData({ name: '' });
                setShowAddModal(false);
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.error('Erreur serveur:', errorData);
                alert('Erreur lors de la création: ' + (errorData.message || 'Erreur inconnue'));
            }
        } catch (error) {
            console.error('Erreur lors de la création:', error);
            alert('Erreur de connexion. Vérifiez votre connexion internet.');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name });
        setShowEditModal(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingCategory) return;

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/admin/api/categories/${editingCategory.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setCategories((prev) => prev.map((cat) => (cat.id === editingCategory.id ? data : cat)));
                setFormData({ name: '' });
                setShowEditModal(false);
                setEditingCategory(null);
                
                // Afficher un message de succès
                await MySwal.fire({
                    title: 'Succès !',
                    text: 'La catégorie a été mise à jour avec succès.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
                
                // Recharger les données
                await fetchCategories(pagination.current_page);
            } else {
                throw new Error(data.message || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            
            await MySwal.fire({
                title: 'Erreur',
                text: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour',
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    const handleDelete = async (categoryId: number, categoryName: string) => {
        const result = await MySwal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Voulez-vous vraiment supprimer la catégorie "${categoryName}" ? Cette action est irréversible.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            reverseButtons: true
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/admin/api/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    Accept: 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
                
                await MySwal.fire({
                    title: 'Supprimé !',
                    text: 'La catégorie a été supprimée avec succès.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
                
                // Recharger les données sans recharger toute la page
                fetchCategories(pagination.current_page);
            } else {
                throw new Error(data.message || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            
            await MySwal.fire({
                title: 'Erreur',
                text: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression',
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
        }
    };



    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter une catégorie
                </button>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Liste des catégories</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {loading ? (
                        <div className="px-6 py-8 text-center text-gray-500">Chargement en cours...</div>
                    ) : categories.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-500">Aucune catégorie trouvée</div>
                    ) : (
                        categories.map((category) => (
                            <div key={category.id} className="flex items-center justify-between px-6 py-4">
                                <span className="text-gray-900">{category.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="rounded p-1 text-blue-600 hover:bg-blue-50"
                                        type="button"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="rounded p-1 text-red-600 hover:bg-red-50"
                                        type="button"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-6 py-4">
                    <Pagination
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        onPageChange={handlePageChange}
                        className="mt-4"
                    />
                </div>
            </div>

            {/* Modal d'ajout */}
            {showAddModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-200 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white">
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-lg font-semibold">Ajouter une catégorie</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700">Nom de la catégorie</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Ex: Appartement"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                    Créer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal d'édition */}
            {showEditModal && editingCategory && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-200 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white">
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-lg font-semibold">Modifier la catégorie</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-4">
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700">Nom de la catégorie</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Ex: Appartement"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

(Categories as React.FC & { layout?: (page: ReactNode) => JSX.Element }).layout = (page) => (
    <LayoutAdmin activeTab="Catégories">{page}</LayoutAdmin>
);
