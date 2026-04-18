import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'JEFE' | 'USER';

interface User {
  name: string;
  nip: string;
  role: UserRole;
  position: string;
}

interface AuthContextType {
  user: User | null;
  login: (nip: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS: User[] = [
  {
    name: 'Victor Guillermo Hernandez Ortega',
    nip: '0406',
    role: 'JEFE',
    position: 'Jefe de Tráfico'
  },
  {
    name: 'Operador Estándar',
    nip: '1111',
    role: 'USER',
    position: 'Auxiliar de Tráfico'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('glosa_auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (nip: string) => {
    const foundUser = USERS.find(u => u.nip === nip);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('glosa_auth_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('glosa_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
