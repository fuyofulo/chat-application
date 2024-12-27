import { FaTwitter, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa"; // Social media icons

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white py-4 mt-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        {/* Text Section */}
        <div className="text-sm font-serif">
          <p>Crafted with a lot of patience by fuyofulo</p>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-6">
          <a
            href="https://twitter.com/fuyofulo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://github.com/fuyofulo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/fuyofulo/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://www.instagram.com/fuyofulo/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
