import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AvailabilityPanel } from "@/components/admin/AvailabilityPanel";
import { getAdminAvailabilityData } from "@/app/admin/actions";

export default async function AdminAvailabilityPage() {
  const { settings, weekly, blocked } = await getAdminAvailabilityData();

  return (
    <>
      <AdminPageHeader
        title="Disponibilités"
        description="Définissez vos horaires d'ouverture et les jours fermés. Les clientes réservent uniquement sur les créneaux libres."
      />
      <AvailabilityPanel settings={settings} weekly={weekly} blocked={blocked} />
    </>
  );
}
