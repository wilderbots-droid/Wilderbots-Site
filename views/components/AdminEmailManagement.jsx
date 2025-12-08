import { useState, useEffect } from 'react'
import { 
  Mail, Send, Inbox, Settings, Plus, Edit, Trash2, X, Save, 
  Star, Archive, CheckCircle, XCircle, Search, RefreshCw, 
  Paperclip, Eye, EyeOff, ChevronDown, ChevronUp, TestTube,
  Reply, ReplyAll, Forward, MoreVertical, Flag, Folder,
  Maximize, Minimize
} from 'lucide-react'

export default function AdminEmailManagement() {
  const [activeTab, setActiveTab] = useState('inbox') // inbox, compose, config
  const [emails, setEmails] = useState([])
  const [smtpConfigs, setSmtpConfigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all') // all, sent, received
  const [viewFilter, setViewFilter] = useState('inbox') // inbox, starred, archived
  const [selectedAccount, setSelectedAccount] = useState('all') // all, or specific email address
  const [emailCounts, setEmailCounts] = useState({ inbox: 0, starred: 0, archived: 0 })
  const [isFullScreen, setIsFullScreen] = useState(false)
  
  // Compose email state
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    text: '',
    html: '',
    configId: '',
    replyTo: null, // Original email for reply/forward
    mode: 'compose' // 'compose', 'reply', 'replyAll', 'forward'
  })
  
  // SMTP config form state
  const [configForm, setConfigForm] = useState({
    name: '',
    host: '',
    port: 587,
    secure: false,
    auth: { user: '', pass: '' },
    from: { name: '', address: '' },
    imap: {
      host: '',
      port: 993,
      secure: true,
      auth: { user: '', pass: '' }
    },
    isActive: true,
    isDefault: false
  })
  const [editingConfigId, setEditingConfigId] = useState(null)
  const [testingConnection, setTestingConnection] = useState(false)

  useEffect(() => {
    if (activeTab === 'inbox') {
      // Load SMTP configs first to populate account filter
      if (smtpConfigs.length === 0) {
        fetchSMTPConfigs().then(() => fetchEmails())
      } else {
        fetchEmails()
      }
    } else if (activeTab === 'config') {
      fetchSMTPConfigs()
    }
  }, [activeTab, filter, viewFilter, searchQuery, selectedAccount])

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams({
        direction: filter === 'all' ? 'all' : filter,
        limit: '50'
      })
      
      // Apply view filter (inbox, starred, archived)
      if (viewFilter === 'starred') {
        params.append('isStarred', 'true')
        params.append('isArchived', 'false') // Don't show archived in starred view
      } else if (viewFilter === 'archived') {
        params.append('isArchived', 'true')
      } else {
        // inbox view - show non-archived emails
        params.append('isArchived', 'false')
      }
      
      if (searchQuery) params.append('search', searchQuery)
      if (selectedAccount !== 'all') params.append('emailAccount', selectedAccount)
      
      const response = await fetch(`/api/admin/inbox?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails || [])
        
        // Fetch counts for different views
        fetchEmailCounts()
      }
    } catch (error) {
      console.error('Error fetching emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmailCounts = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      // Fetch inbox count (non-archived)
      const inboxParams = new URLSearchParams({
        direction: 'all',
        limit: '1',
        isArchived: 'false'
      })
      if (selectedAccount !== 'all') inboxParams.append('emailAccount', selectedAccount)
      
      // Fetch starred count
      const starredParams = new URLSearchParams({
        direction: 'all',
        limit: '1',
        isStarred: 'true',
        isArchived: 'false'
      })
      if (selectedAccount !== 'all') starredParams.append('emailAccount', selectedAccount)
      
      // Fetch archived count
      const archivedParams = new URLSearchParams({
        direction: 'all',
        limit: '1',
        isArchived: 'true'
      })
      if (selectedAccount !== 'all') archivedParams.append('emailAccount', selectedAccount)
      
      const [inboxRes, starredRes, archivedRes] = await Promise.all([
        fetch(`/api/admin/inbox?${inboxParams}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`/api/admin/inbox?${starredParams}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`/api/admin/inbox?${archivedParams}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      
      if (inboxRes.ok && starredRes.ok && archivedRes.ok) {
        const [inboxData, starredData, archivedData] = await Promise.all([
          inboxRes.json(),
          starredRes.json(),
          archivedRes.json()
        ])
        
        setEmailCounts({
          inbox: inboxData.total || 0,
          starred: starredData.total || 0,
          archived: archivedData.total || 0
        })
      }
    } catch (error) {
      console.error('Error fetching email counts:', error)
    }
  }

  const fetchSMTPConfigs = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/smtp-config', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setSmtpConfigs(data.configs || [])
        if (data.configs?.length > 0 && !composeData.configId) {
          const defaultConfig = data.configs.find(c => c.isDefault) || data.configs[0]
          setComposeData(prev => ({ ...prev, configId: defaultConfig._id }))
        }
        return data.configs || []
      }
      return []
    } catch (error) {
      console.error('Error fetching SMTP configs:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchNewEmails = async (fetchAllAccounts = true) => {
    try {
      const token = localStorage.getItem('admin_token')
      
      // Get active configs with IMAP configured
      const activeConfigs = smtpConfigs.filter(c => 
        c.isActive && c.imap?.host && c.imap.host.trim() !== ''
      )
      
      if (activeConfigs.length === 0) {
        alert('No active email accounts with IMAP configured found')
        return
      }

      let response
      if (fetchAllAccounts && activeConfigs.length > 1) {
        // Fetch from all accounts
        response = await fetch('/api/admin/inbox', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            fetchAll: true,
            limit: 50
          })
        })
      } else {
        // Fetch from selected account or default
        const configToUse = selectedAccount !== 'all' 
          ? activeConfigs.find(c => c.from.address === selectedAccount)
          : activeConfigs.find(c => c.isDefault) || activeConfigs[0]
        
        if (!configToUse) {
          alert('No email account selected')
          return
        }

        response = await fetch('/api/admin/inbox', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            configId: configToUse._id,
            limit: 50
          })
        })
      }

      if (response.ok) {
        const data = await response.json()
        let message = `Fetched ${data.emails?.length || 0} new email(s)`
        if (data.results && data.results.length > 0) {
          message += '\n\nResults:'
          data.results.forEach(r => {
            message += `\n- ${r.email}: ${r.count} email(s)`
            if (r.error) message += ` (Error: ${r.error})`
          })
        }
        alert(message)
        fetchEmails()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to fetch emails')
      }
    } catch (error) {
      console.error('Error fetching new emails:', error)
      alert('Failed to fetch emails: ' + error.message)
    }
  }

  const handleSendEmail = async () => {
    if (!composeData.to || !composeData.subject || (!composeData.text && !composeData.html)) {
      alert('Please fill in all required fields (To, Subject, and Message)')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          to: composeData.to.split(',').map(e => e.trim()),
          cc: composeData.cc ? composeData.cc.split(',').map(e => e.trim()) : [],
          bcc: composeData.bcc ? composeData.bcc.split(',').map(e => e.trim()) : [],
          subject: composeData.subject,
          text: composeData.text,
          html: composeData.html || composeData.text.replace(/\n/g, '<br>'),
          configId: composeData.configId || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Email sent successfully!')
        setComposeData({
          to: '',
          cc: '',
          bcc: '',
          subject: '',
          text: '',
          html: '',
          configId: composeData.configId,
          replyTo: null,
          mode: 'compose'
        })
        setActiveTab('inbox')
        fetchEmails()
      } else {
        alert(data.error || 'Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email')
    }
  }

  const handleSaveConfig = async () => {
    if (!configForm.name || !configForm.host || !configForm.auth.user || !configForm.auth.pass || !configForm.from.address) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const url = '/api/admin/smtp-config'
      const method = editingConfigId ? 'PUT' : 'POST'
      const body = editingConfigId
        ? { id: editingConfigId, ...configForm }
        : configForm

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        alert(editingConfigId ? 'SMTP config updated successfully!' : 'SMTP config created successfully!')
        resetConfigForm()
        fetchSMTPConfigs()
      } else {
        alert(data.error || 'Failed to save SMTP config')
      }
    } catch (error) {
      console.error('Error saving SMTP config:', error)
      alert('Failed to save SMTP config')
    }
  }

  const handleTestConnection = async (type) => {
    setTestingConnection(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/smtp-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          config: configForm,
          type
        })
      })

      const data = await response.json()
      alert(data.message || (data.success ? 'Connection successful!' : 'Connection failed'))
    } catch (error) {
      alert('Test failed: ' + error.message)
    } finally {
      setTestingConnection(false)
    }
  }

  const handleDeleteConfig = async (id) => {
    if (!confirm('Are you sure you want to delete this SMTP configuration?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/smtp-config', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      })

      const data = await response.json()

      if (response.ok) {
        alert('SMTP config deleted successfully!')
        fetchSMTPConfigs()
      } else {
        alert(data.error || 'Failed to delete SMTP config')
      }
    } catch (error) {
      console.error('Error deleting SMTP config:', error)
      alert('Failed to delete SMTP config')
    }
  }

  const handleEditConfig = (config) => {
    setConfigForm({
      name: config.name,
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.auth.user, pass: '' }, // Don't show password
      from: config.from,
      imap: config.imap || {
        host: '',
        port: 993,
        secure: true,
        auth: { user: '', pass: '' }
      },
      isActive: config.isActive,
      isDefault: config.isDefault
    })
    setEditingConfigId(config._id)
  }

  const resetConfigForm = () => {
    setConfigForm({
      name: '',
      host: '',
      port: 587,
      secure: false,
      auth: { user: '', pass: '' },
      from: { name: '', address: '' },
      imap: {
        host: '',
        port: 993,
        secure: true,
        auth: { user: '', pass: '' }
      },
      isActive: true,
      isDefault: false
    })
    setEditingConfigId(null)
  }

  const handleEmailAction = async (emailId, action, value) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/emails/${emailId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ [action]: value })
      })

      if (response.ok) {
        fetchEmails()
        if (selectedEmail?._id === emailId) {
          const data = await response.json()
          setSelectedEmail(data.email)
        }
      }
    } catch (error) {
      console.error('Error updating email:', error)
    }
  }

  const handleDeleteEmail = async (emailId) => {
    if (!confirm('Are you sure you want to delete this email?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/emails/${emailId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        if (selectedEmail?._id === emailId) {
          setSelectedEmail(null)
        }
        fetchEmails()
        alert('Email deleted successfully')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete email')
      }
    } catch (error) {
      console.error('Error deleting email:', error)
      alert('Failed to delete email')
    }
  }

  const handleReply = (email, replyAll = false) => {
    const defaultConfig = smtpConfigs.find(c => c.isDefault) || smtpConfigs[0]
    const replyTo = email.from?.address || email.from
    const replyToName = email.from?.name || ''
    
    let toAddresses = []
    let ccAddresses = []
    
    if (replyAll) {
      // Reply All: Reply to sender + all recipients (excluding yourself)
      toAddresses = [replyTo]
      if (email.cc && email.cc.length > 0) {
        ccAddresses = email.cc.map(c => c.address || c).filter(addr => 
          addr !== defaultConfig?.from.address
        )
      }
      // Add original 'to' recipients to CC if not already there
      if (email.to && email.to.length > 0) {
        email.to.forEach(t => {
          const addr = t.address || t
          if (addr !== replyTo && addr !== defaultConfig?.from.address && !ccAddresses.includes(addr)) {
            ccAddresses.push(addr)
          }
        })
      }
    } else {
      // Reply: Just reply to sender
      toAddresses = [replyTo]
    }

    const subjectPrefix = email.subject?.toLowerCase().startsWith('re:') ? '' : 'Re: '
    const originalText = email.text || email.html?.replace(/<[^>]*>/g, '') || ''
    const replyText = `\n\n--- Original Message ---\nFrom: ${replyToName || replyTo}\nDate: ${formatDate(email.date || email.sentAt)}\nSubject: ${email.subject}\n\n${originalText}`

    setComposeData({
      to: toAddresses.join(', '),
      cc: ccAddresses.join(', '),
      bcc: '',
      subject: `${subjectPrefix}${email.subject || ''}`,
      text: replyText,
      html: '',
      configId: defaultConfig?._id || '',
      replyTo: email,
      mode: replyAll ? 'replyAll' : 'reply'
    })
    setActiveTab('compose')
  }

  const handleForward = (email) => {
    const defaultConfig = smtpConfigs.find(c => c.isDefault) || smtpConfigs[0]
    const subjectPrefix = email.subject?.toLowerCase().startsWith('fwd:') || email.subject?.toLowerCase().startsWith('fw:') ? '' : 'Fwd: '
    const originalText = email.text || email.html?.replace(/<[^>]*>/g, '') || ''
    const forwardText = `\n\n--- Forwarded Message ---\nFrom: ${email.from?.name || email.from?.address || 'Unknown'}\nDate: ${formatDate(email.date || email.sentAt)}\nTo: ${email.to?.map(t => t.address || t).join(', ') || 'N/A'}\nSubject: ${email.subject}\n\n${originalText}`

    setComposeData({
      to: '',
      cc: '',
      bcc: '',
      subject: `${subjectPrefix}${email.subject || ''}`,
      text: forwardText,
      html: '',
      configId: defaultConfig?._id || '',
      replyTo: email,
      mode: 'forward'
    })
    setActiveTab('compose')
  }

  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (days < 7) {
      return `${days}d ago`
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex flex-col gap-4 border-b border-gray-800 pb-4 mb-4 flex-shrink-0">
        {/* Main Tabs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
              activeTab === 'inbox'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Inbox size={18} />
            Inbox
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
              activeTab === 'compose'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Send size={18} />
            Compose
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
              activeTab === 'config'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Settings size={18} />
            SMTP Settings
          </button>
        </div>
        
        {/* View Filters (only show in inbox tab) */}
        {activeTab === 'inbox' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewFilter('inbox')}
              className={`px-4 py-2 rounded-lg transition text-sm flex items-center gap-2 ${
                viewFilter === 'inbox'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Inbox size={16} />
              Inbox
              {emailCounts.inbox > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  {emailCounts.inbox}
                </span>
              )}
            </button>
            <button
              onClick={() => setViewFilter('starred')}
              className={`px-4 py-2 rounded-lg transition text-sm flex items-center gap-2 ${
                viewFilter === 'starred'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Star size={16} className={viewFilter === 'starred' ? 'fill-current' : ''} />
              Starred
              {emailCounts.starred > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  {emailCounts.starred}
                </span>
              )}
            </button>
            <button
              onClick={() => setViewFilter('archived')}
              className={`px-4 py-2 rounded-lg transition text-sm flex items-center gap-2 ${
                viewFilter === 'archived'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Archive size={16} />
              Archived
              {emailCounts.archived > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  {emailCounts.archived}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Inbox Tab */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Email List */}
          {!isFullScreen && (
            <div className="lg:col-span-2 flex flex-col space-y-4 min-h-0">
            {/* Filters and Search */}
            <div className="space-y-3 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All</option>
                    <option value="received">Received</option>
                    <option value="sent">Sent</option>
                  </select>
                  <button
                    onClick={() => fetchNewEmails(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2"
                    title="Fetch from all accounts"
                  >
                    <RefreshCw size={18} />
                    Fetch All
                  </button>
                </div>
              </div>
              {/* Account Filter */}
              {smtpConfigs.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400 whitespace-nowrap">Account:</label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Accounts</option>
                    {smtpConfigs
                      .filter(c => c.isActive && c.imap?.host)
                      .map((config) => (
                        <option key={config._id} value={config.from.address}>
                          {config.from.address} {config.isDefault ? '(Default)' : ''}
                        </option>
                      ))}
                  </select>
                  {selectedAccount !== 'all' && (
                    <button
                      onClick={() => fetchNewEmails(false)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 text-sm"
                      title="Fetch from selected account"
                    >
                      <RefreshCw size={16} />
                      Fetch
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Email List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-700 border-t-purple-600"></div>
              </div>
            ) : emails.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                <Mail className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-400">No emails found</p>
              </div>
            ) : (
              <div className="space-y-2 flex-1 overflow-y-auto pr-2 min-h-0">
                {emails.map((email) => (
                  <div
                    key={email._id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedEmail?._id === email._id
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/50'
                    } ${!email.isRead ? 'bg-blue-500/5 border-blue-500/20' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          {!email.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                          <span className="font-semibold text-white truncate text-sm">
                            {email.direction === 'sent' 
                              ? `To: ${email.to?.[0]?.address || email.to?.[0] || 'N/A'}`
                              : email.from?.name || email.from?.address || 'Unknown'
                            }
                          </span>
                          {email.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-gray-300 font-medium mb-1.5 truncate">{email.subject || '(No Subject)'}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs text-gray-500">{formatDate(email.date || email.sentAt)}</p>
                          {/* Show account info */}
                          {email.direction === 'sent' && email.from?.address && (
                            <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                              {email.from.address}
                            </span>
                          )}
                          {email.direction === 'received' && email.to?.[0]?.address && (
                            <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                              {email.to[0].address}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {email.status === 'sent' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {email.status === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Email Detail */}
          <div className={`${isFullScreen ? 'fixed inset-0 z-50 p-4 bg-gray-950/95 backdrop-blur-sm' : 'lg:col-span-1'} flex flex-col min-h-0`}>
            {selectedEmail ? (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden flex flex-col h-full">
                {/* Email Header */}
                <div className="p-4 border-b border-gray-800 bg-gray-900/80 flex-shrink-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white pr-2 break-words">{selectedEmail.subject || '(No Subject)'}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="text-gray-400 hover:text-white flex-shrink-0 p-2 hover:bg-gray-800 rounded transition"
                        title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                      >
                        {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEmail(null)
                          setIsFullScreen(false)
                        }}
                        className="text-gray-400 hover:text-white flex-shrink-0 p-2 hover:bg-gray-800 rounded transition"
                        title="Close"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-500 min-w-[50px]">From:</span>
                      <div className="flex-1">
                        <div className="text-white">{selectedEmail.from?.name || selectedEmail.from?.address || 'Unknown'}</div>
                        {selectedEmail.from?.address && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                            {selectedEmail.from.address}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-500 min-w-[50px]">To:</span>
                      <div className="flex-1">
                        <div className="text-white">{selectedEmail.to?.map(t => t.address || t).join(', ') || 'N/A'}</div>
                        {selectedEmail.direction === 'received' && selectedEmail.to?.[0]?.address && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                            {selectedEmail.to[0].address}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 pt-1">{formatDate(selectedEmail.date || selectedEmail.sentAt)}</div>
                  </div>
                </div>

                {/* Email Content */}
                <div className="flex-1 overflow-y-auto bg-white">
                  <div className="p-6">
                    {selectedEmail.html ? (
                      <div 
                        className="email-content"
                        style={{
                          color: '#1f2937',
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}
                        dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                      />
                    ) : (
                      <div className="text-gray-800 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {selectedEmail.text || '(No content)'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Actions */}
                <div className="p-4 border-t border-gray-800 bg-gray-900/80">
                  {/* Primary Actions */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-800">
                    {selectedEmail.direction === 'received' && (
                      <>
                        <button
                          onClick={() => handleReply(selectedEmail, false)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-sm"
                          title="Reply"
                        >
                          <Reply size={16} />
                          Reply
                        </button>
                        <button
                          onClick={() => handleReply(selectedEmail, true)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600/80 hover:bg-purple-700 text-white rounded-lg transition text-sm"
                          title="Reply All"
                        >
                          <ReplyAll size={16} />
                          Reply All
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleForward(selectedEmail)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                      title="Forward"
                    >
                      <Forward size={16} />
                      Forward
                    </button>
                  </div>
                  
                  {/* Secondary Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleEmailAction(selectedEmail._id, 'isStarred', !selectedEmail.isStarred)}
                      className={`p-2 rounded-lg transition ${
                        selectedEmail.isStarred
                          ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                          : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                      title={selectedEmail.isStarred ? 'Unstar' : 'Star'}
                    >
                      <Star size={18} className={selectedEmail.isStarred ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={() => handleEmailAction(selectedEmail._id, 'isRead', !selectedEmail.isRead)}
                      className={`p-2 rounded-lg transition ${
                        selectedEmail.isRead
                          ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                          : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                      }`}
                      title={selectedEmail.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {selectedEmail.isRead ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleEmailAction(selectedEmail._id, 'isArchived', !selectedEmail.isArchived)}
                      className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition"
                      title={selectedEmail.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteEmail(selectedEmail._id)}
                      className="p-2 rounded-lg bg-gray-800 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-12 text-center h-full flex items-center justify-center">
                <div>
                  <Mail className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-400">Select an email to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div className="flex flex-col h-full min-h-0">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 space-y-4 flex-1 overflow-y-auto">
          {composeData.mode !== 'compose' && (
            <div className={`p-3 rounded-lg mb-4 ${
              composeData.mode === 'reply' || composeData.mode === 'replyAll' 
                ? 'bg-purple-500/10 border border-purple-500/20' 
                : 'bg-blue-500/10 border border-blue-500/20'
            }`}>
              <div className="flex items-center gap-2 text-sm">
                {composeData.mode === 'reply' && <Reply size={16} className="text-purple-400" />}
                {composeData.mode === 'replyAll' && <ReplyAll size={16} className="text-purple-400" />}
                {composeData.mode === 'forward' && <Forward size={16} className="text-blue-400" />}
                <span className={`font-medium ${
                  composeData.mode === 'forward' ? 'text-blue-400' : 'text-purple-400'
                }`}>
                  {composeData.mode === 'reply' && 'Replying to:'}
                  {composeData.mode === 'replyAll' && 'Replying to all:'}
                  {composeData.mode === 'forward' && 'Forwarding:'}
                </span>
                <span className="text-gray-300">
                  {composeData.replyTo?.subject || 'Email'}
                </span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">To *</label>
              <input
                type="text"
                value={composeData.to}
                onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                placeholder="recipient@example.com"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Config</label>
              <select
                value={composeData.configId}
                onChange={(e) => setComposeData({ ...composeData, configId: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Use Default</option>
                {smtpConfigs.map(config => (
                  <option key={config._id} value={config._id}>{config.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">CC</label>
              <input
                type="text"
                value={composeData.cc}
                onChange={(e) => setComposeData({ ...composeData, cc: e.target.value })}
                placeholder="cc@example.com"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">BCC</label>
              <input
                type="text"
                value={composeData.bcc}
                onChange={(e) => setComposeData({ ...composeData, bcc: e.target.value })}
                placeholder="bcc@example.com"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
            <input
              type="text"
              value={composeData.subject}
              onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
              placeholder="Email subject"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
            <textarea
              value={composeData.text}
              onChange={(e) => setComposeData({ ...composeData, text: e.target.value })}
              rows={15}
              placeholder="Type your message here..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y min-h-[300px]"
              style={{ maxHeight: 'calc(100vh - 500px)' }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition"
            >
              <Send size={18} />
              Send Email
            </button>
            <button
              onClick={() => {
                const defaultConfig = smtpConfigs.find(c => c.isDefault) || smtpConfigs[0]
                setComposeData({
                  to: '',
                  cc: '',
                  bcc: '',
                  subject: '',
                  text: '',
                  html: '',
                  configId: defaultConfig?._id || '',
                  replyTo: null,
                  mode: 'compose'
                })
              }}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Clear
            </button>
            {composeData.mode !== 'compose' && (
              <button
                onClick={() => {
                  setComposeData({
                    ...composeData,
                    replyTo: null,
                    mode: 'compose'
                  })
                }}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              >
                New Email
              </button>
            )}
          </div>
          </div>
        </div>
      )}

      {/* SMTP Config Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Config Form */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingConfigId ? 'Edit SMTP Configuration' : 'Add SMTP Configuration'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={configForm.name}
                    onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                    placeholder="My SMTP Server"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Host *</label>
                  <input
                    type="text"
                    value={configForm.host}
                    onChange={(e) => setConfigForm({ ...configForm, host: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Port *</label>
                  <input
                    type="number"
                    value={configForm.port}
                    onChange={(e) => setConfigForm({ ...configForm, port: parseInt(e.target.value) || 587 })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secure</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configForm.secure}
                      onChange={(e) => setConfigForm({ ...configForm, secure: e.target.checked })}
                      className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-purple-600"
                    />
                    <span className="text-sm text-gray-300">Use SSL/TLS</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username *</label>
                  <input
                    type="text"
                    value={configForm.auth.user}
                    onChange={(e) => setConfigForm({ 
                      ...configForm, 
                      auth: { ...configForm.auth, user: e.target.value }
                    })}
                    placeholder="your-email@gmail.com"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                  <input
                    type="password"
                    value={configForm.auth.pass}
                    onChange={(e) => setConfigForm({ 
                      ...configForm, 
                      auth: { ...configForm.auth, pass: e.target.value }
                    })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">From Name</label>
                  <input
                    type="text"
                    value={configForm.from.name}
                    onChange={(e) => setConfigForm({ 
                      ...configForm, 
                      from: { ...configForm.from, name: e.target.value }
                    })}
                    placeholder="Wilderbots"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">From Address *</label>
                  <input
                    type="email"
                    value={configForm.from.address}
                    onChange={(e) => setConfigForm({ 
                      ...configForm, 
                      from: { ...configForm.from, address: e.target.value }
                    })}
                    placeholder="noreply@wilderbots.com"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* IMAP Settings */}
              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-md font-semibold text-white mb-4">IMAP Settings (for receiving emails)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">IMAP Host</label>
                    <input
                      type="text"
                      value={configForm.imap.host}
                      onChange={(e) => setConfigForm({ 
                        ...configForm, 
                        imap: { ...configForm.imap, host: e.target.value }
                      })}
                      placeholder="imap.gmail.com"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">IMAP Port</label>
                    <input
                      type="number"
                      value={configForm.imap.port}
                      onChange={(e) => setConfigForm({ 
                        ...configForm, 
                        imap: { ...configForm.imap, port: parseInt(e.target.value) || 993 }
                      })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">IMAP Username</label>
                    <input
                      type="text"
                      value={configForm.imap.auth.user}
                      onChange={(e) => setConfigForm({ 
                        ...configForm, 
                        imap: { 
                          ...configForm.imap, 
                          auth: { ...configForm.imap.auth, user: e.target.value }
                        }
                      })}
                      placeholder="your-email@gmail.com"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">IMAP Password</label>
                    <input
                      type="password"
                      value={configForm.imap.auth.pass}
                      onChange={(e) => setConfigForm({ 
                        ...configForm, 
                        imap: { 
                          ...configForm.imap, 
                          auth: { ...configForm.imap.auth, pass: e.target.value }
                        }
                      })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-gray-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configForm.isActive}
                    onChange={(e) => setConfigForm({ ...configForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-purple-600"
                  />
                  <span className="text-sm text-gray-300">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configForm.isDefault}
                    onChange={(e) => setConfigForm({ ...configForm, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-purple-600"
                  />
                  <span className="text-sm text-gray-300">Set as Default</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveConfig}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition"
                >
                  <Save size={18} />
                  {editingConfigId ? 'Update' : 'Save'} Configuration
                </button>
                <button
                  onClick={() => handleTestConnection('smtp')}
                  disabled={testingConnection}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  <TestTube size={18} />
                  Test SMTP
                </button>
                <button
                  onClick={() => handleTestConnection('imap')}
                  disabled={testingConnection}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  <TestTube size={18} />
                  Test IMAP
                </button>
                {editingConfigId && (
                  <button
                    onClick={resetConfigForm}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Config List */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">SMTP Configurations</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {smtpConfigs.map((config) => (
                <div key={config._id} className="p-4 hover:bg-gray-800/30 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{config.name}</span>
                        {config.isDefault && (
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">
                            Default
                          </span>
                        )}
                        {config.isActive ? (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-500/10 text-gray-400 text-xs rounded border border-gray-500/20">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        <div>SMTP: {config.host}:{config.port}</div>
                        {config.imap?.host && <div>IMAP: {config.imap.host}:{config.imap.port}</div>}
                        <div>From: {config.from.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditConfig(config)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                      >
                        <Edit size={18} />
                      </button>
                      {!config.isDefault && (
                        <button
                          onClick={() => handleDeleteConfig(config._id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

