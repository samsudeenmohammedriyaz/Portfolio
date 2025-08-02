/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Github, Linkedin, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react';
import { FaReact, FaNodeJs, FaJava, FaHtml5, FaCss3Alt, FaGitAlt } from 'react-icons/fa';
import { SiExpress, SiMongodb, SiMysql, SiJavascript, SiTailwindcss, SiVscodium } from 'react-icons/si';
import emailjs from '@emailjs/browser';

const About = () => {
  const [state, setState] = useState({
    position: { x: 0, y: 0 },
    clicked: false,
    hovered: false,
    activeSection: 'home',
    scrolled: false,
    mouseVelocity: { x: 0, y: 0 },
    isMobile: window.innerWidth <= 768,
    formData: { name: '', email: '', subject: '', message: '' },
    isSubmitting: false,
    submitStatus: ''
  });

  const { position, clicked, hovered, activeSection, scrolled, isMobile, formData, isSubmitting, submitStatus } = state;
  const cursorRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Initialize EmailJS with Public Key
  useEffect(() => {
    emailjs.init('yLst_k0GjVfqm6yDW'); // Replace with your EmailJS Public Key
  }, []);

  // Unified event handler setup
  useEffect(() => {
    const handleResize = () => setState(s => ({ ...s, isMobile: window.innerWidth <= 768 }));
    const handleMouseMove = (e) => {
      const newPos = { x: e.clientX, y: e.clientY };
      const velocity = !isMobile ? { x: newPos.x - lastMousePos.current.x, y: newPos.y - lastMousePos.current.y } : { x: 0, y: 0 };
      lastMousePos.current = newPos;
      setState(s => ({
        ...s,
        position: newPos,
        mouseVelocity: velocity,
        hovered: document.elementFromPoint(e.clientX, e.clientY)?.closest('.interactive') !== null
      }));
    };
    const handleMouseDown = () => setState(s => ({ ...s, clicked: true }));
    const handleMouseUp = () => setState(s => ({ ...s, clicked: false }));
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const sections = ['home', 'about', 'work', 'contact'];
      const active = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          return center <= windowHeight / 2 && center >= -windowHeight / 2;
        }
        return false;
      }) || 'home';
      setState(s => ({ ...s, scrolled: scrollY > 50, activeSection: active }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // Particle system initialization
  const initializeParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: isMobile ? 60 : 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
      vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
      size: Math.random() * (isMobile ? 1.5 : 2) + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      color: `hsl(${Math.random() * 60 + 240}, 100%, ${Math.random() * 50 + 50}%)`,
      life: Math.random() * 100 + 50,
      originalVx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
      originalVy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5)
    }));
  }, [isMobile]);

  // Particle animation loop with stable movement
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((p, i) => {
      p.x += p.vx + (Math.random() - 0.5) * 0.01;
      p.y += p.vy + (Math.random() - 0.5) * 0.01;
      p.vx += (p.originalVx - p.vx) * 0.02;
      p.vy += (p.originalVy - p.vy) * 0.02;
      p.vx = Math.min(Math.max(p.vx, isMobile ? -0.8 : -1), isMobile ? 0.8 : 1);
      p.vy = Math.min(Math.max(p.vy, isMobile ? -0.8 : -1), isMobile ? 0.8 : 1);

      p.x = p.x < 0 ? canvas.width : p.x > canvas.width ? 0 : p.x;
      p.y = p.y < 0 ? canvas.height : p.y > canvas.height ? 0 : p.y;

      p.life -= 0.1;
      if (p.life <= 0) {
        Object.assign(p, {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
          vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
          life: Math.random() * 100 + 50,
          opacity: Math.random() * 0.8 + 0.2,
          originalVx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
          originalVy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5)
        });
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (!isMobile || i % 2 === 0) {
        particlesRef.current.forEach((op, j) => {
          if (i !== j) {
            const dx = p.x - op.x;
            const dy = p.y - op.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = isMobile ? 80 : 100;
            if (distance < maxDistance) {
              ctx.save();
              ctx.globalAlpha = (maxDistance - distance) / maxDistance * (isMobile ? 0.2 : 0.3);
              ctx.strokeStyle = '#4f46e5';
              ctx.lineWidth = isMobile ? 0.3 : 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(op.x, op.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      }
    });

    animationRef.current = requestAnimationFrame(animateParticles);
  }, [isMobile]);

  // Canvas setup
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
      cancelAnimationFrame(animationRef.current);
    };
  }, [initializeParticles, animateParticles]);

  // Form handling with EmailJS
  const handleInputChange = (e) => setState(s => ({ ...s, formData: { ...s.formData, [e.target.name]: e.target.value } }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(s => ({ ...s, isSubmitting: true, submitStatus: '' }));
    try {
      await emailjs.sendForm(
        'service_0tgiozs', // Replace with your EmailJS Service ID
        'template_4dc3k9e', // Replace with your EmailJS Template ID
        e.target,
        'yLst_k0GjVfqm6yDW' // Replace with your EmailJS Public Key
      );
      setState(s => ({ ...s, isSubmitting: false, submitStatus: 'success', formData: { name: '', email: '', subject: '', message: '' } }));
    } catch (error) {
      console.error('EmailJS Error:', error);
      setState(s => ({ ...s, isSubmitting: false, submitStatus: 'error' }));
    } finally {
      setTimeout(() => setState(s => ({ ...s, submitStatus: '' })), 5000);
    }
  };

  const CustomCursor = () => !isMobile && (
    <>
      <div
        ref={cursorRef}
        className={`fixed w-6 h-6 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${clicked ? 'scale-50' : hovered ? 'scale-150' : 'scale-100'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: hovered
            ? 'radial-gradient(circle, rgba(139, 92, 246, 1) 0%, rgba(79, 70, 229, 0.8) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
          boxShadow: hovered ? '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)' : '0 0 10px rgba(255, 255, 255, 0.5)'
        }}
      />
      <div className="fixed w-1 h-1 bg-white rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2" style={{ left: `${position.x}px`, top: `${position.y}px` }} />
    </>
  );

  const FloatingText = ({ text, className = '' }) => (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {text.split('').map((letter, i) => (
        <span
          key={i}
          className="inline-block hover:-translate-y-3 transition-all duration-500 hover:text-indigo-400 hover:scale-110 cursor-default"
          style={{ animationDelay: `${i * 0.1}s`, filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </div>
  );

  const ProjectCard = ({ title, description, tags, index }) => (
    <div
      className="relative p-4 sm:p-6 bg-gray-900/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-500/20 group interactive hover:-translate-y-2"
      style={{ transitionDelay: `${index * 150}ms`, background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(55, 48, 163, 0.1) 100%)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-xl group-hover:scale-150 group-hover:rotate-180 transition-all duration-1000" />
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors duration-300">{title}</h3>
        <p className="text-gray-300 mb-4 text-sm sm:text-base">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full text-xs sm:text-sm text-indigo-300 border border-gray-700/50 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
  );

  const SkillCard = ({ skill, icon, index }) => (
    <div className="relative p-3 sm:p-4 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 group interactive hover:scale-105">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h4 className="text-white font-semibold text-sm sm:text-base group-hover:text-indigo-300 transition-colors duration-300">{skill}</h4>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );

  const projects = [
    { title: 'Rock Paper Scissors Game', description: 'Animated game with confetti effects and responsive design.', tags: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB'] },
    { title: 'Personal Portfolio', description: 'Professional portfolio showcasing skills and projects.', tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'] },
    { title: 'CRUD Application', description: 'Database-driven app with intuitive UI.', tags: ['Java', 'MySQL', 'Eclipse IDE', 'Database Design'] },
    { title: 'Amazon Product Management', description: 'System with advanced filtering and inventory tracking.', tags: ['Java', 'MySQL', 'Backend Development'] },
    { title: 'Employee Management System', description: 'HR solution with payroll and performance tracking.', tags: ['Full Stack', 'Database Design', 'Java'] },
    { title: 'Tutor Booking Website', description: 'Platform for tutor-student connections with booking and payments.', tags: ['React', 'Node.js', 'MongoDB', 'Payment Gateway'] }
  ];

  const skills = [
    { skill: 'React.js', icon: <FaReact /> },
    { skill: 'JavaScript', icon: <SiJavascript /> },
    { skill: 'Node.js', icon: <FaNodeJs /> },
    { skill: 'Express.js', icon: <SiExpress /> },
    { skill: 'MongoDB', icon: <SiMongodb /> },
    { skill: 'MySQL', icon: <SiMysql /> },
    { skill: 'Java', icon: <FaJava /> },
    { skill: 'HTML5', icon: <FaHtml5 /> },
    { skill: 'CSS3', icon: <FaCss3Alt /> },
    { skill: 'Tailwind CSS', icon: <SiTailwindcss /> },
    { skill: 'Git', icon: <FaGitAlt /> },
    { skill: 'VS Code', icon: <SiVscodium /> }
  ];

  const navLinks = ['home', 'about', 'work', 'contact'];
  const socials = [
    { name: 'GitHub', icon: <Github className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { name: 'LinkedIn', icon: <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { name: 'Twitter', icon: <Twitter className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { name: 'Email', icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" /> }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(17, 24, 39, 0.8) 0%, rgba(0, 0, 0, 1) 100%)' }} />
      <CustomCursor />

      <nav className={`fixed top-0 left-0 right-0 z-40 py-3 sm:py-4 transition-all duration-700 ${scrolled ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          <a href="#" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Hey Everyone</a>
          <div className="hidden md:flex gap-4">
            {navLinks.map(item => (
              <a key={item} href={`#${item}`} className={`relative text-gray-300 hover:text-white transition-all duration-300 interactive text-sm ${activeSection === item ? 'text-white' : ''}`}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
                {activeSection === item && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />}
              </a>
            ))}
          </div>
          <a href="#contact" className="px-3 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 interactive text-sm">Connect</a>
        </div>
      </nav>

      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
        <div className="container mx-auto py-20 sm:py-24 text-center relative z-20">
          <div className="relative inline-block mb-8 sm:mb-10">
            <div className="absolute -inset-4 sm:-inset-6 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <h1 className="relative text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 sm:mb-8">
              <FloatingText text="Full Stack Developer" />
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-10 sm:mb-12 leading-relaxed px-4">
            I'm <span className="text-indigo-400 font-semibold">Samsudeen Mohammed Riyaz S</span>, a passionate
            <span className="text-purple-400"> Full Stack Developer</span> creating
            <span className="text-indigo-400"> immersive digital experiences</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
            <a href="#work" className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-500 interactive hover:scale-105 text-sm sm:text-base">Explore My Universe</a>
            <button className="px-6 py-3 bg-transparent border-2 border-gray-600 text-white rounded-full hover:bg-gray-800/50 hover:border-indigo-500 transition-all duration-500 interactive hover:scale-105 text-sm sm:text-base">Download CV</button>
          </div>
        </div>
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="w-5 h-8 border-2 border-gray-400 rounded-full flex justify-center"><div className="w-1 h-2 bg-indigo-400 rounded-full mt-2 animate-pulse" /></div>
        </div>
      </section>

      <section id="about" className="min-h-screen py-12 sm:py-16 flex items-center relative z-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative w-full aspect-square max-w-xs sm:max-w-sm mx-auto">
                <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-spin" style={{ animationDuration: '25s' }} />
                <div className="absolute inset-3 sm:inset-6 border border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
                <div className="absolute inset-6 sm:inset-12 border border-indigo-400/10 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
                <div className="absolute inset-8 sm:inset-12 bg-gradient-to-br from-gray-900/80 to-indigo-900/40 rounded-full border-2 border-gray-700/50 backdrop-blur-lg flex items-center justify-center p-1 sm:p-2">
                  <div className="text-center">
                    <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full mx-auto mb-3 sm:mb-4 overflow-hidden border-2 sm:border-[3px] border-indigo-400/60 shadow-xl shadow-indigo-500/40 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/60 group">
                      <img src="../assets/Profile.png" alt="Samsudeen Mohammed Riyaz S" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                      <div className="absolute inset-0 bg-indigo-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm font-medium tracking-wider">FULL STACK DEVELOPER</p>
                  </div>
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-purple-500/10 rounded-full blur-md animate-pulse" />
                <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-indigo-500/10 rounded-full blur-lg" />
              </div>
            </div>
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8"><FloatingText text="About Me" /></h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Enthusiastic B.E. Computer Science graduate (2024, CGPA 7.63) from Einstein College of Engineering, passionate about software development and problem-solving.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Excited to leverage my skills to contribute to innovative IT projects.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10">
                {skills.map((item, i) => <SkillCard key={i} index={i} {...item} />)}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-10">
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 interactive text-sm sm:text-base">View Resume</button>
                <button className="px-6 py-3 border border-gray-600 text-white rounded-full hover:bg-gray-800/50 transition-all duration-300 interactive text-sm sm:text-base">Contact Me</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="min-h-screen py-12 sm:py-16 relative z-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center"><FloatingText text="My Projects" /></h2>
          <p className="text-gray-300 text-base sm:text-lg mb-12 sm:mb-16 text-center max-w-3xl mx-auto">Explore my collection of innovative projects.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, i) => <ProjectCard key={i} index={i} {...project} />)}
          </div>
        </div>
      </section>

      <section id="contact" className="min-h-screen py-12 sm:py-16 flex items-center relative z-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center"><FloatingText text="Connect With Me" /></h2>
          <p className="text-gray-300 text-base sm:text-lg mb-12 sm:mb-16 text-center">Let's create something extraordinary!</p>
          <div className="grid md:grid-cols-2 gap-10 sm:gap-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50">
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-400 mb-4">Get In Touch</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Email', value: 'samsudeenmohammedriyaz@gmail.com' },
                    { icon: <Phone className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Phone', value: '+91 9382093530' },
                    { icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Location', value: 'Tirunelveli, Tamil Nadu' }
                  ].map(({ icon, label, value }, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">{icon}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-400 text-sm sm:text-base">{label}</p>
                        <p className="text-white text-sm sm:text-base break-all">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {submitStatus === 'success' && <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center">Message sent successfully!</div>}
              {submitStatus === 'error' && <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">Failed to send message. Please try again.</div>}
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {['name', 'email'].map(field => (
                  <input
                    key={field}
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive text-sm sm:text-base"
                  />
                ))}
              </div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                required
                className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive text-sm sm:text-base"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                rows="5"
                required
                className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 interactive resize-none text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-500 interactive hover:scale-[1.02] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    Launch Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-10 bg-gray-900/30 backdrop-blur-sm border-t border-gray-800/50 relative z-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3 sm:mb-4">SAMSUDEEN MOHAMMED RIYAZ S</h3>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Full Stack Developer</p>
              <p className="text-gray-500 text-sm sm:text-base">© {new Date().getFullYear()} All Rights Reserved</p>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-4 sm:gap-6">
              <div className="flex gap-4 sm:gap-6">
                {socials.map(social => (
                  <a key={social.name} href="#" className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50 border border-gray-700/50 transition-all duration-300 interactive hover:scale-110" title={social.name}>
                    {social.icon}
                  </a>
                ))}
              </div>
              <div className="text-center lg:text-right">
                <p className="text-gray-400 text-xs sm:text-sm mb-2">Let's build something extraordinary</p>
                <div className="flex items-center justify-center lg:justify-end gap-2 text-indigo-400">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                  <span className="text-xs sm:text-sm">Available for freelance work</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800/50">
            <div className="flex justify-center flex-wrap items-center gap-2 sm:gap-4 text-gray-500 text-xs sm:text-sm">
              <span>Made with lots of</span>
              <span className="text-red-400 animate-pulse">❤️</span>
              <span>and</span>
              <span className="text-yellow-400">☕</span>
              <span>by Samsudeen</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 interactive">
          <span className="text-lg">☰</span>
        </button>
      </div>

      <style jsx>{`
        ${!isMobile ? '* { cursor: none; }' : ''}
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-20px) rotate(2deg); } }
        @keyframes cosmic-pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        @keyframes orbital { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-cosmic-pulse { animation: cosmic-pulse 3s ease-in-out infinite; }
        .animate-orbital { animation: orbital 20s linear infinite; }
        ::-webkit-scrollbar { width: 6px; }
        @media (min-width: 768px) { ::-webkit-scrollbar { width: 8px; } }
        ::-webkit-scrollbar-track { background: rgba(17, 24, 39, 0.8); }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #4f46e5, #7c3aed); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #6366f1, #8b5cf6); }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(139, 92, 246, 0.3); color: white; }
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-sm { backdrop-filter: blur(4px); }
          .backdrop-blur-lg { backdrop-filter: blur(16px); }
        }
        .interactive:focus { outline: 2px solid #4f46e5; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
        :root { --cosmic-primary: #4f46e5; --cosmic-secondary: #7c3aed; --cosmic-accent: #8b5cf6; --cosmic-bg: #000000; --cosmic-surface: rgba(17, 24, 39, 0.8); }
        .text-gradient { background: linear-gradient(90deg, var(--cosmic-primary), --cosmic-secondary); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .interactive:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .interactive:active { transform: translateY(0); filter: brightness(0.95); }
        .glow { box-shadow: 0 0 20px rgba(79, 70, 229, 0.3); }
        .glow-hover:hover { box-shadow: 0 0 30px rgba(79, 70, 229, 0.5); }
        @keyframes particle-float { 0% { transform: translate(0, 0) rotate(0); } 33% { transform: translate(5px, -10px) rotate(120deg); } 66% { transform: translate(-5px, 5px) rotate(240deg); } 100% { transform: translate(0, 0) rotate(360deg); } }
        @keyframes loading-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes border-cosmic { 0% { border-color: rgba(79, 70, 229, 0.5); } 50% { border-color: rgba(139, 92, 246, 0.8); } 100% { border-color: rgba(79, 70, 229, 0.5); } }
        .border-cosmic { animation: border-cosmic 3s ease-in-out infinite; }
        .text-shadow { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }
        @media (max-width: 768px) { .text-responsive { font-size: clamp(1rem, 4vw, 2rem); } canvas { opacity: 0.7; } }
        @media (max-width: 640px) { .container { padding-left: 1rem; padding-right: 1rem; } }
        @media (hover: none) and (pointer: coarse) { .interactive:hover { transform: none; filter: none; } .interactive:active { transform: scale(0.98); } }
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { .blur-3xl { filter: blur(48px); } }
        @media (prefers-color-scheme: dark) { :root { color-scheme: dark; } }
        @media (min-width: 769px) { .interactive { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); } .interactive:hover { transform: translateY(-4px) scale(1.02); filter: brightness(1.15); } }
      `}</style>
    </div>
  );
};

export default About;