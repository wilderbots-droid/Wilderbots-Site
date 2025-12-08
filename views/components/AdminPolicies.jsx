import { useState, useEffect } from 'react'
import { Save, FileText, Shield, Scale, Truck, ChevronRight } from 'lucide-react'

export default function AdminPolicies() {
  const [policies, setPolicies] = useState({
    privacy: { title: '', content: '' },
    terms: { title: '', content: '' },
    returns: { title: '', content: '' }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const [activeTab, setActiveTab] = useState('privacy')

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/policies', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        const policiesMap = {}
        data.policies.forEach(policy => {
          policiesMap[policy.type] = {
            title: policy.title || '',
            content: policy.content || ''
          }
        })
        setPolicies(prev => ({ ...prev, ...policiesMap }))
      }
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (type) => {
    setSaving(prev => ({ ...prev, [type]: true }))
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/policies?type=${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(policies[type]),
      })

      if (response.ok) {
        alert(`${type === 'privacy' ? 'Privacy Policy' : type === 'terms' ? 'Terms of Service' : 'Returns & Delivery Policy'} saved successfully!`)
        fetchPolicies()
      } else {
        alert('Error saving policy')
      }
    } catch (error) {
      console.error('Error saving policy:', error)
      alert('Error saving policy')
    } finally {
      setSaving(prev => ({ ...prev, [type]: false }))
    }
  }

  const policyTabs = [
    {
      id: 'privacy',
      label: 'Privacy Policy',
      icon: Shield,
      color: 'text-blue-400'
    },
    {
      id: 'terms',
      label: 'Terms of Service',
      icon: Scale,
      color: 'text-purple-400'
    },
    {
      id: 'returns',
      label: 'Returns & Delivery',
      icon: Truck,
      color: 'text-green-400'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-600 mb-4"></div>
          <p className="text-gray-400">Loading policies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FileText className="w-6 h-6 mr-2 text-yellow-400" />
          Legal Pages Management
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Manage Privacy Policy, Terms of Service, and Returns & Delivery Policy
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800">
        {policyTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Editor */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={policies[activeTab].title}
              onChange={(e) => setPolicies(prev => ({
                ...prev,
                [activeTab]: { ...prev[activeTab], title: e.target.value }
              }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${policyTabs.find(t => t.id === activeTab)?.label} title...`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content (HTML/Markdown supported)
            </label>
            <textarea
              value={policies[activeTab].content}
              onChange={(e) => setPolicies(prev => ({
                ...prev,
                [activeTab]: { ...prev[activeTab], content: e.target.value }
              }))}
              rows={20}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder={`Enter ${policyTabs.find(t => t.id === activeTab)?.label} content...`}
            />
            <p className="text-xs text-gray-500 mt-2">
              You can use HTML tags for formatting. Line breaks will be preserved.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-800">
            <button
              onClick={() => handleSave(activeTab)}
              disabled={saving[activeTab]}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving[activeTab] ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Note */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          <strong>Note:</strong> Changes will be reflected on the public pages immediately after saving. 
          The content supports HTML formatting for better presentation.
        </p>
      </div>
    </div>
  )
}

