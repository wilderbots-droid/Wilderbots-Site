import { useState, useEffect } from 'react'
import { MapPin, Plus, Edit, Trash2, X, Save, Home, Building, Star } from 'lucide-react'

export default function AdminAddresses() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    label: 'Home',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('wilderbots_token')
      const response = await fetch('/api/auth/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('wilderbots_token')
      const url = editingId 
        ? `/api/auth/addresses?id=${editingId}`
        : '/api/auth/addresses'
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchAddresses()
        resetForm()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to save address')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Failed to save address')
    }
  }

  const handleEdit = (address) => {
    setFormData({
      label: address.label || 'Home',
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone || '',
      street: address.street,
      city: address.city,
      state: address.state || '',
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault || false
    })
    setEditingId(address._id)
    setIsAdding(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const token = localStorage.getItem('wilderbots_token')
      const response = await fetch(`/api/auth/addresses?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchAddresses()
      } else {
        alert('Failed to delete address')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('Failed to delete address')
    }
  }

  const resetForm = () => {
    setFormData({
      label: 'Home',
      firstName: '',
      lastName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    })
    setIsAdding(false)
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-purple-600 mb-4"></div>
          <p className="text-gray-400">Loading addresses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-purple-400" />
            Saved Addresses
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage your delivery addresses for faster checkout
          </p>
        </div>
        <button
          onClick={() => {
            if (isAdding) {
              resetForm()
            } else {
              setIsAdding(true)
              setEditingId(null)
              setFormData({
                label: 'Home',
                firstName: '',
                lastName: '',
                phone: '',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                isDefault: false
              })
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isAdding 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isAdding ? (
            <>
              <X size={18} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Address
            </>
          )}
        </button>
      </div>

      {isAdding && (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Label</label>
                <select
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-600 bg-black text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">Set as default</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">ZIP/Postal Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
              >
                <Save size={18} />
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-neutral-900 border rounded-3xl p-6 relative ${
                address.isDefault ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10'
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {address.label === 'Home' && <Home size={18} className="text-purple-400" />}
                  {address.label === 'Work' && <Building size={18} className="text-blue-400" />}
                  <h3 className="font-bold text-white">{address.label}</h3>
                  {address.isDefault && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-gray-300 mb-4">
                <p className="font-medium text-white">{address.firstName} {address.lastName}</p>
                {address.phone && <p>{address.phone}</p>}
                <p>{address.street}</p>
                <p>
                  {address.city}
                  {address.state && `, ${address.state}`}
                  {address.zipCode && ` ${address.zipCode}`}
                </p>
                <p>{address.country}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(address)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-900 rounded-3xl border border-white/10">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">No saved addresses yet</h3>
          <p className="text-gray-400 mb-6">Add your first address to make checkout faster</p>
          {!isAdding && (
            <button
              onClick={() => {
                setIsAdding(true)
                setEditingId(null)
                setFormData({
                  label: 'Home',
                  firstName: '',
                  lastName: '',
                  phone: '',
                  street: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: '',
                  isDefault: false
                })
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus size={18} />
              Add Your First Address
            </button>
          )}
        </div>
      )}
    </div>
  )
}

