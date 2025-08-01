import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const SocialIcons = () => {
    return (
        <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Github size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Mail size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Twitter size={20} />
            </a>
        </div>
    );
};

export default SocialIcons;