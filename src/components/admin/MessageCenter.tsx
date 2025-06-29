'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, Send, Search, Filter, MoreHorizontal, 
  Eye, Trash2, Reply, Archive, Star, Clock, User,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle,
  Paperclip, Download, Plus, Grid3X3, List, X,
  TrendingUp, Users, Mail, Clock as ClockIcon
} from 'lucide-react'

interface Message {
  id: string
  content: string
  senderName: string
  senderEmail: string
  senderPhone?: string
  senderCompany?: string
  recipientName: string
  recipientEmail: string
  subject?: string
  type: 'CHAT' | 'SUPPORT' | 'NOTIFICATION' | 'SYSTEM'
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  readAt?: string
  repliedAt?: string
  hasAttachments: boolean
  attachments?: string[]
  quoteId?: string
  projectId?: string
  requiresEmailResponse?: boolean
  responseMethod?: string
  source: 'INTERNAL' | 'CONTACT_FORM'
  originalFormId?: string
  serviceRequested?: string
  budgetRange?: string
  timelineRequested?: string
}

const typeConfig = {
  CHAT: { label: 'Chat', color: 'bg-blue-100 text-blue-800', icon: MessageSquare },
  SUPPORT: { label: 'Soporte', color: 'bg-green-100 text-green-800', icon: AlertCircle },
  NOTIFICATION: { label: 'Notificación', color: 'bg-yellow-100 text-yellow-800', icon: CheckCircle },
  SYSTEM: { label: 'Sistema', color: 'bg-gray-100 text-gray-800', icon: User },
  TEXT: { label: 'Mensaje', color: 'bg-purple-100 text-purple-800', icon: MessageSquare },
  EMAIL: { label: 'Email', color: 'bg-green-100 text-green-800', icon: Mail },
  FILE: { label: 'Archivo', color: 'bg-orange-100 text-orange-800', icon: Paperclip },
  CONTACT_FORM: { label: 'Formulario', color: 'bg-pink-100 text-pink-800', icon: Mail }
}

const sourceConfig = {
  INTERNAL: { label: 'Sistema', color: 'bg-blue-50 text-blue-700', icon: MessageSquare },
  CONTACT_FORM: { label: 'Formulario', color: 'bg-purple-50 text-purple-700', icon: Mail }
}

const statusConfig = {
  UNREAD: { label: 'Sin leer', color: 'bg-red-100 text-red-800' },
  READ: { label: 'Leído', color: 'bg-blue-100 text-blue-800' },
  REPLIED: { label: 'Respondido', color: 'bg-green-100 text-green-800' },
  ARCHIVED: { label: 'Archivado', color: 'bg-gray-100 text-gray-800' }
}

const priorityConfig = {
  LOW: { label: 'Baja', color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  HIGH: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: 'Urgente', color: 'bg-red-100 text-red-800' }
}

