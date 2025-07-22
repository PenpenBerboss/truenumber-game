'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

/**
 * Interface définissant la structure d'un utilisateur pour l'administration
 */
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  balance: number;
  created_at: string;
}

/**
 * Page d'administration des utilisateurs - Gestion CRUD des comptes utilisateurs
 * Route: /admin/users (Accès administrateur uniquement)
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'user' as 'user' | 'admin',
    balance: 1000
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data); // L'API backend renvoie directement un tableau
    } catch (error) {
      toast.error('Échec de la récupération des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      toast.success('User created successfully');
      fetchUsers();
      setShowCreateForm(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await api.put(`/users/${editingUser.id}`, formData);
      toast.success('User updated successfully');
      fetchUsers();
      setEditingUser(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      balance: 1000
    });
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      password: '',
      role: user.role,
      balance: user.balance
    });
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
          <Navbar />
          <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mb-4 shadow-lg animate-pulse">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Loading Users...</h1>
            </div>
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-300 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-10 h-8 bg-gray-300 rounded"></div>
                        <div className="w-10 h-8 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mb-6 shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              User Management
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage all users, their roles, and account settings from this administrative panel
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{users.length}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.role === 'admin').length}
                  </div>
                  <div className="text-sm text-gray-600">Administrators</div>
                </CardContent>
              </Card>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>

          {/* Create/Edit Form */}
          {(showCreateForm || editingUser) && (
            <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-orange-600 to-red-600"></div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  {editingUser ? (
                    <>
                      <Edit className="h-6 w-6 mr-3 text-orange-600" />
                      Edit User: {editingUser.username}
                    </>
                  ) : (
                    <>
                      <Plus className="h-6 w-6 mr-3 text-orange-600" />
                      Create New User
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone number"
                        className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password {editingUser && <span className="text-gray-500">(leave empty to keep current)</span>}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingUser}
                        minLength={6}
                        className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium text-gray-700">User Role</Label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                        className="w-full h-11 px-3 rounded-md border border-gray-200 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="user">👤 User</option>
                        <option value="admin">👑 Administrator</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="balance" className="text-sm font-medium text-gray-700">Initial Balance</Label>
                      <Input
                        id="balance"
                        type="number"
                        value={formData.balance}
                        onChange={(e) => setFormData({ ...formData, balance: parseInt(e.target.value) })}
                        required
                        className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                    >
                      {editingUser ? 'Update User' : 'Create User'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingUser(null);
                        resetForm();
                      }}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <div className="space-y-4">
            {users.map((user, index) => (
              <Card key={user.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* User Avatar */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                        user.role === 'admin' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}>
                        {user.name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      
                      {/* User Info */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-bold text-gray-900">{user.name || user.username || 'Nom non défini'}</h3>
                          <span className="text-sm text-gray-500">@{user.username || 'username'}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
                              : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200'
                          }`}>
                            {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                          </span>
                        </div>
                        <p className="text-gray-600 flex items-center">
                          📧 {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-gray-600 flex items-center text-sm">
                            📱 {user.phone}
                          </p>
                        )}
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mt-2">
                          <span className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Balance: {user.balance.toLocaleString()}</span>
                          </span>
                          <span>📅 Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(user)}
                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {users.length === 0 && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No Users Found</h3>
                  <p className="text-lg text-gray-500 mb-6">Get started by creating your first user account.</p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First User
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}