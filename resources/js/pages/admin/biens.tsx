import LayoutAdmin from '@/layouts/layoutAdmin';
import { Check, Clock, DollarSign, Eye, MapPin, RefreshCw, Trash2, User, X } from 'lucide-react';
import React, { JSX, ReactNode } from 'react';
import Swal from 'sweetalert2';

type Property = {
    id: number;
    title: string;
    price: number;
    status: string;
    image: string;
    location: string;
    type: string;
    description?: string;
    offre?: string;
    reactivation_requested?: boolean;
    reactivation_reason?: string;
    user?: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
    };
    categorie?: {
        id: number;
        name: string;
    };
    created_at: string;
};

interface BiensProps {
    properties: Property[];
}

export default function Biens({ properties = [] }: BiensProps) {
    const handleApprove = async (propertyId: number) => {
        const result = await Swal.fire({
            title: 'Approuver ce bien ?',
            text: 'Êtes-vous sûr de vouloir approuver ce bien ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, approuver',
            cancelButtonText: 'Annuler',
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/admin/biens/${propertyId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: data.message,
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: data.message || "Erreur lors de l'approbation",
                });
            }
        } catch (error) {
            console.error("Erreur lors de l'approbation:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Erreur lors de l'approbation",
            });
        }
    };

    const handleReject = async (propertyId: number) => {
        const result = await Swal.fire({
            title: 'Rejeter ce bien ?',
            text: 'Êtes-vous sûr de vouloir rejeter ce bien ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, rejeter',
            cancelButtonText: 'Annuler',
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/admin/biens/${propertyId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: data.message,
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: data.message || 'Erreur lors du rejet',
                });
            }
        } catch (error) {
            console.error('Erreur lors du rejet:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors du rejet',
            });
        }
    };

    const handleDelete = async (propertyId: number) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler',
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/admin/biens/${propertyId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: data.message,
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: data.message || 'Erreur lors de la suppression',
                });
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la suppression',
            });
        }
    };

    const handleApproveReactivation = async (propertyId: number) => {
        const result = await Swal.fire({
            title: 'Approuver la réactivation ?',
            text: 'Voulez-vous approuver la demande de réactivation de ce bien ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, approuver',
            cancelButtonText: 'Annuler',
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/admin/properties/${propertyId}/approve-reactivation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès !',
                    text: data.message,
                }).then(() => {
                    window.location.reload();
                });
            } else {
                throw new Error(data.message || 'Erreur lors de l\'approbation de la réactivation');
            }
        } catch (error) {
            console.error('Erreur lors de l\'approbation de la réactivation:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'approbation de la réactivation',
            });
        }
    };

    const handleView = (propertyId: number) => {
        window.location.href = `/admin/biens/${propertyId}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approuvé':
                return 'bg-green-100 text-green-800';
            case 'En attente':
                return 'bg-yellow-100 text-yellow-800';
            case 'Rejeté':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getOffreColor = (offre: string) => {
        switch (offre) {
            case 'En vente':
                return 'bg-blue-100 text-blue-800';
            case 'En location':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Biens</h1>
                <div className="text-sm text-gray-500">Total: {properties.length} bien(s)</div>
            </div>

            <div className="rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Liste des biens</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {properties.map((property) => (
                        <div key={property.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={property.image ? 
                                            (property.image.startsWith('http') || property.image.startsWith('/') 
                                                ? property.image 
                                                : `/storage/${property.image}`) 
                                            : '/assets/img/property-1.jpg'}
                                        alt={property.title}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">{property.title}</h3>
                                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <MapPin className="mr-1 h-4 w-4" />
                                                {property.location}
                                            </div>
                                            <div className="flex items-center">
                                                <DollarSign className="mr-1 h-4 w-4" />
                                                {property.price?.toLocaleString()} FCFA
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-4 w-4" />
                                                {new Date(property.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="mt-1 flex flex-col space-y-1">
                                            <div className="flex items-center space-x-2">
                                                {property.categorie && (
                                                    <span className="text-xs text-gray-400">Catégorie: {property.categorie.name}</span>
                                                )}
                                                {property.offre && (
                                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getOffreColor(property.offre)}`}>
                                                        {property.offre}
                                                    </span>
                                                )}
                                            </div>
                                            {property.reactivation_requested && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                                        Demande de réactivation
                                                    </span>
                                                    {property.reactivation_reason && (
                                                        <span className="text-xs text-gray-500">
                                                            Raison: {property.reactivation_reason}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(property.status)}`}>
                                        {property.status}
                                    </span>
                                    <div className="flex gap-2">
                                        {property.status === 'En attente' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(property.id)}
                                                    className="rounded-md p-2 text-green-600 hover:bg-green-50"
                                                    title="Approuver"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(property.id)}
                                                    className="rounded-md p-2 text-red-600 hover:bg-red-50"
                                                    title="Rejeter"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                        {property.status === 'En attente de réactivation' && property.reactivation_requested ? (
                                            <>
                                                <button
                                                    onClick={() => handleView(property.id)}
                                                    className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
                                                    title="Voir les détails avant approbation"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleApproveReactivation(property.id)}
                                                    className="rounded-md p-2 text-green-600 hover:bg-green-50"
                                                    title="Approuver la réactivation"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleView(property.id)}
                                                className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
                                                title="Voir les détails"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="rounded-md p-2 text-red-600 hover:bg-red-50"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {properties.length === 0 && <div className="px-6 py-8 text-center text-gray-500">Aucun bien trouvé</div>}
                </div>
            </div>
        </div>
    );
}

(Biens as React.FC & { layout?: (page: ReactNode) => JSX.Element }).layout = (page) => <LayoutAdmin activeTab="Biens">{page}</LayoutAdmin>;
