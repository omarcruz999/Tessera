import supabase from '../services/supabaseClient'

export interface Comment {
    id: number;
    postId: number;
    user_id: string;
    parent_comment_id: number | null;
    content: string;
    created_at: string;
    replies: Comment[];
}

export interface CreateCommentPayload {
    post_id: number;
    user_id: string;
    content: string;
    parent_comment_id?: number | null;
}

const BASE =
    import.meta.env.VITE_SERVER_URL?.replace(/\/$/, '') ||
    'http://localhost:4000';


// Helpers
async function handle<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function getToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
}

function authHeaders(token: string | null): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// CRUD wrappers
export const getComments = async (postId: number) => {
    const token = await getToken();
    return fetch(`${BASE}/api/comments/${postId}`, {
        headers: authHeaders(token),
    }).then(handle<Comment[]>);
};

export const addComment = async (body: CreateCommentPayload) => {
    const token = await getToken();
    return fetch(`${BASE}/api/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders(token),
        },
        body: JSON.stringify(body),
    }).then(handle<Comment>);
};

export const updateComment = async (id: number, content: string) => {
    const token = await getToken();
    return fetch(`${BASE}/api/comments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
      body: JSON.stringify({ content }),
    }).then(handle<void>);
  };

  export const deleteComment = async (id: number, userId: string) => {
    const token = await getToken();
    return fetch(`${BASE}/api/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token), 
      },
      body: JSON.stringify({ user_id: userId }),
    }).then(handle<void>);
  };