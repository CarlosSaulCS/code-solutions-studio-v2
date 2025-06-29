'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/providers'
import { 
  Eye, EyeOff, Mail, Lock, User, Building, Phone, ArrowLeft,
  AlertCircle, UserPlus, CheckCircle2
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ToastContainer'
import { ButtonLoading } from '@/components/LoadingSpinner'

export default function RegisterPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { success, error: showError } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [registeredUserName, setRegisteredUserName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t('auth.register.error.required')
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('auth.register.error.nameLength')
    }

    if (!formData.email) {
      newErrors.email = t('auth.register.error.required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.register.error.emailInvalid')
    }

    if (!formData.password) {
      newErrors.password = t('auth.register.error.required')
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.register.error.passwordLength')
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.error.required')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.error.passwords')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
        
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
        }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        // Guardar el nombre para el modal
        setRegisteredUserName(formData.name.trim())
        
        // Mostrar modal de éxito
        setShowSuccess(true)
        
        // No limpiar el formulario aquí - se hará en el modal
      } else {
        showError('Error en el registro', result.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('💥 Error en registro:', error)
      showError('Error de conexión', 'No se pudo conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessModalAction = () => {
    // Redirigir al login con parámetros de registro exitoso
    router.push('/auth/login?registered=true&email=' + encodeURIComponent(formData.email))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Success Modal - similar to ContactForm and Quoter
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center max-w-md w-full">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Bienvenido a Code Solutions!
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            ¡Hola <strong>{registeredUserName}</strong>! Tu cuenta ha sido creada exitosamente. 
            Ya puedes acceder a tu portal personalizado.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Email registrado:</span>
            </div>
            <p className="text-sm text-blue-700 font-mono bg-white rounded px-2 py-1">
              {formData.email}
            </p>
          </div>
          <button
            onClick={handleSuccessModalAction}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 w-full"
          >
            Ir al Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white py-32 lg:py-40">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <UserPlus className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-3xl font-bold text-secondary-900">
                {t('auth.register.title')}
              </h1>
            </div>
            <p className="text-secondary-600">
              {t('auth.register.subtitle')}
            </p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('auth.register.name')} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('auth.register.placeholder.name')}
                  />
                  {errors.name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('auth.register.email')} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('auth.register.placeholder.email')}
                  />
                  {errors.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('auth.register.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="+52 123 456 7890"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('auth.register.company')}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder={t('auth.register.placeholder.company')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('auth.register.password')} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('auth.register.confirmPassword')} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <ButtonLoading
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-5 h-5" />
                {isLoading ? t('auth.register.loading') : t('auth.register.button')}
              </ButtonLoading>
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-secondary-600">
                {t('auth.register.hasAccount')}{' '}
                <Link 
                  href="/auth/login" 
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors"
                >
                  {t('auth.register.login')}
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-secondary-600 hover:text-primary-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('auth.register.backToHome')}
            </Link>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  )
}

