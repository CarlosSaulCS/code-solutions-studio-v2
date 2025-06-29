'use client'

import { useState, useCallback, useEffect } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// Global toast store using simple state management
let globalToasts: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

const notifyListeners = () => {
  listeners.forEach(listener => listener([...globalToasts]))
}

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substring(2)
  const newToast: Toast = { ...toast, id }
  
  globalToasts = [...globalToasts, newToast]
  notifyListeners()

  // Auto remove after duration
  const duration = toast.duration || 5000
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

const removeToast = (id: string) => {
  globalToasts = globalToasts.filter(t => t.id !== id)
  notifyListeners()
}

const clearAllToasts = () => {
  globalToasts = []
  notifyListeners()
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(globalToasts)

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToasts(newToasts)
    }
    
    listeners.push(listener)
    
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  const success = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration })
  }, [])

  const error = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration })
  }, [])

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration })
  }, [])

  const info = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration })
  }, [])

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAllToasts
  }
}
