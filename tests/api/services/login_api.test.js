import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

class LoginApiTest {
  constructor(baseUrl = process.env.API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  async testLogin() {
    console.log("Testing: Login API");
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: process.env.TEST_USER_EMAIL,
          password: process.env.TEST_USER_PASSWORD,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Login failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✔️ Login successful:", data);
      return data.token;
    } catch (error) {
      console.error("❌ Login test failed:", error);
      throw error;
    }
  }

  async runAllTests() {
    try {
      console.log("\n🚀 Starting Login API tests...\n");

      // Run login test
      const token = await this.testLogin();
      console.log("🔑 Received token:", token);

      console.log("\n✅ All Login API tests completed successfully!\n");
    } catch (error) {
      console.error("\n❌ Login API tests failed:", error);
      process.exit(1);
    }
  }
}

// Get current directory path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.test
const envPath = resolve(__dirname, "../../../tests/.env.test");
const result = config({ path: envPath });

if (result.error) {
  console.error("\n⚠️ Error loading .env.test file:", result.error);
  process.exit(1);
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new LoginApiTest();
  tester.runAllTests();
}

export default LoginApiTest;
