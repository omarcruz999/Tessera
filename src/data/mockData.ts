// Mock data for Tessera app - replaces database functionality
import { User } from '../UserContext';
import { PostWithMedia, PostMedia } from '../components/Post Components/PostCard';
import { generateDiceBearAvatar } from '../utils/avatarUtils';
import AlexAvatar from "../assets/AlexAboutAvatar.png"; 
import OmarAvatar from "../assets/OmarAboutAvatar.png";
import JonathanAvatar from "../assets/JohnAboutAvatar.png"; // Import Jonathan's avatar

// Demo user (always "logged in")
export const DEMO_USER: User = {
  id: 'demo-user-1',
  full_name: 'Maya Chen',
  avatar_url: generateDiceBearAvatar('maya-chen', 'personas'),
  is_active: true,
  bio: 'Senior Product Manager at TechFlow Solutions 🚀 I turn coffee into user stories and bugs into features. Former competitive chess player who now applies strategic thinking to building products that users actually want to use. Currently exploring how AI can make social connections more meaningful (and less awkward). Fun fact: I once debugged production code during a wedding ceremony. The bride was grateful! 💻✨'
};

// Mock connections/peers (Tessera team members + diverse users)
export const MOCK_CONNECTIONS: User[] = [
  // Original team members
  {
    id: 'user-alex',
    full_name: 'Alex Matei',
    avatar_url: AlexAvatar,
    is_active: true,
    bio: 'Team Lead & Full Stack Developer - Alex blends his diverse interests—including technology, literature, and philosophy—to build digital tools that make everyday life more thoughtful and connected. A CS undergrad at Cal Poly Pomona, graduating in Spring 2025, he works across the full stack and enjoys guiding collaborative teams to bring meaningful ideas to life.'
  },
  {
    id: 'user-omar',
    full_name: 'Omar Cruz',
    avatar_url: OmarAvatar,
    is_active: true,
    bio: 'Full Stack Developer - Omar builds high-performance, user-friendly full-stack apps by combining backend efficiency with thoughtful UI design to bring big ideas to life. A Computer Science student at Cal Poly Pomona, he\'ll graduate in December 2025 and is passionate about turning ambitious concepts into polished, reliable software.'
  },
  {
    id: 'user-jonathan',
    full_name: 'Jonathan Rodriguez',
    avatar_url: JonathanAvatar,
    is_active: true,
    bio: 'UI/UX Designer - Jonathan brings applications to life through clean, user-focused designs that balance form and function. He crafts intuitive interfaces users love — all while pursuing his degree in computer science at Cal Poly Pomona, graduating August 2025.'
  },
  {
    id: 'user-edgar',
    full_name: 'Edgar Ortiz',
    avatar_url: generateDiceBearAvatar('edgar-ortiz', 'identicon'),
    is_active: true,
    bio: ''
  },
  // Additional diverse users (mix of technical and non-technical)
  {
    id: 'user-marcus',
    full_name: 'Marcus Johnson',
    avatar_url: generateDiceBearAvatar('marcus-johnson', 'personas'),
    is_active: true,
    bio: 'Senior DevOps Engineer ⚙️ Infrastructure whisperer and container orchestrator. If it can be automated, it should be. Coffee enthusiast and dad joke connoisseur.'
  },
  {
    id: 'user-carlos',
    full_name: 'Carlos Rivera',
    avatar_url: generateDiceBearAvatar('carlos-rivera', 'personas'),
    is_active: true,
    bio: 'Mobile App Developer 📱 iOS and Android native development. Creating delightful user experiences one swipe at a time. Salsa dancing enthusiast.'
  },
  {
    id: 'user-jen',
    full_name: 'Jennifer Wu',
    avatar_url: generateDiceBearAvatar('jennifer-wu', 'personas'),
    is_active: true,
    bio: 'Technical Writer & Documentation Specialist 📝 Making complex tech concepts accessible to everyone. Advocate for clear communication and user-friendly docs.'
  },
  {
    id: 'user-david',
    full_name: 'David Thompson',
    avatar_url: generateDiceBearAvatar('david-thompson', 'personas'),
    is_active: true,
    bio: 'Game Developer 🎮 Building immersive worlds and interactive experiences. Unity expert and indie game enthusiast. Always up for a good pixel art discussion.'
  },
  {
    id: 'user-luna',
    full_name: 'Luna Rodriguez',
    avatar_url: generateDiceBearAvatar('luna-rodriguez', 'personas'),
    is_active: true,
    bio: 'Creative Director 🎨 Bringing brands to life through visual storytelling. Skilled in graphic design, branding, and creative strategy. Coffee shop regular and museum wanderer.'
  },
  {
    id: 'user-ahmed',
    full_name: 'Ahmed Hassan',
    avatar_url: generateDiceBearAvatar('ahmed-hassan', 'personas'),
    is_active: true,
    bio: 'Cloud Architect ☁️ Designing scalable, resilient cloud solutions. AWS and Azure certified. Passionate about serverless architecture and cost optimization.'
  },
  {
    id: 'user-elena',
    full_name: 'Elena Volkov',
    avatar_url: generateDiceBearAvatar('elena-volkov', 'personas'),
    is_active: true,
    bio: 'Machine Learning Engineer 🤖 Building intelligent systems that learn and adapt. PhD in Computer Science, specializing in NLP and computer vision.'
  },
  {
    id: 'user-tyler',
    full_name: 'Tyler Brooks',
    avatar_url: generateDiceBearAvatar('tyler-brooks', 'personas'),
    is_active: true,
    bio: 'Frontend Engineer 💻 React and TypeScript specialist. Obsessed with performance optimization and accessibility. Mechanical keyboard enthusiast.'
  },
  {
    id: 'user-zoe',
    full_name: 'Zoe Chen',
    avatar_url: generateDiceBearAvatar('zoe-chen', 'personas'),
    is_active: true,
    bio: 'Startup Founder 🚀 Building the next generation of fintech solutions. Former investment banker turned entrepreneur. Hiking and meditation keep me grounded.'
  },
  {
    id: 'user-robert',
    full_name: 'Robert Taylor',
    avatar_url: generateDiceBearAvatar('robert-taylor', 'personas'),
    is_active: true,
    bio: 'Backend Engineer 🔧 Scalable API design and database optimization. Python and Go enthusiast. Part-time woodworker and full-time problem solver.'
  },
  {
    id: 'user-maya-friend',
    full_name: 'Maya Singh',
    avatar_url: generateDiceBearAvatar('maya-singh', 'personas'),
    is_active: true,
    bio: 'UX Researcher 🔍 Understanding user behavior through research and testing. Passionate about inclusive design and accessibility. Yoga instructor on weekends.'
  },
  {
    id: 'user-kevin',
    full_name: 'Kevin O\'Connor',
    avatar_url: generateDiceBearAvatar('kevin-oconnor', 'personas'),
    is_active: true,
    bio: 'Site Reliability Engineer 🛠️ Keeping systems running smoothly at scale. Monitoring, alerting, and incident response expert. Craft beer brewer in spare time.'
  },
  {
    id: 'user-rachel',
    full_name: 'Rachel Green',
    avatar_url: generateDiceBearAvatar('rachel-green', 'personas'),
    is_active: true,
    bio: 'High School Mathematics Teacher 📚 Making calculus less scary and more fun! Passionate about STEM education and helping students discover their potential. Marathon runner and puzzle enthusiast.'
  },
  {
    id: 'user-daniel',
    full_name: 'Daniel Martinez',
    avatar_url: generateDiceBearAvatar('daniel-martinez', 'personas'),
    is_active: true,
    bio: 'Physical Therapist 🏥 Helping people recover and get back to doing what they love. Specializing in sports medicine and injury prevention. Weekend rock climber and fitness enthusiast.'
  },
  {
    id: 'user-sophia',
    full_name: 'Sophia Anderson',
    avatar_url: generateDiceBearAvatar('sophia-anderson', 'personas'),
    is_active: true,
    bio: 'Marketing Manager 📢 Crafting compelling campaigns that connect brands with their audience. Data-driven storyteller with a passion for consumer psychology. Amateur chef and wine lover.'
  },
  {
    id: 'user-riley',
    full_name: 'Riley Thompson',
    avatar_url: generateDiceBearAvatar('riley-thompson', 'personas'),
    is_active: true,
    bio: 'Technical Lead 👨‍💻 Guiding engineering teams to build amazing products. Full-stack developer turned people manager. Mentor and code reviewer extraordinaire.'
  },
  {
    id: 'user-jordan',
    full_name: 'Jordan Smith',
    avatar_url: generateDiceBearAvatar('jordan-smith', 'personas'),
    is_active: true,
    bio: 'Platform Engineer 🏗️ Building the infrastructure that powers modern applications. Kubernetes and microservices specialist. Rock climbing and photography hobbyist.'
  },
  {
    id: 'user-jessica',
    full_name: 'Jessica Chen',
    avatar_url: generateDiceBearAvatar('jessica-chen', 'personas'),
    is_active: true,
    bio: 'Environmental Lawyer ⚖️ Fighting for climate justice and sustainable policy. Passionate about environmental protection and renewable energy advocacy. Avid hiker and nature photographer.'
  },
  {
    id: 'user-mike',
    full_name: 'Mike O\'Sullivan',
    avatar_url: generateDiceBearAvatar('mike-osullivan', 'personas'),
    is_active: true,
    bio: 'Financial Advisor 💰 Helping families plan for their future and achieve their financial goals. Certified Financial Planner with 10+ years experience. Golf enthusiast and travel blogger.'
  },
  {
    id: 'user-anna',
    full_name: 'Anna Rodriguez',
    avatar_url: generateDiceBearAvatar('anna-rodriguez', 'personas'),
    is_active: true,
    bio: 'Social Worker 🤝 Advocating for vulnerable populations and connecting families with resources. MSW specializing in child welfare and community outreach. Volunteer coordinator and dog lover.'
  },
  {
    id: 'user-ethan',
    full_name: 'Ethan Williams',
    avatar_url: generateDiceBearAvatar('ethan-williams', 'personas'),
    is_active: true,
    bio: 'Blockchain Developer ⛓️ Decentralizing the future one smart contract at a time. Ethereum and Solidity specialist. Cryptocurrency educator and DeFi enthusiast.'
  },
  {
    id: 'user-maria',
    full_name: 'Maria Gonzalez',
    avatar_url: generateDiceBearAvatar('maria-gonzalez', 'personas'),
    is_active: true,
    bio: 'Pediatric Nurse 👩‍⚕️ Caring for little ones and supporting families during challenging times. Pediatric ICU specialist with a heart for healing. Weekend pottery artist and children\'s book collector.'
  },
  {
    id: 'user-alex-friend',
    full_name: 'Alex Torres',
    avatar_url: generateDiceBearAvatar('alex-torres', 'personas'),
    is_active: true,
    bio: 'Growth Hacker 📊 Data-driven growth strategies and user acquisition. A/B testing fanatic and conversion optimization expert. Salsa dancing and travel photography.'
  },
  {
    id: 'user-morgan',
    full_name: 'Morgan Davis',
    avatar_url: generateDiceBearAvatar('morgan-davis', 'personas'),
    is_active: true,
    bio: 'Solutions Architect 🏛️ Designing enterprise-grade software solutions. 15+ years in tech, helping companies scale and modernize. Wine enthusiast and amateur chef.'
  }
];

