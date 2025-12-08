import { useState, useEffect } from 'react'
import { Search, Filter, Mail, MessageSquare, Calendar, Trash2, ChevronLeft, ChevronRight, Eye, X, Inbox } from 'lucide-react'

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    fetchContacts()
  }, [page, search, statusFilter, categoryFilter])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter }),
      })

      const response = await fetch(`/api/admin/contacts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchContacts()
      }
    } catch (error) {
      console.error('Error updating contact:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchContacts()
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'replied': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'read': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'archived': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-pink-400" />
            Contact Messages
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {pagination ? `Total: ${pagination.total} messages` : 'Manage contact form submissions'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="product">Product</option>
              <option value="services">IT Services</option>
              <option value="education">Education</option>
              <option value="partnership">Partnership</option>
              <option value="careers">Careers</option>
              <option value="media">Media & Press</option>
            </select>
          </div>
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10 pr-4 py-2.5 w-full sm:w-80 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-pink-600 mb-4"></div>
            <p className="text-gray-400">Loading contacts...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">From</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                            <Inbox className="w-8 h-8 text-gray-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">No contact messages</h3>
                          <p className="text-sm text-gray-400 max-w-md">
                            {search || statusFilter || categoryFilter
                              ? 'No contacts match your current filters. Try adjusting your search criteria.'
                              : 'Contact form submissions will appear here once visitors start sending messages.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-800/30 transition">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{contact.name}</div>
                          <div className="text-xs text-gray-400">{contact.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white">{contact.subject || 'No subject'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-300 capitalize">
                            {contact.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={contact.status}
                            onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(contact.status)}`}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedContact(contact)}
                              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(contact._id)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedContact && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">Message Details</h3>
                  <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400">Name</label>
                      <div className="text-white">{selectedContact.name}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Email</label>
                      <div className="text-white">{selectedContact.email}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Subject</label>
                      <div className="text-white">{selectedContact.subject || 'No subject'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Category</label>
                      <div className="text-white capitalize">{selectedContact.category}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Message</label>
                    <div className="text-white mt-1 p-4 bg-gray-800 rounded-lg whitespace-pre-wrap">
                      {selectedContact.message}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Received: {new Date(selectedContact.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 px-6 py-4">
              <div className="text-sm text-gray-400">
                Showing <span className="font-medium text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium text-white">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium text-white">{pagination.total}</span> messages
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm text-gray-300">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

