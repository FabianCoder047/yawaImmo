import AdminLayout from '@/layouts/layoutAdmin';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import PropertyHistory from '@/components/ownComponents/admin/PropertyHistory';
import { JSX, ReactNode } from 'react';

interface HistoryPageProps extends PageProps {
    properties: any[];
    stats: {
        total: number;
        sold: number;
        rented: number;
    };
    proprietaires: Array<{ id: number; name: string }>;
    filters: {
        proprietaire_id?: number;
        status?: string;
    };
}

export default function History({ 
    properties, 
    stats, 
    proprietaires, 
    filters 
}: HistoryPageProps) {
    return (
        <>
            <Head title="Historique des transactions" />
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <PropertyHistory 
                    properties={properties}
                    stats={stats}
                    proprietaires={proprietaires}
                    filters={filters}
                />
            </div>
        </>
    );
}

(History as React.FC & { layout?: (page: ReactNode) => JSX.Element }).layout = (page) => (
    <AdminLayout activeTab="Historique">
        {page}
    </AdminLayout>
);
