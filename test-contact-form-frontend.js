// Test script to verify contact form frontend functionality
const testContactFormSubmission = async () => {
  console.log('Testing contact form submission...')
  
  const testData = {
    name: 'Test User Frontend',
    email: 'test@example.com',
    phone: '123-456-7890',
    company: 'Test Company',
    service: 'Web Development',
    budget: '$1,000 - $5,000',
    timeline: '1-2 months',
    message: 'This is a test message from frontend test'
  }

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    const result = await response.json()
    console.log('Response data:', result)

    if (result.success) {
      console.log('✅ Contact form test PASSED')
      console.log('Message ID:', result.messageId)
      console.log('Success message:', result.message)
    } else {
      console.log('❌ Contact form test FAILED')
      console.log('Error:', result.error)
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Test both local and production endpoints
const testBothEnvironments = async () => {
  console.log('\n=== Testing Local Environment ===')
  await testContactFormSubmission()

  console.log('\n=== Testing Production Environment ===')
  const testDataProd = {
    name: 'Test User Production',
    email: 'test@example.com',
    phone: '123-456-7890',
    company: 'Test Company Prod',
    service: 'Web Development',
    budget: '$1,000 - $5,000',
    timeline: '1-2 months',
    message: 'This is a test message from production test'
  }

  try {
    const response = await fetch('https://www.codesolutionstudio.com.mx/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testDataProd)
    })

    console.log('Production response status:', response.status)
    console.log('Production response ok:', response.ok)

    const result = await response.json()
    console.log('Production response data:', result)

    if (result.success) {
      console.log('✅ Production contact form test PASSED')
    } else {
      console.log('❌ Production contact form test FAILED')
    }

  } catch (error) {
    console.error('❌ Production test failed with error:', error)
  }
}

testBothEnvironments()
