import { headers } from 'next/headers';

export const getRequestOrigin = () => {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';

  if (!host) {
    return 'http://localhost:3000';
  }

  return `${protocol}://${host}`;
};
