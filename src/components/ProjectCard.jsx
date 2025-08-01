import { Github, ExternalLink } from 'lucide-react';

const ProjectCard = ({ project, index, isVisible }) => {
  return (
    <div 
      className={`bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-400/50 transition-all duration-500 group ${
        isVisible ? 'animate-scale-in' : 'opacity-0 scale-90'
      }`}
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      <div className="relative overflow-hidden h-48">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to- from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 bg-gradient-to-r ${project.gradient}/10`}>
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tech.map((tech, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-black/50 rounded-md backdrop-blur-sm">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex space-x-3">
              <a href={project.github} className="p-2 bg-black/50 rounded-full hover:bg-purple-500/30 transition-all duration-300">
                <Github size={18} />
              </a>
              <a href={project.live} className="p-2 bg-black/50 rounded-full hover:bg-cyan-500/30 transition-all duration-300">
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-400">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;