import { useState, useEffect } from 'react'
import { Search, Filter, Mail, Calendar, Trash2, ChevronLeft, ChevronRight, X, Download } from 'lucide-react'

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [selectedSubscription, setSelectedSubscription] = useState(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [page, search, statusFilter])

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      })

      const response = await fetch(`/api/admin/subscriptions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.subscriptions)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/subscriptions?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/subscriptions?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error deleting subscription:', error)
    }
  }

  const handleExport = () => {
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
    const csvContent = [
      ['Email', 'Status', 'Subscribed At', 'Source'].join(','),
      ...activeSubscriptions.map(sub => [
        sub.email,
        sub.status,
        new Date(sub.subscribedAt).toLocaleDateString(),
        sub.source || 'newsletter'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'unsubscribed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'bounced': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Mail className="w-6 h-6 mr-2 text-purple-400" />
            Newsletter Subscriptions
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {pagination ? `Total: ${pagination.total} subscribers` : 'Manage newsletter subscriptions'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
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
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
            </select>
          </div>
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-purple-600 mb-4"></div>
            <p className="text-gray-400">Loading subscriptions...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Source</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Subscribed</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                        No subscriptions found
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((subscription) => (
                      <tr key={subscription._id} className="hover:bg-gray-800/30 transition">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{subscription.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={subscription.status}
                            onChange={(e) => handleStatusUpdate(subscription._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(subscription.status)}`}
                          >
                            <option value="active">Active</option>
                            <option value="unsubscribed">Unsubscribed</option>
                            <option value="bounced">Bounced</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-300 capitalize">
                            {subscription.source || 'newsletter'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(subscription.subscribedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedSubscription(subscription)}
                              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(subscription._id)}
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

          {selectedSubscription && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-md w-full">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">Subscription Details</h3>
                  <button onClick={() => setSelectedSubscription(null)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs text-gray-400">Email</label>
                    <div className="text-white">{selectedSubscription.email}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Status</label>
                    <div className="text-white capitalize">{selectedSubscription.status}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Source</label>
                    <div className="text-white capitalize">{selectedSubscription.source || 'newsletter'}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Subscribed At</label>
                    <div className="text-white">
                      {new Date(selectedSubscription.subscribedAt).toLocaleString()}
                    </div>
                  </div>
                  {selectedSubscription.unsubscribedAt && (
                    <div>
                      <label className="text-xs text-gray-400">Unsubscribed At</label>
                      <div className="text-white">
                        {new Date(selectedSubscription.unsubscribedAt).toLocaleString()}
                      </div>
                    </div>
                  )}
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
                of <span className="font-medium text-white">{pagination.total}</span> subscriptions
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

