import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HomePagePanel } from "@/components/admin/HomePagePanel";
import { getAdminHomeData } from "@/app/admin/actions";

export default async function AdminHomePage() {
  const { config, features } = await getAdminHomeData();

  return (
    <>
      <AdminPageHeader
        title="Page d'accueil"
        description="Bannière, texte de présentation et points forts visibles en haut du site."
      />
      <HomePagePanel config={config} features={features} />
    </>
  );
}
