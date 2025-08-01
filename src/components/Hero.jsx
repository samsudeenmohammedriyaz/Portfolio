const Hero = () => {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-purple-900/30 text-purple-400 rounded-full border border-purple-400/20">
              Full Stack Developer
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-gray-100">Hi, I'm </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Your Name
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            I build exceptional digital experiences with modern technologies and user-centered design.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#contact"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Contact Me
            </a>
            <a
              href="#projects"
              className="px-8 py-3 border border-gray-700 rounded-lg font-medium text-gray-300 hover:border-purple-400/50 hover:text-purple-400 transition-all duration-300"
            >
              View Projects
            </a>
          </div>
        </div>
      </section>
    );
  };
  
  export default Hero;