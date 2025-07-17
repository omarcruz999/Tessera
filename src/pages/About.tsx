import DeveloperCard from "../components/AboutUsPage/DeveloperCard";
import AlexAvatar from "../assets/AlexAboutAvatar.png"; 
import OmarAvatar from "../assets/OmarAboutAvatar.png";
import JonathanAvatar from "../assets/JohnAboutAvatar.png"; // Import Jonathan's avatar
import { generateDiceBearAvatar } from "../utils/avatarUtils";

function About() {
  const developers = [
    {
      name: "Alex Matei",
      role: "Team Lead & Full Stack Developer",
      bio: "Alex blends his diverse interests—including technology, literature, and philosophy—to build digital tools that make everyday life more thoughtful and connected. A CS undergrad at Cal Poly Pomona, graduating in Spring 2025, he works across the full stack and enjoys guiding collaborative teams to bring meaningful ideas to life.",
      profilePicture: AlexAvatar,
    },
    {
      name: "Omar Cruz",
      role: "Full Stack Developer",
      bio: "Omar builds high-performance, user-friendly full-stack apps by combining backend efficiency with thoughtful UI design to bring big ideas to life. A Computer Science student at Cal Poly Pomona, he’ll graduate in December 2025 and is passionate about turning ambitious concepts into polished, reliable software.",
      profilePicture: OmarAvatar,
    },
    {
      name: "Jonathan Rodriguez",
      role: "UI/UX Designer",
      bio: "Jonathan brings applications to life through clean, user-focused designs that balance form and function. He crafts intuitive interfaces users love — all while pursuing his degree in computer science at Cal Poly Pomona, graduating August 2025.",
      profilePicture: JonathanAvatar, // Updated to use Jonathan's avatar
    },
    {
      name: "Edgar Ortiz",
      role: "Full Stack Developer",
      bio: "",
      profilePicture: generateDiceBearAvatar('edgar-ortiz', 'identicon'),
    },
  ]


  return (
    <div className="items-center justify-center mt-[20px]">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#424242]">Tessera</h1>

        {/* About the Application Section */}
        <section className="mb-16">
          <div className="bg-[#FDF7F4] p-8 rounded-lg shadow-md">
            <div className="prose max-w-none">
              <p className="text-xl mb-4 text-[#424242]">
                Our platform is designed to help people connect and share meaningful experiences with their peers. We
                believe in building communities that foster genuine relationships and support.
              </p>
              <p className="text-xl mb-4 text-[#424242]">
                Starting as a class project in Spring 2025, we've been working to create a space where users can easily find and connect with
                like-minded individuals, share their thoughts, and collaborate on projects that matter to them.
              </p>
              <p className="text-xl text-[#424242]">
                Our mission is to make online connections feel more personal and authentic, bridging the gap between
                digital interaction and real-world relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Developers Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-[#424242]">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {developers.map((developer, index) => (
              <DeveloperCard
                key={index}
                name={developer.name}
                role={developer.role}
                bio={developer.bio}
                profilePicture={developer.profilePicture}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;