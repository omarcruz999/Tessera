// Mock data for Tessera app - replaces database functionality
import { User } from '../UserContext';
import { PostWithMedia, PostMedia } from '../components/Post Components/PostCard';

// Demo user (always "logged in")
export const DEMO_USER: User = {
  id: 'demo-user-1',
  full_name: 'Alex Demo',
  avatar_url: '/ProfilePictures/Alex.jpg',
  is_active: true,
  email: 'alex.demo@tessera.app',
  profileComplete: true,
  bio: 'Hey there! I\'m Alex, one of the developers behind Tessera. This is a demo version showcasing our social connection platform. Connect with friends and share your moments!'
};

// Mock connections/peers
export const MOCK_CONNECTIONS: User[] = [
  {
    id: 'user-2',
    full_name: 'John Porter',
    avatar_url: '/ProfilePictures/John.jpg',
    is_active: true,
    email: 'john.porter@example.com',
    profileComplete: true,
    bio: 'Tech enthusiast and coffee lover ☕ Always exploring new places and meeting interesting people through Tessera!'
  },
  {
    id: 'user-3',
    full_name: 'Omar Hassan',
    avatar_url: '/ProfilePictures/Omar.jpg',
    is_active: true,
    email: 'omar.hassan@example.com',
    profileComplete: true,
    bio: 'Designer by day, gamer by night 🎮 Love connecting with creative minds and sharing design inspiration.'
  },
  {
    id: 'user-4',
    full_name: 'Sarah Chen',
    avatar_url: '/ProfilePictures/Sarah.jpg',
    is_active: true,
    email: 'sarah.chen@example.com',
    profileComplete: true,
    bio: 'Digital nomad 🌍 Currently in Bali. Passionate about sustainable travel and meaningful connections.'
  },
  {
    id: 'user-5',
    full_name: 'Marcus Johnson',
    avatar_url: '/ProfilePictures/Marcus.jpg',
    is_active: true,
    email: 'marcus.j@example.com',
    profileComplete: true,
    bio: 'Startup founder and mentor. Building the future one connection at a time 🚀'
  },
  {
    id: 'user-6',
    full_name: 'Elena Rodriguez',
    avatar_url: '/ProfilePictures/Elena.jpg',
    is_active: true,
    email: 'elena.rodriguez@example.com',
    profileComplete: true,
    bio: 'Photographer capturing life\'s beautiful moments 📸 Always looking for new perspectives and stories.'
  },
  {
    id: 'user-7',
    full_name: 'David Kim',
    avatar_url: '/ProfilePictures/David.jpg',
    is_active: true,
    email: 'david.kim@example.com',
    profileComplete: true,
    bio: 'Software engineer and rock climbing enthusiast 🧗‍♂️ Love solving complex problems and outdoor adventures.'
  }
];

// Mock posts with realistic content
export const MOCK_POSTS: PostWithMedia[] = [
  {
    id: 'post-1',
    text: 'Just launched the new Tessera demo! So excited to show everyone how easy it is to connect with people in real life. The future of social networking is here! 🚀',
    created_at: '2024-07-13T10:30:00Z',
    post_media: []
  },
  {
    id: 'post-2',
    text: 'Had an amazing coffee meeting with a fellow developer I met through Tessera. There\'s something special about making connections that start digitally but flourish in person ☕',
    created_at: '2024-07-12T15:45:00Z',
    post_media: [
      {
        media_url: '/MediaPictures/Coffee.jpg',
        type: 'image'
      }
    ]
  },
  {
    id: 'post-3',
    text: 'Working on some new features for the app. The connection flow is getting smoother every day. Can\'t wait to share what we\'re building next! 💻',
    created_at: '2024-07-11T09:15:00Z',
    post_media: []
  },
  {
    id: 'post-4',
    text: 'Tessera isn\'t just about networking - it\'s about building genuine relationships. Every connection tells a story, and every story matters. What\'s your Tessera story?',
    created_at: '2024-07-10T16:20:00Z',
    post_media: [
      {
        media_url: '/MediaPictures/Handshake.jpg',
        type: 'image'
      }
    ]
  },
  {
    id: 'post-5',
    text: 'Friday reflection: This week I connected with 3 new people, had 2 meaningful conversations, and shared 1 amazing experience. Quality over quantity, always! 🌟',
    created_at: '2024-07-09T18:00:00Z',
    post_media: []
  }
];

