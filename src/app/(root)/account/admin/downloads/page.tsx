import { notFound } from 'next/navigation';

import { getCurrentUser } from '~lib/auth/get-current-user';
import { AdminDownloadsPage } from '~modules/account/admin-downloads-page';

export default async function AccountAdminDownloadsPageRoute() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    notFound();
  }

  return <AdminDownloadsPage />;
}
