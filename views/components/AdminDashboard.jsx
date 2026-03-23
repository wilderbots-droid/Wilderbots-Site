import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  LogOut, 
  TrendingUp, 
  Package, 
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  Activity,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  Star,
  Mail,
  Send,
  Layers
} from 'lucide-react'
import AdminUsers from './AdminUsers'
import AdminOrders from './AdminOrders'
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
import AdminSubscriptions from './AdminSubscriptions'
import AdminPolicies from './AdminPolicies'
import AdminEmailAddresses from './AdminEmailAddresses'
import AdminEmailManagement from './AdminEmailManagement'
import AdminProcess from './AdminProcess'
import AdminStats from './AdminStats'

export default function AdminDashboard({ admin, onLogout }) {
  const router = useRouter()
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'processing': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'confirmed': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const ordersByStatusMap = stats?.ordersByStatus?.reduce((acc, item) => {
    acc[item._id] = item.count
    return acc
  }, {}) || {}

  const totalOrders = stats?.stats?.totalOrders || 0
  const deliveredOrders = ordersByStatusMap['delivered'] || 0
  const conversionRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0

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
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Users</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Orders</span>
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
              onClick={() => setActiveTab('subscriptions')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'subscriptions'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Subscriptions</span>
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
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'orders' && 'Order Management'}
                  {activeTab === 'services' && 'Services Management'}
                  {activeTab === 'products' && 'Products Management'}
                  {activeTab === 'careers' && 'Careers Management'}
                  {activeTab === 'applications' && 'Job Applications'}
                  {activeTab === 'contacts' && 'Contact Messages'}
                  {activeTab === 'subscriptions' && 'Newsletter Subscriptions'}
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
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {activeTab === 'dashboard' && 'Welcome back, here\'s what\'s happening'}
                  {activeTab === 'users' && 'Manage all registered users'}
                  {activeTab === 'orders' && 'Track and manage all orders'}
                  {activeTab === 'services' && 'Manage your services and offerings'}
                  {activeTab === 'products' && 'Manage products and featured items'}
                  {activeTab === 'careers' && 'Manage job listings and positions'}
                  {activeTab === 'applications' && 'Review and manage job applications'}
                  {activeTab === 'contacts' && 'Manage contact form submissions'}
                  {activeTab === 'subscriptions' && 'Manage newsletter subscriptions'}
                  {activeTab === 'faqs' && 'Manage frequently asked questions'}
                  {activeTab === 'reviews' && 'Manage customer reviews and testimonials'}
                  {activeTab === 'team' && 'Manage team members for the About page'}
                  {activeTab === 'policies' && 'Manage Privacy Policy, Terms of Service, and Returns & Delivery Policy'}
                  {activeTab === 'email-management' && 'Send and receive emails using SMTP/IMAP'}
                  {activeTab === 'admin-account' && 'Manage your admin account profile and password'}
                  {activeTab === 'settings' && 'Manage company information and settings'}
                  {activeTab === 'process' && 'Manage your journey steps and process section'}
                  {activeTab === 'stats' && 'Manage landing page statistics'}
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
                          <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stats?.stats?.totalUsers || 0}</div>
                      <div className="text-sm text-gray-400">Total Users</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition">
                          <ShoppingBag className="w-6 h-6 text-purple-400" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stats?.stats?.totalOrders || 0}</div>
                      <div className="text-sm text-gray-400">Total Orders</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-600/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center group-hover:bg-amber-600/30 transition">
                          <Clock className="w-6 h-6 text-amber-400" />
                        </div>
                        <Activity className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stats?.stats?.pendingOrders || 0}</div>
                      <div className="text-sm text-gray-400">Pending Orders</div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-600/30 transition">
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{conversionRate}%</div>
                      <div className="text-sm text-gray-400">Delivery Rate</div>
                    </div>
                  </div>

                  {/* Order Status Breakdown */}
                  {stats?.ordersByStatus && stats.ordersByStatus.length > 0 && (
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-gray-400" />
                        Orders by Status
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {stats.ordersByStatus.map((item) => (
                          <div key={item._id} className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <div className="flex items-center justify-center mb-2">
                              <div className={`p-2 rounded-lg ${getStatusColor(item._id).split(' ')[0]}`}>
                                {getStatusIcon(item._id)}
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{item.count}</div>
                            <div className="text-xs text-gray-400 capitalize">{item._id}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Orders */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-2 text-gray-400" />
                        Recent Orders
                      </h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Tracking #</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {stats?.recentOrders?.length > 0 ? (
                            stats.recentOrders.map((order) => (
                              <tr key={order._id} className="hover:bg-gray-800/30 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{order.trackingNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">{order.userId?.name || 'N/A'}</div>
                                  <div className="text-xs text-gray-400">{order.userId?.email || ''}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center text-sm font-semibold text-white">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    {order.totalAmount?.toFixed(2) || '0.00'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">{order.status}</span>
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                No orders found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <UserCheck className="w-5 h-5 mr-2 text-gray-400" />
                        Recent Users
                      </h3>
                      <button
                        onClick={() => setActiveTab('users')}
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
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {stats?.recentUsers?.length > 0 ? (
                            stats.recentUsers.map((user) => (
                              <tr key={user._id} className="hover:bg-gray-800/30 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-white text-xs font-semibold">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                      </span>
                                    </div>
                                    <div className="text-sm font-medium text-white">{user.name}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                                No users found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'careers' && <AdminCareers />}
        {activeTab === 'applications' && <AdminJobApplications />}
        {activeTab === 'contacts' && <AdminContacts />}
        {activeTab === 'subscriptions' && <AdminSubscriptions />}
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
        </main>
      </div>
    </div>
  )
}

