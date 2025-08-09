// src/app/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import ContentCard from 'components/ContentCard'; // Import ContentCard component
import { ContentCardType } from 'types'; // Import the ContentCardType

// Import icons for the connections section
import { FaEnvelope, FaLinkedinIn, FaGithub, FaFacebookF, FaInstagram } from 'react-icons/fa';

// ⭐ DUMMY DATA FOR PROJECTS
const myProjects: ContentCardType[] = [
  {
    id: 1,
    title: 'Anime/Movie Website Project',
    imageUrl: '/placeholders/anime-website-project.jpg', // Placeholder image
    genre: 'Web Development',
    year: '2024',
    type: 'project',
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    imageUrl: '/placeholders/ecommerce-project.jpg', // Placeholder image
    genre: 'Full-Stack Development',
    year: '2023',
    type: 'project',
  },
  {
    id: 3,
    title: 'Personal Blog Application',
    imageUrl: '/placeholders/blog-project.jpg', // Placeholder image
    genre: 'CMS, Blogging',
    year: '2023',
    type: 'project',
  },
  {
    id: 4,
    title: 'Real-time Chat App',
    imageUrl: '/placeholders/chat-app.jpg', // Placeholder image
    genre: 'Sockets, Messaging',
    year: '2022',
    type: 'project',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#212121]">
      <main className="flex-grow container mx-auto py-8 px-4 text-[#FBE9E7]">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> &gt;
          <span> About</span>
        </div>

        <h1 className="text-3xl font-bold text-[#FBE9E7] mb-8">About Me</h1>

        {/* About Me Section */}
        <section className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col items-center md:flex-row md:items-start md:gap-8">
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 mb-4 md:mb-0">
              <Image
                src="/placeholders/your-avatar.jpg" // Replace with your actual avatar image
                alt="Your Name"
                fill
                className="object-cover rounded-full border-4 border-[#2196F3]"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#FBE9E7] mb-1">Raymart Maqueda</h2>
              <p className="text-xl text-[#FFD54F] mb-4">A Passionate Full-Stack Developer</p>
              <p className="text-gray-200 leading-relaxed max-w-2xl">
                Hello! I'm Raymart Maqueda, a dedicated Full-Stack Developer with a keen interest in building engaging and user-friendly web applications. I love diving deep into new technologies and solving complex problems with elegant code.
              </p>
              <p className="text-gray-200 leading-relaxed mt-2 max-w-2xl">
                This project is a demonstration of my skills in Next.js, TypeScript, and Tailwind CSS and my passion for creating seamless digital experiences. I aim to create performant and visually appealing applications.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-[#FBE9E7] mb-4">My Skills</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#212121] text-[#FBE9E7] text-sm px-4 py-2 rounded-full">React</span>
            <span className="bg-[#212121] text-[#FBE9E7] text-sm px-4 py-2 rounded-full">Next.js</span>
            <span className="bg-[#212121] text-[#FBE9E7] text-sm px-4 py-2 rounded-full">TypeScript</span>
            <span className="bg-[#212121] text-[#FBE9E7] text-sm px-4 py-2 rounded-full">Tailwind CSS</span>
            <span className="bg-[#212121] text-[#FBE9E7] text-sm px-4 py-2 rounded-full">Node.js</span>
            <span className="bg-[#212121] text-[#FBE9E7] text-sm px-4 py-2 rounded-full">Express.js</span>
            <span className="bg-[#212121] text-[#FBE9E7] text-sm px-4 py-2 rounded-full">MongoDB</span>
            <span className="bg-[#212121] text-[#FBE9E7] text-sm px-4 py-2 rounded-full">Git</span>
            <span className="bg-[#212121] text-[#FBE9E7] text-sm px-4 py-2 rounded-full">RESTful APIs</span>
          </div>
        </section>
        
        {/* ⭐ NEW: Projects Section */}
        <section className="bg-[#3E2723] p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-[#FBE9E7] mb-4">My Projects</h3>
          {/* Display projects in a responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myProjects.map((project) => (
              <ContentCard key={project.id} card={project} />
            ))}
          </div>
        </section>

        {/* Let's Connect Section with react-icons */}
        <section className="bg-[#3E2723] p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#FBE9E7] mb-4">Let's Connect</h3>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="mailto:Raymart.Maqueda@gmail.com" className="text-[#2196F3] hover:underline flex items-center gap-2">
              <FaEnvelope className="h-6 w-6" />
              Raymart.Maqueda@gmail.com
            </Link>
            <Link href="https://www.linkedin.com/in/raymart-maqueda/" target="_blank" rel="noopener noreferrer" className="text-[#2196F3] hover:underline flex items-center gap-2">
              <FaLinkedinIn className="h-6 w-6" />
              LinkedIn
            </Link>
            <Link href="https://github.com/kuyamarqk" target="_blank" rel="noopener noreferrer" className="text-[#2196F3] hover:underline flex items-center gap-2">
              <FaGithub className="h-6 w-6" />
              GitHub
            </Link>
            <Link href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-[#2196F3] hover:underline flex items-center gap-2">
              <FaFacebookF className="h-6 w-6" />
              Facebook
            </Link>
            <Link href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-[#2196F3] hover:underline flex items-center gap-2">
              <FaInstagram className="h-6 w-6" />
              Instagram
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;