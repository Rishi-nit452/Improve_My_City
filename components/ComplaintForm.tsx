import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useComplaints } from '../contexts/ComplaintContext';
import MapPlaceholder from './MapPlaceholder';
import { PhotoIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface ComplaintFormProps {
    onSubmitSuccess: () => void;
    onCancel: () => void;
    isModal?: boolean;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSubmitSuccess, onCancel, isModal = false }) => {
    const { user } = useAuth();
    const { addComplaint } = useComplaints();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        
        try {
            await addComplaint({
                title,
                description,
                imageUrl: imagePreview || `https://picsum.photos/seed/${Date.now()}/800/600`,
                location: { lat: 34.05, lng: -118.24, address: "123 Civic Center, Los Angeles, CA"}, // Mocked location
                userId: user.id,
                userEmail: user.email,
            });
            onSubmitSuccess();
        } catch (error) {
            console.error("Failed to add complaint", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={isModal ? "p-8" : "bg-white p-8 rounded-xl shadow-lg"}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">File a New Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Issue Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Photo</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md object-cover" />
                            ) : (
                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            )}
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><MapPinIcon className="h-5 w-5 mr-2" /> Location</label>
                    <MapPlaceholder />
                    <p className="text-xs text-gray-500 mt-1">Click on the map to select the issue location.</p>
                </div>
                <div className="flex justify-end items-center space-x-4 pt-4 border-t">
                     <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-700 py-2 px-6 rounded-md font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="bg-secondary text-white py-2 px-6 rounded-md font-semibold hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors">
                        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComplaintForm;