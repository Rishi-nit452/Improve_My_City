
import React from 'react';
import { ComplaintStatus } from '../types';

interface StatusBadgeProps {
    status: ComplaintStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const statusStyles: { [key in ComplaintStatus]: string } = {
        [ComplaintStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
        [ComplaintStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
        [ComplaintStatus.RESOLVED]: 'bg-green-100 text-green-800',
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
