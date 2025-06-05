# SendBeacon Cleanup Implementation

## Overview

This document describes the implementation of reliable task cleanup using the `navigator.sendBeacon` API to replace unreliable async API calls during page unload events.

## Problem Statement

The original cleanup implementation used `Promise.allSettled` with async API calls in the `unload` event handler:

```javascript
const handleUnload = () => {
  cleanupActiveTasks(); // Uses async Promise.allSettled
};
```

**Issues with this approach:**
- Browsers don't guarantee that async operations complete before page unload
- Network requests may be cancelled mid-flight during navigation
- Tasks might not be properly cleaned up, leaving orphaned data

## Solution: SendBeacon API

The `navigator.sendBeacon` API is specifically designed for reliable data transmission during page unload:

- **Fire-and-forget**: Queues the request even if the page unloads
- **Non-blocking**: Doesn't delay page navigation
- **Reliable**: Browser guarantees delivery attempt
- **Efficient**: Uses POST method with minimal overhead

## Implementation Details

### 1. Beacon Cleanup Function

```typescript
const cleanupActiveTasksWithBeacon = useCallback(() => {
  // Check browser support
  if (!navigator.sendBeacon) {
    cleanupActiveTasks(); // Fallback to async method
    return;
  }

  // Get auth token
  const token = TokenService.getToken();
  const authHeader = token ? `Bearer ${token}` : '';

  // Prepare cleanup data
  const cleanupData = {
    ragTasks: activeTasks.rag,
    promptTasks: activeTasks.prompt,
    timestamp: Date.now()
  };

  // Send batch cleanup beacon
  const payload = JSON.stringify({
    type: 'task_cleanup',
    data: cleanupData,
    auth: authHeader
  });

  const beaconSent = navigator.sendBeacon('/api/cleanup/tasks', payload);

  if (!beaconSent) {
    // Fallback: Individual beacons for each task
    activeTasks.rag.forEach(taskId => {
      const deletePayload = JSON.stringify({
        method: 'DELETE',
        auth: authHeader,
        timestamp: Date.now()
      });
      navigator.sendBeacon(`/api/rag/task/${taskId}`, deletePayload);
    });

    activeTasks.prompt.forEach(taskId => {
      const deletePayload = JSON.stringify({
        method: 'DELETE',
        auth: authHeader,
        timestamp: Date.now()
      });
      navigator.sendBeacon(`/api/prompt/task/${taskId}`, deletePayload);
    });
  }
}, [activeTasks, cleanupActiveTasks]);
```

### 2. Updated Event Handlers

```typescript
useEffect(() => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (activeTasks.rag.length > 0 || activeTasks.prompt.length > 0) {
      event.preventDefault();
      return CLEANUP_WARNING_MESSAGE;
    }
  };

  const handleUnload = () => {
    // Use beacon-based cleanup for reliable unload cleanup
    cleanupActiveTasksWithBeacon();
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("unload", handleUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("unload", handleUnload);
  };
}, [activeTasks, cleanupActiveTasksWithBeacon]);
```

## Backend Requirements

To fully support this implementation, the backend needs:

### 1. Batch Cleanup Endpoint

```http
POST /api/cleanup/tasks
Content-Type: application/json

{
  "type": "task_cleanup",
  "data": {
    "ragTasks": ["task1", "task2"],
    "promptTasks": [101, 102],
    "timestamp": 1674123456789
  },
  "auth": "Bearer token"
}
```

### 2. Enhanced Individual Endpoints

The existing DELETE endpoints should be enhanced to handle beacon payloads:

```http
POST /api/rag/task/{taskId}
Content-Type: application/json

{
  "method": "DELETE",
  "auth": "Bearer token",
  "timestamp": 1674123456789
}
```

## Browser Support

| Browser | SendBeacon Support |
|---------|-------------------|
| Chrome  | ✅ v39+           |
| Firefox | ✅ v31+           |
| Safari  | ✅ v11.1+         |
| Edge    | ✅ v14+           |

**Fallback Strategy**: If `navigator.sendBeacon` is not available, the system automatically falls back to the original async cleanup method.

## Testing

### Test Environment

Use `tests/test-sendbeacon.html` to test the implementation:

1. **Mock Tasks**: Add/remove mock active tasks
2. **Beacon Test**: Test the beacon cleanup functionality
3. **Fallback Test**: Test behavior when beacon is unavailable
4. **Unload Simulation**: Simulate actual page unload scenarios

### Manual Testing Steps

1. Open the test file in a browser
2. Add mock tasks using the "Add Mock Tasks" button
3. Test beacon cleanup with "Test Beacon Cleanup"
4. Monitor Network tab in browser dev tools
5. Simulate page unload to verify real behavior

### Network Monitoring

In browser dev tools:
1. Open Network tab
2. Check "Preserve log" to see requests during navigation
3. Look for POST requests to `/api/cleanup/tasks` and individual task endpoints
4. Verify requests are marked as "beacon" type

## Migration Guide

### From Async to Beacon

**Before:**
```typescript
const handleUnload = () => {
  cleanupActiveTasks(); // Unreliable async
};
```

**After:**
```typescript
const handleUnload = () => {
  cleanupActiveTasksWithBeacon(); // Reliable beacon
};
```

### Key Changes

1. **Import TokenService**: Added for proper auth token access
2. **New Cleanup Function**: `cleanupActiveTasksWithBeacon` with beacon logic
3. **Updated Event Handler**: Use beacon cleanup in unload event
4. **Graceful Fallback**: Automatic fallback when beacon unavailable

## Benefits

1. **Reliability**: Tasks are consistently cleaned up even during navigation
2. **Performance**: Non-blocking beacon requests don't delay page unload
3. **User Experience**: No hanging network requests or orphaned data
4. **Compatibility**: Automatic fallback ensures support across all browsers

## Debugging

### Common Issues

1. **Beacon Not Sent**: Check browser support and payload size (<64KB)
2. **Auth Token Missing**: Verify TokenService.getToken() returns valid token
3. **Network Errors**: Check browser Network tab for beacon requests
4. **Backend Errors**: Ensure backend supports beacon payload format

### Debug Logs

The implementation includes comprehensive logging:
```typescript
console.log("cleanupActiveTasksWithBeacon called, current activeTasks:", activeTasks);
console.log("Sending cleanup data via beacon:", cleanupData);
console.log("Cleanup beacon sent successfully");
```

Monitor browser console for these debug messages during testing.

## Future Enhancements

1. **Retry Logic**: Implement retry mechanism for failed beacons
2. **Batch Optimization**: Optimize payload size for large task lists
3. **Analytics**: Track cleanup success rates for monitoring
4. **Progressive Enhancement**: Enhanced cleanup strategies based on browser capabilities
