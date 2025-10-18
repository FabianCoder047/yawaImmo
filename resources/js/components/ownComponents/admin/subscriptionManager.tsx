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
            </div>
          ))
        )}
      </div>

    </div>
  );
}
