import PropertyCard from '@/components/ownComponents/admin/propertyCard';
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
} from 'lucide-react';

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

const properties: Property[] = [
  {
    id: 1,
    title: 'Appartement de luxe...',
    price: '2 850 000',
    status: 'En vente',
    image: '/assets/img/post-1.jpg',
    location: 'Sanguéra',
    type: 'Appartement',
    owner: 'Albert DEGBE',
    beds: 2,
    baths: 2.5,
    size: 1450,
  },
  {
    id: 2,
    title: 'Bureau moderne...',
    price: '45 000',
    status: 'En location',
    image: '/assets/img/post-2.jpg',
    location: 'Amoutivé',
    type: 'Bureau',
    owner: 'Delphin LAMBOU',
    size: 2200,
  },
  {
    id: 3,
    title: 'Maison familiale...',
    price: '6 500 000',
    status: 'En vente',
    image: '/assets/img/post-4.jpg',
    location: 'Attiégou',
    type: 'Maison',
    owner: 'Caitlin AKOMABO',
    beds: 4,
    baths: 4.5,
    size: 4200,
  },
  {
    id: 4,
    title: 'Appartement de luxe...',
    price: '2 850 000',
    status: 'En vente',
    image: '/assets/img/post-5.jpg',
    location: 'Sanguéra',
    type: 'Appartement',
    owner: 'Médard KAMOUKY',
    beds: 2,
    baths: 2.5,
    size: 1450,
  },
];

export default function PropertyList() {
  return (
    <>
    <h2 className="text-2xl font-bold mb-2 border-b-2 border-gray-200 pb-2">Liste des biens</h2>
    <div className="p-6">
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <input
          type="text"
          placeholder="Rechercher un bien..."
          className="border rounded px-4 py-2 font-bold w-full md:w-2/3"
        />

        <button className="flex items-center gap-2 border px-4 py-2 rounded-md font-bold text-gray-600 hover:bg-gray-100">
          <ArrowUpWideNarrow className="w-4 h-4" />
          Plus récent
        </button>

        <button className="flex items-center gap-2 border px-4 py-2 rounded-md font-bold text-gray-600 hover:bg-gray-100">
          <ArrowDownWideNarrow className="w-4 h-4" />
          Plus ancien
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
    </>
  );
}
