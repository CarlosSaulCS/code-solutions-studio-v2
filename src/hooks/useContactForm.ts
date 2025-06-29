'use client'

import { useState } from 'react'

export interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  service: string
  budget: string
  timeline: string
  message: string
  subject?: string
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  budget: '',
  timeline: '',
  message: '',
  subject: ''
}

export const useContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const submitForm = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    setIsLoading(true)
    setError(null)

    try {
      const submitData = {
        ...formData,
        service: formData.subject || formData.service // Map subject to service for backend compatibility
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar el formulario')
      }

      const result = await response.json()
      console.log('Contact form response:', result) // Debug log
      
      if (result.success) {
        console.log('Setting success to true') // Debug log
        setIsSuccess(true)
        setFormData(initialFormData)
      } else {
        throw new Error(result.error || 'Error al enviar el formulario')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setIsSuccess(false)
    setError(null)
    setIsLoading(false)
  }

  return {
    formData,
    isLoading,
    isSuccess,
    error,
    updateField,
    submitForm,
    resetForm
  }
}
