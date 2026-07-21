import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  LogOut, 
  TrendingUp, 
  Package, 
  ShoppingBag,
  Users,
  Activity,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  Star,
  Mail,
  Send,
  Layers,
  BookOpen
} from 'lucide-react'
import AdminServices from './AdminServices'
import AdminProducts from './AdminProducts'
import AdminCareers from './AdminCareers'
import AdminJobApplications from './AdminJobApplications'
import AdminContacts from './AdminContacts'
import AdminSettings from './AdminSettings'
import AdminAccountSettings from './AdminAccountSettings'
import AdminFAQs from './AdminFAQs'
import AdminReviews from './AdminReviews'
import AdminTeam from './AdminTeam'
import AdminPolicies from './AdminPolicies'
import AdminEmailAddresses from './AdminEmailAddresses'
import AdminEmailManagement from './AdminEmailManagement'
import AdminProcess from './AdminProcess'
import AdminStats from './AdminStats'
import AdminEducation from './AdminEducation'

export default function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentAdmin, setCurrentAdmin] = useState(admin)

  // Expose update function for AdminAccountSettings
  useEffect(() => {
    window.updateAdminProfile = (updatedAdmin) => {
      setCurrentAdmin(updatedAdmin)
    }
    return () => {
      delete window.updateAdminProfile
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Wilderbots</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Services</span>
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'process'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span className="font-medium">Journey Steps</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Statistics</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'education'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Education</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </button>
            <button
              onClick={() => setActiveTab('careers')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'careers'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Careers</span>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'applications'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Applications</span>
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'contacts'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Contacts</span>
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'faqs'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">FAQs</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Star className="w-5 h-5" />
              <span className="font-medium">Reviews</span>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'team'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Team</span>
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'policies'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Policies</span>
            </button>
            <button
              onClick={() => setActiveTab('email-addresses')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'email-addresses'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email Addresses</span>
            </button>
            <button
              onClick={() => setActiveTab('email-management')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'email-management'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="font-medium">Email Management</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Company Settings</span>
            </button>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => setActiveTab('admin-account')}
              className="w-full flex items-center space-x-3 mb-4 p-2 rounded-lg hover:bg-gray-800 transition cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {currentAdmin?.name?.charAt(0).toUpperCase() || admin?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition">{currentAdmin?.name || admin?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{currentAdmin?.email || admin?.email || ''}</p>
              </div>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'services' && 'Services Management'}
                  {activeTab === 'products' && 'Products Management'}
                  {activeTab === 'careers' && 'Careers Management'}
                  {activeTab === 'applications' && 'Job Applications'}
                  {activeTab === 'contacts' && 'Contact Messages'}
                  {activeTab === 'faqs' && 'FAQs Management'}
                  {activeTab === 'reviews' && 'Reviews & Testimonials'}
                  {activeTab === 'team' && 'Team Management'}
                  {activeTab === 'policies' && 'Legal Pages Management'}
                  {activeTab === 'email-addresses' && 'Email Addresses'}
                  {activeTab === 'email-management' && 'Email Management'}
                  {activeTab === 'admin-account' && 'Admin Account Settings'}
                  {activeTab === 'settings' && 'Company Settings'}
                  {activeTab === 'process' && 'Journey Management'}
                  {activeTab === 'stats' && 'Statistics Management'}
                  {activeTab === 'education' && 'Education Management'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {activeTab === 'dashboard' && 'Welcome back, here\'s what\'s happening'}
                  {activeTab === 'services' && 'Manage your services and offerings'}
                  {activeTab === 'products' && 'Manage products and featured items'}
                  {activeTab === 'careers' && 'Manage job listings and positions'}
                  {activeTab === 'applications' && 'Review and manage job applications'}
                  {activeTab === 'contacts' && 'Manage contact form submissions'}
                  {activeTab === 'faqs' && 'Manage frequently asked questions'}
                  {activeTab === 'reviews' && 'Manage customer reviews and testimonials'}
                  {activeTab === 'team' && 'Manage team members for the About page'}
                  {activeTab === 'policies' && 'Manage Privacy Policy, Terms of Service, and Returns & Delivery Policy'}
                  {activeTab === 'email-management' && 'Send and receive emails using SMTP/IMAP'}
                  {activeTab === 'admin-account' && 'Manage your admin account profile and password'}
                  {activeTab === 'settings' && 'Manage company information and settings'}
                  {activeTab === 'process' && 'Manage your journey steps and process section'}
                  {activeTab === 'stats' && 'Manage landing page statistics'}
                  {activeTab === 'education' && 'Manage education section content'}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 overflow-y-auto ${activeTab === 'email-management' ? 'p-0' : 'p-8'}`}>
          {activeTab === 'dashboard' && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-600 mb-4"></div>
                    <p className="text-gray-400">Loading dashboard data...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition">
                          <MessageSquare className="w-6 h-6 text-blue-400" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stats?.stats?.totalContacts || 0}</div>
                      <div className="text-sm text-gray-400">Contact Messages</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition">
                          <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stats?.stats?.totalApplications || 0}</div>
                      <div className="text-sm text-gray-400">Applications</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-600/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center group-hover:bg-amber-600/30 transition">
                          <Package className="w-6 h-6 text-amber-400" />
                        </div>
                        <Activity className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stats?.stats?.totalProducts || 0}</div>
                      <div className="text-sm text-gray-400">Products</div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-600/30 transition">
                          <Briefcase className="w-6 h-6 text-emerald-400" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stats?.stats?.totalServices || 0}</div>
                      <div className="text-sm text-gray-400">Services</div>
                    </div>
                  </div>

                  {/* Recent Applications */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-gray-400" />
                        Recent Applications
                      </h3>
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {stats?.recentApplications?.length > 0 ? (
                            stats.recentApplications.map((application) => (
                              <tr key={application._id} className="hover:bg-gray-800/30 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{application.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{application.position}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{application.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(application.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                No applications found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Contacts */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-gray-400" />
                        Recent Contacts
                      </h3>
                      <button
                        onClick={() => setActiveTab('contacts')}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {stats?.recentContacts?.length > 0 ? (
                            stats.recentContacts.map((contact) => (
                              <tr key={contact._id} className="hover:bg-gray-800/30 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{contact.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{contact.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{contact.category || 'general'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                No contact messages found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Newsletter Snapshot */}
                  {typeof stats?.stats?.totalSubscriptions === 'number' ? (
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-gray-400" />
                        Newsletter Snapshot
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                          <div className="text-2xl font-bold text-white mb-1">{stats.stats.totalSubscriptions}</div>
                          <div className="text-xs text-gray-400">Active subscribers</div>
                        </div>
                        <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                          <div className="text-2xl font-bold text-white mb-1">{stats.stats.totalProducts || 0}</div>
                          <div className="text-xs text-gray-400">Published products</div>
                        </div>
                        <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                          <div className="text-2xl font-bold text-white mb-1">{stats.stats.totalServices || 0}</div>
                          <div className="text-xs text-gray-400">Active services</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'careers' && <AdminCareers />}
        {activeTab === 'applications' && <AdminJobApplications />}
        {activeTab === 'contacts' && <AdminContacts />}
        {activeTab === 'faqs' && <AdminFAQs />}
        {activeTab === 'reviews' && <AdminReviews />}
        {activeTab === 'team' && <AdminTeam />}
        {activeTab === 'policies' && <AdminPolicies />}
        {activeTab === 'email-addresses' && <AdminEmailAddresses />}
        {activeTab === 'email-management' && (
          <div className="h-full w-full p-8">
            <AdminEmailManagement />
          </div>
        )}
        {activeTab === 'admin-account' && <AdminAccountSettings admin={currentAdmin || admin} />}
        {activeTab === 'settings' && <AdminSettings />}
        {activeTab === 'process' && <AdminProcess />}
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'education' && <AdminEducation />}
        </main>
      </div>
    </div>
  )
}
