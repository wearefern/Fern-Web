import { getCurrentUser } from './get-current-user';

export class AdminAccessError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const requireAdmin = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new AdminAccessError(401, 'Unauthorized');
  }

  if (user.role !== 'ADMIN') {
    throw new AdminAccessError(403, 'Forbidden');
  }

  return user;
};
