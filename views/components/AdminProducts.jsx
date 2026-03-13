import { useState, useEffect, useRef } from 'react'
import { Search, Plus, Edit, Trash2, Package, X, Save } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    edition: 'Development Kit Edition',
    engineeredBy: 'Engineered by <br/>You.',
    description: '',
    price: 299,
    image: '/kit.png',
    isActive: true
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
      
      console.log('Saving product:', formData)
      console.log('URL:', url)
      console.log('Token exists:', !!token)

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('API Response:', response.status, data)

      if (response.ok) {
        alert('Product saved successfully!')
        fetchProducts()
        resetForm()
        setShowForm(false)
      } else {
        alert(`Error saving product: ${data.error || 'Unknown error'}. Status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert(`Error saving product: ${error.message}`)
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
    setFormData(product)
    setEditingId(product._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      edition: 'Development Kit Edition',
      engineeredBy: 'Engineered by <br/>You.',
      description: '',
      price: 299,
      image: '/kit.png',
      isActive: true
    })
    setEditingId(null)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    resetForm()
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
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  placeholder="e.g., The Wilder Watch Development Kit..."
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Edition</label>
                <input
                  type="text"
                  value={formData.edition}
                  onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  placeholder="e.g., Development Kit Edition"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Engineered By</label>
                <input
                  type="text"
                  value={formData.engineeredBy}
                  onChange={(e) => setFormData({ ...formData, engineeredBy: e.target.value })}
                  placeholder="e.g., Engineered by You."
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed product description..."
                  rows="4"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    placeholder="299"
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Image URL</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/kit.png"
                      className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        title="Choose image file"
                        className="px-3 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors flex items-center justify-center"
                      >
                        <Package size={16} />
                      </button>

                      <span className="max-w-[200px] text-sm text-gray-300 truncate">
                        {formData.image && formData.image !== '/kit.png' ? formData.image : ''}
                      </span>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0]
                        if (file) setFormData({ ...formData, image: file.name })
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-white">Active</label>
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
