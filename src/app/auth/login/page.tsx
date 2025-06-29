'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/providers'
import { 
  Eye, EyeOff, Mail, Lock, LogIn, ArrowLeft, 
  AlertCircle, CheckCircle2, User, Building
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ToastContainer'
import { ButtonLoading } from '@/components/LoadingSpinner'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { success, error: showError } = useToast()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Mostrar mensaje de bienvenida si viene desde registro
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      // Auto-llenar el email si viene del registro
      const emailFromRegistration = searchParams.get('email')
      if (emailFromRegistration) {
        setFormData(prev => ({
          ...prev,
          email: decodeURIComponent(emailFromRegistration)
        }))
      }
      
      success(
        '✅ ¡Registro completado!',
        'Ahora puedes iniciar sesión con tus credenciales para acceder a tu dashboard personalizado.',
        5000 // 5 segundos para que sea más visible
      )
    }
  }, [searchParams, success])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = t('auth.login.error.required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = t('auth.login.error.required')
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
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
            
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      
      if (result?.error) {
                showError('Error de autenticación', result.error === 'CredentialsSignin' 
          ? 'Email o contraseña incorrectos' 
          : 'Error de autenticación')
      } else if (result?.ok) {
                
        // Obtener la sesión actualizada
        const session = await getSession()
                
        if (session?.user) {
          success('¡Bienvenido!', `Hola ${session.user.name || session.user.email}!`)
          
          // Redirigir según el rol del usuario
          if (session.user.role === 'ADMIN') {
                        router.push('/admin')
          } else {
                        router.push('/dashboard')
          }
        } else {
                    showError('Error', 'No se pudo obtener la información de la sesión')
        }
      } else {
                showError('Error', 'Resultado de autenticación inesperado')
      }
    } catch (error) {
      console.error('💥 Error en login:', error)
      showError('Error', 'Ocurrió un error inesperado durante el login')
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white py-32 lg:py-40">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <LogIn className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-3xl font-bold text-secondary-900">
                {t('auth.login.title')}
              </h1>
            </div>
            <p className="text-secondary-600">
              {t('auth.login.subtitle')}
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('auth.login.email')}
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
                    placeholder={t('auth.login.placeholder.email')}
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

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('auth.login.password')}
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

              {/* Submit Button */}
              <ButtonLoading
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <LogIn className="w-5 h-5" />
                {isLoading ? t('auth.login.loading') : t('auth.login.button')}
              </ButtonLoading>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-secondary-600">
                {t('auth.login.noAccount')}{' '}
                <Link 
                  href="/auth/register" 
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors"
                >
                  {t('auth.login.register')}
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
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  )
}

