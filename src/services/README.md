# API Services Guide

## Overview

This directory contains service modules for API communication. Please use these for consistency across the app.

## Core Services

- `apiClient.ts`: Base axios client configured with auth interceptors
- `userApi.ts`: User profile and connection related API functions
- `supabaseClient.ts`: Supabase client for auth and storage

## How to Use

### Option 1: Using API Service Functions (Recommended)

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

For endpoints without dedicated service functions:

### Option 2: Using apiClient Directly

```typescript
import apiClient from '../services/apiClient';

// Later in your component
const fetchData = async () => {
  try {
    const { data } = await apiClient.get(`/some-endpoint/${id}`);
    // Use the data
  } catch (error) {
    // Handle errors
  }
};
```

## API URL Configuration

The API client automatically determines the correct base URL:

1. Uses VITE_API_URL environment variable if available
2. In production, defaults to ${window.location.origin}/api
3. For development, defaults to `http://localhost:4000/api`

## Adding New API Functions

When creating new API endpoints, consider adding them to appropriate service files:

```typescript
// In userApi.ts
export const updateUserPreferences = async (userId: string, preferences: UserPreferences) => {
  return apiClient.put(`/users/${userId}/preferences`, preferences);
};
```

## Working with File Uploads

For file uploads, remember to set the correct content type:

```typescript
import apiClient from '../services/apiClient';

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
```

## Benefits of This Approach

1. **Non-Disruptive**: Works with existing code without major refactoring
2. **Gradual Adoption**: Can be adopted incrementally by team members
3. **Centralized Configuration**: API URLs and auth logic in one place
4. **Better Error Handling**: Consistent error handling across the app
5. **Easier Testing**: API functions can be mocked easily in tests
6. Environment Awareness: Automatically adapts to development/production environments
