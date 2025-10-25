import React from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { MapPinIcon, CalendarIcon, UserIcon, PencilIcon } from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';

interface ComplaintCardProps {
    complaint: Complaint;
    isAdminView?: boolean;
    isModalView?: boolean;
    onStatusChange?: (id: string, newStatus: ComplaintStatus) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, isAdminView = false, isModalView = false, onStatusChange }) => {
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onStatusChange) {
            onStatusChange(complaint.id, e.target.value as ComplaintStatus);
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ${!isModalView && 'transition-transform transform hover:scale-[1.02] duration-300'}`}>
            {complaint.imageUrl && <img src={complaint.imageUrl} alt={complaint.title} className="w-full h-48 object-cover" />}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight pr-2">{complaint.title}</h3>
                    <StatusBadge status={complaint.status} />
                </div>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{complaint.description}</p>
                
                <div className="text-xs text-gray-500 space-y-2 mt-auto">
                    <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{complaint.location.address}</span>
                    </div>
                    {isAdminView && (
                        <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-2" />
                            <span>Reported by: {complaint.userEmail}</span>
                        </div>
                    )}
                     <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>Reported on: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {isAdminView && onStatusChange && (
                    <div className="mt-4 pt-4 border-t">
                        <label htmlFor={`status-update-${complaint.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <PencilIcon className="h-4 w-4 mr-2" /> Update Status
                        </label>
                        <select
                            id={`status-update-${complaint.id}`}
                            value={complaint.status}
                            onChange={handleSelectChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                        >
                            {Object.values(ComplaintStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintCard;