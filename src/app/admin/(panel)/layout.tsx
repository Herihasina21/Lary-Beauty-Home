import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminToast } from "@/components/admin/AdminToast";
import { fetchUnreadMessageCount } from "@/lib/site-data";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const unread = await fetchUnreadMessageCount();

  return (
    <AdminShell unreadMessages={unread}>
      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Suspense fallback={null}>
          <AdminToast />
        </Suspense>
        {children}
      </main>
    </AdminShell>
  );
}
