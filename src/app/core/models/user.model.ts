export type Role = 'user' | 'employer' | 'master';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}
