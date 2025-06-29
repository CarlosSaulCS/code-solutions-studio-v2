'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/app/providers'
import { useCurrency } from '@/app/providers'
import { 
  User, Mail, Phone, Building, Calendar, FileText, 
  Clock, CheckCircle2, AlertCircle, TrendingUp, 
  MessageSquare, Download, Star, Settings, Bell,
  DollarSign, Package, Eye, Trash2, MoreVertical,
  Filter, Search, Plus, RefreshCw, Grid3X3,
  Activity, BarChart3, Users, Target
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ToastContainer'
import ChatComponent from '@/components/ChatComponent'
import DashboardStatsGrid from '@/components/DashboardStatsGrid'
import ProjectsOverview from '@/components/ProjectsOverview'
import RecentActivities from '@/components/RecentActivities'
import ProjectTimeline from '@/components/ProjectTimeline'

interface Quote {
  id: string
  serviceType: string
  packageType: string
  selectedAddons: string | null
  basePrice: number
  addonsPrice: number
  totalPrice: number
  currency: string
  timeline: number
  status: string
  notes: string | null
  adminNotes: string | null
  validUntil: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
    company: string | null
  }
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  actionUrl: string | null
  createdAt: string
}

interface Project {
  id: string
  quoteId?: string
  userId: string
  title: string
  description?: string
  serviceType: string
  packageType: string
  status: string
  progress: number
  budget: number
  startDate?: string
  estimatedEndDate?: string
  actualEndDate?: string
  statusNotes?: string
  createdAt: string
  updatedAt: string
  user?: {
    name: string | null
    email: string
  }
  quote?: {
    serviceType: string
    packageType: string
    totalPrice: number
    currency: string
  }
}

interface DashboardData {
  quotes: Quote[]
  notifications: Notification[]
  projects: Project[]
  unreadCount: number
}

