const fetch = require('node-fetch')

async function testContactEndpoint() {
  try {
    console.log('🧪 Testing /api/contact endpoint...')
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User API',
        email: 'testapi@example.com',
        message: 'Test message from API endpoint',
        phone: '+1234567890',
        company: 'Test Company',
        service: 'Web Development'
      })
    })
    
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', data)
    
    if (response.ok) {
      console.log('✅ Contact endpoint working!')
    } else {
      console.log('❌ Contact endpoint failed')
    }
    
    return data
    
  } catch (error) {
    console.error('❌ Error testing contact endpoint:', error.message)
    return null
  }
}

async function testQuoteEndpoint() {
  try {
    console.log('🧪 Testing /api/quotes/create endpoint...')
    
    const response = await fetch('http://localhost:3000/api/quotes/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceType: 'WEB',
        packageType: 'STARTUP',
        basePrice: 15000,
        totalPrice: 15000,
        timeline: 30,
        contactInfo: {
          name: 'Test User Quote',
          email: 'testquote@example.com',
          phone: '+1234567890',
          company: 'Test Company'
        },
        selectedAddons: [],
        addonsPrice: 0,
        currency: 'MXN',
        notes: 'Test quote from API'
      })
    })
    
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', data)
    
    if (response.ok) {
      console.log('✅ Quote endpoint working!')
    } else {
      console.log('❌ Quote endpoint failed')
    }
    
    return data
    
  } catch (error) {
    console.error('❌ Error testing quote endpoint:', error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Testing API endpoints...\n')
  
  await testContactEndpoint()
  console.log('')
  await testQuoteEndpoint()
  
  console.log('\n✨ API test completed!')
}

main().catch(console.error)
