import { useContext } from 'react';
import { UserContext } from '../UserContext';

function ProfileView() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
  }
  const { user } = userContext;

  if (!user) {
    return <div>Error: User is not available</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '16px', width: '100vw', height: '100vh', boxSizing: 'border-box', overflow: 'hidden', maxWidth: "100%"}}>
    {/* Profile Section (1/3) */}
    <div style={{ flex: '1', border: '1px solid #ccc', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
        <img src="/defaultProfilePicture.png" alt="Profile" style={{ width: '100%', maxWidth: '150px', marginBottom: '16px' }} />
        <h2 style={{ color: 'black' }}>{user.name}</h2>
        <h3>Just a regular old guy!</h3>
        <p>Pomona, CA | Month 20XX</p>
        <button style={{ display: 'block', marginBottom: '8px' }}>Edit Profile</button>
        <button style={{ display: 'block' }}>Share Profile</button>
    </div>
    {/* Posts Section (2/3) */}
    <div style={{ flex: '2', border: '1px solid #ccc', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
        <h2>Posts</h2>
        <p>Placeholder for posts...</p>
    </div>
    </div>
  );
}

export default ProfileView;