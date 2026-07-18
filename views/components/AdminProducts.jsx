import { useState, useEffect, useRef } from 'react'
import { Search, Plus, Edit, Trash2, Package, X, Save } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    edition: 'Standard Edition',
    engineeredBy: 'Wilderbots',
    description: '',
    detailedOverview: '',
    features: [],
    price: 0,
    image: '/logo.png',
    isActive: true,
    isPrimary: false,
    ctaText: 'Learn More',
    ctaLink: '',
    appStoreLink: '',
    playStoreLink: '',
    showCta: true,
    showPrice: true
  })

  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.subtitle) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Error: Admin token not found. Please log in again.')
        return
      }

      const url = editingId 
        ? `/api/admin/products?id=${editingId}`
        : '/api/admin/products'
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Product saved successfully!')
        fetchProducts()
        resetForm()
        setShowForm(false)
      } else {
        alert(`Error saving product: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert(`Error saving product: ${error.message}`)
    }
  }

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

      const response = await fetch('/api/admin/upload-product-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, image: data.url }))
        setImagePreview(data.url)
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
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      handleFileUpload(file)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchProducts()
      } else {
        alert('Error deleting product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const handleEdit = (product) => {
    setFormData({
      ...product,
      features: product.features || []
    })
    setImagePreview(product.image)
    setEditingId(product._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      edition: 'Standard Edition',
      engineeredBy: 'Wilderbots',
      description: '',
      detailedOverview: '',
      features: [],
      price: '',
      image: '',
      isActive: true,
      isPrimary: false,
      ctaText: 'Learn More',
      ctaLink: '',
      appStoreLink: '',
      playStoreLink: '',
      showCta: true,
      showPrice: true
    })
    setImagePreview(null)
    setEditingId(null)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    resetForm()
  }

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: '', description: '', icon: '' }]
    })
  }

  const handleRemoveFeature = (index) => {
    const newFeatures = [...formData.features]
    newFeatures.splice(index, 1)
    setFormData({ ...formData, features: newFeatures })
  }

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index][field] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase()) ||
    product.subtitle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Products</h2>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Not just a Watch. It's a Workshop."
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Subtitle *</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g., Wilderbots Launch Package..."
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Edition</label>
                      <input
                        type="text"
                        value={formData.edition}
                        onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                        placeholder="e.g., Standard Edition"
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Engineered By</label>
                      <input
                        type="text"
                        value={formData.engineeredBy}
                        onChange={(e) => setFormData({ ...formData, engineeredBy: e.target.value })}
                        placeholder="e.g., Wilderbots"
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Short Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Mini description for cards..."
                      rows="2"
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Product Image</label>
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 flex items-center justify-center group">
                        {imagePreview || formData.image ? (
                          <img
                            src={imagePreview || formData.image}
                            alt="Product preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = '/logo.png'
                            }}
                          />
                        ) : (
                          <Package className="w-12 h-12 text-neutral-600" />
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm"
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500 mb-1 block">Image URL (Direct Edit)</label>
                          <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => {
                              setFormData({ ...formData, image: e.target.value })
                              setImagePreview(e.target.value)
                            }}
                            placeholder="/logo.png"
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 text-sm"
                          />
                        </div>
                        <div className="flex items-end">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Price (Rs)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
                      />
                    </div>
                    <div className="flex flex-col justify-end gap-2 pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-green-500"
                        />
                        <span className="text-white text-sm font-semibold">Is Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPrimary}
                          onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                          className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-green-500"
                        />
                        <span className="text-white text-sm font-semibold">Is Primary</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showCta}
                          onChange={(e) => setFormData({ ...formData, showCta: e.target.checked })}
                          className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-green-500"
                        />
                        <span className="text-white text-sm font-semibold">Show Main CTA</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showPrice}
                          onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                          className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-green-500"
                        />
                        <span className="text-white text-sm font-semibold">Show Price</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">CTA Text</label>
                      <input
                        type="text"
                        value={formData.ctaText}
                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">CTA Link (Internal or External)</label>
                      <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                        placeholder="/?view=order"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">App Store Link</label>
                      <input
                        type="text"
                        value={formData.appStoreLink}
                        onChange={(e) => setFormData({ ...formData, appStoreLink: e.target.value })}
                        placeholder="https://apps.apple.com/..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Play Store Link</label>
                      <input
                        type="text"
                        value={formData.playStoreLink}
                        onChange={(e) => setFormData({ ...formData, playStoreLink: e.target.value })}
                        placeholder="https://play.google.com/..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Detailed Overview</label>
                <textarea
                  value={formData.detailedOverview}
                  onChange={(e) => setFormData({ ...formData, detailedOverview: e.target.value })}
                  placeholder="Full description for product page..."
                  rows="4"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-white font-semibold">Features</label>
                  <button
                    onClick={handleAddFeature}
                    className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-md hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Feature
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="p-4 bg-neutral-800 border border-neutral-700 rounded-xl relative group">
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                          placeholder="Feature Title"
                          className="px-3 py-1 bg-neutral-900 border border-neutral-700 rounded text-white text-sm"
                        />
                        <input
                          type="text"
                          value={feature.icon}
                          onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                          placeholder="Lucide Icon Name"
                          className="px-3 py-1 bg-neutral-900 border border-neutral-700 rounded text-white text-sm"
                        />
                      </div>
                      <textarea
                        value={feature.description}
                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                        placeholder="Feature Description"
                        rows="2"
                        className="w-full px-3 py-1 bg-neutral-900 border border-neutral-700 rounded text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors font-semibold"
              >
                <Save size={18} /> Save Product
              </button>
              <button
                onClick={handleCloseForm}
                className="flex-1 bg-neutral-700 text-white px-4 py-2 rounded-lg hover:bg-neutral-600 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No products found</div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800 border-b border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-white font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Subtitle</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-neutral-800 transition-colors">
                  <td className="px-6 py-4 text-white">{product.title}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{product.subtitle}</td>
                  <td className="px-6 py-4 text-white font-semibold">Rs {product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      product.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
