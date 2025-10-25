
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { mockComplaints } from '../data';

interface ComplaintContextType {
    complaints: Complaint[];
    getComplaintById: (id: string) => Complaint | undefined;
    getComplaintsByUser: (userId: string) => Complaint[];
    addComplaint: (newComplaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Complaint>;
    updateComplaintStatus: (id: string, status: ComplaintStatus) => Promise<Complaint>;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);

    const getComplaintById = useCallback((id: string) => {
        return complaints.find(c => c.id.toLowerCase() === id.toLowerCase());
    }, [complaints]);

    const getComplaintsByUser = useCallback((userId: string) => {
        return complaints.filter(c => c.userId === userId);
    }, [complaints]);

    const addComplaint = (newComplaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Complaint> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newComplaint: Complaint = {
                    ...newComplaintData,
                    id: `CMPT-${String(complaints.length + 1).padStart(3, '0')}`,
                    status: ComplaintStatus.PENDING,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                setComplaints(prev => [newComplaint, ...prev]);
                resolve(newComplaint);
            }, 500);
        });
    };

    const updateComplaintStatus = (id: string, status: ComplaintStatus): Promise<Complaint> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let updatedComplaint: Complaint | undefined;
                setComplaints(prev =>
                    prev.map(c => {
                        if (c.id === id) {
                            updatedComplaint = { ...c, status, updatedAt: new Date() };
                            return updatedComplaint;
                        }
                        return c;
                    })
                );
                if (updatedComplaint) {
                    resolve(updatedComplaint);
                } else {
                    reject(new Error("Complaint not found"));
                }
            }, 500);
        });
    };

    return (
        <ComplaintContext.Provider value={{ complaints, getComplaintById, getComplaintsByUser, addComplaint, updateComplaintStatus }}>
            {children}
        </ComplaintContext.Provider>
    );
};

export const useComplaints = (): ComplaintContextType => {
    const context = useContext(ComplaintContext);
    if (context === undefined) {
        throw new Error('useComplaints must be used within a ComplaintProvider');
    }
    return context;
};
