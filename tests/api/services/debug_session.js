// Debug script to test session creation API
import axios from 'axios';

async function testSessionAPI() {
  const baseURL = 'http://localhost:5173/rag/';

  // First, let's test if the endpoint exists
  try {
    console.log('Testing session creation endpoint...');
    console.log('URL:', baseURL + 'session');

    const response = await axios.post(baseURL + 'session', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // Using a test token
      },
      timeout: 5000
    });

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', error.response?.data);
    console.error('Request URL:', error.config?.url);

    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - the API server might not be running on the expected port');
    }

    if (error.response?.status === 404) {
      console.error('Endpoint not found - check if the API route is correctly configured');
    }
  }
}

testSessionAPI();
