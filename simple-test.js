// Simple test for contact form
const testContactForm = async () => {
  console.log('Testing contact form...')
  
  const testData = {
    name: 'Test User Local',
    email: 'test@example.com',
    message: 'Test message from local script'
  }

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log('Status:', response.status)
    const result = await response.json()
    console.log('Result:', JSON.stringify(result, null, 2))

  } catch (error) {
    console.error('Error:', error.message)
  }
}

testContactForm()
