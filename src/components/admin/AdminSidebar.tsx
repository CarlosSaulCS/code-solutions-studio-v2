'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  BarChart3, FileText, Calendar, Users, MessageSquare, Settings,
  Home, LogOut, User, ChevronLeft, ChevronRight, Bell, 
  DollarSign, TrendingUp, Shield, Database
} from 'lucide-react'

interface AdminSidebarProps {
  selectedTab: string
  onTabChange: (tab: string) => void
}

interface BadgeCounts {
  pendingQuotes: number
  unreadMessages: number
  notifications: number
}

export default function AdminSidebar({ selectedTab, onTabChange }: AdminSidebarProps) {
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [badgeCounts, setBadgeCounts] = useState<BadgeCounts>({
    pendingQuotes: 0,
    unreadMessages: 0,
    notifications: 0
  })

  // Fetch real-time badge counts
  useEffect(() => {
    const fetchBadgeCounts = async () => {
      try {
        const response = await fetch('/api/admin/badge-counts')
        if (response.ok) {
          const data = await response.json()
          setBadgeCounts(data)
        }
      } catch (error) {
        console.error('Error fetching badge counts:', error)
        // Keep badges at 0 if there's an error
      }
    }

    // Fetch initially
    fetchBadgeCounts()

    // Refresh every 30 seconds
    const interval = setInterval(fetchBadgeCounts, 30000)

    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    {
      id: 'overview',
      label: 'Resumen',
      icon: BarChart3,
      description: 'Dashboard principal'
    },
    {
      id: 'quotes',
      label: 'Cotizaciones',
      icon: FileText,
      description: 'Gestionar cotizaciones',
      badge: badgeCounts.pendingQuotes > 0 ? badgeCounts.pendingQuotes.toString() : null
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: Calendar,
      description: 'Proyectos activos'
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      description: 'Gestión de usuarios'
    },
    {
      id: 'messages',
      label: 'Mensajes',
      icon: MessageSquare,
      description: 'Centro de mensajes',
      badge: badgeCounts.unreadMessages > 0 ? badgeCounts.unreadMessages.toString() : null
    },
    {
      id: 'finance',
      label: 'Finanzas',
      icon: DollarSign,
      description: 'Reportes financieros'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Análisis y reportes'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      description: 'Configuración del sistema'
    }
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-secondary-900">Admin Panel</h1>
                <p className="text-xs text-secondary-500">Code Solutions</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-secondary-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-secondary-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = selectedTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center p-3 rounded-lg transition-colors text-left
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 border-primary-200 border' 
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-secondary-500'}`} />
              
              {!isCollapsed && (
                <>
                  <div className="ml-3 flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-secondary-500 mt-0.5">{item.description}</div>
                  </div>
                  
                  {item.badge && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {isCollapsed && item.badge && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-secondary-200">
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4 mr-3" />
              <span className="text-sm">Ver Sitio Web</span>
            </Link>
            
            <Link
              href="/dashboard"
              className="flex items-center p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 mr-3" />
              <span className="text-sm">Mi Dashboard</span>
            </Link>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="p-4 border-t border-secondary-200">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-secondary-900">
                  {session?.user?.name || 'Administrador'}
                </div>
                <div className="text-xs text-secondary-500">{session?.user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1 text-secondary-400 hover:text-red-600 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <button
              onClick={handleSignOut}
              className="p-1 text-secondary-400 hover:text-red-600 transition-colors mx-auto"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
