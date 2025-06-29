import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Code Solutions Studio',
  description: 'Panel de administración para gestionar proyectos, clientes y cotizaciones.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="flex">
        {/* Sidebar - will be added later */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
