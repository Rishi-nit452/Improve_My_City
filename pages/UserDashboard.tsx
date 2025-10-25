import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useComplaints } from '../contexts/ComplaintContext';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintCard from '../components/ComplaintCard';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ComplaintStatus } from '../types';

const StatCard: React.FC<{ title: string; value: number; color: 'yellow' | 'blue' | 'green' }> = ({ title, value, color }) => {
    const colorClasses = {
        yellow: 'text-yellow-600',
        blue: 'text-blue-600',
        green: 'text-green-600',
    };
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
    );
};


const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const { getComplaintsByUser } = useComplaints();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const userComplaints = useMemo(() => {
        return user ? getComplaintsByUser(user.id) : [];
    }, [user, getComplaintsByUser]);
    
    const stats = useMemo(() => {
        return userComplaints.reduce((acc, c) => {
            if (c.status === ComplaintStatus.PENDING) acc.pending++;
            else if (c.status === ComplaintStatus.IN_PROGRESS) acc.inProgress++;
            else if (c.status === ComplaintStatus.RESOLVED) acc.resolved++;
            return acc;
        }, { pending: 0, inProgress: 0, resolved: 0 });
    }, [userComplaints]);

    if (!user) {
        return <p>Please log in to see your dashboard.</p>;
    }

    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}!</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-primary-hover transition-transform transform hover:scale-105"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    File New Complaint
                </button>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Pending Issues" value={stats.pending} color="yellow" />
                <StatCard title="In Progress" value={stats.inProgress} color="blue" />
                <StatCard title="Issues Resolved" value={stats.resolved} color="green" />
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                        <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close form">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <ComplaintForm 
                            onSubmitSuccess={() => setIsFormOpen(false)} 
                            onCancel={() => setIsFormOpen(false)}
                            isModal={true}
                        />
                    </div>
                </div>
            )}
            
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Submitted Issues</h2>
            
            {userComplaints.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userComplaints.map(complaint => (
                        <ComplaintCard key={complaint.id} complaint={complaint} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700">No issues filed yet</h3>
                    <p className="text-gray-500 mt-2">Click "File New Complaint" to get started.</p>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;