import { useState, useEffect } from 'react'
import { BookOpen, Save, Plus, Trash2, Globe, Aperture, Cpu, Zap, GraduationCap } from 'lucide-react'

export default function AdminEducation() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/education-content', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setContent(data.content)
      }
    } catch (error) {
      console.error('Error fetching education content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/education-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Education content updated successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update education content.' })
      }
    } catch (error) {
      console.error('Error saving education content:', error)
      setMessage({ type: 'error', text: 'An error occurred while saving.' })
    } finally {
      setSaving(false)
    }
  }

  const addFeature = () => {
    setContent({
      ...content,
      features: [...content.features, { icon: 'Aperture', text: '' }]
    })
  }

  const removeFeature = (index) => {
    const newFeatures = content.features.filter((_, i) => i !== index)
    setContent({ ...content, features: newFeatures })
  }

  const updateFeature = (index, field, value) => {
    const newFeatures = [...content.features]
    newFeatures[index][field] = value
    setContent({ ...content, features: newFeatures })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-blue-400" />
          Education Section Management
        </h2>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Main Content Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-4">Main Content</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Badge Text</label>
              <input
                type="text"
                value={content?.badgeText || ''}
                onChange={(e) => setContent({ ...content, badgeText: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title Gradient Part</label>
              <input
                type="text"
                value={content?.titleGradient || ''}
                onChange={(e) => setContent({ ...content, titleGradient: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Never Before."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Title</label>
            <input
              type="text"
              value={content?.title || ''}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={content?.description || ''}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Features Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <h3 className="text-lg font-semibold text-white">Key Features</h3>
            <button
              type="button"
              onClick={addFeature}
              className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition text-sm flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Feature
            </button>
          </div>

          <div className="space-y-4">
            {content?.features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Icon</label>
                      <select
                        value={feature.icon}
                        onChange={(e) => updateFeature(idx, 'icon', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Aperture">Aperture</option>
                        <option value="Globe">Globe</option>
                        <option value="Cpu">CPU/AI</option>
                        <option value="Zap">Zap/Energy</option>
                        <option value="GraduationCap">Education</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Text</label>
                      <input
                        type="text"
                        value={feature.text}
                        onChange={(e) => updateFeature(idx, 'text', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition mt-6"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA & Platform Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-4">CTA & External Platform</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={content?.ctaText || ''}
                onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">CTA Link</label>
              <input
                type="text"
                value={content?.ctaLink || ''}
                onChange={(e) => setContent({ ...content, ctaLink: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">CTA Subtext (leaves platform warning)</label>
            <input
              type="text"
              value={content?.ctaSubtext || ''}
              onChange={(e) => setContent({ ...content, ctaSubtext: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Browser Visual Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-4">Browser Visual Display</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Browser URL Mockup</label>
              <input
                type="text"
                value={content?.browserUrl || ''}
                onChange={(e) => setContent({ ...content, browserUrl: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="neureck.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Browser Image URL</label>
              <input
                type="text"
                value={content?.browserImage || ''}
                onChange={(e) => setContent({ ...content, browserImage: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Trending Badge Title</label>
              <input
                type="text"
                value={content?.trendingTitle || ''}
                onChange={(e) => setContent({ ...content, trendingTitle: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Trending Badge Subtitle</label>
              <input
                type="text"
                value={content?.trendingSubtitle || ''}
                onChange={(e) => setContent({ ...content, trendingSubtitle: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Education Content'}
          </button>
        </div>
      </form>
    </div>
  )
}
