// A simple script to test the chat API connectivity
// Run with Node.js: node test_api.js

// Import fetch for Node.js

// Test function
async function testChatAPI() {
  const token = process.argv[2]; // Get token from command line

  if (!token) {
    console.error('Please provide an authentication token as an argument');
    console.log('Usage: node test_api.js YOUR_TOKEN');
    return;
  }

  console.log('Testing API connectivity...');

  // Test API endpoints
  try {
    // 1. Create a new session
    console.log('Creating a new session...');
    const sessionResponse = await fetch('https://home.si-qi.wang/rag/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'API Test Session'
      })
    });

    if (!sessionResponse.ok) {
      throw new Error(`Failed to create session: ${sessionResponse.status} ${sessionResponse.statusText}`);
    }

    const sessionData = await sessionResponse.json();
    console.log('Session created:', sessionData);
    const sessionId = sessionData.data.id;

    // 2. Send a message
    console.log('Sending a test message...');
    const messageResponse = await fetch(`https://home.si-qi.wang/rag/session/${sessionId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: 'Hello, this is a test message!'
      })
    });

    if (!messageResponse.ok) {
      throw new Error(`Failed to send message: ${messageResponse.status} ${messageResponse.statusText}`);
    }

    console.log('Message sent successfully!');

    // 3. Get messages
    console.log('Fetching messages...');
    const getMessagesResponse = await fetch(`https://home.si-qi.wang/rag/session/${sessionId}/message?page=0&page_size=10`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!getMessagesResponse.ok) {
      throw new Error(`Failed to get messages: ${getMessagesResponse.status} ${getMessagesResponse.statusText}`);
    }

    const messagesData = await getMessagesResponse.json();
    console.log('Messages retrieved:', messagesData);

    console.log('\nAPI TEST SUCCESSFUL! All endpoints are working correctly.');
  } catch (error) {
    console.error('API TEST FAILED:', error);
  }
}

testChatAPI();
