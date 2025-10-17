import { useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import {Plus,Eye,Pencil,Trash,CalendarDays,Wallet,Star,BadgeCheck,Gem,} from 'lucide-react';
import Swal from 'sweetalert2';

type Subscription = {
  id: number;
  name: string;
  duration_months: number;
  price: number;
  description?: string; // optionnel selon ta base
};

interface SubscriptionManagerProps {
  subscriptions: Subscription[];
}

export default function SubscriptionManager({ subscriptions = [] }: SubscriptionManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);


  const { data, setData, post, put, processing, reset, errors } = useForm({
    name: '',
    duration_months: '',
    price: '0',
    description: '',
  });

  const icons = [
    <Star key="star" className="w-8 h-8 text-blue-500" />,
    <BadgeCheck key="badge" className="w-8 h-8 text-yellow-500" />,
    <Gem key="gem" className="w-8 h-8 text-purple-600" />,
  ];

  const colors = ['bg-blue-50', 'bg-yellow-50', 'bg-purple-50'];

  // Ouvrir modal en mode ajout
  const openAddModal = () => {
    reset();
    setEditingSubscription(null);
    setShowModal(true);
  };

  // Ouvrir modal en mode édition
  const openEditModal = (sub: Subscription) => {
    setData({
      name: sub.name,
      duration_months: String(sub.duration_months),
      price: String(sub.price),
      description: sub.description || '',
    });
    setEditingSubscription(sub);
    setShowModal(true);
  };

  // Soumission du formulaire (ajout ou modification)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSubscription) {
      // Modifier
      put(route('admin.abonnements.update', editingSubscription.id), {
        onSuccess: () => {
          reset();
          setShowModal(false);
          setEditingSubscription(null);
        },
      });
    } else {
      // Ajouter
      post(route('admin.abonnements.store'), {
        onSuccess: () => {
          reset();
          setShowModal(false);
        },
      });
    }
  };

  // Supprimer un abonnement
  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.abonnements.destroy', id), {
          onSuccess: () => {
            Swal.fire('Supprimé !', 'L’abonnement a été supprimé.', 'success');
          },
          onError: () => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
          }
        });
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-semibold">Gestion des abonnements</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={18} />
          Ajouter un abonnement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.length === 0 ? (
          <p className="text-gray-600 col-span-full">Aucun abonnement pour le moment.</p>
        ) : (
          subscriptions.map((sub, i) => (
            <div
              key={sub.id}
              className={`rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition ${colors[i % colors.length]}`}
            >
              <div className="flex items-center gap-3 mb-4">
                {icons[i % icons.length]}
                <h3 className="text-xl font-bold text-gray-800">{sub.name}</h3>
              </div>

              <div className="flex items-center text-gray-600 gap-2 mb-2">
                <CalendarDays size={18} />
                <span>Durée : {sub.duration_months} mois</span>
              </div>

              <div className="flex items-center text-gray-700 font-medium gap-2 mb-4">
                <Wallet size={18} />
                <span>Prix : {Number(sub.price).toLocaleString()} FCFA</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedSubscription(sub)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                  <Eye size={18} className="text-gray-700" />
                </button>
                <button
                  onClick={() => openEditModal(sub)}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                >
                  <Pencil size={18} className="text-blue-700" />
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition"
                >
                  <Trash size={18} className="text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal ajout / modification */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingSubscription ? 'Modifier un abonnement' : 'Ajouter un abonnement'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Durée (en mois)</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={data.duration_months}
                  onChange={(e) => setData('duration_months', e.target.value)}
                  required
                  min={1}
                />
                {errors.duration_months && (
                  <p className="text-red-600 text-sm mt-1">{errors.duration_months}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Prix (FCFA)</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  required
                  min={0}
                />
                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  required
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSubscription(null);
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Détails de l’abonnement</h3>
            <p><strong>Nom :</strong> {selectedSubscription.name}</p>
            <p><strong>Durée :</strong> {selectedSubscription.duration_months} mois</p>
            <p><strong>Prix :</strong> {Number(selectedSubscription.price).toLocaleString()} FCFA</p>
            <p><strong>Description :</strong> {selectedSubscription.description || 'Aucune description'}</p>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedSubscription(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
