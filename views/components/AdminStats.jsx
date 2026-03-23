import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, BarChart3, X, Save } from 'lucide-react'

export default function AdminStats() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingId 
        ? `/api/admin/stats?id=${editingId}`
        : '/api/admin/stats'
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchStats()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving stat:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this stat?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/stats?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting stat:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      value: '',
      label: '',
      order: 0,
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (stat) => {
    setFormData({
      value: stat.value,
      label: stat.label,
      order: stat.order || 0,
      isActive: stat.isActive !== undefined ? stat.isActive : true
    })
    setEditingId(stat._id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-purple-400" />
          Statistics Management
        </h2>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Stat
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? 'Edit Statistic' : 'New Statistic'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Value (e.g. 50k+)</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Label (e.g. Kits Shipped)</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Stat
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-700 border-t-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat._id}
              className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border p-6 transition-all hover:border-purple-500/30 group ${
                stat.isActive ? 'border-gray-800' : 'border-gray-800/50 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(stat)}
                    className="p-1.5 text-purple-400 hover:bg-purple-500/10 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(stat._id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{stat.label}</div>
              <div className="mt-4 flex items-center justify-between text-[10px] text-gray-600">
                <span>Order: {stat.order}</span>
                <span>{stat.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          ))}
          {stats.length === 0 && (
            <div className="col-span-full text-center py-12 border border-dashed border-gray-800 rounded-xl">
              <BarChart3 className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No stats found. Add your first statistic!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
