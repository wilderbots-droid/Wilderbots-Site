import { useState, useEffect } from 'react'
import { Search, Filter, FileText, Mail, Phone, Calendar, Trash2, ChevronLeft, ChevronRight, Eye, X, Briefcase } from 'lucide-react'

export default function AdminJobApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    fetchApplications()
  }, [page, search, statusFilter])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      })

      const response = await fetch(`/api/admin/job-applications?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/job-applications?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error updating application:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/job-applications?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error deleting application:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'interviewing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'reviewing': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FileText className="w-6 h-6 mr-2 text-green-400" />
            Job Applications
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {pagination ? `Total: ${pagination.total} applications` : 'Review and manage job applications'}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
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
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="interviewing">Interviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-green-600 mb-4"></div>
            <p className="text-gray-400">Loading applications...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Applicant</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Position</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Applied</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="w-8 h-8 text-gray-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">No job applications</h3>
                          <p className="text-sm text-gray-400 max-w-md">
                            {search || statusFilter
                              ? 'No applications match your current filters. Try adjusting your search criteria.'
                              : 'Job applications will appear here once candidates start applying for positions.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-800/30 transition">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{app.name}</div>
                          <div className="text-xs text-gray-400">{app.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white">{app.position}</div>
                          {app.careerId ? (
                            <div className="text-xs text-gray-400">{app.careerId.department || app.careerId.title}</div>
                          ) : (
                            <div className="text-xs text-gray-500 italic">General Application</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(app.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(app._id)}
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

          {selectedApp && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">Application Details</h3>
                  <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400">Name</label>
                      <div className="text-white">{selectedApp.name}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Email</label>
                      <div className="text-white">{selectedApp.email}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Phone</label>
                      <div className="text-white">{selectedApp.phone || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Position</label>
                      <div className="text-white">{selectedApp.position}</div>
                      {selectedApp.careerId ? (
                        <div className="text-xs text-gray-500 mt-1">
                          Applied for: {selectedApp.careerId.title || selectedApp.careerId.department}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic mt-1">General Application (No specific position)</div>
                      )}
                    </div>
                  </div>
                  {selectedApp.coverLetter && (
                    <div>
                      <label className="text-xs text-gray-400">Cover Letter</label>
                      <div className="text-white mt-1 p-3 bg-gray-800 rounded-lg">{selectedApp.coverLetter}</div>
                    </div>
                  )}
                  {selectedApp.experience && (
                    <div>
                      <label className="text-xs text-gray-400">Experience</label>
                      <div className="text-white mt-1 p-3 bg-gray-800 rounded-lg">{selectedApp.experience}</div>
                    </div>
                  )}
                  {selectedApp.whyWilderbots && (
                    <div>
                      <label className="text-xs text-gray-400">Why Wilderbots</label>
                      <div className="text-white mt-1 p-3 bg-gray-800 rounded-lg">{selectedApp.whyWilderbots}</div>
                    </div>
                  )}
                  {(selectedApp.portfolio || selectedApp.linkedin || selectedApp.github) && (
                    <div>
                      <label className="text-xs text-gray-400">Links</label>
                      <div className="mt-1 space-y-1">
                        {selectedApp.portfolio && <div className="text-blue-400"><a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></div>}
                        {selectedApp.linkedin && <div className="text-blue-400"><a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>}
                        {selectedApp.github && <div className="text-blue-400"><a href={selectedApp.github} target="_blank" rel="noopener noreferrer">GitHub</a></div>}
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
                of <span className="font-medium text-white">{pagination.total}</span> applications
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

