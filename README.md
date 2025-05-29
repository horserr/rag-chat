# RAG Chat Application

A React-based chat application that uses a Retrieval-Augmented Generation (RAG) API for providing informative responses.

## Features

- User authentication with token-based access
- Chat sessions management
- Real-time streaming chat responses
- Chat history browsing
- Responsive UI with Material UI components

## Development Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- An available RAG API endpoint (default: https://home.si-qi.wang)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```

## Configuration

The application is configured to proxy API requests to `https://home.si-qi.wang` for the following endpoints:
- Authentication: `/auth/`
- RAG API: `/rag/`
- Prompt API: `/api/prompt/`
- RAG Evaluation: `/api/rag/`

You can modify these settings in `vite.config.ts`.
```

## Testing API Connectivity

You can test the API connectivity using the provided test script:

```bash
# First install node-fetch if you don't have it
npm install node-fetch

# Then run the test with your auth token
node src/test_api.js YOUR_AUTH_TOKEN
```

## Key Components

- **Authentication**: Handles user login and token management
- **Chat Sessions**: Manages multiple chat conversations
- **Message Service**: Handles sending/receiving messages with streaming support
- **UI Components**: Responsive chat interface with Material UI

## Troubleshooting

### Common Issues

1. **Authentication Errors**: If you see 401 errors, your token may be expired. Try logging out and logging back in.

2. **API Connection Issues**: Verify your network connection and ensure the API server is up and running.

3. **Message Streaming**: If message streaming isn't working, check your browser console for errors and ensure the API supports streaming responses.
```
