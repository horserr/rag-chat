# Evaluation Hooks Organization

This directory contains all React hooks related to evaluation functionality, organized into logical groups for better maintainability and discoverability.

## Directory Structure

### `/core`
Contains the main evaluation management hooks that orchestrate the overall evaluation workflow.
- `useEvaluationManager.ts` - Main evaluation manager with comprehensive functionality
- `useEvaluationManagerNew.ts` - Newer version of evaluation manager (migration in progress)

### `/queries`
Contains React Query hooks for data fetching and caching.
- `useRagQueries.ts` - RAG-specific data fetching hooks
- `usePromptQueries.ts` - Prompt evaluation data fetching hooks

### `/operations`
Contains business logic hooks that handle specific operations.
- `useRagOperations.ts` - RAG evaluation business logic
- `usePromptOperations.ts` - Prompt evaluation business logic

### `/pages`
Contains page-specific logic hooks that manage state and behavior for specific UI pages.
- `useOverviewPage.ts` - Overview page logic
- `useRagDetailLogic.ts` - RAG detail page logic
- `usePromptDetailLogic.ts` - Prompt detail page logic
- `useRagOverviewLogic.ts` - RAG overview page logic
- `usePromptOverviewLogic.ts` - Prompt overview page logic

### `/utils`
Contains utility hooks that provide reusable functionality across evaluation features.
- `useTaskCleanup.ts` - Task cleanup and management utilities
- `useEvaluationNavigation.ts` - Navigation helpers for evaluation pages
- `useEvaluationStats.ts` - Statistics and metrics calculation hooks

## Usage

All hooks are re-exported from the main index file, so you can import them directly:

```typescript
import {
  useEvaluationManager,
  useRagQueries,
  usePromptOperations,
  useEvaluationNavigation
} from '@/hooks/evaluation';
```

## Types

Evaluation-related types have been moved to `@/models/evaluation-hooks.ts` for better organization and to avoid circular dependencies.
