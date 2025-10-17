import ProprietaireLayout from '@/layouts/layoutProprietaire';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import HistoryShowComponent from '@/components/ownComponents/proprietaires/HistoryShow';

export default function HistoryShow({ property }: PageProps<{ property: any }>) {
    return (
        <ProprietaireLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Détails du bien
                </h2>
            }
        >
            <Head title={`Détails - ${property.title}`} />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <HistoryShowComponent property={property} />
                    </div>
                </div>
            </div>
        </ProprietaireLayout>
    );
}
