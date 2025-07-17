import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { getAvatarUrl } from '../utils/avatarUtils';
import PostCard, { PostWithMedia } from '../components/Post Components/PostCard.tsx';
import PostForm from './Post Components/PostForm.tsx';
import PostModal from './Post Components/PostModal.tsx';
import { getMockPostsForUser } from '../data/mockData';

interface ProfileUser {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
}

interface ProfileViewProps {
  profileUser?: ProfileUser;
}

function ProfileView({ profileUser }: ProfileViewProps) {
  const { user: loggedInUser } = useContext(UserContext)!;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'bookmarks'>('posts');
  const [postsLoading, setPostsLoading] = useState(false);
  const [posts, setPosts] = useState<PostWithMedia[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Calculate displayed user and related properties safely
  const displayedUser = profileUser || loggedInUser || null;
  const displayedUserId = displayedUser ? ('user_id' in displayedUser ? displayedUser.user_id : displayedUser.id) : null;
  const isOwnProfile = !!loggedInUser && !!displayedUserId && loggedInUser.id === displayedUserId;

  // Load mock posts
  useEffect(() => {
    if (!displayedUserId) return;
    
    const loadPosts = async () => {
      setPostsLoading(true);
      try {
        
        // Get mock posts for this user
        const mockPosts = getMockPostsForUser(displayedUserId);
        setPosts(mockPosts);
        console.log(`Loaded ${mockPosts.length} mock posts for user ${displayedUserId}`);
      } catch (error) {
        console.error('Error loading mock posts:', error);
      } finally {
        setPostsLoading(false);
      }
    };
    
    loadPosts();
  }, [displayedUserId]);

  // Early return if no user data is available
  if (!displayedUser) {
    return <div className="p-4 text-center text-red-500">Error: No user data available</div>;
  }

  const handleMessageClick = () => {
    if (displayedUserId) {
      navigate(`/direct-messages/${displayedUserId}`);
    }
  };

  // Separate function for reloading posts that can be called from other places
  const refreshPosts = async () => {
    if (!displayedUserId) return;
    
    setPostsLoading(true);
    try {
      // Small delay to ensure delete operation has completed
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Get fresh mock posts for this user
      const mockPosts = getMockPostsForUser(displayedUserId);
      
      // Force a new array reference to ensure React detects the change
      setPosts([...mockPosts]);
      console.log(`Refreshed ${mockPosts.length} mock posts for user ${displayedUserId}`);
    } catch (error) {
      console.error('Error refreshing mock posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  return (
    <div className="profile-layout">
      <div className="profile-sidebar">
        <img
          src={displayedUser.avatar_url || getAvatarUrl(displayedUser.full_name, 'personas')}
          alt="Profile"
          className="profile-image"
        />
        <h2 className="profile-name">{displayedUser.full_name}</h2>
        <h3 className="profile-bio">{displayedUser.bio?.trim() || 'No bio yet.'} </h3>
        {/* <p className="profile-location">Pomona, CA | Joined 20XX</p> */}

        {!isOwnProfile ? (
          <button className="edit-btn" onClick={handleMessageClick}>
            Message
          </button>
        ) : (
          <button className="edit-btn">Edit Profile</button>
        )}
        <button className="share-btn">Share Profile</button>

        {isOwnProfile && (
          <>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="mb-4 px-6 py-2 !bg-[#997C70] !text-white !rounded-lg !w-[150px] !font-bold !border-none"
            >
              New Post
            </button>

            <PostModal
              isOpen={isPostModalOpen}
              onClose={() => setIsPostModalOpen(false)}
            >
              <PostForm
                onClose={() => {
                  setIsPostModalOpen(false);
                  refreshPosts(); // Use the refreshPosts function here
                }}
              />
            </PostModal>
          </>
        )}
      </div>

      <div className="profile-content">
        {/* Rest of your component remains unchanged */}
        {/* But replace loadPosts() calls with refreshPosts() */}
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
          {activeTab === 'posts' &&
            (postsLoading ? (
              <p>Loading posts...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={{
                    name: displayedUser.full_name,
                    profilePicture:
                      displayedUser.avatar_url || getAvatarUrl(displayedUser.full_name, 'personas'),
                  }}
                  onDelete={() => refreshPosts()} // Use refreshPosts here
                  isOwnProfile={isOwnProfile}
                />
              ))
            ) : (
              <p>No posts yet.</p>
            ))}

          {isOwnProfile && activeTab === 'replies' && (
            <p>Placeholder for replies...</p>
          )}
          {isOwnProfile && activeTab === 'bookmarks' && (
            <p>Placeholder for bookmarks...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
