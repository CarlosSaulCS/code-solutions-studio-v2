const fetch = require('node-fetch')

async function testContactForm() {
  console.log('🧪 Testing Contact Form with detailed logging...\n')
  
  const testData = {
    name: 'Carlos Test',
    email: 'carlos.test@example.com',
    message: 'Mensaje de prueba desde script',
    phone: '+52 248 102 4714',
    subject: 'web',
    company: 'Test Company'
  }
  
  try {
    console.log('📤 Sending data:', JSON.stringify(testData, null, 2))
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', response.headers.raw())
    
    const responseText = await response.text()
    console.log('📥 Raw response:', responseText)
    
    try {
      const responseData = JSON.parse(responseText)
      console.log('📋 Parsed response:', JSON.stringify(responseData, null, 2))
      
      if (responseData.success) {
        console.log('✅ SUCCESS: Contact form is working!')
        console.log('📧 Message ID:', responseData.messageId)
      } else {
        console.log('❌ FAILED:', responseData.error)
      }
    } catch (parseError) {
      console.log('❌ JSON Parse Error:', parseError.message)
    }
    
  } catch (error) {
    console.error('🚨 Network Error:', error.message)
  }
}

// Also test production
async function testProductionContactForm() {
  console.log('\n🌍 Testing Production Contact Form...\n')
  
  const testData = {
    name: 'Carlos Production Test',
    email: 'carlos.production@example.com', 
    message: 'Test desde script de producción',
    subject: 'web'
  }
  
  try {
    const response = await fetch('https://www.codesolutionstudio.com.mx/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    const responseData = await response.json()
    console.log('🌍 Production Response:', JSON.stringify(responseData, null, 2))
    
    if (responseData.success) {
      console.log('✅ Production contact form working!')
    } else {
      console.log('❌ Production failed:', responseData.error)
    }
    
  } catch (error) {
    console.error('🚨 Production Error:', error.message)
  }
}

async function main() {
  await testContactForm()
  await testProductionContactForm()
}

main().catch(console.error)
