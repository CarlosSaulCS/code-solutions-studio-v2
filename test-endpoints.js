const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testContactForm() {
  try {
    console.log('🧪 Testing contact form creation...')
    
    const contactForm = await prisma.contactForm.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message from script',
        status: 'NEW',
        priority: 'MEDIUM',
        responseMethod: 'EMAIL'
      }
    })
    
    console.log('✅ Contact form created successfully:', contactForm)
    return contactForm
    
  } catch (error) {
    console.error('❌ Error creating contact form:', error)
    return null
  }
}

async function testQuoteCreation() {
  try {
    console.log('🧪 Testing quote creation...')
    
    // First create or find a user
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          role: 'CLIENT'
        }
      })
    }
    
    const quote = await prisma.quote.create({
      data: {
        userId: user.id,
        serviceType: 'WEB',
        packageType: 'STARTUP',
        basePrice: 15000,
        totalPrice: 15000,
        timeline: 30,
        status: 'PENDING',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })
    
    console.log('✅ Quote created successfully:', quote)
    return quote
    
  } catch (error) {
    console.error('❌ Error creating quote:', error)
    return null
  }
}

async function main() {
  console.log('🚀 Starting endpoint tests...\n')
  
  await testContactForm()
  console.log('')
  await testQuoteCreation()
  
  console.log('\n✨ Test completed!')
  await prisma.$disconnect()
}

main().catch(console.error)
