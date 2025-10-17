import { Lock, Unlock, ArrowRight, MapPin, Home, Ruler, Bed, Bath } from 'lucide-react';

type Property = {
  id: number;
  title: string;
  price: string;
  status: 'En vente' | 'En location';
  image: string;
  location: string;
  type: string;
  owner: string;
  beds?: number;
  baths?: number;
  size: number;
};

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full max-w-xs">
      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded text-white ${property.status === 'En vente' ? 'bg-blue-500' : 'bg-[#2E7D32]'}`}>
          {property.status}
        </span>
      </div>

      <div className="flex justify-between items-start mb-1">
        <h3 className="text-sm font-semibold text-gray-800">{property.title}</h3>
        <span className="text-xs text-gray-500 italic">{property.owner}</span>
      </div>
      <p className="text-indigo-600 font-bold text-sm mb-3">{property.price} F CFA</p>

      <div className="text-sm text-gray-500 space-y-1 mb-3">
        <p className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {property.location}
        </p>
        <p className="flex items-center gap-1">
          <Home className="w-4 h-4" /> {property.type}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-xs text-gray-500 mb-4">
        {property.beds !== undefined && (
            <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.beds} chambres</span>
            </div>
        )}
        {property.baths !== undefined && (
            <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.baths} salle de bains</span>
            </div>
        )}
        <div className="flex items-center gap-1">
            <Ruler className="w-4 h-4" />
            <span>{property.size} m²</span>
        </div>
      </div>


      <div className="flex items-center justify-between text-gray-500 text-sm">
        <div className="flex gap-2">
          <button title="Désactiver">
            <Lock className="w-4 h-4 hover:text-red-600 bg-red-100 rounded-sm p-1 text-red-600 cursor-pointer" />
          </button>
          <button title="Activer">
            <Unlock className="w-4 h-4 hover:text-green-600 bg-green-100 rounded-sm p-1 text-green-600 cursor-pointer" />
          </button>
        </div>
        <button className="text-indigo-600 hover:underline flex items-center gap-1 text-sm font-medium">
          Voir les détails <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
