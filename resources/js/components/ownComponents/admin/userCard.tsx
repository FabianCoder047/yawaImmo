import React from "react";
import { Eye, Lock, Unlock, Trash, Mail, Phone } from "lucide-react";
import UserStatusBadge from "./userStatusBadge";

interface SubscriptionInfo {
  status: string;
  type: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  days_remaining: number | null;
}

interface User {
  id?: string | number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  image?: string;
  role: string;
  status: string;
  isActive: number;
  subscription: SubscriptionInfo | null;
  has_active_subscription?: boolean;
}

// Liste de couleurs (Tailwind)
const colors = ["bg-blue-500", "bg-[#2E7D32]", "bg-pink-500", "bg-purple-500"];

function getColorIndex(nom: string, prenom: string): string {
  const fullName = nom + prenom;
  const charSum = [...fullName].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charSum % colors.length]; // Choix cyclique
}

// Helper function to format date from d/m/Y to a more readable format
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'Date inconnue';
  try {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Date invalide';
  }
};

export default function UserCard({ user }: { user: User }) {
  // Safely get subscription data with defaults
  const subscription = user.subscription || {
    status: 'inactif',
    type: 'Aucun abonnement',
    start_date: null,
    end_date: null,
    is_active: false,
    days_remaining: null
  };
  
  // Utiliser has_active_subscription si disponible, sinon utiliser subscription.is_active
  const isActive = user.has_active_subscription !== undefined 
    ? user.has_active_subscription 
    : (subscription.is_active === true);

  const initials = (user.nom + " " + user.prenom)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const bgColor = getColorIndex(user.nom, user.prenom);

  return (
    <div className="bg-white border rounded-lg shadow-sm p-5 flex flex-col sm:flex-row sm:items-start gap-4 relative">
      {/* Avatar ou Initiales */}
      {user.image ? (
        <img
          src={user.image}
          alt={`${user.nom} ${user.prenom}`}
          className="w-16 h-16 rounded-full object-cover"
        />
      ) : (
        <div className={`w-16 h-16 rounded-full ${bgColor} text-white text-xl font-bold flex items-center justify-center select-none`}>
          {initials}
        </div>
      )}

      {/* Infos utilisateur */}
      <div className="flex-1">
        <div className="flex items-center flex-wrap gap-2">
          <h2 className="font-semibold text-lg">{user.nom} {user.prenom}</h2>
          <UserStatusBadge
            label={isActive ? "Actif" : "Inactif"}
            color={isActive ? "green" : "gray"}
          />
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500 gap-2">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <Phone className="h-4 w-4" />
          <span>{user.telephone || 'Non renseigné'}</span>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm gap-2">
            <span className="font-medium">Abonnement:</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {subscription.type}
            </span>
          </div>
          
          {subscription.start_date && subscription.end_date && (
            <div className="text-xs text-gray-500 mt-1">
              <div>Du {formatDate(subscription.start_date)} au {formatDate(subscription.end_date)}</div>
              {isActive ? (
                subscription.days_remaining !== null && (
                  <div>Expire dans {Math.floor(Math.abs(subscription.days_remaining))} jour{Math.abs(subscription.days_remaining) > 1 ? 's' : ''}</div>
                )
              ) : (
                <div className="text-red-500">Abonnement expiré</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Icônes d'action */}
      <div className="flex sm:flex-col justify-center sm:justify-start items-center sm:items-end gap-4 sm:absolute sm:top-5 sm:right-5 mt-4 sm:mt-0">
        <Eye size={18} className="cursor-pointer bg-gray-100 text-gray-600 rounded-sm p-1" />
        {isActive ? (
          <Lock size={18} className="cursor-pointer text-slate-900 bg-slate-500 rounded-sm p-1" />
        ) : (
          <Unlock size={18} className="cursor-pointer text-green-600 bg-green-100 rounded-sm p-1" />
        )}
        <Trash size={18} className="cursor-pointer text-red-600 bg-red-100 rounded-sm p-1" />
      </div>
    </div>
  );
}
