import HomeView from '../components/HomeView.tsx'
import PostForm from '../components/PostForm.tsx';

function Home() {
    return (
      <div className='flex flex-col items-center justify-center'>
        <HomeView />
        <PostForm />
      </div>
    );
  }
  
  export default Home;