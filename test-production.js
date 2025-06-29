const https = require('https');

function testEndpoint(url, data, name) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'www.codesolutionstudio.com.mx',
      port: 443,
      path: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseData);
          console.log(`\n🧪 ${name}:`);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Response:`, jsonResponse);
          
          if (res.statusCode === 201) {
            console.log(`✅ ${name} - SUCCESS`);
          } else {
            console.log(`❌ ${name} - FAILED`);
          }
        } catch (error) {
          console.log(`❌ ${name} - Invalid JSON response`);
          console.log('Raw response:', responseData);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${name} - Network Error:`, error.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🚀 Testing Code Solutions Studio APIs in production...\n');
  
  // Test contact endpoint
  await testEndpoint('/api/contact', {
    name: 'Test Production User',
    email: 'test-production@example.com',
    message: 'Testing contact form in production'
  }, 'Contact Form');
  
  // Test quote endpoint
  await testEndpoint('/api/quotes/create', {
    serviceType: 'WEB',
    packageType: 'STARTUP',
    basePrice: 15000,
    totalPrice: 15000,
    timeline: 30,
    contactInfo: {
      name: 'Test Quote User',
      email: 'test-quote@example.com'
    }
  }, 'Quote Form');
  
  // Test health endpoint
  console.log('\n🔍 Testing health endpoint...');
  
  const healthOptions = {
    hostname: 'www.codesolutionstudio.com.mx',
    port: 443,
    path: '/api/health',
    method: 'GET',
  };
  
  const healthReq = https.request(healthOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const health = JSON.parse(data);
        console.log('Health Status:', health);
        console.log('\n📊 Configuration Status:');
        console.log(`Database: ${health.database ? '✅' : '❌'}`);
        console.log(`Resend: ${health.integrations?.resend === 'configured' ? '✅' : '❌'}`);
      } catch (error) {
        console.log('Health check failed:', data);
      }
    });
  });
  
  healthReq.end();
  
  console.log('\n✨ Production test completed!');
}

main().catch(console.error);
