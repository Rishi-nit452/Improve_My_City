import React, { useState } from 'react';
import { Complaint } from '../types';
import ComplaintCard from '../components/ComplaintCard';
import { mockComplaints } from '../data';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const TrackIssuePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState<Complaint[] | null>(null);
    const [searched, setSearched] = useState(false);
    
    // In a real app, this would be an API call. Here we simulate it.
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
        if(!searchTerm) {
            setSearchResult(null);
            return;
        }

        const isEmail = searchTerm.includes('@');
        if (isEmail) {
            const results = mockComplaints.filter(c => c.userEmail.toLowerCase() === searchTerm.toLowerCase());
            setSearchResult(results.length > 0 ? results : null);
        } else {
            const result = mockComplaints.find(c => c.id.toLowerCase() === searchTerm.toLowerCase());
            setSearchResult(result ? [result] : null);
        }
    };
    
    const renderContent = () => {
        if (!searched) {
            return (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-4 text-gray-500">Enter a complaint ID or an email to begin your search.</p>
                </div>
            );
        }

        if (!searchResult) {
            return (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                     <p className="text-gray-500">No complaints found for "{searchTerm}".</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResult.map(complaint => (
                     <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Track Your Issue</h2>
                <p className="text-gray-500 mb-6">Enter your Complaint ID or Email to check the status.</p>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="e.g., CMPT-001 or user@example.com"
                    />
                    <button
                        type="submit"
                        className="bg-primary text-white py-2 px-6 rounded-md font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>
            
            <div className="mt-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default TrackIssuePage;