const formatPrice = (price: number, targetCurrency: string) => {
  if (targetCurrency === 'USD') {
    // Convert MXN to USD (using approximate rate)
    const usdPrice = price / 20; // Approximate MXN to USD conversion
    return usdPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }
  return price.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const { t, language } = useLanguage()
  const { currency } = useCurrency()
  const router = useRouter()
  const { success, error: showError } = useToast()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    quotes: [],
    notifications: [],
    projects: [],
    unreadCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  // Generate dashboard statistics
  const generateDashboardStats = useCallback(() => {
    // Ensure arrays exist before using array methods
    const quotes = Array.isArray(dashboardData.quotes) ? dashboardData.quotes : []
    const projects = Array.isArray(dashboardData.projects) ? dashboardData.projects : []
    
    const totalQuotes = quotes.length
    const approvedQuotes = quotes.filter(q => q.status === 'APPROVED').length
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length
    const activeProjects = projects.filter(p => 
      !['COMPLETED', 'CANCELLED'].includes(p.status)
    ).length
    const pendingQuotes = quotes.filter(q => q.status === 'PENDING').length
    
    const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0)
    
    // Calculate average project duration
    const completedProjectsWithDates = projects.filter(p => 
      p.status === 'COMPLETED' && p.startDate && p.actualEndDate
    )
    
    const averageProjectDuration = completedProjectsWithDates.length > 0
      ? Math.round(
          completedProjectsWithDates.reduce((sum, project) => {
            const start = new Date(project.startDate!)
            const end = new Date(project.actualEndDate!)
            const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
            return sum + duration
          }, 0) / completedProjectsWithDates.length
        )
      : 0

    return {
      totalQuotes,
      approvedQuotes,
      totalProjects,
      completedProjects,
      totalBudget,
      averageProjectDuration,
      activeProjects,
      pendingQuotes
    }
  }, [dashboardData])

  // Utility functions for data formatting
  const getServiceName = useCallback((serviceType: string) => {
    const services: Record<string, string> = {
      WEB: language === 'es' ? 'Desarrollo Web' : 'Web Development',
      MOBILE: language === 'es' ? 'Apps Móviles' : 'Mobile Apps',
      ECOMMERCE: language === 'es' ? 'E-commerce' : 'E-commerce',
      CLOUD: language === 'es' ? 'Migración a la Nube' : 'Cloud Migration',
      AI: language === 'es' ? 'Inteligencia Artificial' : 'Artificial Intelligence',
      CONSULTING: language === 'es' ? 'Consultoría TI' : 'IT Consulting'
    }
    return services[serviceType] || serviceType
  }, [language])

  const getPackageName = useCallback((packageType: string) => {
    const packages: Record<string, string> = {
      STARTUP: 'Startup',
      BUSINESS: 'Business',
      ENTERPRISE: 'Enterprise',
      CUSTOM: language === 'es' ? 'Personalizado' : 'Custom'
    }
    return packages[packageType] || packageType
  }, [language])

  const getStatusColor = useCallback((status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'text-yellow-700 bg-yellow-100 border-yellow-200',
      APPROVED: 'text-green-700 bg-green-100 border-green-200',
      REJECTED: 'text-red-700 bg-red-100 border-red-200',
      EXPIRED: 'text-gray-700 bg-gray-100 border-gray-200',
      CONVERTED: 'text-blue-700 bg-blue-100 border-blue-200'
    }
    return colors[status] || 'text-gray-700 bg-gray-100 border-gray-200'
  }, [])

  const getStatusText = useCallback((status: string) => {
    const statusTexts: Record<string, string> = {
      PENDING: language === 'es' ? 'Pendiente' : 'Pending',
      APPROVED: language === 'es' ? 'Aprobada' : 'Approved', 
      REJECTED: language === 'es' ? 'Rechazada' : 'Rejected',
      EXPIRED: language === 'es' ? 'Expirada' : 'Expired',
      CONVERTED: language === 'es' ? 'Convertida' : 'Converted',
      QUOTE_RECEIVED: language === 'es' ? 'Cotización Recibida' : 'Quote Received',
      QUOTE_APPROVED: language === 'es' ? 'Cotización Aprobada' : 'Quote Approved',
      PLANNING: language === 'es' ? 'Planificación' : 'Planning',
      DEVELOPMENT: language === 'es' ? 'En Desarrollo' : 'In Development',
      TESTING: language === 'es' ? 'Pruebas' : 'Testing',
      REVIEW: language === 'es' ? 'Revisión' : 'Review',
      DELIVERY: language === 'es' ? 'Entrega' : 'Delivery',
      COMPLETED: language === 'es' ? 'Completado' : 'Completed',
      ON_HOLD: language === 'es' ? 'En Pausa' : 'On Hold',
      CANCELLED: language === 'es' ? 'Cancelado' : 'Cancelled'
    }
    return statusTexts[status] || status
  }, [language])

  // Generate recent activities
  const generateRecentActivities = useCallback(() => {
    const activities: any[] = []

    // Ensure arrays exist before using array methods
    const quotes = Array.isArray(dashboardData.quotes) ? dashboardData.quotes : []
    const projects = Array.isArray(dashboardData.projects) ? dashboardData.projects : []

    // Add quote activities
    quotes.forEach(quote => {
      activities.push({
        id: `quote-${quote.id}`,
        type: quote.status === 'APPROVED' ? 'quote_approved' : 'quote_received',
        title: language === 'es' 
          ? `${quote.status === 'APPROVED' ? 'Cotización aprobada' : 'Nueva cotización recibida'}`
          : `${quote.status === 'APPROVED' ? 'Quote approved' : 'New quote received'}`,
        description: `${getServiceName(quote.serviceType)} - ${getPackageName(quote.packageType)}`,
        date: quote.updatedAt,
        metadata: {
          amount: quote.totalPrice,
          currency: quote.currency
        }
      })
    })

    // Add project activities
    projects.forEach(project => {
      activities.push({
        id: `project-${project.id}`,
        type: 'project_update',
        title: language === 'es' 
          ? `Actualización del proyecto: ${project.title}`
          : `Project update: ${project.title}`,
        description: language === 'es'
          ? `Estado: ${getStatusText(project.status)}`
          : `Status: ${getStatusText(project.status)}`,
        date: project.updatedAt,
        projectId: project.id,
        projectName: project.title,
        metadata: {
          status: project.status
        }
      })

      // Add milestone activities for completed phases
      if (project.progress >= 25) {
        activities.push({
          id: `milestone-planning-${project.id}`,
          type: 'milestone',
          title: language === 'es' ? 'Hito completado: Planificación' : 'Milestone completed: Planning',
          description: language === 'es' 
            ? `Fase de planificación completada para ${project.title}`
            : `Planning phase completed for ${project.title}`,
          date: project.updatedAt,
          projectId: project.id,
          projectName: project.title
        })
      }

      if (project.progress >= 50) {
        activities.push({
          id: `milestone-development-${project.id}`,
          type: 'milestone',
          title: language === 'es' ? 'Hito completado: Desarrollo' : 'Milestone completed: Development',
          description: language === 'es' 
            ? `Fase de desarrollo completada para ${project.title}`
            : `Development phase completed for ${project.title}`,
          date: project.updatedAt,
          projectId: project.id,
          projectName: project.title
        })
      }

      if (project.progress >= 100) {
        activities.push({
          id: `milestone-completion-${project.id}`,
          type: 'milestone',
          title: language === 'es' ? 'Proyecto completado' : 'Project completed',
          description: language === 'es' 
            ? `${project.title} ha sido completado exitosamente`
            : `${project.title} has been completed successfully`,
          date: project.actualEndDate || project.updatedAt,
          projectId: project.id,
          projectName: project.title
        })
      }
    })

    // Sort by date (most recent first) and return top 20
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20)
  }, [dashboardData, language, getServiceName, getPackageName, getStatusText])

  const loadDashboardData = useCallback(async () => {
    if (!session?.user?.email) {
      return
    }

    try {
      setIsLoading(true)
      
      // Load quotes with proper error handling
      const quotesResponse = await fetch('/api/quotes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies for session
      })
      
      // Load notifications with proper error handling
      const notificationsResponse = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      // Load projects with proper error handling
      const projectsResponse = await fetch('/api/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      // Check if requests were successful
      if (!quotesResponse.ok) {
        console.error('Quotes API error:', quotesResponse.status, quotesResponse.statusText)
      }
      
      if (!notificationsResponse.ok) {
        console.error('Notifications API error:', notificationsResponse.status, notificationsResponse.statusText)
      }
      
      if (!projectsResponse.ok) {
        console.error('Projects API error:', projectsResponse.status, projectsResponse.statusText)
      }
      
      // Only process responses that were successful
      const quotesData = quotesResponse.ok ? await quotesResponse.json() : { success: false, data: [] }
      const notificationsData = notificationsResponse.ok ? await notificationsResponse.json() : { success: false, data: { notifications: [], unreadCount: 0 } }
      const projectsData = projectsResponse.ok ? await projectsResponse.json() : { success: false, data: [] }
      
      // Set data with fallbacks for failed requests
      const newData = {
        quotes: quotesData.success ? (quotesData.data?.quotes || quotesData.data || []) : [],
        notifications: notificationsData.success ? (notificationsData.data.notifications || []) : [],
        projects: projectsData.success ? (projectsData.data || []) : [],
        unreadCount: notificationsData.success ? (notificationsData.data.unreadCount || 0) : 0
      }
      
      setDashboardData(newData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      showError('Error', 'No se pudo cargar la información del dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.email, showError])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }

    loadDashboardData()
  }, [session, status, router, loadDashboardData])

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'markAsRead',
          notificationId
        })
      })

      if (response.ok) {
        setDashboardData(prev => ({
          ...prev,
          notifications: prev.notifications.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, prev.unreadCount - 1)
        }))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'markAsRead'
        })
      })

      if (response.ok) {
        setDashboardData(prev => ({
          ...prev,
          notifications: prev.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }))
        success(language === 'es' ? 'Éxito' : 'Success', language === 'es' ? 'Todas las notificaciones marcadas como leídas' : 'All notifications marked as read')
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          notificationId
        })
      })

      if (response.ok) {
        setDashboardData(prev => ({
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== notificationId),
          unreadCount: prev.notifications.find(n => n.id === notificationId && !n.read) 
            ? prev.unreadCount - 1 
            : prev.unreadCount
        }))
        success(language === 'es' ? 'Éxito' : 'Success', language === 'es' ? 'Notificación eliminada' : 'Notification deleted')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" text={language === 'es' ? 'Cargando dashboard...' : 'Loading dashboard...'} />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const stats = generateDashboardStats()
  const activities = generateRecentActivities()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'es' ? `¡Bienvenido, ${session.user?.name || 'Usuario'}!` : `Welcome, ${session.user?.name || 'User'}!`}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'es' 
                  ? 'Aquí tienes un resumen de tus proyectos y actividad'
                  : 'Here\'s an overview of your projects and activity'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={loadDashboardData}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                {language === 'es' ? 'Actualizar' : 'Refresh'}
              </button>
              
              <button
                onClick={() => router.push('/quoter')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {language === 'es' ? 'Nueva Cotización' : 'New Quote'}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStatsGrid
            stats={stats}
            currency={currency}
            language={language as 'es' | 'en'}
            formatPrice={formatPrice}
          />
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  {language === 'es' ? 'Resumen' : 'Overview'}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {language === 'es' ? 'Mis Proyectos' : 'My Projects'} ({dashboardData.projects.length})
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('quotes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'quotes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {language === 'es' ? 'Cotizaciones' : 'Quotes'} ({dashboardData.quotes.length})
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'activity'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  {language === 'es' ? 'Actividad' : 'Activity'}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm relative transition-colors whitespace-nowrap ${
                  activeTab === 'notifications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  {language === 'es' ? 'Notificaciones' : 'Notifications'} ({dashboardData.notifications.length})
                  {dashboardData.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {dashboardData.unreadCount}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'chat'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {language === 'es' ? 'Chat' : 'Chat'}
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {dashboardData.projects.length === 0 && dashboardData.quotes.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {language === 'es' ? '¡Bienvenido a Code Solutions Studio!' : 'Welcome to Code Solutions Studio!'}
                    </h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {language === 'es' 
                        ? 'Comienza tu viaje digital con nosotros. Solicita tu primera cotización y descubre cómo podemos ayudarte a hacer realidad tus ideas.'
                        : 'Start your digital journey with us. Request your first quote and discover how we can help bring your ideas to life.'
                      }
                    </p>
                    <button
                      onClick={() => router.push('/quoter')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      {language === 'es' ? 'Solicitar Cotización' : 'Request Quote'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Projects Overview */}
                    <div className="xl:col-span-2">
                      <ProjectsOverview
                        projects={dashboardData.projects.slice(0, 6)}
                        language={language as 'es' | 'en'}
                        currency={currency}
                        formatPrice={formatPrice}
                      />
                    </div>
                    
                    {/* Recent Activities */}
                    <div>
                      <RecentActivities
                        activities={activities.slice(0, 8)}
                        language={language as 'es' | 'en'}
                        maxItems={8}
                        showFilters={false}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <ProjectsOverview
                  projects={dashboardData.projects}
                  language={language as 'es' | 'en'}
                  currency={currency}
                  formatPrice={formatPrice}
                />
              </div>
            )}

            {activeTab === 'quotes' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {language === 'es' ? 'Mis Cotizaciones' : 'My Quotes'}
                  </h3>
                  
                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">{language === 'es' ? 'Todos los estados' : 'All statuses'}</option>
                      <option value="PENDING">{getStatusText('PENDING')}</option>
                      <option value="APPROVED">{getStatusText('APPROVED')}</option>
                      <option value="REJECTED">{getStatusText('REJECTED')}</option>
                      <option value="EXPIRED">{getStatusText('EXPIRED')}</option>
                    </select>
                    
                    <button
                      onClick={() => router.push('/quoter')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      {language === 'es' ? 'Nueva Cotización' : 'New Quote'}
                    </button>
                  </div>
                </div>

                {dashboardData.quotes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {language === 'es' ? 'No tienes cotizaciones' : 'No quotes yet'}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {language === 'es' 
                        ? 'Solicita tu primera cotización para comenzar'
                        : 'Request your first quote to get started'
                      }
                    </p>
                    <button
                      onClick={() => router.push('/quoter')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {language === 'es' ? 'Solicitar Cotización' : 'Request Quote'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dashboardData.quotes
                      .filter(quote => filterStatus === 'all' || quote.status === filterStatus)
                      .map((quote) => (
                        <div key={quote.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                {getServiceName(quote.serviceType)}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {getPackageName(quote.packageType)}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(quote.status)}`}>
                              {getStatusText(quote.status)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <span className="text-gray-500">{language === 'es' ? 'Precio:' : 'Price:'}</span>
                              <div className="font-semibold text-lg text-green-600">
                                {quote.currency} {formatPrice(quote.totalPrice, quote.currency)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">{language === 'es' ? 'Tiempo:' : 'Timeline:'}</span>
                              <div className="font-medium">
                                {quote.timeline} {language === 'es' ? 'días' : 'days'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>{language === 'es' ? 'Creada:' : 'Created:'}</span>
                              <span>{new Date(quote.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{language === 'es' ? 'Válida hasta:' : 'Valid until:'}</span>
                              <span>{new Date(quote.validUntil).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}</span>
                            </div>
                          </div>
                          
                          {quote.notes && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">{quote.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <RecentActivities
                  activities={activities}
                  language={language as 'es' | 'en'}
                  maxItems={15}
                  showFilters={true}
                />
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {language === 'es' ? 'Notificaciones' : 'Notifications'}
                  </h3>
                  
                  {dashboardData.notifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="flex items-center px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors mt-4 md:mt-0"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {language === 'es' ? 'Marcar todas como leídas' : 'Mark all as read'}
                    </button>
                  )}
                </div>

                {dashboardData.notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {language === 'es' ? 'No tienes notificaciones' : 'No notifications'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'es' ? 'Te notificaremos sobre actualizaciones importantes.' : 'We\'ll notify you about important updates.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.notifications.map((notification) => (
                      <div key={notification.id} className={`border rounded-lg p-4 transition-colors ${
                        notification.read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              <Bell className={`w-5 h-5 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {notification.title}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(notification.createdAt).toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title={language === 'es' ? 'Marcar como leída' : 'Mark as read'}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title={language === 'es' ? 'Eliminar' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div>
                <ChatComponent />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  )
}


