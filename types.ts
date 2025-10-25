
export enum ComplaintStatus {
    PENDING = 'Pending',
    IN_PROGRESS = 'In Progress',
    RESOLVED = 'Resolved',
}

export interface Complaint {
    id: string;
    title: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    imageUrl?: string;
    status: ComplaintStatus;
    userId: string;
    userEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    submittedIssues: number;
    resolvedIssues: number;
}
