import SectionTitle from '../components/SectionTitle';

const About = () => {
    return (
        <section id="about" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <SectionTitle gradientFrom="from-purple-400" gradientTo="to-cyan-400">
                    About Me
                </SectionTitle>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-300">
                            I'm <span className="text-purple-400">Your Name</span>, a passionate developer
                        </h3>
                        <p className="text-gray-400">
                            With over X years of experience in web development, I specialize in creating modern,
                            responsive, and user-friendly applications. My journey in tech began...
                        </p>
                        <p className="text-gray-400">
                            When I'm not coding, you can find me exploring new technologies, contributing to open-source
                            projects, or enjoying outdoor activities.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="w-full h-80 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl overflow-hidden border border-gray-800">
                            {/* Placeholder for your image or illustration */}
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                [Your Photo/Illustration]
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;