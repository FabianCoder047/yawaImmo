import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
} from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: "recent" | "ancien";
  onSortChange: (order: "recent" | "ancien") => void;
}

export default function UserSearchBar({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-2/3 px-4 py-2 border rounded-md focus:outline-none font-bold"
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          className={`w-full sm:w-auto border px-4 py-2 rounded-md flex items-center justify-center text-sm font-bold ${
            sortOrder === "recent" ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => onSortChange("recent")}
        >
          <ArrowUpWideNarrow size={16} className="mr-1" />
          Plus récent
        </button>

        <button
          className={`w-full sm:w-auto border px-4 py-2 rounded-md flex items-center justify-center text-sm font-bold ${
            sortOrder === "ancien" ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => onSortChange("ancien")}
        >
          <ArrowDownWideNarrow size={16} className="mr-1" />
          Plus ancien
        </button>
      </div>
    </div>
  );
}
