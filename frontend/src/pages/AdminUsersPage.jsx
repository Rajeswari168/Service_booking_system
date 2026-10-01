import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Users, Mail, Phone, Shield } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (e) {
      setError(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">ADMIN</span>;
      case 'PROVIDER':
        return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">PROVIDER</span>;
      case 'CUSTOMER':
        return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-green-50 text-green-700 border border-green-200">CUSTOMER</span>;
      default:
        return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-gray-100 text-gray-700">{role}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Directory of customers, service providers, and administrators</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">System Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/70 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-gray-900">#{u.id}</td>
                <td className="py-3.5 px-4 font-semibold text-gray-900 flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-xs">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="py-3.5 px-4 text-gray-600 text-xs">{u.email}</td>
                <td className="py-3.5 px-4 text-gray-600 text-xs">{u.phone}</td>
                <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
