import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import defaultProfilePicture from '../assets/defaultProfilePicture.png';
import PostCard, { PostWithMedia } from '../components/Post Components/PostCard.tsx';
import supabase from '../services/supabaseClient';

interface ProfileViewProps {
  profileUser?: {
    user_id: string;
    full_name: string;
    avatar_url: string;
    is_active: boolean;
  };
}

function ProfileView({ profileUser }: ProfileViewProps) {
  const { user: loggedInUser } = useContext(UserContext)!;
  const displayedUser = profileUser || loggedInUser;
  const isOwnProfile = loggedInUser?.user_id === displayedUser?.user_id;
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'bookmarks'>('posts');
  const [posts, setPosts] = useState<PostWithMedia[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!displayedUser) return;

    const uid = displayedUser.user_id;

    async function loadPosts() {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          id,
          text,
          created_at,
          post_media (
            media_url,
            type
          )
        `)
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading posts:', error);
        return;
      }

      const postsWithSigned: PostWithMedia[] = await Promise.all(
        (postsData || []).map(async (post) => {
          const signedMedia = await Promise.all(
            (post.post_media || []).map(async (m) => {
              const url = m.media_url;
              // If external URL (not in our storage), leave as-is
              if (/^https?:\/\//.test(url) && !url.includes('/storage/v1/object/')) {
                return m;
              }

              // Determine bucket path
              let filePath: string;
              const publicMarker = '/storage/v1/object/public/post-media/';
              if (url.includes(publicMarker)) {
                filePath = url.split(publicMarker)[1];
              } else if (/^https?:\/\//.test(url)) {
                // URL might be signed already or other storage URL
                // Extract path after bucket name
                const parts = url.split(`/post-media/`);
                filePath = parts.length > 1 ? parts[1] : url;
              } else {
                // Stored raw path in DB
                filePath = url;
              }

              try {
                const { data: urlData, error: urlErr } = await supabase
                  .storage
                  .from('post-media')
                  .createSignedUrl(filePath, 60 * 60);
                if (urlErr || !urlData?.signedUrl) throw urlErr || new Error('No signedUrl');
                return { ...m, media_url: urlData.signedUrl };
              } catch (e) {
                console.error('Signed URL error for', filePath, e);
                // Fall back to original URL
                return m;
              }
            })
          );

          return { ...post, post_media: signedMedia };
        })
      );

      setPosts(postsWithSigned);
    }

    loadPosts();
  }, [displayedUser]);

  const handleMessageClick = () => {
    if (profileUser) navigate('/direct-messages', { state: { selectedUserId: profileUser.user_id } });
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
          <button className="edit-btn" onClick={handleMessageClick}>Message</button>
        ) : (
          <button className="edit-btn">Edit Profile</button>
        )}
        <button className="share-btn">Share Profile</button>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <h2 className={activeTab === 'posts' ? 'active-tab' : ''} onClick={() => setActiveTab('posts')}>Posts</h2>
          {isOwnProfile && (
            <>
              <h2 className={activeTab === 'replies' ? 'active-tab' : ''} onClick={() => setActiveTab('replies')}>Replies</h2>
              <h2 className={activeTab === 'bookmarks' ? 'active-tab' : ''} onClick={() => setActiveTab('bookmarks')}>Bookmarks</h2>
            </>
          )}
        </div>

        <div className="profile-posts">
          {activeTab === 'posts' && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                user={{ name: displayedUser.full_name, profilePicture: displayedUser.avatar_url || defaultProfilePicture }}
              />
            ))
          ) : (
            activeTab === 'posts' && <p>No posts yet.</p>
          )}
          {isOwnProfile && activeTab === 'replies' && <p>Placeholder for replies...</p>}
          {isOwnProfile && activeTab === 'bookmarks' && <p>Placeholder for bookmarks...</p>}
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
