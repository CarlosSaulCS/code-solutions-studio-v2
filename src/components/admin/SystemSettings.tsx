'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Settings, Save, RefreshCw, Database, Mail, Shield, 
  Globe, DollarSign, Bell, Key, Server, Monitor,
  AlertCircle, CheckCircle, Upload, Download, Trash2
} from 'lucide-react'

interface SystemConfig {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    adminEmail: string
    defaultLanguage: string
    timezone: string
    maintenanceMode: boolean
  }
  email: {
    provider: string
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    fromName: string
    fromEmail: string
  }
  currency: {
    defaultCurrency: string
    exchangeRate: number
    autoUpdateRates: boolean
    taxRate: number
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    adminAlerts: boolean
  }
  security: {
    sessionTimeout: number
    passwordMinLength: number
    requireSpecialChars: boolean
    maxLoginAttempts: number
    enableTwoFactor: boolean
  }
  features: {
    enableQuotes: boolean
    enableProjects: boolean
    enableChat: boolean
    enableFileUploads: boolean
    maxFileSize: number
  }
}

export default function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const getDefaultConfig = (): SystemConfig => ({
    general: {
      siteName: 'Code Solutions Studio',
      siteDescription: 'Soluciones tecnológicas integrales para tu negocio',
      siteUrl: 'https://codesolutions.studio',
      adminEmail: 'admin@codesolutions.studio',
      defaultLanguage: 'es',
      timezone: 'America/Mexico_City',
      maintenanceMode: false
    },
    email: {
      provider: 'smtp',
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromName: 'Code Solutions Studio',
      fromEmail: 'noreply@codesolutions.studio'
    },
    currency: {
      defaultCurrency: 'MXN',
      exchangeRate: 20.5,
      autoUpdateRates: true,
      taxRate: 16
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      adminAlerts: true
    },
    security: {
      sessionTimeout: 3600,
      passwordMinLength: 8,
      requireSpecialChars: true,
      maxLoginAttempts: 5,
      enableTwoFactor: false
    },
    features: {
      enableQuotes: true,
      enableProjects: true,
      enableChat: true,
      enableFileUploads: true,
      maxFileSize: 10
    }
  })

  const fetchSystemConfig = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.config || getDefaultConfig())
      } else {
        setConfig(getDefaultConfig())
      }
    } catch (error) {
      console.error('Error fetching system config:', error)
      setConfig(getDefaultConfig())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSystemConfig()
  }, [fetchSystemConfig])

  const handleSave = async () => {
    if (!config) return
    
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuración guardada exitosamente' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la configuración' })
      }
    } catch (error) {
      console.error('Error saving config:', error)
      setMessage({ type: 'error', text: 'Error al guardar la configuración' })
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    try {
      const response = await fetch('/api/admin/settings/test-email', {
        method: 'POST'
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Email de prueba enviado exitosamente' })
      } else {
        setMessage({ type: 'error', text: 'Error al enviar email de prueba' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al enviar email de prueba' })
    }
  }

  const handleExportConfig = async () => {
    try {
      const response = await fetch('/api/admin/settings/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'system-config.json'
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al exportar configuración' })
    }
  }

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    if (!config) return
    
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value
      }
    })
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'currency', name: 'Moneda', icon: DollarSign },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'features', name: 'Funcionalidades', icon: Monitor }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar configuración</h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Configuración del Sistema</h1>
          <p className="mt-2 text-secondary-600">
            Administra la configuración general del sistema y aplicación
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleExportConfig}
            className="inline-flex items-center px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre del Sitio</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.general.siteName}
                    onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">URL del Sitio</label>
                  <input
                    type="url"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.general.siteUrl}
                    onChange={(e) => updateConfig('general', 'siteUrl', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Descripción del Sitio</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.general.siteDescription}
                    onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email del Administrador</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.general.adminEmail}
                    onChange={(e) => updateConfig('general', 'adminEmail', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Idioma por Defecto</label>
                  <select
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.general.defaultLanguage}
                    onChange={(e) => updateConfig('general', 'defaultLanguage', e.target.value)}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Zona Horaria</label>
                  <select
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.general.timezone}
                    onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
                  >
                    <option value="America/Mexico_City">México (CDT)</option>
                    <option value="America/New_York">New York (EDT)</option>
                    <option value="America/Los_Angeles">Los Angeles (PDT)</option>
                    <option value="Europe/Madrid">Madrid (CEST)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={config.general.maintenanceMode}
                      onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
                    />
                    <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                      Modo de Mantenimiento
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Activa el modo de mantenimiento para mostrar una página de mantenimiento a los usuarios
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Proveedor de Email</label>
                  <select
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.email.provider}
                    onChange={(e) => updateConfig('email', 'provider', e.target.value)}
                  >
                    <option value="smtp">SMTP</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Host SMTP</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.email.smtpHost}
                    onChange={(e) => updateConfig('email', 'smtpHost', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Puerto SMTP</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.email.smtpPort}
                    onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Usuario SMTP</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.email.smtpUser}
                    onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña SMTP</label>
                  <input
                    type="password"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.email.smtpPassword}
                    onChange={(e) => updateConfig('email', 'smtpPassword', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre del Remitente</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.email.fromName}
                    onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email del Remitente</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.email.fromEmail}
                    onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={handleTestEmail}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Probar Configuración de Email
                </button>
              </div>
            </div>
          )}

          {activeTab === 'currency' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Moneda por Defecto</label>
                  <select
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.currency.defaultCurrency}
                    onChange={(e) => updateConfig('currency', 'defaultCurrency', e.target.value)}
                  >
                    <option value="MXN">Peso Mexicano (MXN)</option>
                    <option value="USD">Dólar Estadounidense (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de Cambio (MXN/USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.currency.exchangeRate}
                    onChange={(e) => updateConfig('currency', 'exchangeRate', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tasa de Impuesto (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.currency.taxRate}
                    onChange={(e) => updateConfig('currency', 'taxRate', parseFloat(e.target.value))}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoUpdateRates"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={config.currency.autoUpdateRates}
                      onChange={(e) => updateConfig('currency', 'autoUpdateRates', e.target.checked)}
                    />
                    <label htmlFor="autoUpdateRates" className="ml-2 block text-sm text-gray-900">
                      Actualizar tipos de cambio automáticamente
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={config.notifications.emailNotifications}
                    onChange={(e) => updateConfig('notifications', 'emailNotifications', e.target.checked)}
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                    Notificaciones por Email
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={config.notifications.pushNotifications}
                    onChange={(e) => updateConfig('notifications', 'pushNotifications', e.target.checked)}
                  />
                  <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-900">
                    Notificaciones Push
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={config.notifications.smsNotifications}
                    onChange={(e) => updateConfig('notifications', 'smsNotifications', e.target.checked)}
                  />
                  <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
                    Notificaciones SMS
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="adminAlerts"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={config.notifications.adminAlerts}
                    onChange={(e) => updateConfig('notifications', 'adminAlerts', e.target.checked)}
                  />
                  <label htmlFor="adminAlerts" className="ml-2 block text-sm text-gray-900">
                    Alertas de Administrador
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tiempo de Sesión (segundos)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.security.sessionTimeout}
                    onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitud Mínima de Contraseña</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.security.passwordMinLength}
                    onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Máximo Intentos de Login</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireSpecialChars"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={config.security.requireSpecialChars}
                      onChange={(e) => updateConfig('security', 'requireSpecialChars', e.target.checked)}
                    />
                    <label htmlFor="requireSpecialChars" className="ml-2 block text-sm text-gray-900">
                      Requerir caracteres especiales en contraseñas
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableTwoFactor"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={config.security.enableTwoFactor}
                      onChange={(e) => updateConfig('security', 'enableTwoFactor', e.target.checked)}
                    />
                    <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-900">
                      Habilitar autenticación de dos factores
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableQuotes"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={config.features.enableQuotes}
                        onChange={(e) => updateConfig('features', 'enableQuotes', e.target.checked)}
                      />
                      <label htmlFor="enableQuotes" className="ml-2 block text-sm text-gray-900">
                        Habilitar Cotizaciones
                      </label>
                    </div>
                    <p className="ml-6 text-sm text-gray-500">Permite a los usuarios solicitar cotizaciones</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableProjects"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={config.features.enableProjects}
                        onChange={(e) => updateConfig('features', 'enableProjects', e.target.checked)}
                      />
                      <label htmlFor="enableProjects" className="ml-2 block text-sm text-gray-900">
                        Habilitar Proyectos
                      </label>
                    </div>
                    <p className="ml-6 text-sm text-gray-500">Sistema de gestión de proyectos</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableChat"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={config.features.enableChat}
                        onChange={(e) => updateConfig('features', 'enableChat', e.target.checked)}
                      />
                      <label htmlFor="enableChat" className="ml-2 block text-sm text-gray-900">
                        Habilitar Chat
                      </label>
                    </div>
                    <p className="ml-6 text-sm text-gray-500">Sistema de mensajería en tiempo real</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableFileUploads"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={config.features.enableFileUploads}
                        onChange={(e) => updateConfig('features', 'enableFileUploads', e.target.checked)}
                      />
                      <label htmlFor="enableFileUploads" className="ml-2 block text-sm text-gray-900">
                        Habilitar Subida de Archivos
                      </label>
                    </div>
                    <p className="ml-6 text-sm text-gray-500">Permite a los usuarios subir archivos</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tamaño Máximo de Archivo (MB)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={config.features.maxFileSize}
                      onChange={(e) => updateConfig('features', 'maxFileSize', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
