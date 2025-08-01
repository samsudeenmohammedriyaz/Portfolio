/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

const Portfolio = () => {
  // State management
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Mouse tracking with velocity calculation
  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPos = { x: e.clientX, y: e.clientY };

      // Calculate velocity for gravitational effects
      const velocity = {
        x: newPos.x - lastMousePos.current.x,
        y: newPos.y - lastMousePos.current.y
      };

      setPosition(newPos);
      setMouseVelocity(velocity);
      lastMousePos.current = newPos;

      // Enhanced hover detection
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = element?.classList.contains('interactive') ||
        element?.tagName === 'A' ||
        element?.tagName === 'BUTTON' ||
        element?.closest('.interactive');
      setHovered(isInteractive);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Advanced scroll handling with section transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      // More precise active section detection
      const sections = ['home', 'about', 'work', 'contact'];
      const windowHeight = window.innerHeight;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          if (elementCenter <= windowHeight / 2 && elementCenter >= -windowHeight / 2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Particle system for cosmic effects
  const initializeParticles = useCallback(() => {
    const particles = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        color: `hsl(${Math.random() * 60 + 240}, 100%, ${Math.random() * 50 + 50}%)`,
        life: Math.random() * 100 + 50
      });
    }
    particlesRef.current = particles;
  }, []);

  // Particle animation loop
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      // Natural particle movement without mouse influence
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Add some randomness for organic movement
      particle.vx += (Math.random() - 0.5) * 0.01;
      particle.vy += (Math.random() - 0.5) * 0.01;

      // Limit velocity to prevent particles from moving too fast
      const maxVelocity = 1;
      if (Math.abs(particle.vx) > maxVelocity) particle.vx = particle.vx > 0 ? maxVelocity : -maxVelocity;
      if (Math.abs(particle.vy) > maxVelocity) particle.vy = particle.vy > 0 ? maxVelocity : -maxVelocity;

      // Boundary wrapping
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Natural life cycle
      particle.life -= 0.1;

      // Reset particle if dead
      if (particle.life <= 0) {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.5;
        particle.life = Math.random() * 100 + 50;
        particle.opacity = Math.random() * 0.8 + 0.2;
      }

      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Connect nearby particles
      particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx2 = particle.x - otherParticle.x;
          const dy2 = particle.y - otherParticle.y;
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (distance2 < 100) {
            ctx.save();
            ctx.globalAlpha = (100 - distance2) / 100 * 0.3;
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      });
    });

    animationRef.current = requestAnimationFrame(animateParticles);
  }, []);

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    initializeParticles();
    animateParticles();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeParticles, animateParticles]);

  // Enhanced custom cursor
  const CustomCursor = () => (
    <>
      <div
        ref={cursorRef}
        className={`fixed w-6 h-6 rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out hidden md:block ${clicked ? 'scale-50' : hovered ? 'scale-150' : 'scale-100'
          }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: hovered
            ? 'radial-gradient(circle, rgba(139, 92, 246, 1) 0%, rgba(79, 70, 229, 0.8) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
          boxShadow: hovered
            ? '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)'
            : '0 0 10px rgba(255, 255, 255, 0.5)'
        }}
      />
      <div
        className="fixed w-1 h-1 bg-white rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );

  // Floating text with gravitational effect
  const FloatingText = ({ text, className = "" }) => {
    const letters = text.split('');
    return (
      <div className={`flex flex-wrap justify-center ${className}`}>
        {letters.map((letter, i) => (
          <span
            key={i}
            className="inline-block hover:-translate-y-3 transition-all duration-500 hover:text-indigo-400 hover:scale-110 cursor-default"
            style={{
              animationDelay: `${i * 0.1}s`,
              filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))'
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </div>
    );
  };

  // Enhanced project card with cosmic theme
  const ProjectCard = ({ title, description, tags, index }) => (
    <div
      className="relative p-4 sm:p-6 lg:p-8 bg-gray-900/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-500/20 overflow-hidden group interactive transform hover:-translate-y-2"
      style={{
        transitionDelay: `${index * 150}ms`,
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(55, 48, 163, 0.1) 100%)'
      }}
    >
      {/* Cosmic background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

      {/* Floating orb */}
      <div className="absolute -top-4 -right-4 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-xl group-hover:scale-150 group-hover:rotate-180 transition-all duration-1000" />

      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4 group-hover:text-indigo-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-300 mb-4 lg:mb-6 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 bg-gray-800/50 backdrop-blur-sm rounded-full text-xs sm:text-sm text-indigo-300 border border-gray-700/50 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Particle trail effect on hover */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
  );

  // Skill card with cosmic theme - simplified without levels
  const SkillCard = ({ skill, icon, index }) => (
    <div className="relative p-3 sm:p-4 lg:p-6 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 group interactive hover:scale-105">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-lg sm:text-xl lg:text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h4 className="text-white font-semibold text-sm sm:text-base lg:text-lg group-hover:text-indigo-300 transition-colors duration-300">{skill}</h4>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, rgba(17, 24, 39, 0.8) 0%, rgba(0, 0, 0, 1) 100%)' }}
      />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 py-3 sm:py-4 lg:py-6 transition-all duration-700 ${scrolled ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50' : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          <a href="#" className="text-xl sm:text-2xl lg:text-3xl font-bold">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Hey Everyone
            </span>
          </a>
          <div className="hidden md:flex gap-4 lg:gap-8">
            {['home', 'about', 'work', 'contact'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={`relative text-gray-300 hover:text-white transition-all duration-300 interactive text-sm lg:text-base ${activeSection === item ? 'text-white' : ''
                  }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                {activeSection === item && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                )}
              </a>
            ))}
          </div>
          <button className="px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 interactive backdrop-blur-sm text-sm lg:text-base">
            Connect
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
        <div className="container mx-auto py-20 sm:py-24 lg:py-32 text-center relative z-20">
          <div className="relative inline-block mb-8 sm:mb-10 lg:mb-12">
            <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <h1 className="relative text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 sm:mb-8">
              <FloatingText text="Full Stack Developer" className="justify-center" />
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-10 sm:mb-12 lg:mb-16 leading-relaxed px-4">
            I'm <span className="text-indigo-400 font-semibold">Samsudeen Mohammed Riyaz S</span>, a passionate
            <span className="text-purple-400"> Full Stack Developer</span> creating
            <span className="text-indigo-400"> immersive digital experiences</span> that transcend ordinary web boundaries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
            <button className="px-6 py-3 sm:px-8 sm:py-4 lg:px-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-500 interactive hover:scale-105 text-sm sm:text-base">
              Explore My Universe
            </button>
            <button className="px-6 py-3 sm:px-8 sm:py-4 lg:px-10 bg-transparent border-2 border-gray-600 text-white rounded-full hover:bg-gray-800/50 hover:border-indigo-500 transition-all duration-500 interactive hover:scale-105 text-sm sm:text-base">
              Download CV
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-indigo-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-12 sm:py-16 lg:py-20 flex items-center relative z-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative w-full aspect-square max-w-xs sm:max-w-sm lg:max-w-lg mx-auto">
                {/* Enhanced Orbital rings - responsive sizing */}
                <div className="absolute inset-0 border-2 sm:border-[3px] border-indigo-500/30 rounded-full animate-spin" style={{ animationDuration: '25s' }} />
                <div className="absolute inset-3 sm:inset-6 border border-purple-500/20 sm:border-2 rounded-full animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
                <div className="absolute inset-6 sm:inset-12 border border-indigo-400/10 rounded-full animate-spin" style={{ animationDuration: '12s' }} />

                {/* Central profile area with much larger image */}
                <div className="absolute inset-8 sm:inset-12 lg:inset-16 bg-gradient-to-br from-gray-900/80 to-indigo-900/40 rounded-full border-2 border-gray-700/50 backdrop-blur-lg flex items-center justify-center p-1 sm:p-2">
                  <div className="text-center">
                    {/* Much larger profile image with enhanced effects */}
                    <div className="w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 xl:w-60 xl:h-60 rounded-full mx-auto mb-3 sm:mb-4 overflow-hidden border-2 sm:border-[3px] border-indigo-400/60 shadow-xl shadow-indigo-500/40 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/60 group">
                      <img
                        src="../assets/Profile.png"
                        alt="Samsudeen Mohammed Riyaz S"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-indigo-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm font-medium tracking-wider">FULL STACK DEVELOPER</p>
                  </div>
                </div>

                {/* Floating particles decoration */}
                <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 bg-purple-500/10 rounded-full blur-md animate-pulse" />
                <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 w-8 h-8 sm:w-12 sm:h-12 bg-indigo-500/10 rounded-full blur-lg" />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
                <FloatingText text="About Me" />
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                A vibrant, enthusiastic individual with a keen interest in software development and problem solving.
                I graduated with a B.E in Computer Science Engineering with CGPA 7.63 from Einstein College of Engineering in 2024.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                My positive attitude and eagerness to learn make me particularly excited about leveraging my skills
                to contribute to the success of IT projects and create innovative digital solutions.
              </p>

              {/* Skills Grid - Responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10">
                {[
                  { skill: 'React.js', icon: '⚛️' },
                  { skill: 'JavaScript', icon: '🟨' },
                  { skill: 'Node.js', icon: '🟢' },
                  { skill: 'Express.js', icon: '🚀' },
                  { skill: 'MongoDB', icon: '🍃' },
                  { skill: 'MySQL', icon: '🐬' },
                  { skill: 'Java', icon: '☕' },
                  { skill: 'HTML5', icon: '🌐' },
                  { skill: 'CSS3', icon: '🎨' },
                  { skill: 'Tailwind CSS', icon: '💨' },
                  { skill: 'Git', icon: '📚' },
                  { skill: 'VS Code', icon: '💻' }
                ].map((item, i) => (
                  <SkillCard key={i} index={i} {...item} />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-10">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 interactive text-sm sm:text-base">
                  View Resume
                </button>
                <button className="px-6 py-3 sm:px-8 sm:py-4 border border-gray-600 text-white rounded-full hover:bg-gray-800/50 transition-all duration-300 interactive text-sm sm:text-base">
                  Contact Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="min-h-screen py-12 sm:py-16 lg:py-20 relative z-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 text-center">
            <FloatingText text="My Projects" />
          </h2>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl mb-12 sm:mb-16 lg:mb-20 text-center max-w-3xl mx-auto">
            Explore my cosmic collection of projects that showcase innovation and technical expertise.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'Rock Paper Scissors Game',
                description: 'Built a fun, animated Rock-Paper-Scissors game with exploding confetti for wins and consoling jokes for losses. Features smooth React animations and responsive design.',
                tags: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB']
              },
              {
                title: 'Personal Portfolio',
                description: 'A professional and visually appealing portfolio website designed to showcase skills, projects, and experience with modern web technologies.',
                tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design']
              },
              {
                title: 'CRUD Application',
                description: 'A comprehensive CRUD application built using Java, demonstrating fundamental database operations with an intuitive user interface.',
                tags: ['Java', 'MySQL', 'Eclipse IDE', 'Database Design']
              },
              {
                title: 'Amazon Product Management',
                description: 'A sophisticated system for managing Amazon products with advanced filtering, search capabilities, and inventory tracking.',
                tags: ['Java', 'MySQL', 'Backend Development']
              },
              {
                title: 'Employee Management System',
                description: 'Complete employee management solution with features for HR operations, payroll management, and performance tracking.',
                tags: ['Full Stack', 'Database Design', 'Java']
              },
              {
                title: 'Tutor Booking Website',
                description: 'An interactive platform connecting students with tutors, featuring booking systems, scheduling, and payment integration.',
                tags: ['React', 'Node.js', 'MongoDB', 'Payment Gateway']
              }
            ].map((project, i) => (
              <ProjectCard key={i} index={i} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-12 sm:py-16 lg:py-20 flex items-center relative z-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 text-center">
            <FloatingText text="Connect With Me" />
          </h2>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl mb-12 sm:mb-16 lg:mb-20 text-center">
            Ready to embark on a cosmic journey together? Let's create something extraordinary!
          </p>

          <div className="grid md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-6 sm:space-y-8">
              <div className="p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50">
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-400 mb-4">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-400 text-sm sm:text-base">📧</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-400 text-sm sm:text-base">Email</p>
                      <p className="text-white text-sm sm:text-base break-all">samsudeenmohammedriyaz@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-400 text-sm sm:text-base">📱</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-400 text-sm sm:text-base">Phone</p>
                      <p className="text-white text-sm sm:text-base">+91 9382093530</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-400 text-sm sm:text-base">📍</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-400 text-sm sm:text-base">Location</p>
                      <p className="text-white text-sm sm:text-base">Tirunelveli, Tamil Nadu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="space-y-4 sm:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive text-sm sm:text-base"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive text-sm sm:text-base"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive text-sm sm:text-base"
              />
              <textarea
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive resize-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-500 interactive hover:scale-[1.02] backdrop-blur-sm text-sm sm:text-base"
              >
                Launch Message Into The Cosmos
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-12 lg:py-16 bg-gray-900/30 backdrop-blur-sm border-t border-gray-800/50 relative z-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                SAMSUDEEN MOHAMMED RIYAZ S
              </h3>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Full Stack Developer</p>
              <p className="text-gray-500 text-sm sm:text-base">© {new Date().getFullYear()} All Rights Reserved</p>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-4 sm:gap-6">
              <div className="flex gap-4 sm:gap-6">
                {[
                  { name: 'GitHub', icon: <FaGithub /> },
                  { name: 'LinkedIn', icon: <FaLinkedin /> },
                  { name: 'Twitter', icon: <FaTwitter /> },
                  { name: 'Email', icon: <FiMail /> }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50 border border-gray-700/50 transition-all duration-300 interactive hover:scale-110"
                    title={social.name}
                  >
                    <span className="text-base sm:text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>

              <div className="text-center lg:text-right">
                <p className="text-gray-400 text-xs sm:text-sm mb-2">Let's build something extraordinary together</p>
                <div className="flex items-center justify-center lg:justify-end gap-2 text-indigo-400">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                  <span className="text-xs sm:text-sm">Available for freelance work</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cosmic separator */}
          <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-800/50">
            <div className="flex justify-center">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-gray-500 text-xs sm:text-sm">
                <span>Made with</span>
                <span className="text-red-400 animate-pulse">❤️</span>
                <span>and a lot of</span>
                <span className="text-yellow-400">☕</span>
                <span>by Samsudeen</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Toggle (if needed) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 interactive">
          <span className="text-lg">☰</span>
        </button>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @keyframes cosmic-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes orbital {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-cosmic-pulse {
          animation: cosmic-pulse 3s ease-in-out infinite;
        }
        
        .animate-orbital {
          animation: orbital 20s linear infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        @media (min-width: 768px) {
          ::-webkit-scrollbar {
            width: 8px;
          }
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.8);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Selection styling */
        ::selection {
          background: rgba(139, 92, 246, 0.3);
          color: white;
        }
        
        /* Backdrop blur support */
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
          .backdrop-blur-lg {
            backdrop-filter: blur(16px);
          }
        }
        
        /* Focus styles for accessibility */
        .interactive:focus {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }
        
        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Dark theme variables */
        :root {
          --cosmic-primary: #4f46e5;
          --cosmic-secondary: #7c3aed;
          --cosmic-accent: #8b5cf6;
          --cosmic-bg: #000000;
          --cosmic-surface: rgba(17, 24, 39, 0.8);
        }
        
        /* Gradient text utilities */
        .text-gradient {
          background: linear-gradient(90deg, var(--cosmic-primary), var(--cosmic-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        /* Custom button hover effects */
        .interactive:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        
        .interactive:active {
          transform: translateY(0);
          filter: brightness(0.95);
        }
        
        /* Glow effects */
        .glow {
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
        }
        
        .glow-hover:hover {
          box-shadow: 0 0 30px rgba(79, 70, 229, 0.5);
        }
        
        /* Particle animation keyframes */
        @keyframes particle-float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-10px) translateX(5px) rotate(120deg); }
          66% { transform: translateY(5px) translateX(-5px) rotate(240deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
        }
        
        /* Loading animation */
        @keyframes loading-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Cosmic border animation */
        @keyframes border-cosmic {
          0% { border-color: rgba(79, 70, 229, 0.5); }
          50% { border-color: rgba(139, 92, 246, 0.8); }
          100% { border-color: rgba(79, 70, 229, 0.5); }
        }
        
        .border-cosmic {
          animation: border-cosmic 3s ease-in-out infinite;
        }
        
        /* Text shadow for better readability */
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        /* Responsive typography */
        @media (max-width: 768px) {
          .text-responsive {
            font-size: clamp(1rem, 4vw, 2rem);
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .interactive:hover {
            transform: none;
            filter: none;
          }
          
          .interactive:active {
            transform: scale(0.98);
          }
        }
        
        /* High DPI display optimizations */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .blur-3xl {
            filter: blur(48px);
          }
        }
        
        /* Dark mode preference support */
        @media (prefers-color-scheme: dark) {
          :root {
            color-scheme: dark;
          }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;