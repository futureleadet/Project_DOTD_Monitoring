import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { User, ViewState, Creation } from '../types';
import { getAllUsers, getAdminPickedCreations } from '../services/apiService';

interface AdminDashboardProps {
  user: User;
  onNavigate: (view: ViewState) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pickedCreations, setPickedCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState({ users: true, creations: true });

  useEffect(() => {
    if (user.role !== 'ADMIN') {
      alert("Access Denied.");
      onNavigate(ViewState.HOME);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, users: true, creations: true }));
        const [usersData, creationsData] = await Promise.all([
          getAllUsers(),
          getAdminPickedCreations()
        ]);
        setUsers(usersData);
        setPickedCreations(creationsData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
        alert("Failed to load admin data.");
      } finally {
        setLoading(prev => ({ ...prev, users: false, creations: false }));
      }
    };

    fetchData();
  }, [user, onNavigate]);

  if (user.role !== 'ADMIN') {
    return null; // or a redirect component
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Site Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h3 className="text-sm font-semibold text-gray-500">Total Users</h3>
            {loading.users ? <div className="h-8 bg-gray-200 rounded animate-pulse mt-1"></div> : <p className="text-3xl font-bold">{users.length}</p>}
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h3 className="text-sm font-semibold text-gray-500">Picked Items</h3>
            {loading.creations ? <div className="h-8 bg-gray-200 rounded animate-pulse mt-1"></div> : <p className="text-3xl font-bold">{pickedCreations.length}</p>}
          </div>
        </div>
      </div>

      {/* Picked Creations Management */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Feed Management (Editor's Picks)</h2>
        {loading.creations ? (
             <p className="text-sm text-gray-500">Loading picked images...</p>
        ) : pickedCreations.length === 0 ? (
            <p className="text-sm text-gray-500">No images have been picked yet.</p>
        ) : (
            <div className="grid grid-cols-3 gap-3">
            {pickedCreations.map(creation => (
                <div key={creation.id} className="relative group bg-gray-100 rounded-lg shadow-sm overflow-hidden aspect-square">
                <img src={creation.media_url} alt={creation.prompt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => alert(`Un-picking ${creation.id}`)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition-colors"
                    >
                        Un-pick
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
      
      {/* User Management */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">User Management</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto border">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody>
              {loading.users ? (
                <tr><td colSpan={3} className="p-4 text-center text-gray-500">Loading users...</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <img src={u.avatarUrl} className="w-6 h-6 rounded-full" />
                    {u.name}
                  </td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
