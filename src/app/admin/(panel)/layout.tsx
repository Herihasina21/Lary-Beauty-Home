import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminToast } from "@/components/admin/AdminToast";
import { fetchAdminNotificationStats } from "@/lib/site-data";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const notifications = await fetchAdminNotificationStats();

  return (
    <AdminShell initialNotifications={notifications}>
      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Suspense fallback={null}>
          <AdminToast />
        </Suspense>
        {children}
      </main>
    </AdminShell>
  );
}
