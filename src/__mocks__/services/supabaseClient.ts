import { vi } from 'vitest';

// Create a mock Supabase client
const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn()
        }
      }
    })
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null })
  })
};

export default mockSupabase;