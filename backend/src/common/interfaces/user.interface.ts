import { UserRole } from '@prisma/client';

export interface User {
  userId: string;
  username: string;
  role: UserRole;
  refreshToken?: string;
}
