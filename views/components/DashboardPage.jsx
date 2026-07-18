import { useState, useEffect } from 'react'
import { ArrowLeft, Package, LogOut, User, ShoppingBag, MapPin, Calendar, Search, Edit, Save, X, Lock, Mail, Bell, MessageSquare, Briefcase, Phone } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from './Logo'
import { useRouter } from 'next/router'
import AdminAddresses from './AdminAddresses'

export default function DashboardPage({ onBack }) {
  const { user, logout, getUserOrders, updateUser } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'profile' | 'updates' | 'addresses'
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updates, setUpdates] = useState(null)
  const [loadingUpdates, setLoadingUpdates] = useState(false)

  useEffect(() => {
    if (user) {
      const userOrders = getUserOrders()
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }, [user])

  useEffect(() => {
    if (activeTab === 'updates' && user) {
      fetchUpdates()
    }
  }, [activeTab, user])

  const fetchUpdates = async () => {
    setLoadingUpdates(true)
    try {
      const token = localStorage.getItem('wilderbots_token')
      const response = await fetch('/api/auth/user-updates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUpdates(data)
      }
    } catch (error) {
      console.error('Error fetching updates:', error)
    } finally {
      setLoadingUpdates(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError('')
    setSuccess('')
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    // Validate password change if new password is provided
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        setError('Current password is required to change password')
        setSaving(false)
        return
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        setError('New passwords do not match')
        setSaving(false)
        return
      }
      if (profileData.newPassword.length < 6) {
        setError('New password must be at least 6 characters')
        setSaving(false)
        return
      }
    }

    try {
      const token = localStorage.getItem('wilderbots_token')
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          currentPassword: profileData.currentPassword || undefined,
          newPassword: profileData.newPassword || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update user in localStorage and context
      const updatedUser = { ...user, ...data.user }
      updateUser(updatedUser)
      
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      
      // Clear password fields
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Refresh updates if on updates tab
      if (activeTab === 'updates') {
        fetchUpdates()
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-400 bg-blue-500/10'
      case 'processing':
        return 'text-yellow-400 bg-yellow-500/10'
      case 'shipped':
        return 'text-purple-400 bg-purple-500/10'
      case 'delivered':
        return 'text-green-400 bg-green-500/10'
      default:
        return 'text-gray-400 bg-gray-500/10'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please log in to access your dashboard</p>
          <a href="/login" className="text-purple-400 hover:text-purple-300">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-6 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Logo size={35} showText={false} />
          <span className="font-bold">Dashboard</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-gray-400">Manage your orders and account settings</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/10">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'orders' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                My Orders ({orders.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'profile' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={18} />
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`pb-4 px-4 font-medium transition-colors relative ${
                activeTab === 'updates' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell size={18} />
                Updates
                {updates && (updates.stats.unreadContacts > 0 || updates.stats.pendingApplications > 0) && (
                  <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {updates.stats.unreadContacts + updates.stats.pendingApplications}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'addresses' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                Addresses
              </div>
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-neutral-900 rounded-3xl border border-white/10">
                  <Package className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                  <p className="text-gray-400 mb-6">Start your next project with Wilderbots</p>
                  <a
                    href="/contact"
                    className="inline-block px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all"
                  >
                    Contact Wilderbots
                  </a>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-neutral-900 border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-bold">Order {order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          {order.trackingNumber && (
                            <div className="flex items-center gap-2">
                              <Package size={14} />
                              {order.trackingNumber}
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <p className="font-medium">{order.items?.[0]?.name || 'Wilderbots Project Launch'}</p>
                          <p className="text-sm text-gray-400">Rs 299.00</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={`/track-order?orderId=${order.id}`}
                          className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                          <Search size={16} />
                          Track
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Account Information</h2>
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                      <User size={16} />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="bg-black border border-white/10 rounded-xl p-4">
                        <p className="font-medium text-white">{user.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                      <Mail size={16} />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="bg-black border border-white/10 rounded-xl p-4">
                        <p className="font-medium text-white">{user.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                      <Phone size={16} />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="bg-black border border-white/10 rounded-xl p-4">
                        <p className="font-medium text-white">{user.phone || 'Not provided'}</p>
                      </div>
                    )}
                  </div>

                  {/* Address Fields */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                      <MapPin size={16} />
                      Address
                    </label>
                    {isEditing ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={profileData.address.street}
                          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, street: e.target.value } })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                          placeholder="Street Address"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={profileData.address.city}
                            onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, city: e.target.value } })}
                            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            value={profileData.address.state}
                            onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, state: e.target.value } })}
                            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="State"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={profileData.address.zipCode}
                            onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, zipCode: e.target.value } })}
                            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="ZIP Code"
                          />
                          <input
                            type="text"
                            value={profileData.address.country}
                            onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, country: e.target.value } })}
                            className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-black border border-white/10 rounded-xl p-4">
                        {user.address && (user.address.street || user.address.city) ? (
                          <div className="space-y-1">
                            {user.address.street && <p className="font-medium text-white">{user.address.street}</p>}
                            {(user.address.city || user.address.state || user.address.zipCode) && (
                              <p className="text-gray-300">
                                {[user.address.city, user.address.state, user.address.zipCode].filter(Boolean).join(', ')}
                              </p>
                            )}
                            {user.address.country && <p className="text-gray-300">{user.address.country}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-400">Not provided</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Password Change Section */}
                  {isEditing && (
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Lock size={18} />
                        Change Password
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">Leave blank if you don't want to change your password</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Current Password</label>
                          <input
                            type="password"
                            value={profileData.currentPassword}
                            onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">New Password</label>
                          <input
                            type="password"
                            value={profileData.newPassword}
                            onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="Enter new password (min 6 characters)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Confirm New Password</label>
                          <input
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Member Since - Read Only */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                      <Calendar size={16} />
                      Member Since
                    </label>
                    <div className="bg-black border border-white/10 rounded-xl p-4">
                      <p className="font-medium text-white">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Updates Tab */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              {loadingUpdates ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-purple-600 mb-4"></div>
                    <p className="text-gray-400">Loading updates...</p>
                  </div>
                </div>
              ) : updates ? (
                <>
                  {/* Stats Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Contact Messages</p>
                          <p className="text-2xl font-bold text-white">{updates.stats.totalContacts}</p>
                          {updates.stats.unreadContacts > 0 && (
                            <p className="text-xs text-purple-400 mt-1">{updates.stats.unreadContacts} unread</p>
                          )}
                        </div>
                        <MessageSquare className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                    <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Job Applications</p>
                          <p className="text-2xl font-bold text-white">{updates.stats.totalApplications}</p>
                          {updates.stats.pendingApplications > 0 && (
                            <p className="text-xs text-yellow-400 mt-1">{updates.stats.pendingApplications} pending</p>
                          )}
                        </div>
                        <Briefcase className="w-8 h-8 text-yellow-400" />
                      </div>
                    </div>
                  </div>

                  {/* Contact Messages */}
                  <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MessageSquare size={20} />
                      Recent Contact Messages
                    </h3>
                    {updates.contacts && updates.contacts.length > 0 ? (
                      <div className="space-y-4">
                        {updates.contacts.map((contact) => (
                          <div
                            key={contact._id}
                            className={`p-4 rounded-xl border ${
                              contact.status === 'new' 
                                ? 'bg-purple-500/10 border-purple-500/20' 
                                : 'bg-black/50 border-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-white">{contact.subject || 'No Subject'}</h4>
                                  {contact.status === 'new' && (
                                    <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">New</span>
                                  )}
                                  {contact.status === 'replied' && (
                                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">Replied</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400 mb-2">{contact.message.substring(0, 100)}...</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{contact.category}</span>
                                  <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No contact messages yet</p>
                      </div>
                    )}
                  </div>

                  {/* Job Applications */}
                  <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Briefcase size={20} />
                      Job Applications
                    </h3>
                    {updates.applications && updates.applications.length > 0 ? (
                      <div className="space-y-4">
                        {updates.applications.map((app) => (
                          <div
                            key={app._id}
                            className={`p-4 rounded-xl border ${
                              app.status === 'pending' || app.status === 'reviewing'
                                ? 'bg-yellow-500/10 border-yellow-500/20'
                                : app.status === 'accepted'
                                ? 'bg-green-500/10 border-green-500/20'
                                : app.status === 'rejected'
                                ? 'bg-red-500/10 border-red-500/20'
                                : 'bg-black/50 border-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-white">{app.position}</h4>
                                  <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                                    app.status === 'pending' || app.status === 'reviewing'
                                      ? 'bg-yellow-500 text-white'
                                      : app.status === 'accepted'
                                      ? 'bg-green-500 text-white'
                                      : app.status === 'rejected'
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-500 text-white'
                                  }`}>
                                    {app.status}
                                  </span>
                                </div>
                                {app.careerId && (
                                  <p className="text-sm text-gray-400 mb-2">{app.careerId.title} - {app.careerId.department}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                  {app.updatedAt && app.updatedAt !== app.createdAt && (
                                    <span>Updated: {new Date(app.updatedAt).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No job applications yet</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-neutral-900 rounded-3xl border border-white/10">
                  <Bell className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">No updates available</h3>
                  <p className="text-gray-400">Your contact messages and job applications will appear here</p>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <AdminAddresses />
          )}
        </div>
      </section>
    </div>
  )
}
