import SubscriptionManager from '@/components/ownComponents/admin/subscriptionManager';
import LayoutAdmin from '@/layouts/layoutAdmin';
import { JSX, ReactNode } from 'react';

type Subscription = {
  id: number;
  name: string;
  duration_months: number;
  price: number;
};

interface Props {
  subscriptions: Subscription[];
}

export default function PlanAbonnements({ subscriptions }: Props) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Liste des abonnements</h2>
      <SubscriptionManager subscriptions={subscriptions} />
    </>
  );
}
(PlanAbonnements as React.FC & { layout?: (page: ReactNode) => JSX.Element }).layout = (page) => (
  <LayoutAdmin activeTab="Abonnements">
    {page}
  </LayoutAdmin>
);


