'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Users, FileText, DollarSign, TrendingUp, Calendar, MessageSquare,
  AlertCircle, CheckCircle, Clock, BarChart3, Settings, Bell
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminKPIs from '@/components/admin/AdminKPIs'
import AdminActivityFeed from '@/components/admin/AdminActivityFeed'
import QuoteManagement from '@/components/admin/QuoteManagement'
import ProjectManagement from '@/components/admin/ProjectManagement'
import UserManagement from '@/components/admin/UserManagement'
import MessageCenter from '@/components/admin/MessageCenter'
import SystemSettings from '@/components/admin/SystemSettings'
import Analytics from '@/components/admin/Analytics'
import Finance from '@/components/admin/Finance'

interface DashboardStats {
  totalUsers: number
  totalQuotes: number
  totalProjects: number
  totalRevenue: number
  pendingQuotes: number
  activeProjects: number
  unreadMessages: number
  conversionRate: number
  monthlyGrowth: number
}

interface RecentActivity {
  id: string
  type: 'quote' | 'project' | 'user' | 'message'
  title: string
  description: string
  timestamp: string
  status?: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
  }, [session, status, router])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          fetch('/api/admin/analytics'),
          fetch('/api/admin/activities')
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.data)
        }

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json()
          setActivities(activitiesData.data || [])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === 'ADMIN') {
      fetchDashboardData()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 text-xl font-semibold text-secondary-900">Acceso No Autorizado</h1>
          <p className="mt-2 text-secondary-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: BarChart3 },
    { id: 'quotes', name: 'Cotizaciones', icon: FileText },
    { id: 'projects', name: 'Proyectos', icon: Calendar },
    { id: 'users', name: 'Usuarios', icon: Users },
    { id: 'messages', name: 'Mensajes', icon: MessageSquare },
    { id: 'settings', name: 'Configuración', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="flex">
        <AdminSidebar selectedTab={selectedTab} onTabChange={setSelectedTab} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary-50">
            <div className="container mx-auto px-6 py-8">
              {selectedTab === 'overview' && (
                <>
                  {/* Dashboard Header */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-secondary-900">Dashboard Administrativo</h1>
                    <p className="mt-2 text-secondary-600">
                      Gestiona usuarios, cotizaciones, proyectos y configuración del sistema.
                    </p>
                  </div>

                  {/* KPIs */}
                  <AdminKPIs stats={stats} />

                  {/* Activity Feed and Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                      <AdminActivityFeed activities={activities} />
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                            Acciones Rápidas
                          </h3>
                          <div className="space-y-3">
                            <button
                              onClick={() => setSelectedTab('quotes')}
                              className="w-full flex items-center p-3 text-left border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                            >
                              <FileText className="h-5 w-5 text-primary-600 mr-3" />
                              <div>
                                <div className="font-medium text-secondary-900">Revisar Cotizaciones</div>
                                <div className="text-sm text-secondary-500">
                                  {stats?.pendingQuotes || 0} pendientes
                                </div>
                              </div>
                            </button>

                            <button
                              onClick={() => setSelectedTab('projects')}
                              className="w-full flex items-center p-3 text-left border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                            >
                              <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                              <div>
                                <div className="font-medium text-secondary-900">Gestionar Proyectos</div>
                                <div className="text-sm text-secondary-500">
                                  {stats?.activeProjects || 0} activos
                                </div>
                              </div>
                            </button>

                            <button
                              onClick={() => setSelectedTab('messages')}
                              className="w-full flex items-center p-3 text-left border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                            >
                              <MessageSquare className="h-5 w-5 text-green-600 mr-3" />
                              <div>
                                <div className="font-medium text-secondary-900">Mensajes</div>
                                <div className="text-sm text-secondary-500">
                                  {stats?.unreadMessages || 0} sin leer
                                </div>
                              </div>
                            </button>

                            <button
                              onClick={() => setSelectedTab('users')}
                              className="w-full flex items-center p-3 text-left border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                            >
                              <Users className="h-5 w-5 text-purple-600 mr-3" />
                              <div>
                                <div className="font-medium text-secondary-900">Gestionar Usuarios</div>
                                <div className="text-sm text-secondary-500">
                                  {stats?.totalUsers || 0} registrados
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === 'quotes' && (
                <QuoteManagement />
              )}

              {selectedTab === 'projects' && (
                <ProjectManagement />
              )}

              {selectedTab === 'users' && (
                <UserManagement />
              )}

              {selectedTab === 'messages' && (
                <MessageCenter />
              )}

              {selectedTab === 'settings' && (
                <SystemSettings />
              )}

              {selectedTab === 'analytics' && (
                <Analytics />
              )}

              {selectedTab === 'finance' && (
                <Finance />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
