# API Services Guide

## Overview

This directory contains service modules for API communication. Please use these for consistency across the app.

## Core Services

- `apiClient.ts`: Base axios client configured with auth interceptors
- `userApi.ts`: User profile and connection related API functions
- `supabaseClient.ts`: Supabase client for auth and storage

## How to Use

Import the specific API function you need:

```typescript
import { getUserProfile } from '../services/userApi';

// Later in your component
const fetchData = async () => {
  try {
    const { data } = await getUserProfile(userId);
    // Use the data
  } catch (error) {
    // Handle errors
  }
};
```

This ensures consistent error handling, authentication, and URL management.


## Benefits of This Approach

1. **Non-Disruptive**: Works with existing code without major refactoring
2. **Gradual Adoption**: Can be adopted incrementally by team members
3. **Centralized Configuration**: API URLs and auth logic in one place
4. **Better Error Handling**: Consistent error handling across the app
5. **Easier Testing**: API functions can be mocked easily in tests
