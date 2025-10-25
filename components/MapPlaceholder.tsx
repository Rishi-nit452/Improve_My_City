
import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';

const MapPlaceholder: React.FC = () => {
    return (
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            <img 
                src="https://www.google.com/maps/d/u/0/thumbnail?mid=1_2S31wY1i-kS6j2xJ5v5b2KJcxE&hl=en" 
                alt="Map of a city" 
                className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute text-center">
                <MapPinIcon className="h-12 w-12 text-red-500 animate-bounce" />
                <p className="mt-2 font-semibold text-white bg-black bg-opacity-50 px-3 py-1 rounded-md">
                    Location Pin
                </p>
            </div>
             <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Map functionality is for demonstration.
            </div>
        </div>
    );
};

export default MapPlaceholder;
