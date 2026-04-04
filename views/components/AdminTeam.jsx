import { useState, useEffect, useRef } from 'react'
import { Search, Plus, Edit, Trash2, Users, X, Save, Upload, Linkedin, Github, Mail, Twitter } from 'lucide-react'

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    avatar: 'https://i.pravatar.cc/150',
    social: {
      linkedin: '',
      github: '',
      email: '',
      twitter: ''
    },
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/team', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        let filtered = data.teamMembers || []
        if (search) {
          filtered = filtered.filter(member =>
            member.name.toLowerCase().includes(search.toLowerCase()) ||
            member.role.toLowerCase().includes(search.toLowerCase()) ||
            member.bio.toLowerCase().includes(search.toLowerCase())
          )
        }
        setTeamMembers(filtered)
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (search) {
      fetchTeamMembers()
    } else {
      fetchTeamMembers()
    }
  }, [search])

  const handleFileUpload = async (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const uploadData = new FormData()
      uploadData.append('file', file)

      const response = await fetch('/api/admin/upload-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, avatar: data.url }))
        setAvatarPreview(data.url)
      } else {

        const error = await response.json()
        alert(error.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
      handleFileUpload(file)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingId 
        ? `/api/admin/team?id=${editingId}`
        : '/api/admin/team'
      
      // Ensure social object is always properly structured
      const dataToSave = {
        ...formData,
        social: {
          linkedin: formData.social?.linkedin || '',
          github: formData.social?.github || '',
          email: formData.social?.email || '',
          twitter: formData.social?.twitter || ''
        }
      }
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      })

      if (response.ok) {
        fetchTeamMembers()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving team member:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/team?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchTeamMembers()
      }
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      avatar: 'https://i.pravatar.cc/150',
      social: {
        linkedin: '',
        github: '',
        email: '',
        twitter: ''
      },
      order: 0,
      isActive: true
    })
    setAvatarPreview(null)
    setEditingId(null)
    setShowForm(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const startEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      avatar: member.avatar || 'https://i.pravatar.cc/150',
      social: member.social || {
        linkedin: '',
        github: '',
        email: '',
        twitter: ''
      },
      order: member.order || 0,
      isActive: member.isActive !== undefined ? member.isActive : true
    })
    setAvatarPreview(member.avatar || 'https://i.pravatar.cc/150')
    setEditingId(member._id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Users className="w-6 h-6 mr-2 text-indigo-400" />
            Team Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage team members for the About page
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full sm:w-80 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Member
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? 'Edit Team Member' : 'New Team Member'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role/Title</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., CEO & Co-Founder"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short bio about the team member..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Avatar</label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={avatarPreview || formData.avatar}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                      onError={(e) => {
                        e.target.src = 'https://i.pravatar.cc/150'
                      }}
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition text-sm text-gray-300">
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Or enter URL below</p>
                  </div>
                </div>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => {
                    setFormData({ ...formData, avatar: e.target.value })
                    setAvatarPreview(e.target.value)
                  }}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="https://i.pravatar.cc/150"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Social Links</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.social?.linkedin || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      social: { ...(formData.social || {}), linkedin: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Github className="w-4 h-4" />
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={formData.social?.github || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      social: { ...(formData.social || {}), github: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.social?.email || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      social: { ...(formData.social || {}), email: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.social?.twitter || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      social: { ...(formData.social || {}), twitter: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
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
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-indigo-600 mb-4"></div>
            <p className="text-gray-400">Loading team members...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border p-6 ${
                member.isActive ? 'border-gray-800' : 'border-gray-800/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
                    onError={(e) => {
                      e.target.src = 'https://i.pravatar.cc/150'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{member.name}</h4>
                    <p className="text-sm text-purple-400 truncate">{member.role}</p>
                    {!member.isActive && (
                      <span className="text-xs text-gray-500">Inactive</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(member)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{member.bio}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {(member.social?.linkedin || member.social?.github || member.social?.email) && (
                  <>
                    {member.social.linkedin && <Linkedin className="w-3 h-3" />}
                    {member.social.github && <Github className="w-3 h-3" />}
                    {member.social.email && <Mail className="w-3 h-3" />}
                    {member.social.twitter && <Twitter className="w-3 h-3" />}
                  </>
                )}
              </div>
            </div>
          ))}
          {teamMembers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No team members found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

