import React from 'react';
import Owners, { type User as Owner } from '@/components/ownComponents/admin/owners';
import LayoutAdmin from '@/layouts/layoutAdmin';
import { JSX, ReactNode } from 'react';

interface ProprietairesProps {
  proprietaires: Owner[];
}

const ProprietairesPage = ({ proprietaires }: ProprietairesProps) => {
  return <Owners proprietaires={proprietaires} />;
};

// Add layout property to the component
const ProprietairesWithLayout = ProprietairesPage as React.FC<ProprietairesProps> & { 
  layout?: (page: ReactNode) => JSX.Element 
};

ProprietairesWithLayout.layout = (page: ReactNode) => (
  <LayoutAdmin activeTab="Propriétaires">
    {page}
  </LayoutAdmin>
);

export default ProprietairesWithLayout;
