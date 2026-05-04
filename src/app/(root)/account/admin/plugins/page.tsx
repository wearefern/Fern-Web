import { notFound } from 'next/navigation';

import { getCurrentUser } from '~lib/auth/get-current-user';
import { AdminPluginsPage } from '~modules/account/admin-plugins-page';

export default async function AccountAdminPluginsPageRoute() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    notFound();
  }

  return <AdminPluginsPage />;
}
