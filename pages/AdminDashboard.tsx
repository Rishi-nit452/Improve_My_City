import React, { useState, useMemo } from 'react';
import { useComplaints } from '../contexts/ComplaintContext';
import { Complaint, ComplaintStatus } from '../types';
import ComplaintCard from '../components/ComplaintCard';
import StatusBadge from '../components/StatusBadge';
import { FunnelIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const StatCard: React.FC<{ title: string; value: number; total?: number; color: string }> = ({ title, value, total, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline space-x-2">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            {total && <span className="text-gray-500">/ {total}</span>}
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const { complaints, updateComplaintStatus } = useComplaints();
    const [filter, setFilter] = useState<ComplaintStatus | 'All'>('All');
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

    const filteredComplaints = useMemo(() => {
        if (filter === 'All') return complaints;
        return complaints.filter(c => c.status === filter);
    }, [complaints, filter]);

    const handleStatusChange = async (id: string, newStatus: ComplaintStatus) => {
        try {
            await updateComplaintStatus(id, newStatus);
            if (selectedComplaint && selectedComplaint.id === id) {
                setSelectedComplaint(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };
    
    const stats = useMemo(() => {
        return complaints.reduce((acc, c) => {
            if (c.status === ComplaintStatus.PENDING) acc.pending++;
            else if (c.status === ComplaintStatus.IN_PROGRESS) acc.inProgress++;
            else if (c.status === ComplaintStatus.RESOLVED) acc.resolved++;
            return acc;
        }, { pending: 0, inProgress: 0, resolved: 0 });
    }, [complaints]);
    
    const filterOptions: (ComplaintStatus | 'All')[] = ['All', ...Object.values(ComplaintStatus)];

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            <div className="flex flex-wrap gap-4 mb-6">
                <StatCard title="Total Complaints" value={complaints.length} color="text-gray-800" />
                <StatCard title="Pending" value={stats.pending} color="text-yellow-600" />
                <StatCard title="In Progress" value={stats.inProgress} color="text-blue-600" />
                <StatCard title="Resolved" value={stats.resolved} color="text-green-600" />
            </div>
            
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                <FunnelIcon className="h-6 w-6 text-gray-500" />
                <span className="font-medium text-gray-700">Filter by status:</span>
                <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                    <button
                        key={option}
                        onClick={() => setFilter(option)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                            filter === option
                                ? 'bg-primary text-white shadow'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {option}
                    </button>
                ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Complaint ID</th>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Reported By</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.map(complaint => (
                            <tr key={complaint.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{complaint.id}</td>
                                <td className="px-6 py-4">{complaint.title}</td>
                                <td className="px-6 py-4">{complaint.userEmail}</td>
                                <td className="px-6 py-4">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={complaint.status}
                                        onChange={(e) => handleStatusChange(complaint.id, e.target.value as ComplaintStatus)}
                                        className="w-full p-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-xs"
                                        onClick={(e) => e.stopPropagation()} // Prevents row click events
                                    >
                                        {Object.values(ComplaintStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => setSelectedComplaint(complaint)} className="flex items-center text-primary hover:underline font-medium">
                                        <EyeIcon className="h-4 w-4 mr-1" /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                        <button onClick={() => setSelectedComplaint(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10" aria-label="Close details">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <ComplaintCard complaint={selectedComplaint} isAdminView={true} isModalView={true} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;