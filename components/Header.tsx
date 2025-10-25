
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BuildingOffice2Icon, UserCircleIcon, ArrowLeftOnRectangleIcon, MagnifyingGlassIcon, ChartBarIcon, UserGroupIcon, IdentificationIcon } from '@heroicons/react/24/outline';

type Page = 'login' | 'user_dashboard' | 'admin_dashboard' | 'track_issue' | 'leaderboard';

interface HeaderProps {
    currentPage: Page;
    navigate: (page: Page) => void;
}

const NavItem: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isActive
                ? 'bg-blue-100 text-primary'
                : 'text-gray-600 hover:bg-gray-200'
        }`}
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ currentPage, navigate }) => {
    const { user, role, logout } = useAuth();

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <BuildingOffice2Icon className="h-8 w-8 text-primary" />
                        <h1 className="text-xl font-bold text-gray-800">Improve My City</h1>
                    </div>
                    <nav className="hidden md:flex items-center space-x-2">
                        {user && role === 'user' && (
                             <NavItem onClick={() => navigate('user_dashboard')} isActive={currentPage === 'user_dashboard'}>
                                <UserCircleIcon className="h-5 w-5 mr-2" />
                                My Dashboard
                            </NavItem>
                        )}
                         {user && role === 'admin' && (
                             <NavItem onClick={() => navigate('admin_dashboard')} isActive={currentPage === 'admin_dashboard'}>
                                <IdentificationIcon className="h-5 w-5 mr-2" />
                                Admin Panel
                            </NavItem>
                        )}
                        <NavItem onClick={() => navigate('track_issue')} isActive={currentPage === 'track_issue'}>
                           <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                           Track Issue
                        </NavItem>
                        <NavItem onClick={() => navigate('leaderboard')} isActive={currentPage === 'leaderboard'}>
                            <ChartBarIcon className="h-5 w-5 mr-2" />
                            Leaderboard
                        </NavItem>
                    </nav>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium hidden sm:block">{user.name}</span>
                                <button
                                    onClick={logout}
                                    className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200"
                                >
                                    <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                                </button>
                            </div>
                        ) : (
                             <button
                                onClick={() => navigate('login')}
                                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-hover transition-colors"
                            >
                                Login / Sign Up
                            </button>
                        )}
                    </div>
                </div>
                 {/* Mobile Nav */}
                 <nav className="md:hidden flex items-center justify-around py-2 border-t">
                        {user && role === 'user' && (
                             <NavItem onClick={() => navigate('user_dashboard')} isActive={currentPage === 'user_dashboard'}>
                                <UserCircleIcon className="h-5 w-5" />
                            </NavItem>
                        )}
                         {user && role === 'admin' && (
                             <NavItem onClick={() => navigate('admin_dashboard')} isActive={currentPage === 'admin_dashboard'}>
                                <IdentificationIcon className="h-5 w-5" />
                            </NavItem>
                        )}
                        <NavItem onClick={() => navigate('track_issue')} isActive={currentPage === 'track_issue'}>
                           <MagnifyingGlassIcon className="h-5 w-5" />
                        </NavItem>
                        <NavItem onClick={() => navigate('leaderboard')} isActive={currentPage === 'leaderboard'}>
                            <ChartBarIcon className="h-5 w-5" />
                        </NavItem>
                </nav>
            </div>
        </header>
    );
};

export default Header;
