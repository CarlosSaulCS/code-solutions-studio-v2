'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, Filter, Search, Eye, CheckCircle, XCircle, 
  Clock, DollarSign, User, Calendar, ChevronDown, MoreVertical,
  ArrowUpDown, Download, RefreshCw, Edit2, Trash2, Plus, ExternalLink
} from 'lucide-react'

interface Quote {
  id: string
  serviceType: string
  packageType: string
  totalPrice: number
  currency: string
  status: string
  createdAt: string
  validUntil: string
  notes?: string
  adminNotes?: string
  timeline: number
  user: {
    name: string
    email: string
    company?: string
    phone?: string
  }
  project?: {
    id: string
    title: string
    status: string
  }
}

export default function QuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Form state for editing/creating quotes
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    serviceType: 'WEB',
    packageType: 'BASIC',
    totalPrice: 0,
    currency: 'MXN',
    timeline: 30,
    status: 'PENDING',
    notes: '',
    adminNotes: '',
    validUntil: ''
  })

  // Fetch quotes
  const fetchQuotes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/quotes')
      if (response.ok) {
        const data = await response.json()
        setQuotes(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  const statusOptions = [
    { value: 'all', label: 'Todos los estados', count: quotes.length },
    { value: 'PENDING', label: 'Pendientes', count: quotes.filter(q => q.status === 'PENDING').length },
    { value: 'APPROVED', label: 'Aprobadas', count: quotes.filter(q => q.status === 'APPROVED').length },
    { value: 'REJECTED', label: 'Rechazadas', count: quotes.filter(q => q.status === 'REJECTED').length },
    { value: 'EXPIRED', label: 'Expiradas', count: quotes.filter(q => q.status === 'EXPIRED').length },
    { value: 'CONVERTED', label: 'Convertidas', count: quotes.filter(q => q.status === 'CONVERTED').length }
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-gray-100 text-gray-800',
      CONVERTED: 'bg-blue-100 text-blue-800'
    }
    
    const labels = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobada',
      REJECTED: 'Rechazada',
      EXPIRED: 'Expirada',
      CONVERTED: 'Convertida'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.PENDING}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchQuotes() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating quote status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote)
    setShowViewModal(true)
  }

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote)
    setFormData({
      clientName: quote.user.name || '',
      clientEmail: quote.user.email || '',
      clientPhone: quote.user.phone || '',
      clientCompany: quote.user.company || '',
      serviceType: quote.serviceType,
      packageType: quote.packageType,
      totalPrice: quote.totalPrice,
      currency: quote.currency,
      timeline: quote.timeline,
      status: quote.status,
      notes: quote.notes || '',
      adminNotes: quote.adminNotes || '',
      validUntil: quote.validUntil.split('T')[0] // Format for date input
    })
    setShowEditModal(true)
  }

  const handleDeleteQuote = (quote: Quote) => {
    setSelectedQuote(quote)
    setShowDeleteModal(true)
  }

  const handleSaveQuote = async () => {
    if (!selectedQuote) return // Solo permitir edición de cotizaciones existentes
    
    try {
      setIsUpdating(true)
      
      const url = `/api/admin/quotes/${selectedQuote.id}`
      
      const requestData = {
        ...formData,
        totalPrice: Number(formData.totalPrice),
        timeline: Number(formData.timeline),
        validUntil: new Date(formData.validUntil).toISOString()
      }
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        await fetchQuotes() // Refresh the list
        setShowEditModal(false)
        setSelectedQuote(null)
      } else {
        const errorData = await response.json()
        console.error('Error saving quote:', errorData)
        alert('Error al guardar la cotización: ' + (errorData.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error saving quote:', error)
      alert('Error al guardar la cotización')
    } finally {
      setIsUpdating(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedQuote) return

    try {
      setIsUpdating(true)
      const response = await fetch(`/api/admin/quotes/${selectedQuote.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchQuotes()
        setShowDeleteModal(false)
        setSelectedQuote(null)
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleExport = async () => {
    try {
      setIsUpdating(true)
      const quoteIds = selectedQuotes.length > 0 ? selectedQuotes : quotes.map(q => q.id)
      
      const response = await fetch('/api/admin/quotes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export',
          quoteIds
        })
      })

      if (response.ok) {
        const data = await response.json()
        const csvContent = generateCSV(data.data.quotes)
        downloadCSV(csvContent, 'cotizaciones_export.csv')
      }
    } catch (error) {
      console.error('Error exporting quotes:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBulkAction = async (action: string, status?: string) => {
    if (selectedQuotes.length === 0) return

    try {
      setIsUpdating(true)
      const response = await fetch('/api/admin/quotes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          quoteIds: selectedQuotes,
          data: status ? { status } : undefined
        })
      })

      if (response.ok) {
        await fetchQuotes()
        setSelectedQuotes([])
      }
    } catch (error) {
      console.error('Error in bulk action:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const generateCSV = (data: any[]) => {
    const headers = [
      'ID', 'Cliente', 'Email', 'Teléfono', 'Empresa', 'Servicio', 'Paquete',
      'Precio Base', 'Precio Addons', 'Precio Total', 'Moneda', 'Timeline',
      'Estado', 'Notas', 'Notas Admin', 'Válida Hasta', 'Fecha Creación'
    ]
    
    const csvRows = [
      headers.join(','),
      ...data.map(row => [
        row.id,
        `"${row.cliente}"`,
        row.email,
        row.telefono,
        `"${row.empresa}"`,
        row.servicio,
        row.paquete,
        row.precio_base,
        row.precio_addons,
        row.precio_total,
        row.moneda,
        row.timeline,
        row.estado,
        `"${row.notas}"`,
        `"${row.notas_admin}"`,
        row.valida_hasta,
        row.fecha_creacion
      ].join(','))
    ]
    
    return csvRows.join('\n')
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

  const filteredQuotes = quotes
    .filter(quote => {
      const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus
      const matchesSearch = searchQuery === '' || 
        quote.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesStatus && matchesSearch
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Quote] as string | number
      const bValue = b[sortBy as keyof Quote] as string | number
      
      if (aValue === undefined || bValue === undefined) return 0
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const formatPrice = (price: number, currency: string) => {
    return currency === 'USD' 
      ? `$${Math.round(price).toLocaleString()} USD`
      : `$${Math.round(price).toLocaleString()} MXN`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-secondary-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Gestión de Cotizaciones</h1>
          <p className="text-secondary-600">Administra y da seguimiento a todas las cotizaciones</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            disabled={isUpdating}
            className="flex items-center px-4 py-2 border border-secondary-200 rounded-lg text-secondary-700 hover:bg-secondary-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
          <button 
            onClick={fetchQuotes}
            disabled={isUpdating}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-secondary-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por cliente, email o servicio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-secondary-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order as 'asc' | 'desc')
                }}
                className="appearance-none bg-white border border-secondary-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt-desc">Más recientes</option>
                <option value="createdAt-asc">Más antiguos</option>
                <option value="totalPrice-desc">Mayor precio</option>
                <option value="totalPrice-asc">Menor precio</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-secondary-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuotes(filteredQuotes.map(q => q.id))
                      } else {
                        setSelectedQuotes([])
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-secondary-300"
                      checked={selectedQuotes.includes(quote.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedQuotes(prev => [...prev, quote.id])
                        } else {
                          setSelectedQuotes(prev => prev.filter(id => id !== quote.id))
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {quote.user.name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-secondary-500">{quote.user.email}</div>
                        {quote.user.company && (
                          <div className="text-xs text-secondary-400">{quote.user.company}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">{quote.serviceType}</div>
                    <div className="text-sm text-secondary-500">{quote.packageType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-secondary-900">
                      {formatPrice(quote.totalPrice, quote.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(quote.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {formatDate(quote.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewQuote(quote)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditQuote(quote)}
                        className="text-secondary-600 hover:text-secondary-900 p-1 rounded"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {quote.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => updateQuoteStatus(quote.id, 'APPROVED')}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Aprobar"
                            disabled={isUpdating}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateQuoteStatus(quote.id, 'REJECTED')}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Rechazar"
                            disabled={isUpdating}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteQuote(quote)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Eliminar"
                        disabled={quote.project !== undefined}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-secondary-300" />
            <h3 className="mt-4 text-sm font-medium text-secondary-900">
              No se encontraron cotizaciones
            </h3>
            <p className="mt-2 text-sm text-secondary-500">
              {searchQuery ? 'Intenta con diferentes términos de búsqueda' : 'No hay cotizaciones con los filtros seleccionados'}
            </p>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedQuotes.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-secondary-200 p-4 z-50">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-secondary-600">
              {selectedQuotes.length} cotización(es) seleccionada(s)
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleBulkAction('updateStatus', 'APPROVED')}
                disabled={isUpdating}
                className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                Aprobar
              </button>
              <button 
                onClick={() => handleBulkAction('updateStatus', 'REJECTED')}
                disabled={isUpdating}
                className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Rechazar
              </button>
              <button 
                onClick={() => handleBulkAction('convertToProject')}
                disabled={isUpdating}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Convertir a Proyecto
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                disabled={isUpdating}
                className="px-3 py-2 bg-secondary-600 text-white rounded text-sm hover:bg-secondary-700 disabled:opacity-50"
              >
                Eliminar
              </button>
              <button 
                onClick={() => setSelectedQuotes([])}
                className="px-3 py-2 border border-secondary-200 text-secondary-700 rounded text-sm hover:bg-secondary-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Quote Modal */}
      {showViewModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detalles de la Cotización</h3>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.user.name || 'Sin nombre'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.user.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Empresa</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.user.company || 'No especificada'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.user.phone || 'No especificado'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Servicio</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.serviceType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Paquete</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.packageType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio Total</label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{formatPrice(selectedQuote.totalPrice, selectedQuote.currency)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timeline</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.timeline} días</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <div className="mt-1">{getStatusBadge(selectedQuote.status)}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Válida Hasta</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedQuote.validUntil)}</p>
                </div>
              </div>
              
              {selectedQuote.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notas del Cliente</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.notes}</p>
                </div>
              )}
              
              {selectedQuote.adminNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notas del Administrador</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.adminNotes}</p>
                </div>
              )}
              
              {selectedQuote.project && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700">Proyecto Asociado</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <p className="text-sm text-gray-900">{selectedQuote.project.title}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedQuote.project.status}
                    </span>
                  </div>
                </div>
              )}
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
                  handleEditQuote(selectedQuote)
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Confirmar Eliminación</h3>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-sm text-gray-700">
                ¿Estás seguro de que quieres eliminar la cotización para {selectedQuote.user.name || 'este cliente'}?
              </p>
              {selectedQuote.project && (
                <div className="mt-2 p-3 bg-red-50 rounded-md">
                  <p className="text-sm text-red-700">
                    Esta cotización tiene un proyecto asociado y no puede ser eliminada.
                  </p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={selectedQuote.project !== undefined || isUpdating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {isUpdating ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quote Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Editar Cotización
              </h3>
            </div>
            
            <div className="px-6 py-4">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveQuote(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cliente Info */}
                  <div className="col-span-full">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Información del Cliente</h4>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Cliente *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.clientEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Empresa</label>
                    <input
                      type="text"
                      value={formData.clientCompany}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientCompany: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                  
                  {/* Cotización Info */}
                  <div className="col-span-full">
                    <h4 className="text-md font-medium text-gray-900 mb-4 mt-6">Información de la Cotización</h4>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Servicio *</label>
                    <select
                      required
                      value={formData.serviceType}
                      onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="WEB">Desarrollo Web</option>
                      <option value="MOBILE">Aplicaciones Móviles</option>
                      <option value="ECOMMERCE">E-commerce</option>
                      <option value="CLOUD">Migración a la Nube</option>
                      <option value="AI">Inteligencia Artificial</option>
                      <option value="CONSULTING">Consultoría TI</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Paquete *</label>
                    <select
                      required
                      value={formData.packageType}
                      onChange={(e) => setFormData(prev => ({ ...prev, packageType: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="BASIC">Básico</option>
                      <option value="PROFESSIONAL">Profesional</option>
                      <option value="BUSINESS">Empresarial</option>
                      <option value="ENTERPRISE">Premium</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Precio Total *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.totalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalPrice: parseFloat(e.target.value) || 0 }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Moneda *</label>
                    <select
                      required
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="MXN">MXN - Peso Mexicano</option>
                      <option value="USD">USD - Dólar Americano</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timeline (días) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.timeline}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeline: parseInt(e.target.value) || 30 }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="APPROVED">Aprobada</option>
                      <option value="REJECTED">Rechazada</option>
                      <option value="EXPIRED">Expirada</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Válida Hasta *</label>
                    <input
                      type="date"
                      required
                      value={formData.validUntil}
                      onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700">Notas del Cliente</label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Notas o requerimientos específicos del cliente..."
                    />
                  </div>
                  
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700">Notas Administrativas</label>
                    <textarea
                      rows={3}
                      value={formData.adminNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, adminNotes: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Notas internas del administrador..."
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedQuote(null)
                }}
                disabled={isUpdating}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveQuote}
                disabled={isUpdating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
