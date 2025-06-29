'use client'

import { useEffect } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { Toast, useToast } from '@/hooks/useToast'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {    success: 'bg-cyan-500 text-white',
    error: 'bg-slate-500 text-white',
    warning: 'bg-slate-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  const IconComponent = icons[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])
  return (
    <div className={`flex items-start p-4 rounded-lg shadow-lg ${colors[toast.type]} transform transition-all duration-300 animate-slide-up`}>
      <IconComponent className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        <p className="text-sm opacity-90 mt-1">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-3 p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  )
}
