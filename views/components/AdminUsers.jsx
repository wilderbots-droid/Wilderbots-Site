import { useState, useEffect } from 'react'
import { Search, Trash2, Users as UsersIcon, Mail, Calendar, ChevronLeft, ChevronRight, Phone, MapPin, Eye, X, Clock, Home, Building, Star, Ban, CheckCircle, AlertCircle, Edit, Save, Lock } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [editSuccess, setEditSuccess] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
      })

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBlockToggle = async (user, block) => {
    const action = block ? 'block' : 'unblock'
    const reason = block ? prompt('Enter reason for blocking (optional):') : null
    
    if (block && reason === null) {
      return // User cancelled
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/users?id=${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isBlocked: block,
          blockedReason: reason || undefined
        }),
      })

      if (response.ok) {
        await fetchUsers()
        if (selectedUser && selectedUser._id === user._id) {
          const updatedUser = await response.json()
          setSelectedUser(updatedUser.user)
        }
      } else {
        const data = await response.json()
        alert(data.error || `Failed to ${action} user`)
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error)
      alert(`Failed to ${action} user`)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchUsers()
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(null)
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const fetchUserAddresses = async (userId) => {
    setLoadingAddresses(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/users/${userId}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSavedAddresses(data.addresses || [])
      }
    } catch (error) {
      console.error('Error fetching user addresses:', error)
      setSavedAddresses([])
    } finally {
      setLoadingAddresses(false)
    }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setIsEditing(false)
    setEditingUser(null)
    setEditError('')
    setEditSuccess('')
    fetchUserAddresses(user._id)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditing(true)
    setEditingUser({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      },
      password: ''
    })
    setEditError('')
    setEditSuccess('')
    fetchUserAddresses(user._id)
  }

  const handleSaveUser = async () => {
    setSaving(true)
    setEditError('')
    setEditSuccess('')

    try {
      // Validate email format
      if (editingUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingUser.email)) {
        setEditError('Invalid email format')
        setSaving(false)
        return
      }

      // Validate password if provided
      if (editingUser.password && editingUser.password.length < 6) {
        setEditError('Password must be at least 6 characters')
        setSaving(false)
        return
      }

      const token = localStorage.getItem('admin_token')
      const updateData = {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        address: editingUser.address
      }

      // Only include password if it's provided
      if (editingUser.password) {
        updateData.password = editingUser.password
      }

      const response = await fetch(`/api/admin/users?id=${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (response.ok) {
        setEditSuccess('User updated successfully!')
        setIsEditing(false)
        setEditingUser(null)
        await fetchUsers()
        // Update selectedUser with new data
        setSelectedUser(data.user)
        setTimeout(() => {
          setEditSuccess('')
        }, 3000)
      } else {
        setEditError(data.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setEditError('Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingUser(null)
    setEditError('')
    setEditSuccess('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <UsersIcon className="w-6 h-6 mr-2 text-blue-400" />
            User Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {pagination ? `Total: ${pagination.total} users` : 'Manage all registered users'}
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-10 pr-4 py-2.5 w-full sm:w-80 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-600 mb-4"></div>
            <p className="text-gray-400">Loading users...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider sticky right-0 bg-gray-800/50 z-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-800/30 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-semibold">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-300">
                              <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center text-sm text-gray-400">
                                <Phone className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.address && (user.address.street || user.address.city) ? (
                            <div className="text-sm text-gray-300 space-y-0.5">
                              {user.address.street && <div>{user.address.street}</div>}
                              <div className="text-gray-400">
                                {user.address.city}
                                {user.address.state && `, ${user.address.state}`}
                                {user.address.zipCode && ` ${user.address.zipCode}`}
                              </div>
                              {user.address.country && <div className="text-gray-400">{user.address.country}</div>}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No address</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isBlocked ? (
                            <div className="flex items-center gap-2">
                              <Ban className="w-4 h-4 text-red-400" />
                              <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full border border-red-500/20">
                                Blocked
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                                Active
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.lastLogin ? (
                            <div className="flex items-center text-sm text-gray-400">
                              <Clock className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                              {new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Never</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right sticky right-0 bg-gray-900/50 group-hover:bg-gray-800/50 z-10 transition-colors">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition whitespace-nowrap"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            {user.isBlocked ? (
                              <button
                                onClick={() => handleBlockToggle(user, false)}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition whitespace-nowrap"
                                title="Unblock user"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlockToggle(user, true)}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition whitespace-nowrap"
                                title="Block user"
                              >
                                <Ban className="w-4 h-4 mr-1" />
                                Block
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition whitespace-nowrap"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                            <UsersIcon className="w-8 h-8 text-gray-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
                          <p className="text-sm text-gray-400 max-w-md">
                            {search
                              ? 'No users match your search query. Try adjusting your search criteria.'
                              : 'Registered users will appear here once they sign up.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 px-6 py-4">
              <div className="text-sm text-gray-400">
                Showing <span className="font-medium text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium text-white">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium text-white">{pagination.total}</span> users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm text-gray-300">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900">
              <h3 className="text-xl font-semibold text-white">{isEditing ? 'Edit User' : 'User Details'}</h3>
              <button
                onClick={() => {
                  setSelectedUser(null)
                  setIsEditing(false)
                  setEditingUser(null)
                  setEditError('')
                  setEditSuccess('')
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Success/Error Messages */}
              {editSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm">{editSuccess}</p>
                </div>
              )}
              {editError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{editError}</p>
                </div>
              )}

              {/* User Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Personal Information</h4>
                {isEditing ? (
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editingUser.phone}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        New Password (leave empty to keep current)
                      </label>
                      <input
                        type="password"
                        value={editingUser.password}
                        onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                        placeholder="Enter new password (min 6 characters)"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Admin can reset password without current password</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{selectedUser.name}</div>
                        <div className="text-sm text-gray-400">{selectedUser.email}</div>
                      </div>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Profile Address
                </h4>
                {isEditing ? (
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Street</label>
                      <input
                        type="text"
                        value={editingUser.address.street}
                        onChange={(e) => setEditingUser({ ...editingUser, address: { ...editingUser.address, street: e.target.value } })}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                        <input
                          type="text"
                          value={editingUser.address.city}
                          onChange={(e) => setEditingUser({ ...editingUser, address: { ...editingUser.address, city: e.target.value } })}
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                        <input
                          type="text"
                          value={editingUser.address.state}
                          onChange={(e) => setEditingUser({ ...editingUser, address: { ...editingUser.address, state: e.target.value } })}
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Zip Code</label>
                        <input
                          type="text"
                          value={editingUser.address.zipCode}
                          onChange={(e) => setEditingUser({ ...editingUser, address: { ...editingUser.address, zipCode: e.target.value } })}
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                        <input
                          type="text"
                          value={editingUser.address.country}
                          onChange={(e) => setEditingUser({ ...editingUser, address: { ...editingUser.address, country: e.target.value } })}
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  selectedUser.address && (selectedUser.address.street || selectedUser.address.city) ? (
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                      {selectedUser.address.street && (
                        <div className="text-white">{selectedUser.address.street}</div>
                      )}
                      <div className="text-gray-300">
                        {selectedUser.address.city}
                        {selectedUser.address.state && `, ${selectedUser.address.state}`}
                        {selectedUser.address.zipCode && ` ${selectedUser.address.zipCode}`}
                      </div>
                      {selectedUser.address.country && (
                        <div className="text-gray-300">{selectedUser.address.country}</div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 rounded-lg p-4 text-gray-500 text-sm">No address set</div>
                  )
                )}
              </div>

              {/* Saved Addresses */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Saved Addresses ({savedAddresses.length})
                </h4>
                {loadingAddresses ? (
                  <div className="bg-gray-800/50 rounded-lg p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-700 border-t-blue-600 mb-2"></div>
                    <p className="text-gray-400 text-sm">Loading addresses...</p>
                  </div>
                ) : savedAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {savedAddresses.map((address) => (
                      <div
                        key={address._id}
                        className={`bg-gray-800/50 rounded-lg p-4 border ${
                          address.isDefault ? 'border-purple-500/50 bg-purple-500/5' : 'border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {address.label === 'Home' && <Home size={16} className="text-purple-400" />}
                            {address.label === 'Work' && <Building size={16} className="text-blue-400" />}
                            {address.label === 'Other' && <MapPin size={16} className="text-gray-400" />}
                            <span className="font-semibold text-white">{address.label}</span>
                            {address.isDefault && (
                              <>
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                  Default
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div className="font-medium text-white">{address.firstName} {address.lastName}</div>
                          {address.phone && <div className="flex items-center gap-1">
                            <Phone size={12} className="text-gray-400" />
                            {address.phone}
                          </div>}
                          <div>{address.street}</div>
                          <div>
                            {address.city}
                            {address.state && `, ${address.state}`}
                            {address.zipCode && ` ${address.zipCode}`}
                          </div>
                          <div>{address.country}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/50 rounded-lg p-8 text-center">
                    <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No saved addresses</p>
                  </div>
                )}
              </div>

              {/* Account Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Account Information</h4>
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>Status</span>
                    </div>
                    {selectedUser.isBlocked ? (
                      <div className="flex items-center gap-2">
                        <Ban className="w-4 h-4 text-red-400" />
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 text-sm font-medium rounded-full border border-red-500/20">
                          Blocked
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-full border border-green-500/20">
                          Active
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedUser.isBlocked && selectedUser.blockedReason && (
                    <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-red-400 mb-1">Blocked Reason</div>
                        <div className="text-sm text-gray-300">{selectedUser.blockedReason}</div>
                        {selectedUser.blockedAt && (
                          <div className="text-xs text-gray-400 mt-1">
                            Blocked on: {new Date(selectedUser.blockedAt).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Member Since</span>
                    </div>
                    <span className="text-white font-medium">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Last Login</span>
                    </div>
                    <span className="text-white font-medium">
                      {selectedUser.lastLogin 
                        ? new Date(selectedUser.lastLogin).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User ID */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">User ID</h4>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <code className="text-sm text-gray-300 font-mono">{selectedUser._id}</code>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-between items-center">
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveUser}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditUser(selectedUser)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit User
                    </button>
                    {selectedUser.isBlocked ? (
                      <button
                        onClick={() => handleBlockToggle(selectedUser, false)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Unblock User
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockToggle(selectedUser, true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                        Block User
                      </button>
                    )}
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null)
                  setIsEditing(false)
                  setEditingUser(null)
                  setEditError('')
                  setEditSuccess('')
                }}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

