import ProprietaireLayout from '@/layouts/layoutProprietaire';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import HistoryComponent from '@/components/ownComponents/proprietaires/History';
import { JSX, ReactNode } from 'react';

export default function History({ properties, stats }: PageProps<{ properties: any, stats: any }>) {
    return (
        <>
            <Head title="Historique des biens" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <HistoryComponent 
                            properties={properties} 
                            stats={stats} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

(History as React.FC & { layout?: (page: ReactNode) => JSX.Element }).layout = (page: ReactNode) => (
    <ProprietaireLayout activeTab="Historique">{page}</ProprietaireLayout>
);

