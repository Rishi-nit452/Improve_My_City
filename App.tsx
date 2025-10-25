
import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TrackIssuePage from './pages/TrackIssuePage';
import LeaderboardPage from './pages/LeaderboardPage';
import Header from './components/Header';
import { ComplaintProvider } from './contexts/ComplaintContext';

type Page = 'login' | 'user_dashboard' | 'admin_dashboard' | 'track_issue' | 'leaderboard';

const AppContent: React.FC = () => {
    const { user, role } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('track_issue');

    const navigate = useCallback((page: Page) => {
        if (!user && (page === 'user_dashboard' || page === 'admin_dashboard')) {
            setCurrentPage('login');
        } else {
            setCurrentPage(page);
        }
    }, [user]);

    React.useEffect(() => {
        if (user) {
            if (role === 'admin') {
                setCurrentPage('admin_dashboard');
            } else {
                setCurrentPage('user_dashboard');
            }
        } else {
            setCurrentPage('track_issue');
        }
    }, [user, role]);

    const renderPage = () => {
        if (!user) {
            if(currentPage === 'login') return <LoginPage />;
            if(currentPage === 'track_issue') return <TrackIssuePage />;
            if(currentPage === 'leaderboard') return <LeaderboardPage />;
            return <TrackIssuePage />;
        }

        switch (currentPage) {
            case 'user_dashboard':
                return <UserDashboard />;
            case 'admin_dashboard':
                return <AdminDashboard />;
            case 'track_issue':
                return <TrackIssuePage />;
            case 'leaderboard':
                return <LeaderboardPage />;
            default:
                return role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <Header currentPage={currentPage} navigate={navigate} />
            <main className="p-4 sm:p-6 md:p-8">
                {renderPage()}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ComplaintProvider>
                <AppContent />
            </ComplaintProvider>
        </AuthProvider>
    );
};

export default App;
