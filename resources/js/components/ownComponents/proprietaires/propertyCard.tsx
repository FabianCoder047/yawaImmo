import { Home, MapPin } from 'lucide-react';

type Property = {
    id: number;
    title: string;
    price: number;
    status: string;
    image: string;
    location: string;
    type: string;
    description?: string;
    offre?: string; // En vente ou En location
    categorie?: {
        id: number;
        name: string;
    };
};

export default function PropertyCard({ property }: { property: Property }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approuvé':
                return 'bg-[#2E7D32]';
            case 'En attente':
                return 'bg-yellow-500';
            case 'rejeté':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getOffreColor = (offre: string) => {
        switch (offre) {
            case 'En vente':
                return 'bg-blue-500';
            case 'En location':
                return 'bg-[#2E7D32]';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="w-full max-w-xs rounded-xl bg-white p-4 shadow">
            <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg">
                <img
                    src={property.image ? 
                        (property.image.startsWith('http') || property.image.startsWith('/') 
                            ? property.image 
                            : `/storage/${property.image}`) 
                        : '/assets/img/property-1.jpg'}
                    alt={property.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className={`rounded px-2 py-1 text-xs font-semibold text-white ${getStatusColor(property.status)}`}>{property.status}</span>
                    {property.offre && (
                        <span className={`rounded px-2 py-1 text-xs font-semibold text-white ${getOffreColor(property.offre)}`}>
                            {property.offre}
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-1 flex items-start justify-between">
                <h3 className="text-sm font-semibold text-gray-800">{property.title}</h3>
            </div>
            <p className="mb-3 text-sm font-bold text-indigo-600">{property.price?.toLocaleString()} F CFA</p>

            <div className="mb-3 space-y-1 text-sm text-gray-500">
                <p className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {property.location}
                </p>
                <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" /> 
                    {property.categorie && <span className="text-xs text-gray-400">{property.categorie.name}</span>}
                </div>
            </div>
        </div>
    );
}