// Mock posts from other users (for feeds)
export const MOCK_USER_POSTS: { [userId: string]: PostWithMedia[] } = {
  'user-2': [
    {
      id: 'post-john-1',
      text: 'Just discovered this amazing little café downtown through a Tessera connection. Sometimes the best places are found through the people you meet! ☕️',
      created_at: '2024-07-13T12:00:00Z',
      post_media: []
    },
    {
      id: 'post-john-2',
      text: 'Technology is bringing us closer together, one genuine connection at a time. Grateful for platforms like Tessera that prioritize real relationships.',
      created_at: '2024-07-11T14:30:00Z',
      post_media: []
    }
  ],
  'user-3': [
    {
      id: 'post-omar-1',
      text: 'Working on a new design project inspired by the connections I\'ve made recently. There\'s so much creativity when diverse minds come together! 🎨',
      created_at: '2024-07-12T11:15:00Z',
      post_media: []
    }
  ],
  'user-4': [
    {
      id: 'post-sarah-1',
      text: 'Bali update: Met someone through Tessera who showed me this hidden waterfall. Travel is so much richer when you connect with locals and fellow travelers! 🌊',
      created_at: '2024-07-13T08:45:00Z',
      post_media: []
    }
  ]
};

// Mock comments
export interface MockComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string;
}

export const MOCK_COMMENTS: MockComment[] = [
  {
    id: 'comment-1',
    post_id: 'post-1',
    user_id: 'user-2',
    content: 'This is amazing! Can\'t wait to try it out. The demo looks incredibly smooth.',
    created_at: '2024-07-13T11:00:00Z'
  },
  {
    id: 'comment-2',
    post_id: 'post-1',
    user_id: 'user-3',
    content: 'Love the design! Clean and intuitive. Great work on the UX.',
    created_at: '2024-07-13T11:15:00Z'
  },
  {
    id: 'comment-3',
    post_id: 'post-2',
    user_id: 'user-4',
    content: 'Coffee connections are the best connections! ☕ Where was this taken?',
    created_at: '2024-07-12T16:00:00Z'
  },
  {
    id: 'comment-4',
    post_id: 'post-2',
    user_id: 'demo-user-1',
    content: 'At that new place on 5th street! You should check it out next time you\'re in town.',
    created_at: '2024-07-12T16:30:00Z',
    parent_comment_id: 'comment-3'
  },
  {
    id: 'comment-5',
    post_id: 'post-4',
    user_id: 'user-5',
    content: 'So true! I\'ve made some lifelong friends through genuine connections. Quality always beats quantity.',
    created_at: '2024-07-10T17:00:00Z'
  }
];

// Helper functions for accessing mock data
export const getMockUserById = (userId: string): User | undefined => {
  if (userId === DEMO_USER.id) return DEMO_USER;
  return MOCK_CONNECTIONS.find(user => user.id === userId);
};

// Function to add a new post
export const addMockPost = (userId: string, text: string, media?: PostMedia[]): PostWithMedia => {
  const newPost: PostWithMedia = {
    id: `post-${Date.now()}`,
    text,
    created_at: new Date().toISOString(),
    post_media: media || []
  };

  if (userId === DEMO_USER.id) {
    MOCK_POSTS.unshift(newPost);
  } else {
    if (!MOCK_USER_POSTS[userId]) {
      MOCK_USER_POSTS[userId] = [];
    }
    MOCK_USER_POSTS[userId].unshift(newPost);
  }

  return newPost;
};

// Function to delete a post
export const deleteMockPost = async (postId: string, userId: string): Promise<boolean> => {
  // Simulate API delay
  await simulateApiDelay(300);

  // Check demo user's posts
  if (userId === DEMO_USER.id) {
    const index = MOCK_POSTS.findIndex(post => post.id === postId);
    if (index !== -1) {
      MOCK_POSTS.splice(index, 1);
      return true;
    }
  }

  // Check other users' posts
  if (MOCK_USER_POSTS[userId]) {
    const index = MOCK_USER_POSTS[userId].findIndex(post => post.id === postId);
    if (index !== -1) {
      MOCK_USER_POSTS[userId].splice(index, 1);
      return true;
    }
  }

  return false;
};

export const getMockPostsForUser = (userId: string): PostWithMedia[] => {
  if (userId === DEMO_USER.id) return MOCK_POSTS;
  return MOCK_USER_POSTS[userId] || [];
};

export const getMockCommentsForPost = (postId: string): MockComment[] => {
  return MOCK_COMMENTS.filter(comment => comment.post_id === postId);
};

// Simulate API delay for realistic feel
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};