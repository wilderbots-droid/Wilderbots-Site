import { useState, useEffect } from 'react'
import { Save, Building2, Mail, Phone, MapPin, Clock, Plus, X, CreditCard, Eye, EyeOff, Wrench, Power } from 'lucide-react'

export default function AdminSettings() {
  const [companyInfo, setCompanyInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    businessHours: '',
    timezone: '',
    departments: [],
    socialMedia: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: '',
      youtube: ''
    }
  })
  const [newDept, setNewDept] = useState({ title: '', email: '', description: '' })
  const [paymentConfig, setPaymentConfig] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(true)
  const [paymentSaving, setPaymentSaving] = useState(false)
  const [showKeySecret, setShowKeySecret] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  const [paymentFormData, setPaymentFormData] = useState({
    razorpayKeyId: '',
    razorpayKeySecret: '',
    webhookSecret: '',
    isEnabled: false
  })
  const [maintenanceData, setMaintenanceData] = useState(null)
  const [maintenanceLoading, setMaintenanceLoading] = useState(true)
  const [maintenanceSaving, setMaintenanceSaving] = useState(false)
  const [maintenanceFormData, setMaintenanceFormData] = useState({
    isActive: false,
    message: 'We are currently performing scheduled maintenance. We will be back shortly!',
    endTime: ''
  })

  useEffect(() => {
    fetchCompanyInfo()
    fetchPaymentConfig()
    fetchMaintenanceData()
  }, [])

  const fetchCompanyInfo = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/company-info', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setCompanyInfo(data.companyInfo)
        setFormData({
          name: data.companyInfo.name || '',
          email: data.companyInfo.email || '',
          phone: data.companyInfo.phone || '',
          address: data.companyInfo.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          businessHours: data.companyInfo.businessHours || '',
          timezone: data.companyInfo.timezone || '',
          departments: data.companyInfo.departments || [],
          socialMedia: data.companyInfo.socialMedia || {
            linkedin: '',
            github: '',
            twitter: '',
            instagram: '',
            youtube: ''
          }
        })
      }
    } catch (error) {
      console.error('Error fetching company info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/company-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchCompanyInfo()
        alert('Company information saved successfully!')
      }
    } catch (error) {
      console.error('Error saving company info:', error)
      alert('Error saving company information')
    } finally {
      setSaving(false)
    }
  }

  const addDepartment = () => {
    if (newDept.title && newDept.email) {
      setFormData({
        ...formData,
        departments: [...formData.departments, { ...newDept }]
      })
      setNewDept({ title: '', email: '', description: '' })
    }
  }

  const removeDepartment = (index) => {
    setFormData({
      ...formData,
      departments: formData.departments.filter((_, i) => i !== index)
    })
  }

  const fetchPaymentConfig = async () => {
    setPaymentLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/payment-config', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setPaymentConfig(data.paymentConfig)
        setPaymentFormData({
          razorpayKeyId: data.paymentConfig.razorpayKeyId || '',
          razorpayKeySecret: '', // Don't populate secret for security
          webhookSecret: '', // Don't populate secret for security
          isEnabled: data.paymentConfig.isEnabled || false
        })
      }
    } catch (error) {
      console.error('Error fetching payment config:', error)
    } finally {
      setPaymentLoading(false)
    }
  }

  const handlePaymentSave = async () => {
    setPaymentSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/payment-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentFormData),
      })

      if (response.ok) {
        fetchPaymentConfig()
        alert('Payment configuration saved successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Error saving payment configuration')
      }
    } catch (error) {
      console.error('Error saving payment config:', error)
      alert('Error saving payment configuration')
    } finally {
      setPaymentSaving(false)
    }
  }

  const fetchMaintenanceData = async () => {
    setMaintenanceLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/maintenance', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setMaintenanceData(data.maintenance)
        setMaintenanceFormData({
          isActive: data.maintenance.isActive || false,
          message: data.maintenance.message || 'We are currently performing scheduled maintenance. We will be back shortly!',
          endTime: data.maintenance.endTime ? new Date(data.maintenance.endTime).toISOString().slice(0, 16) : ''
        })
      }
    } catch (error) {
      console.error('Error fetching maintenance data:', error)
    } finally {
      setMaintenanceLoading(false)
    }
  }

  const handleMaintenanceSave = async () => {
    setMaintenanceSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const payload = {
        isActive: maintenanceFormData.isActive,
        message: maintenanceFormData.message,
        endTime: maintenanceFormData.endTime ? new Date(maintenanceFormData.endTime).toISOString() : null
      }

      const response = await fetch('/api/admin/maintenance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        fetchMaintenanceData()
        alert(maintenanceFormData.isActive 
          ? 'Maintenance mode activated successfully!' 
          : 'Maintenance mode deactivated successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Error saving maintenance settings')
      }
    } catch (error) {
      console.error('Error saving maintenance settings:', error)
      alert('Error saving maintenance settings')
    } finally {
      setMaintenanceSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-600 mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-yellow-400" />
          Company Settings
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Manage company information, address, and contact details
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Business Hours</label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Street</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Zip Code</label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, zipCode: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, country: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Departments */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Departments</h3>
          <div className="space-y-3 mb-4">
            {formData.departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="text-white font-medium">{dept.title}</div>
                  <div className="text-sm text-gray-400">{dept.email}</div>
                  {dept.description && (
                    <div className="text-xs text-gray-500 mt-1">{dept.description}</div>
                  )}
                </div>
                <button
                  onClick={() => removeDepartment(index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Department Title"
              value={newDept.title}
              onChange={(e) => setNewDept({ ...newDept, title: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newDept.email}
              onChange={(e) => setNewDept({ ...newDept, email: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Description"
                value={newDept.description}
                onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addDepartment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
              <input
                type="url"
                value={formData.socialMedia.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
              <input
                type="url"
                value={formData.socialMedia.github}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, github: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
              <input
                type="url"
                value={formData.socialMedia.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
              <input
                type="url"
                value={formData.socialMedia.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">YouTube</label>
              <input
                type="url"
                value={formData.socialMedia.youtube}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, youtube: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-800">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Razorpay Payment Configuration */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center mt-8">
          <CreditCard className="w-6 h-6 mr-2 text-green-400" />
          Payment Gateway Settings
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Configure Razorpay payment gateway for order processing
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 space-y-6">
        {paymentLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-600 mb-4"></div>
              <p className="text-gray-400">Loading payment configuration...</p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Razorpay Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Razorpay Key ID
                  </label>
                  <input
                    type="text"
                    value={paymentFormData.razorpayKeyId}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, razorpayKeyId: e.target.value })}
                    placeholder="rzp_test_..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your Razorpay Key ID from the dashboard</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Razorpay Key Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showKeySecret ? "text" : "password"}
                      value={paymentFormData.razorpayKeySecret}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, razorpayKeySecret: e.target.value })}
                      placeholder={paymentConfig?.hasKeySecret ? "••••••••••••" : "Enter key secret"}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeySecret(!showKeySecret)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showKeySecret ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {paymentConfig?.hasKeySecret 
                      ? "Leave blank to keep existing secret, or enter new secret to update"
                      : "Your Razorpay Key Secret from the dashboard"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Webhook Secret (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showWebhookSecret ? "text" : "password"}
                      value={paymentFormData.webhookSecret}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, webhookSecret: e.target.value })}
                      placeholder={paymentConfig?.hasWebhookSecret ? "••••••••••••" : "Enter webhook secret"}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showWebhookSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Webhook secret for verifying Razorpay webhook requests. 
                    {paymentConfig?.hasWebhookSecret && " Leave blank to keep existing secret."}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">
                    Webhook URL: {typeof window !== 'undefined' ? `${window.location.origin}/api/payments/razorpay/webhook` : '/api/payments/razorpay/webhook'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enableRazorpay"
                    checked={paymentFormData.isEnabled}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, isEnabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
                  />
                  <label htmlFor="enableRazorpay" className="text-sm font-medium text-gray-300 cursor-pointer">
                    Enable Razorpay Payment Gateway
                  </label>
                </div>

                {paymentConfig && (
                  <div className={`p-4 rounded-lg ${paymentConfig.isEnabled ? 'bg-green-900/20 border border-green-500/30' : 'bg-yellow-900/20 border border-yellow-500/30'}`}>
                    <p className={`text-sm ${paymentConfig.isEnabled ? 'text-green-300' : 'text-yellow-300'}`}>
                      {paymentConfig.isEnabled 
                        ? '✓ Razorpay is currently enabled and active'
                        : '⚠ Razorpay is currently disabled. Orders cannot be processed until enabled.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800">
              <button
                onClick={handlePaymentSave}
                disabled={paymentSaving}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {paymentSaving ? 'Saving...' : 'Save Payment Configuration'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Maintenance Mode Settings */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center mt-8">
          <Wrench className="w-6 h-6 mr-2 text-orange-400" />
          Maintenance Mode
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Activate maintenance mode to temporarily disable public access to the site
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 space-y-6">
        {maintenanceLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-600 mb-4"></div>
              <p className="text-gray-400">Loading maintenance settings...</p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Maintenance Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="enableMaintenance"
                    checked={maintenanceFormData.isActive}
                    onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="enableMaintenance" className="text-sm font-medium text-gray-300 cursor-pointer flex items-center gap-2">
                    <Power className={`w-5 h-5 ${maintenanceFormData.isActive ? 'text-orange-400' : 'text-gray-500'}`} />
                    Enable Maintenance Mode
                  </label>
                </div>

                {maintenanceFormData.isActive && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Maintenance Message
                      </label>
                      <textarea
                        value={maintenanceFormData.message}
                        onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, message: e.target.value })}
                        placeholder="Enter maintenance message..."
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">This message will be displayed to users during maintenance</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expected End Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={maintenanceFormData.endTime}
                        onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, endTime: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Set when maintenance is expected to end. A countdown timer will be displayed.</p>
                    </div>
                  </>
                )}

                {maintenanceData && (
                  <div className={`p-4 rounded-lg ${maintenanceData.isActive ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-gray-800/50 border border-gray-700'}`}>
                    <p className={`text-sm ${maintenanceData.isActive ? 'text-orange-300' : 'text-gray-400'}`}>
                      {maintenanceData.isActive 
                        ? '⚠ Maintenance mode is currently ACTIVE. Public users will be redirected to the maintenance page.'
                        : '✓ Maintenance mode is currently INACTIVE. Site is accessible to all users.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800">
              <button
                onClick={handleMaintenanceSave}
                disabled={maintenanceSaving}
                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${maintenanceFormData.isActive ? 'from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' : 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'} text-white rounded-lg transition disabled:opacity-50`}
              >
                <Save className="w-5 h-5 mr-2" />
                {maintenanceSaving ? 'Saving...' : maintenanceFormData.isActive ? 'Activate Maintenance Mode' : 'Save Settings'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

