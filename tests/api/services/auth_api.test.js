class AuthApiTest {
  constructor(baseUrl = 'https://home.si-qi.wang') {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async testCreateSession() {
    console.log('Testing: Create Session API');
    try {
      const response = await fetch(`${this.baseUrl}/rag/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          name: 'API Test Session'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✔️ Session created successfully:', data);
      return data.data.id;
    } catch (error) {
      console.error('❌ Create session test failed:', error);
      throw error;
    }
  }

  async testSendMessage(sessionId) {
    console.log('Testing: Send Message API');
    try {
      const response = await fetch(`${this.baseUrl}/rag/session/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          content: 'Hello, this is a test message!'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }

      console.log('✔️ Message sent successfully!');
    } catch (error) {
      console.error('❌ Send message test failed:', error);
      throw error;
    }
  }

  async testGetMessages(sessionId) {
    console.log('Testing: Get Messages API');
    try {
      const response = await fetch(
        `${this.baseUrl}/rag/session/${sessionId}/message?page=0&page_size=10`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✔️ Messages retrieved successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Get messages test failed:', error);
      throw error;
    }
  }

  async runAllTests() {
    if (!this.token) {
      throw new Error('Authentication token is required. Use setToken() to set it.');
    }

    try {
      console.log('\n🚀 Starting API tests...\n');

      // Run tests sequentially
      const sessionId = await this.testCreateSession();
      await this.testSendMessage(sessionId);
      await this.testGetMessages(sessionId);

      console.log('\n✅ All API tests completed successfully!\n');
    } catch (error) {
      console.error('\n❌ API tests failed:', error);
      process.exit(1);
    }
  }
}

// CLI execution
if (require.main === module) {
  const token = process.argv[2];
  if (!token) {
    console.error('\n⚠️ Please provide an authentication token as an argument');
    console.log('Usage: node auth_api.test.js YOUR_TOKEN\n');
    process.exit(1);
  }

  const tester = new AuthApiTest();
  tester.setToken(token);
  tester.runAllTests();
}
