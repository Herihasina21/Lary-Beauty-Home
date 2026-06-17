import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceManager } from "@/components/admin/ServiceManager";
import { getAdminServicesData } from "@/app/admin/actions";

export default async function AdminServicesPage() {
  const { categories, services } = await getAdminServicesData();

  return (
    <>
      <AdminPageHeader
        title="Tarifs & prestations"
        description="Cliquez sur une prestation pour la modifier. Utilisez les onglets pour changer de catégorie."
      />
      <ServiceManager categories={categories} services={services} />
    </>
  );
}
