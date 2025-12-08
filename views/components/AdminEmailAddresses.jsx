import { useState, useEffect } from 'react'
import { Mail, Plus, Edit, Trash2, X, Save, Star, CheckCircle, XCircle } from 'lucide-react'

const PURPOSE_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'support', label: 'Support' },
  { value: 'sales', label: 'Sales' },
  { value: 'info', label: 'Info' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical' },
  { value: 'career', label: 'Career' },
  { value: 'other', label: 'Other' }
]

export default function AdminEmailAddresses() {
  const [emailAddresses, setEmailAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    label: '',
    email: '',
    purpose: 'general',
    description: '',
    isActive: true,
    isPrimary: false
  })

  useEffect(() => {
    fetchEmailAddresses()
  }, [])

  const fetchEmailAddresses = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/email-addresses', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setEmailAddresses(data.emailAddresses || [])
      }
    } catch (error) {
      console.error('Error fetching email addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const resetForm = () => {
    setFormData({
      label: '',
      email: '',
      purpose: 'general',
      description: '',
      isActive: true,
      isPrimary: false
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('admin_token')
      const url = '/api/admin/email-addresses'
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId
        ? { id: editingId, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        fetchEmailAddresses()
        resetForm()
        alert(editingId ? 'Email address updated successfully!' : 'Email address added successfully!')
      } else {
        alert(data.error || 'Failed to save email address')
      }
    } catch (error) {
      console.error('Error saving email address:', error)
      alert('Failed to save email address')
    }
  }

  const handleEdit = (emailAddress) => {
    setFormData({
      label: emailAddress.label,
      email: emailAddress.email,
      purpose: emailAddress.purpose,
      description: emailAddress.description || '',
      isActive: emailAddress.isActive,
      isPrimary: emailAddress.isPrimary
    })
    setEditingId(emailAddress._id)
    setIsAdding(true)
  }

  const handleDelete = async (id, isPrimary) => {
    if (isPrimary) {
      alert('Cannot delete primary email address. Please set another email as primary first.')
      return
    }

    if (!confirm('Are you sure you want to delete this email address?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/email-addresses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (response.ok) {
        fetchEmailAddresses()
        alert('Email address deleted successfully!')
      } else {
        alert(data.error || 'Failed to delete email address')
      }
    } catch (error) {
      console.error('Error deleting email address:', error)
      alert('Failed to delete email address')
    }
  }

  const getPurposeColor = (purpose) => {
    const colors = {
      general: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      support: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      sales: 'bg-green-500/10 text-green-400 border-green-500/20',
      info: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      marketing: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      billing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      technical: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      career: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      other: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
    return colors[purpose] || colors.other
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-purple-600 mb-4"></div>
          <p className="text-gray-400">Loading email addresses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Mail className="w-6 h-6 mr-2 text-purple-400" />
            Email Addresses
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage email addresses for different purposes
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setIsAdding(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition"
        >
          <Plus size={18} />
          Add Email Address
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? 'Edit Email Address' : 'Add New Email Address'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Label *</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Support Team"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="support@wilderbots.com"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {PURPOSE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional description"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPrimary"
                  checked={formData.isPrimary}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Set as Primary</span>
              </label>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition"
              >
                <Save size={18} />
                {editingId ? 'Update' : 'Add'} Email Address
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {emailAddresses.length === 0 && !isAdding ? (
        <div className="text-center py-16 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
          <Mail className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">No Email Addresses</h3>
          <p className="text-gray-400 mb-6">Get started by adding your first email address</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition"
          >
            <Plus size={18} />
            Add Your First Email Address
          </button>
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Primary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider sticky right-0 bg-gray-800/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {emailAddresses.map((emailAddress) => (
                  <tr key={emailAddress._id} className="hover:bg-gray-800/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{emailAddress.label}</div>
                      {emailAddress.description && (
                        <div className="text-xs text-gray-400 mt-1">{emailAddress.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{emailAddress.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPurposeColor(emailAddress.purpose)}`}>
                        {PURPOSE_OPTIONS.find(opt => opt.value === emailAddress.purpose)?.label || emailAddress.purpose}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {emailAddress.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {emailAddress.isPrimary && (
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right sticky right-0 bg-gray-900/50">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(emailAddress)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(emailAddress._id, emailAddress.isPrimary)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Delete"
                          disabled={emailAddress.isPrimary}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

