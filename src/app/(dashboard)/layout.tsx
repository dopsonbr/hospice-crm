import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NavSidebar, MobileHeader } from '@/components/nav-sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userEmail = user.email || 'Unknown';

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-900 lg:flex-row">
      <NavSidebar userEmail={userEmail} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader userEmail={userEmail} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
