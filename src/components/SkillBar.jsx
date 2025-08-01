const SkillBar = ({ skill, index, isVisible }) => {
    return (
        <div className="animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
            <div className="flex justify-between mb-2">
                <span className="flex items-center">
                    <span className="mr-2">{skill.icon}</span>
                    {skill.name}
                </span>
                <span>{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full bg-gradient-to-r ${skill.color}`}
                    style={{
                        width: isVisible ? `${skill.level}%` : '0%',
                        transition: 'width 1.5s ease-out',
                    }}
                />
            </div>
        </div>
    );
};

export default SkillBar;