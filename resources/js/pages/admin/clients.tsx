import React, { JSX, ReactNode } from 'react'
import ClientsSection from '@/components/ownComponents/admin/clientsSection'
import LayoutAdmin from '@/layouts/layoutAdmin';

export default function Clients() {
  return (
    <>
    <ClientsSection />
    </>
  )
}
(Clients as React.FC & { layout?: (page: ReactNode) => JSX.Element }).layout = (page) => (
  <LayoutAdmin activeTab="Clients">
    {page}
  </LayoutAdmin>
);

