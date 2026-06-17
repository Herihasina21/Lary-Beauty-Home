import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BookingPanel } from "@/components/admin/BookingPanel";
import { getAdminBookingData, getAdminSiteConfig } from "@/app/admin/actions";

export default async function AdminBookingPage() {
  const { rules, highlights, bookingQuote } = await getAdminBookingData();
  const config = await getAdminSiteConfig();

  const hidden: Record<string, string> = {
    phone: config?.phone ?? "",
    email: config?.email ?? "",
    address: config?.address ?? "",
    instagram: config?.instagram ?? "",
    facebook: config?.facebook ?? "",
    tiktok: config?.tiktok ?? "",
    instagramUrl: config?.instagramUrl ?? "",
    instagramDmUrl: config?.instagramDmUrl ?? "",
    facebookUrl: config?.facebookUrl ?? "",
    tiktokUrl: config?.tiktokUrl ?? "",
    formspreeFormId: config?.formspreeFormId ?? "",
  };

  return (
    <>
      <AdminPageHeader
        title="Réservation"
        description="Les règles et la citation que vos clientes lisent avant de vous contacter."
      />
      <BookingPanel
        rules={rules}
        highlights={highlights}
        bookingQuote={bookingQuote}
        siteConfigHidden={hidden}
      />
    </>
  );
}
