
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../data';

interface AuthContextType {
    user: User | null;
    role: 'user' | 'admin' | null;
    login: (email: string) => Promise<User>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'user' | 'admin' | null>(null);

    const login = (email: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
                if (foundUser) {
                    setUser(foundUser);
                    setRole(foundUser.role);
                    resolve(foundUser);
                } else {
                    reject(new Error('User not found'));
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
