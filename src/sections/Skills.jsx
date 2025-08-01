import { useState, useEffect } from 'react';
import { MousePointer, Star, Zap } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import SkillBar from '../components/SkillBar';
import WorkApproachCard from '../components/WorkApproachCard';

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(document.getElementById('skills'));
    return () => observer.disconnect();
  }, []);

  const skills = [
    { name: 'JavaScript', level: 90, icon: 'JS', color: 'from-yellow-400 to-amber-500' },
    { name: 'React', level: 85, icon: '⚛️', color: 'from-cyan-400 to-blue-500' },
    { name: 'Node.js', level: 80, icon: '⬢', color: 'from-green-400 to-emerald-500' },
    { name: 'CSS/Tailwind', level: 88, icon: '🎨', color: 'from-blue-400 to-indigo-500' },
    { name: 'TypeScript', level: 75, icon: 'TS', color: 'from-blue-400 to-blue-600' },
    { name: 'GraphQL', level: 70, icon: '🟣', color: 'from-pink-400 to-purple-500' },
  ];

  const approaches = [
    {
      icon: MousePointer,
      title: "User-Centric Design",
      description: "I prioritize intuitive interfaces and seamless user experiences in every project."
    },
    {
      icon: Star,
      title: "Quality Code",
      description: "Clean, maintainable code with thorough testing and documentation."
    },
    {
      icon: Zap,
      title: "Performance Focus",
      description: "Optimized solutions that deliver speed and efficiency at scale."
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="Skills"
          gradientFrom="purple-400"
          gradientTo="pink-400"
          isVisible={isVisible}
          animation="slide-up"
        />

        <div className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-gray-300 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              My <span className="text-purple-400">Technical</span> Skills
            </h3>

            {skills.map((skill, index) => (
              <SkillBar
                key={skill.name}
                skill={skill}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-2xl font-semibold text-gray-300 mb-6">
              My <span className="text-cyan-400">Approach</span> to Development
            </h3>

            <div className="space-y-6">
              {approaches.map((approach, index) => (
                <WorkApproachCard
                  key={index}
                  approach={approach}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;