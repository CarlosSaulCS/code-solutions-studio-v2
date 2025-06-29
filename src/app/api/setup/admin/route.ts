import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { adminKey } = await request.json()

    // Security check - only allow setup with a secret key
    if (adminKey !== 'setup-code-solutions-admin-2025') {
      return NextResponse.json(
        { error: 'Clave de administrador incorrecta' },
        { status: 401 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Ya existe un administrador' },
        { status: 400 }
      )
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Casc+10098@', 12)
    
    const admin = await prisma.user.create({
      data: {
        email: 'carlossaulcante@outlook.com',
        name: 'Carlos Saulcante',
        password: hashedPassword,
        role: 'ADMIN',
        company: 'Code Solutions Studio'
      }
    })

    // Create welcome notification for admin
    await prisma.notification.create({
      data: {
        userId: admin.id,
        title: '¡Bienvenido al Panel de Administración!',
        message: 'Tu cuenta de administrador ha sido configurada correctamente. Puedes iniciar sesión con: carlossaulcante@outlook.com / Casc+10098@',
        type: 'SUCCESS'
      }
    })

    // Admin account created successfully
    // Email: carlossaulcante@outlook.com, Password: Casc+10098@

    return NextResponse.json({
      success: true,
      message: 'Administrador creado exitosamente',
      data: {
        email: 'carlossaulcante@outlook.com',
        password: 'Casc+10098@'
      }
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
