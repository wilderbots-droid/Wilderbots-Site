import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Layers, X, Save, Box, Code, CheckCircle } from 'lucide-react'

export default function AdminProcess() {
  const [steps, setSteps] = useState([])
  const [metadata, setMetadata] = useState({ title: 'Your Journey.', badgeText: 'Our Process' })
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'CheckCircle',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/process-steps', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setSteps(data.steps)
        setMetadata(data.metadata)
      }
    } catch (error) {
      console.error('Error fetching process data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMetadataSave = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/process-steps?type=metadata', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(metadata),
      })

      if (response.ok) {
        alert('Section metadata saved successfully!')
      }
    } catch (error) {
      console.error('Error saving metadata:', error)
    }
  }

  const handleSaveStep = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingId 
        ? `/api/admin/process-steps?id=${editingId}`
        : '/api/admin/process-steps'
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchData()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving step:', error)
    }
  }

  const handleDeleteStep = async (id) => {
    if (!confirm('Are you sure you want to delete this step?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/process-steps?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting step:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'CheckCircle',
      order: 0,
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (step) => {
    setFormData({
      title: step.title,
      description: step.description,
      icon: step.icon || 'CheckCircle',
      order: step.order || 0,
      isActive: step.isActive !== undefined ? step.isActive : true
    })
    setEditingId(step._id)
    setShowForm(true)
  }

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Box': return <Box className="w-5 h-5" />
      case 'Code': return <Code className="w-5 h-5" />
      case 'CheckCircle': return <CheckCircle className="w-5 h-5" />
      default: return <CheckCircle className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Section Metadata */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center mb-4">
          <Layers className="w-6 h-6 mr-2 text-cyan-400" />
          Journey Section Settings
        </h2>
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Badge Text</label>
              <input
                type="text"
                value={metadata.badgeText}
                onChange={(e) => setMetadata({ ...metadata, badgeText: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleMetadataSave}
              className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Metadata
            </button>
          </div>
        </div>
      </div>

      {/* Steps Management */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Journey Steps</h3>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Step
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingId ? 'Edit Step' : 'New Step'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Box">Box (Unbox & Assemble)</option>
                    <option value="Code">Code (Code & Customize)</option>
                    <option value="CheckCircle">CheckCircle (Wear & Research)</option>
                    <option value="Layers">Layers (Consult)</option>
                    <option value="Wrench">Wrench (Engineering)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500"
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
                  onClick={handleSaveStep}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Step
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-700 border-t-cyan-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step._id}
                className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border p-6 ${
                  step.isActive ? 'border-gray-800' : 'border-gray-800/50 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center border border-cyan-500/20">
                      <span className="text-cyan-400">{getIcon(step.icon)}</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <span className="text-xs text-gray-500">Order: {step.order}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(step)}
                      className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStep(step._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
            {steps.length === 0 && (
              <div className="col-span-full text-center py-12 border border-dashed border-gray-800 rounded-xl">
                <Layers className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No steps found. Add your first journey step!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
