import { useState, useMemo, useEffect } from "react";
import UserCard from "./userCard";
import UserSearchBar from "./userSearchBar";
import { usePage } from "@inertiajs/react";

export interface SubscriptionInfo {
  status: string;
  type: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  days_remaining: number | null;
}

export interface User {
  id: string | number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  status: string;
  isActive: number;
  created_at: string;
  subscription: SubscriptionInfo | null;
  has_active_subscription: boolean;
  image?: string;
}

interface OwnersProps {
  proprietaires: User[];
}

const CARDS_PER_PAGE = 3;

export default function Owners({ proprietaires: initialProprietaires = [] }: OwnersProps) {
  const { props } = usePage<{ proprietaires: User[] }>();
  
  // Debug log
  console.log('Initial proprietaires:', initialProprietaires);
  console.log('Page props:', props);
  
  // Utiliser useMemo pour éviter de recréer le tableau à chaque rendu
  const proprietaires = useMemo(() => {
    return initialProprietaires.length > 0 
      ? initialProprietaires 
      : (Array.isArray(props?.proprietaires) ? props.proprietaires : []);
  }, [initialProprietaires, props?.proprietaires]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "ancien">("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOwners = useMemo(() => {
    // Ensure proprietaires is always an array
    const proprietairesList = Array.isArray(proprietaires) ? proprietaires : [];
    
    // Transform and filter the data
    const filtered = proprietairesList
      .filter(user => user && user.nom && user.prenom)
      .filter(user => {
        const fullName = `${user.nom} ${user.prenom}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
      .map(user => ({
        ...user,
        // Ensure subscription data has the correct structure
        subscription: user.subscription ? {
          status: user.subscription.status || '',
          type: user.subscription.type || '',
          start_date: user.subscription.start_date || null,
          end_date: user.subscription.end_date || null,
          is_active: Boolean(user.subscription.is_active),
          days_remaining: user.subscription.days_remaining || null
        } : null,
        // Ensure has_active_subscription is a boolean
        has_active_subscription: Boolean(user.has_active_subscription)
      }));

    return filtered.sort((a, b) => {
      // Parse dates with the correct format (d/m/Y from PHP)
      const parseDate = (dateStr: string) => {
        if (!dateStr) return 0;
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      
      const dateA = a?.created_at ? parseDate(a.created_at) : 0;
      const dateB = b?.created_at ? parseDate(b.created_at) : 0;
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });
  }, [proprietaires, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredOwners.length / CARDS_PER_PAGE);
  const paginatedOwners = filteredOwners.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  // Debug effect to log data after all processing
  useEffect(() => {
    console.log('Initial proprietaires:', initialProprietaires);
    console.log('Props from page:', props);
    console.log('Processed proprietaires:', proprietaires);
    console.log('Filtered owners:', filteredOwners);
    console.log('Paginated owners:', paginatedOwners);
  }, [initialProprietaires, props, proprietaires, filteredOwners, paginatedOwners]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-2">
        <div>
          <h1 className="text-2xl font-bold">Liste des propriétaires</h1>
          <p className="text-gray-500">Gestion des propriétaires</p>
        </div>
      </div>

      <UserSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <div className="mt-6 space-y-4">
        {paginatedOwners.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handlePrev()}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => handleNext()}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