// Mock posts with realistic content (Maya Chen's posts)
export const MOCK_POSTS: PostWithMedia[] = [
  {
    id: 'post-1',
    text: 'Just shipped our Q3 features ahead of schedule! ✨ The secret? Treating user feedback like chess moves - each piece of criticism is actually showing you the path to victory. My team thinks I\'m crazy for reading every support ticket, but that\'s where the real insights hide. 🏆',
    created_at: '2024-07-13T10:30:00Z',
    post_media: []
  },
  {
    id: 'post-2',
    text: 'Coffee shop productivity hack: Found a café where the barista actually remembers my order AND asks about my current sprint goals. ☕ This is what I call stakeholder alignment! Sometimes the best product meetings happen outside the office. #ProductLife',
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
    text: 'AI update: Built a custom GPT that converts my rambling voice notes into perfectly formatted user stories. It even adds acceptance criteria! 🤖 My developers are simultaneously impressed and terrified. The future of product management is here, and it speaks fluent Jira.',
    created_at: '2024-07-11T09:15:00Z',
    post_media: []
  },
  {
    id: 'post-4',
    text: 'Wedding debugging story time! 💒 So there I was, maid of honor AND on-call PM, when our payment system decided to crash during the ceremony. Quietly slipped out during the vows, fixed the critical bug from the church bathroom, and made it back for the ring exchange. The bride later said I was the real MVP 😂',
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
    text: 'Friday chess lesson applied to product: Sometimes the best move is NOT to move. ♟️ Had three feature requests this week that seemed urgent, but after sleeping on it, realized they were all solving the same root problem. One elegant solution beats three band-aids. Strategic patience > reactive shipping.',
    created_at: '2024-07-09T18:00:00Z',
    post_media: []
  }
];

// Mock posts from other users (for feeds)
export const MOCK_USER_POSTS: { [userId: string]: PostWithMedia[] } = {
  'user-alex': [
    {
      id: 'post-alex-1',
      text: 'Just finished implementing a new feature that connects literature analysis with user behavior patterns. Amazing how philosophy and technology intersect! 📚💻',
      created_at: '2024-07-13T12:00:00Z',
      post_media: []
    }
  ],
  'user-omar': [
    {
      id: 'post-omar-1',
      text: 'Backend optimization success! 🚀 Reduced API response time by 40% through better caching strategies. Performance improvements make everyone happy.',
      created_at: '2024-07-12T11:15:00Z',
      post_media: []
    }
  ],
  'user-rachel': [
    {
      id: 'post-rachel-1',
      text: 'Today my calculus students finally had their "aha!" moment with derivatives! 📚✨ Nothing beats seeing the lightbulb go off when abstract concepts suddenly make sense. Teaching is just problem-solving with people.',
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
    user_id: 'user-alex',
    content: 'Strategic thinking applied to product delivery - I love this approach! 🧠 The chess analogy is perfect for explaining complex PM concepts.',
    created_at: '2024-07-13T11:00:00Z'
  },
  {
    id: 'comment-2',
    post_id: 'post-1',
    user_id: 'user-tyler',
    content: 'As a frontend dev, I appreciate PMs who actually read our bug reports. User feedback is gold! 💎',
    created_at: '2024-07-13T11:15:00Z'
  },
  {
    id: 'comment-3',
    post_id: 'post-2',
    user_id: 'user-rachel',
    content: 'That barista sounds like they understand agile methodology better than most stakeholders! ☕ Coffee shop meetings are underrated.',
    created_at: '2024-07-12T16:00:00Z'
  },
  {
    id: 'comment-4',
    post_id: 'post-2',
    user_id: 'demo-user-1',
    content: 'Right? Sometimes the best insights come from the most unexpected places. That place has become my unofficial office! 😄',
    created_at: '2024-07-12T16:30:00Z',
    parent_comment_id: 'comment-3'
  },
  {
    id: 'comment-5',
    post_id: 'post-4',
    user_id: 'user-marcus',
    content: 'Wedding debugging is next level dedication! 😂 As someone who\'s been on-call during family events, I salute you. The show must go on!',
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
  console.log('Attempting to delete post:', { postId, userId });
  
  // Check demo user's posts
  if (userId === DEMO_USER.id) {
    const index = MOCK_POSTS.findIndex(post => post.id === postId);
    console.log('Found post in MOCK_POSTS at index:', index);
    if (index !== -1) {
      MOCK_POSTS.splice(index, 1);
      console.log('Post deleted from MOCK_POSTS');
      return true;
    }
  }

  // Check other users' posts
  if (MOCK_USER_POSTS[userId]) {
    const index = MOCK_USER_POSTS[userId].findIndex(post => post.id === postId);
    console.log('Found post in MOCK_USER_POSTS at index:', index);
    if (index !== -1) {
      MOCK_USER_POSTS[userId].splice(index, 1);
      console.log('Post deleted from MOCK_USER_POSTS');
      return true;
    }
  }

  console.log('Post not found in any mock data');
  return false;
};

export const getMockPostsForUser = (userId: string): PostWithMedia[] => {
  if (userId === DEMO_USER.id) return MOCK_POSTS;
  return MOCK_USER_POSTS[userId] || [];
};

export const getMockCommentsForPost = (postId: string): MockComment[] => {
  return MOCK_COMMENTS.filter(comment => comment.post_id === postId);
};

