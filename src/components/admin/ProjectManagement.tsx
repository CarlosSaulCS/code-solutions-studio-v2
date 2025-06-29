'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Clock, DollarSign, User, AlertCircle, CheckCircle,
  Edit3, Trash2, Eye, Filter, Search, Download, Plus,
  Calendar as CalendarIcon, ChevronDown, ChevronUp, MoreHorizontal,
  Grid3X3, List
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  clientName: string
  clientEmail: string
  status: 'QUOTE_RECEIVED' | 'QUOTE_APPROVED' | 'PLANNING' | 'DEVELOPMENT' | 'TESTING' | 'REVIEW' | 'DELIVERY' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  budget: number
  startDate: string
  endDate: string
  progress: number
  teamMembers: string[]
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  QUOTE_RECEIVED: { label: 'Cotización Recibida', color: 'bg-gray-100 text-gray-800', icon: Clock },
  QUOTE_APPROVED: { label: 'Cotización Aprobada', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  PLANNING: { label: 'Planificación', color: 'bg-yellow-100 text-yellow-800', icon: Calendar },
  DEVELOPMENT: { label: 'Desarrollo', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  TESTING: { label: 'Pruebas', color: 'bg-purple-100 text-purple-800', icon: Eye },
  REVIEW: { label: 'Revisión', color: 'bg-orange-100 text-orange-800', icon: Eye },
  DELIVERY: { label: 'Entrega', color: 'bg-indigo-100 text-indigo-800', icon: Calendar },
  COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  ON_HOLD: { label: 'En Pausa', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

const priorityConfig = {
  LOW: { label: 'Baja', color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  HIGH: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: 'Urgente', color: 'bg-red-100 text-red-800' }
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'createdAt' | 'endDate' | 'budget' | 'progress'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  
  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  
  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    clientName: '',
    clientEmail: '',
    status: 'PLANNING' as Project['status'],
    priority: 'MEDIUM' as Project['priority'],
    budget: 0,
    startDate: '',
    endDate: '',
    progress: 0
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data.data || data.projects || [])
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        
        // Si no está autorizado, redirigir al login
        if (response.status === 401) {
          window.location.href = '/auth/login'
          return
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return
    
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleViewProject = (project: Project) => {
    setViewingProject(project)
    setShowViewModal(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      description: project.description,
      clientName: project.clientName,
      clientEmail: project.clientEmail,
      status: project.status,
      priority: project.priority,
      budget: project.budget,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate.split('T')[0],
      progress: project.progress
    })
    setShowProjectModal(true)
  }

  const handleNewProject = () => {
    setEditingProject(null)
    setProjectForm({
      title: '',
      description: '',
      clientName: '',
      clientEmail: '',
      status: 'PLANNING',
      priority: 'MEDIUM',
      budget: 0,
      startDate: '',
      endDate: '',
      progress: 0
    })
    setShowProjectModal(true)
  }

  const handleSaveProject = async () => {
    try {
      const method = editingProject ? 'PUT' : 'POST'
      const url = editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm)
      })
      
      if (response.ok) {
        setShowProjectModal(false)
        fetchProjects()
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleExportProjects = () => {
    const csvContent = generateCSV(filteredProjects)
    downloadCSV(csvContent, 'proyectos.csv')
  }

  const generateCSV = (data: Project[]) => {
    const headers = ['Título', 'Cliente', 'Estado', 'Prioridad', 'Presupuesto', 'Progreso', 'Fecha Inicio', 'Fecha Fin']
    const rows = data.map(project => [
      project.title,
      project.clientName,
      statusConfig[project.status]?.label || project.status,
      priorityConfig[project.priority]?.label || project.priority,
      project.budget,
      `${project.progress}%`,
      formatDate(project.startDate),
      formatDate(project.endDate)
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  }).sort((a, b) => {
    const direction = sortOrder === 'asc' ? 1 : -1
    
    switch (sortBy) {
      case 'endDate':
        return direction * (new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      case 'budget':
        return direction * (a.budget - b.budget)
      case 'progress':
        return direction * (a.progress - b.progress)
      default:
        return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleBulkAction = async (action: string) => {
    if (selectedProjects.length === 0) return
    
    try {
      const response = await fetch('/api/admin/projects/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectIds: selectedProjects, 
          action 
        })
      })
      
      if (response.ok) {
        setSelectedProjects([])
        fetchProjects()
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Gestión de Proyectos</h1>
          <p className="mt-2 text-secondary-600">
            Administra y supervisa todos los proyectos del sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium ${
                viewMode === 'table'
                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
              title="Vista de tabla"
            >
              <List className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Tabla</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`relative inline-flex items-center px-3 py-2 rounded-r-md border-t border-r border-b text-sm font-medium ${
                viewMode === 'cards'
                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
              title="Vista de tarjetas"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Tarjetas</span>
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleExportProjects}
              className="inline-flex items-center px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exportar</span>
              <span className="sm:hidden">Excel</span>
            </button>
            <button 
              onClick={handleNewProject}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nuevo Proyecto</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Proyectos</dt>
                  <dd className="text-lg font-medium text-gray-900">{projects.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completados</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {projects.filter(p => p.status === 'COMPLETED').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En Progreso</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {projects.filter(p => ['DEVELOPMENT', 'TESTING', 'REVIEW'].includes(p.status)).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Valor Total</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
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
                <label className="block text-sm font-medium text-gray-700">Prioridad</label>
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
                <label className="block text-sm font-medium text-gray-700">Ordenar por</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field as any)
                    setSortOrder(order as any)
                  }}
                >
                  <option value="createdAt-desc">Fecha de creación (más reciente)</option>
                  <option value="createdAt-asc">Fecha de creación (más antigua)</option>
                  <option value="endDate-asc">Fecha de entrega (próxima)</option>
                  <option value="endDate-desc">Fecha de entrega (lejana)</option>
                  <option value="budget-desc">Presupuesto (mayor)</option>
                  <option value="budget-asc">Presupuesto (menor)</option>
                  <option value="progress-desc">Progreso (mayor)</option>
                  <option value="progress-asc">Progreso (menor)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {selectedProjects.length} proyecto(s) seleccionado(s)
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Archivar
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Display */}
      {viewMode === 'table' ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects(filteredProjects.map(p => p.id))
                        } else {
                          setSelectedProjects([])
                        }
                      }}
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                    Proyecto
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Cliente
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Progreso
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Presupuesto
                  </th>
                  <th className="relative px-3 py-3 w-24">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => {
                  const statusInfo = statusConfig[project.status] || statusConfig.PLANNING
                  const priorityInfo = priorityConfig[project.priority] || priorityConfig.MEDIUM
                  const StatusIcon = statusInfo.icon
                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-2 py-2 whitespace-nowrap w-8">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedProjects.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProjects([...selectedProjects, project.id])
                            } else {
                              setSelectedProjects(selectedProjects.filter(id => id !== project.id))
                            }
                          }}
                        />
                      </td>
                      <td className="px-3 py-2 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[160px] lg:max-w-[240px]" title={project.title}>
                          {project.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[160px] lg:max-w-[240px]" title={project.description}>
                          {project.description}
                        </div>
                        {/* Información extra en móvil */}
                        <div className="lg:hidden mt-1 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="text-gray-500 flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              Cliente
                            </div>
                            <span className="text-gray-900 font-medium truncate max-w-[120px]" title={project.clientName}>
                              {project.clientName}
                            </span>
                          </div>
                          <div className="md:hidden flex items-center justify-between text-xs">
                            <div className="text-gray-500">Presupuesto</div>
                            <div className="text-gray-900 font-medium">
                              {formatCurrency(project.budget)}
                            </div>
                          </div>
                          <div className="md:hidden flex items-center justify-between text-xs">
                            <div className="text-gray-500">Progreso</div>
                            <div className="flex items-center space-x-1">
                              <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-primary-600 h-1.5 rounded-full" 
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{project.progress}%</span>
                            </div>
                          </div>
                          <div className="sm:hidden flex items-center justify-between text-xs">
                            <div className="text-gray-500">Entrega</div>
                            <div className="text-gray-900 font-medium">{formatDate(project.endDate)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 hidden lg:table-cell">
                        <div className="text-sm text-gray-900 truncate max-w-[140px]" title={project.clientName}>
                          {project.clientName}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[140px]" title={project.clientEmail}>
                          {project.clientEmail}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`} title={statusInfo.label}>
                          <StatusIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="hidden xl:inline">{statusInfo.label}</span>
                          <span className="xl:hidden">{statusInfo.label.length > 8 ? statusInfo.label.substring(0, 8) + '...' : statusInfo.label}</span>
                        </span>
                        {/* Prioridad en móvil */}
                        <div className="mt-1 lg:hidden">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${priorityInfo.color}`}>
                            {priorityInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">{project.progress}%</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        <div className="font-medium">{formatCurrency(project.budget)}</div>
                        <div className="text-xs text-gray-500">{formatDate(project.endDate)}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            onClick={() => handleViewProject(project)}
                            className="text-primary-600 hover:text-primary-900 p-1" 
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditProject(project)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 hidden sm:inline-block" 
                            title="Editar"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-900 p-1 hidden sm:inline-block"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="sm:hidden relative">
                            <button className="text-gray-400 hover:text-gray-600 p-1" title="Más opciones">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'No se encontraron proyectos con los filtros aplicados.'
                  : 'Comienza creando un nuevo proyecto.'
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const statusInfo = statusConfig[project.status] || statusConfig.PLANNING
            const StatusIcon = statusInfo.icon
            return (
              <div key={project.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate" title={project.title}>
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 truncate" title={project.description}>
                        {project.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ml-3"
                      checked={selectedProjects.includes(project.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects([...selectedProjects, project.id])
                        } else {
                          setSelectedProjects(selectedProjects.filter(id => id !== project.id))
                        }
                      }}
                    />
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span className="truncate">{project.clientName}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>Progreso</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{formatCurrency(project.budget)}</div>
                      <div>{formatDate(project.endDate)}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewProject(project)}
                        className="text-primary-600 hover:text-primary-900 p-1" 
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditProject(project)}
                        className="text-yellow-600 hover:text-yellow-900 p-1" 
                        title="Editar"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'No se encontraron proyectos con los filtros aplicados.'
                  : 'Comienza creando un nuevo proyecto.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear/editar proyecto */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h3>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <input
                    type="text"
                    value={projectForm.clientName}
                    onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email del Cliente</label>
                  <input
                    type="email"
                    value={projectForm.clientEmail}
                    onChange={(e) => setProjectForm({ ...projectForm, clientEmail: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as Project['status'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value as Project['priority'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Presupuesto</label>
                  <input
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({ ...projectForm, budget: parseFloat(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
                  <input
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Progreso (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={projectForm.progress}
                    onChange={(e) => setProjectForm({ ...projectForm, progress: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProject}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                {editingProject ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles del proyecto */}
      {showViewModal && viewingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detalles del Proyecto</h3>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <p className="mt-1 text-sm text-gray-900">{viewingProject.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <p className="mt-1 text-sm text-gray-900">{viewingProject.clientName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{viewingProject.clientEmail}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[viewingProject.status]?.color}`}>
                    {statusConfig[viewingProject.status]?.label}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[viewingProject.priority]?.color}`}>
                    {priorityConfig[viewingProject.priority]?.label}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Presupuesto</label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{formatCurrency(viewingProject.budget)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(viewingProject.startDate)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(viewingProject.endDate)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Progreso</label>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${viewingProject.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{viewingProject.progress}%</span>
                </div>
              </div>
              
              {viewingProject.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <p className="mt-1 text-sm text-gray-900">{viewingProject.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Creado</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(viewingProject.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Última Actualización</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(viewingProject.updatedAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  handleEditProject(viewingProject)
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
