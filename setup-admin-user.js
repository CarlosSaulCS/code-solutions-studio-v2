const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupAdmin() {
  try {
    console.log('🔍 Checking for admin user...')
    
    // Check if admin exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@codesolutionsstudio.com' },
          { email: 'carlossaulcante@outlook.com' },
          { role: 'ADMIN' }
        ]
      }
    })
    
    if (existingAdmin) {
      console.log('👤 Admin user found:', {
        id: existingAdmin.id,
        email: existingAdmin.email,
        role: existingAdmin.role,
        name: existingAdmin.name
      })
      
      console.log('\n🔑 Login credentials:')
      console.log('Email:', existingAdmin.email)
      console.log('Password: [The password you set when creating the account]')
      
      return existingAdmin
    }
    
    // Create admin if doesn't exist
    console.log('👤 No admin found, creating one...')
    
    const adminEmail = 'carlossaulcante@outlook.com'
    const adminPassword = 'Admin123!@#'
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const admin = await prisma.user.create({
      data: {
        name: 'Carlos Saúl',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('\n🔑 Login credentials:')
    console.log('Email:', adminEmail)
    console.log('Password:', adminPassword)
    console.log('\n📝 Please save these credentials safely!')
    
    return admin
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    
    if (error.code === 'P2002') {
      console.log('🔄 User with this email already exists')
      
      // Try to find the user
      const user = await prisma.user.findUnique({
        where: { email: 'carlossaulcante@outlook.com' }
      })
      
      if (user) {
        console.log('👤 Found user:', {
          email: user.email,
          role: user.role,
          name: user.name
        })
        
        // Update to admin if needed
        if (user.role !== 'ADMIN') {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' }
          })
          console.log('✅ User updated to ADMIN role')
        }
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}

async function showLoginInfo() {
  console.log('\n🌐 Admin Login URLs:')
  console.log('Local: http://localhost:3000/auth/login')
  console.log('Production: https://www.codesolutionstudio.com.mx/auth/login')
  console.log('\n📊 Admin Dashboard:')
  console.log('Local: http://localhost:3000/admin')
  console.log('Production: https://www.codesolutionstudio.com.mx/admin')
}

setupAdmin().then(showLoginInfo)
