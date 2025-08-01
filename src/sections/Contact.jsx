import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Github, Linkedin, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = element?.classList.contains('interactive') ||
        element?.tagName === 'A' || element?.tagName === 'BUTTON' || element?.closest('.interactive');
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

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

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

  // Particle system
  const initializeParticles = useCallback(() => {
    const particles = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: `hsl(${Math.random() * 60 + 240}, 100%, ${Math.random() * 40 + 50}%)`,
      });
    }
    particlesRef.current = particles;
  }, []);

  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    animationRef.current = requestAnimationFrame(animateParticles);
  }, []);

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

  // EmailJS form handling
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // EmailJS configuration - replace with your actual service details
      const serviceId = 'service_0tgiozs';
      const templateId = 'template_y3h5kir';
      const publicKey = 'user_yLst_k0GjVfqm6yDW';

      // Load EmailJS dynamically
      if (!window.emailjs) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        document.head.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });

        window.emailjs.init(publicKey);
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Samsudeen Mohammed Riyaz S',
      };

      await window.emailjs.send(serviceId, templateId, templateParams);

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 5000);
    }
  };

  // Custom cursor
  const CustomCursor = () => (
    <div className="hidden md:block">
      <div
        className={`fixed w-6 h-6 rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${clicked ? 'scale-50' : hovered ? 'scale-150' : 'scale-100'
          }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: hovered
            ? 'radial-gradient(circle, rgba(139, 92, 246, 1) 0%, rgba(79, 70, 229, 0.8) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
          boxShadow: hovered
            ? '0 0 20px rgba(139, 92, 246, 0.6)'
            : '0 0 10px rgba(255, 255, 255, 0.5)'
        }}
      />
      <div
        className="fixed w-1 h-1 bg-white rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </div>
  );

  const FloatingText = ({ text, className = "" }) => {
    const letters = text.split('');
    return (
      <div className={`flex flex-wrap justify-center ${className}`}>
        {letters.map((letter, i) => (
          <span
            key={i}
            className="inline-block hover:-translate-y-3 transition-all duration-500 hover:text-indigo-400 cursor-default"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </div>
    );
  };

  const ProjectCard = ({ title, description, tags, index }) => (
    <div
      className="relative p-6 bg-gray-900/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-700 hover:shadow-xl hover:shadow-indigo-500/20 group interactive transform hover:-translate-y-2"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl" />
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed text-sm">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full text-xs text-indigo-300 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const SkillCard = ({ skill, icon }) => (
    <div className="relative p-4 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 group interactive hover:scale-105">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h4 className="text-white font-semibold group-hover:text-indigo-300 transition-colors duration-300">{skill}</h4>
      </div>
    </div>
  );

  const projects = [
    {
      title: 'Rock Paper Scissors Game',
      description: 'Fun, animated game with exploding confetti for wins and consoling jokes for losses. Features smooth React animations.',
      tags: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB']
    },
    {
      title: 'Personal Portfolio',
      description: 'Professional portfolio website showcasing skills, projects, and experience with modern web technologies.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design']
    },
    {
      title: 'CRUD Application',
      description: 'Comprehensive CRUD application built with Java, demonstrating database operations with intuitive UI.',
      tags: ['Java', 'MySQL', 'Eclipse IDE', 'Database Design']
    },
    {
      title: 'Amazon Product Management',
      description: 'Sophisticated system for managing Amazon products with advanced filtering and inventory tracking.',
      tags: ['Java', 'MySQL', 'Backend Development']
    },
    {
      title: 'Employee Management System',
      description: 'Complete employee management solution with HR operations, payroll management, and performance tracking.',
      tags: ['Full Stack', 'Database Design', 'Java']
    },
    {
      title: 'Tutor Booking Website',
      description: 'Interactive platform connecting students with tutors, featuring booking systems and payment integration.',
      tags: ['React', 'Node.js', 'MongoDB', 'Payment Gateway']
    }
  ];

  const skills = [
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
  ];

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
      <nav className={`fixed top-0 left-0 right-0 z-40 py-4 transition-all duration-700 ${scrolled ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50' : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Hey Everyone
            </span>
          </a>
          <div className="hidden md:flex gap-8">
            {['home', 'about', 'work', 'contact'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={`relative text-gray-300 hover:text-white transition-all duration-300 interactive ${activeSection === item ? 'text-white' : ''
                  }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                {activeSection === item && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                )}
              </a>
            ))}
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 interactive">
            Connect
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
        <div className="container mx-auto py-32 text-center relative z-20">
          <div className="relative inline-block mb-12">
            <div className="absolute -inset-8 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <h1 className="relative text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-8">
              <FloatingText text="Full Stack Developer" className="justify-center" />
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed">
            I'm <span className="text-indigo-400 font-semibold">Samsudeen Mohammed Riyaz S</span>, a passionate
            <span className="text-purple-400"> Full Stack Developer</span> creating
            <span className="text-indigo-400"> immersive digital experiences</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-500 interactive hover:scale-105">
              Explore My Universe
            </button>
            <button className="px-10 py-4 bg-transparent border-2 border-gray-600 text-white rounded-full hover:bg-gray-800/50 hover:border-indigo-500 transition-all duration-500 interactive hover:scale-105">
              Download CV
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-indigo-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-20 flex items-center relative z-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 border-3 border-indigo-500/30 rounded-full animate-spin" style={{ animationDuration: '25s' }} />
                <div className="absolute inset-6 border-2 border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />

                <div className="absolute inset-16 bg-gradient-to-br from-gray-900/80 to-indigo-900/40 rounded-full border-2 border-gray-700/50 backdrop-blur-lg flex items-center justify-center p-2">
                  <div className="text-center">
                    <div className="w-52 h-52 rounded-full mx-auto mb-4 overflow-hidden border-3 border-indigo-400/60 shadow-xl shadow-indigo-500/40 transition-all duration-500 hover:scale-110 group">
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-6xl font-bold text-white">
                        SR
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm font-medium tracking-wider">FULL STACK DEVELOPER</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
                <FloatingText text="About Me" />
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                A vibrant, enthusiastic individual with a keen interest in software development and problem solving.
                I graduated with a B.E in Computer Science Engineering with CGPA 7.63 from Einstein College of Engineering in 2024.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                My positive attitude and eagerness to learn make me particularly excited about leveraging my skills
                to contribute to the success of IT projects and create innovative digital solutions.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                {skills.map((item, i) => (
                  <SkillCard key={i} {...item} />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mt-10">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 interactive">
                  View Resume
                </button>
                <button className="px-8 py-4 border border-gray-600 text-white rounded-full hover:bg-gray-800/50 transition-all duration-300 interactive">
                  Contact Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="min-h-screen py-20 relative z-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 text-center">
            <FloatingText text="My Projects" />
          </h2>
          <p className="text-gray-300 text-xl mb-20 text-center max-w-3xl mx-auto">
            Explore my cosmic collection of projects that showcase innovation and technical expertise.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <ProjectCard key={i} index={i} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-20 flex items-center relative z-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 text-center">
            <FloatingText text="Connect With Me" />
          </h2>
          <p className="text-gray-300 text-xl mb-20 text-center">
            Ready to embark on a cosmic journey together? Let's create something extraordinary!
          </p>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="p-6 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50">
                <h3 className="text-2xl font-bold text-indigo-400 mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-indigo-400 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white">samsudeenmohammedriyaz@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-indigo-400 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p className="text-white">+91 9382093530</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-indigo-400 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className="text-white">Tirunelveli, Tamil Nadu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
                  Failed to send message. Please try again or contact me directly.
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  required
                  className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive"
                />
              </div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                required
                className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                rows="5"
                required
                className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-500 interactive hover:scale-[1.02] backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Launch Message Into The Cosmos
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900/30 backdrop-blur-sm border-t border-gray-800/50 relative z-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                SAMSUDEEN MOHAMMED RIYAZ S
              </h3>
              <p className="text-gray-400 mb-4">Full Stack Developer</p>
              <p className="text-gray-500">© {new Date().getFullYear()} All Rights Reserved</p>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-6">
              <div className="flex gap-6">
                {[
                  { name: 'GitHub', icon: <Github className="w-5 h-5" /> },
                  { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" /> },
                  { name: 'Twitter', icon: <Twitter className="w-5 h-5" /> },
                  { name: 'Email', icon: <Mail className="w-5 h-5" /> }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50 border border-gray-700/50 transition-all duration-300 interactive hover:scale-110"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              <div className="text-center lg:text-right">
                <p className="text-gray-400 text-sm mb-2">Let's build something extraordinary together</p>
                <div className="flex items-center justify-center lg:justify-end gap-2 text-indigo-400">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                  <span className="text-sm">Available for freelance work</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800/50">
            <div className="flex justify-center">
              <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-sm">
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

      {/* Global Styles */}
      <style jsx>{`
        * {
          cursor: none;
        }
        
        @media (max-width: 768px) {
          * {
            cursor: auto;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
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
        
        html {
          scroll-behavior: smooth;
        }
        
        ::selection {
          background: rgba(139, 92, 246, 0.3);
          color: white;
        }
        
        .interactive:focus {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        @media (hover: none) and (pointer: coarse) {
          .interactive:hover {
            transform: none;
          }
          
          .interactive:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;