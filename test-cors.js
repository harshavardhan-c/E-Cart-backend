// Simple CORS test script
import fetch from 'node-fetch';

const testCORS = async () => {
  try {
    console.log('Testing CORS configuration...');
    
    // Test health endpoint
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      headers: {
        'Origin': 'https://e-cart-frontend-2c1j91azb-harshavardhan-chamalas-projects.vercel.app',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers));
    
    const data = await response.json();
    console.log('Response:', data);
    
  } catch (error) {
    console.error('CORS test failed:', error.message);
  }
};

testCORS();