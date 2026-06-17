import { AdminCard, AdminField } from "@/components/admin/AdminField";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { getAdminSiteConfig, saveSiteConfigAction } from "@/app/admin/actions";
import { fetchBookingQuote } from "@/lib/site-data";

export default async function AdminContactPage() {
  const config = await getAdminSiteConfig();
  const bookingQuote = config?.bookingQuote ?? (await fetchBookingQuote());

  return (
    <>
      <AdminPageHeader
        title="Contact & réseaux"
        description="Vos coordonnées et liens affichés sur le site. Pensez à enregistrer après chaque modification."
      />

      <form action={saveSiteConfigAction} className="space-y-8">
        <input type="hidden" name="bookingQuote" value={bookingQuote} />
        <input type="hidden" name="returnPath" value="/admin/contact" />

        <AdminCard title="Coordonnées principales">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Téléphone" name="phone" defaultValue={config?.phone ?? ""} required hint="Affiché sur le site et cliquable" />
            <AdminField label="Email" name="email" type="email" defaultValue={config?.email ?? ""} required />
            <div className="sm:col-span-2">
              <AdminField label="Adresse" name="address" defaultValue={config?.address ?? ""} required />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Instagram">
          <div className="grid gap-4">
            <AdminField label="Nom affiché" name="instagram" defaultValue={config?.instagram ?? ""} />
            <AdminField label="Lien du profil" name="instagramUrl" defaultValue={config?.instagramUrl ?? ""} />
            <AdminField
              label="Lien message privé (réservation)"
              name="instagramDmUrl"
              defaultValue={config?.instagramDmUrl ?? ""}
              hint="Utilisé pour le bouton « Réserver sur Instagram »"
            />
          </div>
        </AdminCard>

        <AdminCard title="Autres réseaux">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Facebook" name="facebook" defaultValue={config?.facebook ?? ""} />
            <AdminField label="Lien Facebook" name="facebookUrl" defaultValue={config?.facebookUrl ?? ""} />
            <AdminField label="TikTok" name="tiktok" defaultValue={config?.tiktok ?? ""} />
            <AdminField label="Lien TikTok" name="tiktokUrl" defaultValue={config?.tiktokUrl ?? ""} />
          </div>
        </AdminCard>

        <AdminSubmitButton label="Enregistrer tout" className="w-full sm:w-auto" />
      </form>
    </>
  );
}