export default function MessageCenter() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'createdAt' | 'readAt' | 'priority'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  
  // Modal states
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [responseMethod, setResponseMethod] = useState<'CHAT' | 'EMAIL' | 'BOTH'>('CHAT')
  const [sendEmail, setSendEmail] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READ' })
      })
      
      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message)
    setShowViewModal(true)
    // Marcar como leído automáticamente al ver
    if (message.status === 'UNREAD') {
      handleMarkAsRead(message.id)
    }
  }

  const handleReplyMessage = async (message: Message) => {
    setSelectedMessage(message)
    setShowReplyModal(true)
    
    // Determinar si el usuario tiene cuenta activa en el sistema
    const hasActiveAccount = message.source === 'INTERNAL'
    const isContactForm = message.source === 'CONTACT_FORM'
    
    // Configurar método de respuesta automático
    let autoResponseMethod: 'CHAT' | 'EMAIL' | 'BOTH' = 'CHAT'
    let autoSendEmail = false
    let autoReplyContent = ''
    
    if (isContactForm) {
      // Formularios de contacto: siempre por email
      autoResponseMethod = 'EMAIL'
      autoSendEmail = true
      autoReplyContent = `Hola ${message.senderName},\n\nGracias por contactarnos a través de nuestro formulario. Hemos recibido tu consulta sobre ${message.serviceRequested || 'nuestros servicios'}.\n\n`
      
      if (message.serviceRequested) {
        autoReplyContent += `Veo que estás interesado/a en ${getServiceName(message.serviceRequested)}. `
      }
      
      autoReplyContent += `Estaremos en contacto contigo muy pronto para discutir los detalles de tu proyecto.\n\nSaludos cordiales,\nEquipo Code Solutions Studio`
    } else if (hasActiveAccount) {
      // Usuario con cuenta: chat interno + opción de email
      autoResponseMethod = 'BOTH'
      autoSendEmail = false
      autoReplyContent = `Hola ${message.senderName},\n\nGracias por tu mensaje. `
      
      if (message.projectId) {
        autoReplyContent += `He revisado tu consulta relacionada con el proyecto y `
      }
      
      autoReplyContent += `estaré encantado/a de ayudarte.\n\n[Personaliza tu respuesta aquí]\n\nSaludos,\nEquipo Code Solutions Studio`
    } else {
      // Email no registrado: probablemente necesita email
      autoResponseMethod = 'EMAIL'
      autoSendEmail = true
      autoReplyContent = `Hola ${message.senderName},\n\nGracias por tu mensaje. Te respondo por este medio ya que no tienes una cuenta activa en nuestro sistema.\n\n[Personaliza tu respuesta aquí]\n\nSi deseas acceso a nuestro portal de cliente para seguimiento en tiempo real, puedes crear una cuenta en nuestro sitio web.\n\nSaludos cordiales,\nEquipo Code Solutions Studio`
    }
    
    // Aplicar configuración automática
    setResponseMethod(autoResponseMethod)
    setSendEmail(autoSendEmail)
    setReplyContent(autoReplyContent)
  }

  // Función auxiliar para obtener nombres de servicios en español
  const getServiceName = (serviceType: string) => {
    const serviceNames = {
      'WEB': 'desarrollo web',
      'MOBILE': 'aplicaciones móviles', 
      'ECOMMERCE': 'soluciones e-commerce',
      'CLOUD': 'migración a la nube',
      'AI': 'inteligencia artificial',
      'CONSULTING': 'consultoría TI'
    }
    return serviceNames[serviceType as keyof typeof serviceNames] || 'nuestros servicios'
  }

  const handleReply = async (messageId: string) => {
    if (!replyContent.trim()) return
    
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: replyContent,
          responseMethod,
          sendEmail: sendEmail || responseMethod === 'EMAIL' || responseMethod === 'BOTH'
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setReplyContent('')
        setSelectedMessage(null)
        setShowReplyModal(false)
        setResponseMethod('CHAT')
        setSendEmail(false)
        fetchMessages()
        
        // Mostrar mensaje de éxito con información adicional
        if (result.data?.requiresManualEmail) {
          alert(`Respuesta guardada. Revisa tu cliente de email para enviar la respuesta a ${result.data.email}`)
        }
      }
    } catch (error) {
      console.error('Error replying to message:', error)
    }
  }

  const handleArchive = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' })
      })
      
      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error archiving message:', error)
    }
  }

  const handleDelete = async (messageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) return
    
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedMessages.length === 0) return
    
    try {
      const response = await fetch('/api/admin/messages/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageIds: selectedMessages, 
          action 
        })
      })
      
      if (response.ok) {
        setSelectedMessages([])
        fetchMessages()
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  const handleExportMessages = () => {
    const csvContent = generateCSV(filteredMessages)
    downloadCSV(csvContent, 'mensajes.csv')
  }

  const generateCSV = (data: Message[]) => {
    const headers = ['Remitente', 'Email', 'Asunto', 'Tipo', 'Estado', 'Prioridad', 'Fecha']
    const rows = data.map(message => [
      message.senderName,
      message.senderEmail,
      message.subject || 'Sin asunto',
      typeConfig[message.type]?.label || message.type,
      statusConfig[message.status]?.label || message.status,
      priorityConfig[message.priority]?.label || message.priority,
      formatDate(message.createdAt)
    ])
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calcular estadísticas
  const totalMessages = messages.length
  const unreadMessages = messages.filter(m => m.status === 'UNREAD').length
  const unreadCount = unreadMessages
  const unreadPercentage = totalMessages > 0 ? ((unreadMessages / totalMessages) * 100).toFixed(1) : '0'
  const contactFormMessages = messages.filter(m => m.source === 'CONTACT_FORM').length
  const formMessagesCount = contactFormMessages
  const pendingSupport = messages.filter(m => m.status === 'READ' && m.type === 'SUPPORT').length
  const pendingCount = pendingSupport
  const highPriorityMessages = messages.filter(m => m.priority === 'HIGH' || m.priority === 'URGENT').length
  const highPriorityCount = highPriorityMessages
  const responseRate = totalMessages > 0 ? ((messages.filter(m => m.status === 'REPLIED').length / totalMessages) * 100) : 0
  const avgResponseTime = '2.3 hrs' // Esto se calcularía con datos reales
  const averageResponseTime = avgResponseTime

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'all' || message.type === typeFilter
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter
    const matchesSource = sourceFilter === 'all' || message.source === sourceFilter
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesSource
  }).sort((a, b) => {
    const direction = sortOrder === 'asc' ? 1 : -1
    
    switch (sortBy) {
      case 'readAt':
        const aRead = a.readAt ? new Date(a.readAt).getTime() : 0
        const bRead = b.readAt ? new Date(b.readAt).getTime() : 0
        return direction * (aRead - bRead)
      case 'priority':
        const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
        return direction * (priorityOrder[a.priority] - priorityOrder[b.priority])
      default:
        return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900">Centro de Mensajes</h1>
            <p className="mt-1 text-sm lg:text-base text-secondary-600">
              Gestiona comunicaciones, soporte y notificaciones del sistema
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium ${
                  viewMode === 'table'
                    ? 'bg-primary-50 border-primary-500 text-primary-700 z-10'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Lista</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border-t border-r border-b text-sm font-medium ${
                  viewMode === 'cards'
                    ? 'bg-primary-50 border-primary-500 text-primary-700 z-10'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                } ${viewMode === 'table' ? 'border-l-0' : 'border-l'}`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Tarjetas</span>
              </button>
            </div>
            
            <button
              onClick={handleExportMessages}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 whitespace-nowrap min-w-0"
            >
              <Download className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Exportar</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Mensajes</dt>
                  <dd className="text-lg font-semibold text-gray-900">{totalMessages}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sin Leer</dt>
                  <dd className="text-lg font-semibold text-gray-900">{unreadCount}</dd>
                  <dd className="text-xs text-gray-500">{unreadPercentage}% del total</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                  <dd className="text-lg font-semibold text-gray-900">{pendingCount}</dd>
                  <dd className="text-xs text-gray-500">Soporte requerido</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Alta Prioridad</dt>
                  <dd className="text-lg font-semibold text-gray-900">{highPriorityCount}</dd>
                  <dd className="text-xs text-gray-500">Urgente/Alta</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-pink-600" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Formularios</dt>
                  <dd className="text-lg font-semibold text-gray-900">{formMessagesCount}</dd>
                  <dd className="text-xs text-gray-500">Nuevos contactos</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Buscar mensajes por contenido, remitente o asunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  showFilters
                    ? 'border-primary-500 text-primary-700 bg-primary-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Todos los tipos</option>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">Todas las prioridades</option>
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                >
                  <option value="all">Todos los orígenes</option>
                  {Object.entries(sourceConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field as any)
                    setSortOrder(order as any)
                  }}
                >
                  <option value="createdAt-desc">Fecha (más reciente)</option>
                  <option value="createdAt-asc">Fecha (más antigua)</option>
                  <option value="priority-desc">Prioridad (mayor)</option>
                  <option value="priority-asc">Prioridad (menor)</option>
                  <option value="readAt-desc">Último leído</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">
                {selectedMessages.length} mensaje(s) seleccionado(s)
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleBulkAction('read')}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Marcar como leído
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Archivar
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Table/Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMessages(filteredMessages.map(m => m.id))
                        } else {
                          setSelectedMessages([])
                        }
                      }}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remitente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asunto/Contenido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => {
                  const typeData = typeConfig[message.type] || typeConfig.TEXT
                  const TypeIcon = typeData.icon
                  return (
                    <tr 
                      key={message.id} 
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        message.status === 'UNREAD' ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedMessages.includes(message.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMessages([...selectedMessages, message.id])
                            } else {
                              setSelectedMessages(selectedMessages.filter(id => id !== message.id))
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{message.senderName}</div>
                            <div className="text-sm text-gray-500">{message.senderEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          {message.subject && (
                            <div className="text-sm font-medium text-gray-900 mb-1 truncate">{message.subject}</div>
                          )}
                          <div className="text-sm text-gray-600 line-clamp-2">{message.content}</div>
                          {message.hasAttachments && (
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <Paperclip className="h-3 w-3 mr-1" />
                              Archivos adjuntos
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeData.color}`}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {typeData.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[message.status].color}`}>
                          {statusConfig[message.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[message.priority].color}`}>
                          {priorityConfig[message.priority].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatDate(message.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewMessage(message)}
                            className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50 transition-colors"
                            title="Ver mensaje"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReplyMessage(message)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors"
                            title="Responder"
                          >
                            <Reply className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleArchive(message.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50 transition-colors"
                            title="Archivar"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay mensajes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all'
                  ? 'No se encontraron mensajes con los filtros aplicados.'
                  : 'Los mensajes aparecerán aquí cuando los usuarios se comuniquen.'
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        // Cards View
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMessages.map((message) => {
            const typeData = typeConfig[message.type] || typeConfig.TEXT
            const TypeIcon = typeData.icon
            return (
              <div 
                key={message.id} 
                className={`bg-white overflow-hidden shadow-sm rounded-lg border transition-all duration-200 hover:shadow-md ${
                  message.status === 'UNREAD' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeData.color}`}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeData.label}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[message.priority].color}`}>
                        {priorityConfig[message.priority].label}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={selectedMessages.includes(message.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMessages([...selectedMessages, message.id])
                        } else {
                          setSelectedMessages(selectedMessages.filter(id => id !== message.id))
                        }
                      }}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-900">{message.senderName}</h3>
                    <p className="text-sm text-gray-500">{message.senderEmail}</p>
                  </div>
                  
                  {message.subject && (
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{message.subject}</h4>
                  )}
                  
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{message.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[message.status].color}`}>
                        {statusConfig[message.status].label}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewMessage(message)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50 transition-colors"
                        title="Ver mensaje"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReplyMessage(message)}
                        className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors"
                        title="Responder"
                      >
                        <Reply className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(message.id)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50 transition-colors"
                        title="Archivar"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {message.hasAttachments && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Paperclip className="h-3 w-3 mr-1" />
                      Archivos adjuntos disponibles
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {filteredMessages.length === 0 && (
            <div className="col-span-full text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay mensajes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all'
                  ? 'No se encontraron mensajes con los filtros aplicados.'
                  : 'Los mensajes aparecerán aquí cuando los usuarios se comuniquen.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* View Message Modal */}
      {showViewModal && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedMessage.subject || 'Mensaje'}
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{selectedMessage.senderName}</div>
                    <div className="text-sm text-gray-500">{selectedMessage.senderEmail}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedMessage.createdAt)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig[selectedMessage.type].color}`}>
                    {typeConfig[selectedMessage.type].label}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedMessage.status].color}`}>
                    {statusConfig[selectedMessage.status].label}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[selectedMessage.priority].color}`}>
                    {priorityConfig[selectedMessage.priority].label}
                  </span>
                </div>
                
                <div className="text-gray-700 whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>
                
                {selectedMessage.hasAttachments && (
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <Paperclip className="h-4 w-4 mr-1" />
                    <span>Archivos adjuntos disponibles</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    handleReplyMessage(selectedMessage)
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Responder
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Responder a {selectedMessage.senderName}
                </h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Información del remitente */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-900">Email:</span>
                    <span className="ml-2 text-blue-700">{selectedMessage.senderEmail}</span>
                  </div>
                  {selectedMessage.senderPhone && (
                    <div>
                      <span className="font-medium text-blue-900">Teléfono:</span>
                      <span className="ml-2 text-blue-700">{selectedMessage.senderPhone}</span>
                    </div>
                  )}
                  {selectedMessage.senderCompany && (
                    <div>
                      <span className="font-medium text-blue-900">Empresa:</span>
                      <span className="ml-2 text-blue-700">{selectedMessage.senderCompany}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-blue-900">Origen:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${sourceConfig[selectedMessage.source].color}`}>
                      {sourceConfig[selectedMessage.source].label}
                    </span>
                  </div>
                </div>
                
                {/* Información específica para formularios de contacto */}
                {selectedMessage.source === 'CONTACT_FORM' && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      {selectedMessage.serviceRequested && (
                        <div>
                          <span className="font-medium text-blue-900">Servicio:</span>
                          <span className="ml-1 text-blue-700">{selectedMessage.serviceRequested}</span>
                        </div>
                      )}
                      {selectedMessage.budgetRange && (
                        <div>
                          <span className="font-medium text-blue-900">Presupuesto:</span>
                          <span className="ml-1 text-blue-700">{selectedMessage.budgetRange}</span>
                        </div>
                      )}
                      {selectedMessage.timelineRequested && (
                        <div>
                          <span className="font-medium text-blue-900">Plazo:</span>
                          <span className="ml-1 text-blue-700">{selectedMessage.timelineRequested}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Estado del usuario y recomendación automática */}
              <div className="mb-4 p-4 rounded-lg border">
                {selectedMessage.source === 'INTERNAL' ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="text-sm font-medium text-green-800">Usuario registrado</span>
                      <p className="text-xs text-green-600 mt-1">
                        Este usuario tiene cuenta activa. Recomendado: respuesta por chat interno + opción email.
                      </p>
                    </div>
                  </div>
                ) : selectedMessage.source === 'CONTACT_FORM' ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div>
                      <span className="text-sm font-medium text-orange-800">Formulario de contacto</span>
                      <p className="text-xs text-orange-600 mt-1">
                        Contacto desde formulario web. Recomendado: respuesta por email únicamente.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <span className="text-sm font-medium text-red-800">Usuario no registrado</span>
                      <p className="text-xs text-red-600 mt-1">
                        Email no está asociado a una cuenta. Recomendado: respuesta por email + invitación a registrarse.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">Mensaje original:</div>
                <div className="text-sm text-gray-700 max-h-32 overflow-y-auto">
                  {selectedMessage.content}
                </div>
              </div>

              {/* Método de respuesta */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de respuesta
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="responseMethod"
                      value="CHAT"
                      checked={responseMethod === 'CHAT'}
                      onChange={(e) => {
                        setResponseMethod(e.target.value as any)
                        setSendEmail(false)
                      }}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Chat Interno</div>
                      <div className="text-xs text-gray-500">Solo visible en el dashboard</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="responseMethod"
                      value="EMAIL"
                      checked={responseMethod === 'EMAIL'}
                      onChange={(e) => {
                        setResponseMethod(e.target.value as any)
                        setSendEmail(true)
                      }}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Solo Email</div>
                      <div className="text-xs text-gray-500">Respuesta por correo</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="responseMethod"
                      value="BOTH"
                      checked={responseMethod === 'BOTH'}
                      onChange={(e) => {
                        setResponseMethod(e.target.value as any)
                        setSendEmail(true)
                      }}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Ambos</div>
                      <div className="text-xs text-gray-500">Chat + Email</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tu respuesta
                  </label>
                  <button
                    type="button"
                    onClick={() => handleReplyMessage(selectedMessage)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors flex items-center space-x-1"
                  >
                    <Star className="h-3 w-3" />
                    <span>Regenerar respuesta automática</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder={
                    selectedMessage.source === 'CONTACT_FORM' 
                      ? `Respuesta automática cargada para ${selectedMessage.senderName}. Personaliza según sea necesario.`
                      : selectedMessage.source === 'INTERNAL'
                      ? `Respuesta para usuario registrado ${selectedMessage.senderName}. Edita el contenido.`
                      : "Escribe tu respuesta personalizada..."
                  }
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="mt-2 space-y-2">
                  {sendEmail && (
                    <div className="flex items-center text-blue-600 text-xs">
                      <Mail className="h-4 w-4 mr-1" />
                      Esta respuesta se enviará por email a {selectedMessage.senderEmail}
                    </div>
                  )}
                  {responseMethod === 'CHAT' && selectedMessage.source === 'INTERNAL' && (
                    <div className="flex items-center text-green-600 text-xs">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Se enviará como mensaje interno en el dashboard del usuario
                    </div>
                  )}
                  {responseMethod === 'BOTH' && (
                    <div className="flex items-center text-purple-600 text-xs">
                      <Star className="h-4 w-4 mr-1" />
                      Se enviará por chat interno Y por email
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Caracteres: {replyContent.length} | Palabras: {replyContent.split(' ').filter(w => w.length > 0).length}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  {selectedMessage.source === 'CONTACT_FORM' ? (
                    <div className="flex items-center text-orange-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Formulario de contacto: respuesta por email recomendada</span>
                    </div>
                  ) : selectedMessage.source === 'INTERNAL' ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Usuario registrado: múltiples opciones disponibles</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-blue-600">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>Usuario no registrado: email recomendado</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleReply(selectedMessage.id)}
                    disabled={!replyContent.trim()}
                    className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendEmail ? 'Enviar Respuesta' : 'Responder en Chat'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
