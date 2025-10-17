import { usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { useState } from "react";

type Client = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  created_at: string;
};

interface PagePropsWithClients extends PageProps {
  clients: Client[];
}

export default function ClientsSection() {
  const { clients = [] } = usePage<PagePropsWithClients>().props;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "ancien">("recent");
  const itemsPerPage = 5;

  // Filtrage + Tri
  const filteredClients = clients
    .filter((client) =>
      `${client.nom} ${client.prenom} ${client.email} ${client.telephone}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "recent"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <div className="border-b-2 border-gray-200 pb-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Liste des clients</h2>
      </div>
  
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Rechercher un client..."
          className="w-full sm:w-2/3 px-4 py-2 border rounded-md focus:outline-none font-bold"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setSortOrder("recent")}
            className={`flex items-center gap-1 px-4 py-2 rounded-md border text-sm font-bold ${
              sortOrder === "recent"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            <ArrowUpWideNarrow size={16} />
            Plus récents
          </button>
          <button
            onClick={() => setSortOrder("ancien")}
            className={`flex items-center gap-1 px-4 py-2 rounded-md border text-sm font-bold ${
              sortOrder === "ancien"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            <ArrowDownWideNarrow size={16} />
            Plus anciens
          </button>
        </div>
      </div>
  
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm text-gray-600">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Prénom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Téléphone</th>
              <th className="px-4 py-2 text-center">Date d'inscription</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {paginatedClients.map((client) => (
              <tr key={client.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2 font-semibold uppercase">{client.nom}</td>
                <td className="px-4 py-2">{client.prenom}</td>
                <td className="px-4 py-2">{client.email}</td>
                <td className="px-4 py-2">{client.telephone}</td>
                <td className="px-4 py-2 text-center">
                  {new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(client.created_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
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