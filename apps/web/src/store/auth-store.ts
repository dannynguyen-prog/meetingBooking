import { atom, useAtom } from 'jotai';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: 'SYSTEM_ADMIN' | 'COMPANY_ADMIN';
  companyId?: string;
  token: string;
};

const userAtom = atom<User | null>(null);

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);

  const login = (nextUser: User) => setUser(nextUser);
  const logout = () => setUser(null);

  return { user, login, logout };
}
