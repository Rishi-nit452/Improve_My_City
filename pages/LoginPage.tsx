
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers } from '../data';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email);
            // The redirection will be handled by the App component's useEffect
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{isLoginView ? 'Welcome Back!' : 'Create Account'}</h2>
                <p className="text-center text-gray-500 mb-6">{isLoginView ? 'Log in to continue' : 'Sign up to get started'}</p>
                
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    
                    {!isLoginView && (
                         <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div className="mb-6">
                        <label htmlFor="password-mock" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password-mock"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Processing...' : (isLoginView ? 'Log In' : 'Sign Up')}
                    </button>
                </form>
                
                <p className="text-center text-sm text-gray-600 mt-6">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-primary hover:underline ml-1">
                       {isLoginView ? 'Sign up' : 'Log in'}
                    </button>
                </p>

                <div className="mt-4 text-xs text-gray-500 text-center">
                    <p className="font-semibold">Demo Accounts:</p>
                    {mockUsers.map(u => <p key={u.id}>{u.email} ({u.role})</p>)}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
