import React, { useMemo } from 'react';
import { mockUsers } from '../data';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { TrophyIcon } from '@heroicons/react/24/solid';

const LeaderboardPage: React.FC = () => {
    const { user: currentUser } = useAuth();

    const sortedUsers = useMemo(() => {
        return [...mockUsers]
            .filter(u => u.role === 'user')
            .sort((a, b) => (b.resolvedIssues + b.submittedIssues) - (a.resolvedIssues + a.submittedIssues));
    }, []);

    const LeaderboardRow: React.FC<{user: User, rank: number}> = ({ user, rank }) => {
        const getRankColor = (r: number) => {
            if (r === 1) return 'bg-yellow-400 text-white';
            if (r === 2) return 'bg-gray-400 text-white';
            if (r === 3) return 'bg-yellow-600 text-white';
            return 'bg-gray-200 text-gray-700';
        };

        const isCurrentUser = currentUser && currentUser.id === user.id;

        return (
            <tr className={`border-b transition-colors ${isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                <td className="p-4 text-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankColor(rank)}`}>
                        {rank}
                    </span>
                </td>
                <td className="p-4 font-medium text-gray-800">
                    {user.name} {isCurrentUser && <span className="text-xs font-bold text-primary ml-2">(You)</span>}
                </td>
                <td className="p-4 text-center font-semibold text-blue-600">{user.submittedIssues}</td>
                <td className="p-4 text-center font-semibold text-green-600">{user.resolvedIssues}</td>
                <td className="p-4 text-center font-bold text-indigo-700">{user.submittedIssues + user.submittedIssues}</td>
            </tr>
        )
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-center">
                <TrophyIcon className="h-12 w-12 text-yellow-500 mx-auto mb-2"/>
                <h2 className="text-3xl font-bold text-gray-800">Top Contributors</h2>
                <p className="text-gray-500 mt-2">Celebrating citizens who make our city better!</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                            <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                            <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Resolved</th>
                            <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user, index) => (
                           <LeaderboardRow key={user.id} user={user} rank={index + 1} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardPage;