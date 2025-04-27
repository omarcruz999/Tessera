import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import defaultProfilePicture from '../assets/defaultProfilePicture.png';
import PostCard, { PostWithMedia } from '../components/Post Components/PostCard.tsx';
import supabase from '../services/supabaseClient.ts';
import PostForm from './Post Components/PostForm.tsx';
import PostModal from './Post Components/PostModal.tsx';

interface ProfileUser {
  user_id: string;
  full_name: string;
  avatar_url: string;
  is_active: boolean;
}

interface ProfileViewProps {
  profileUser?: ProfileUser;
}

function ProfileView({ profileUser }: ProfileViewProps) {
  const { user: loggedInUser } = useContext(UserContext)!;
  const displayedUser = profileUser || loggedInUser;

  if (!displayedUser) {
    return <div>Error: no user to show</div>;
  }
  
  // Determine the correct ID property for displayedUser
  const displayedUserId =
    'user_id' in displayedUser ? displayedUser.user_id : displayedUser.id;
  const isOwnProfile = loggedInUser?.id === displayedUserId;
  
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'bookmarks'>('posts');
  const [postsLoading, setPostsLoading] = useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostWithMedia[]>([]);

  const loadPosts = async() => {
    if (!displayedUserId) return 

    async function loadPosts(){
      setPostsLoading(true);
      try {
        // grab the current session & token
        const { data: {session} } = await supabase.auth.getSession()
        const token = session?.access_token;

        const resp = await fetch(
          `http://localhost:4000/api/posts?user_id=${displayedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )

      if (!resp.ok) throw new Error(`Failed to fetch posts: ${resp.statusText}`);

      const postsData = await resp.json();
      setPosts(postsData);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setPostsLoading(false);
      }
    }

    loadPosts();
  };

  useEffect(() => { loadPosts(); }, [displayedUserId]);

  const handleMessageClick = () => {
    if (profileUser)
      navigate('/direct-messages', { state: { selectedUserId: profileUser.user_id } });
  };

  if (!displayedUser) return <div>Error: no user to show</div>;

  return (
    <div className="profile-layout">
      <div className="profile-sidebar">
        <img
          src={displayedUser.avatar_url || defaultProfilePicture}
          alt="Profile"
          className="profile-image"
        />
        <h2 className="profile-name">{displayedUser.full_name}</h2>
        <h3 className="profile-bio">Just a regular old guy!</h3>
        <p className="profile-location">Pomona, CA | Joined 20XX</p>
        {!isOwnProfile ? (
          <button className="edit-btn" onClick={handleMessageClick}>
            Message
          </button>
        ) : (
          <button className="edit-btn">Edit Profile</button>
        )}
        <button className="share-btn">Share Profile</button>

        {/* New Post Button + Modal */}
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="!mb-4 !px-6 !py-2 !bg-[#997C70] !text-white !rounded-lg w-[150px] !font-bold !border-none"
        >
          New Post
        </button>

        {isPostModalOpen && <PostForm onClose={() => setIsPostModalOpen(false)} />}

        <PostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)}>
          <PostForm 
            onClose={() => setIsPostModalOpen(false)} 
            onPostCreated = {(newPost : PostWithMedia) => {
              setPosts(prev => [newPost, ...prev]);
              loadPosts();
              setIsPostModalOpen(false);
            }}
            />
        </PostModal>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <h2
            className={activeTab === 'posts' ? 'active-tab' : ''}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </h2>
          {isOwnProfile && (
            <>
              <h2
                className={activeTab === 'replies' ? 'active-tab' : ''}
                onClick={() => setActiveTab('replies')}
              >
                Replies
              </h2>
              <h2
                className={activeTab === 'bookmarks' ? 'active-tab' : ''}
                onClick={() => setActiveTab('bookmarks')}
              >
                Bookmarks
              </h2>
            </>
          )}
        </div>

        <div className="profile-posts">
          {activeTab === 'posts' && (
            postsLoading ? (
              <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                user={{
                  name: displayedUser.full_name,
                  profilePicture: displayedUser.avatar_url || defaultProfilePicture,
                }}
              />
            ))
          ) : (
            <p>No posts yet.</p>
          ))}
          {isOwnProfile && activeTab === 'replies' && <p>Placeholder for replies...</p>}
          {isOwnProfile && activeTab === 'bookmarks' && <p>Placeholder for bookmarks...</p>}
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
