import { notFound } from 'next/navigation';

import { getCurrentUser } from '~lib/auth/get-current-user';
import { AdminToolsPage } from '~modules/account/admin-tools-page';

export default async function AccountAdminToolsPageRoute() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    notFound();
  }

  return <AdminToolsPage />;
}
