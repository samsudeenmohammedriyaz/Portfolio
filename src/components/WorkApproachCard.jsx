const WorkApproachCard = ({ approach, index, isVisible }) => {
    return (
        <div
            className="flex space-x-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-purple-400/30 transition-all duration-300 group animate-fade-in-stagger"
            style={{
                animationDelay: `${0.9 + index * 0.2}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
        >
            <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg group-hover:bg-purple-500/20 transition-all duration-300">
                <approach.icon size={24} className="text-purple-400" />
            </div>
            <div>
                <h4 className="text-xl font-medium text-gray-200">{approach.title}</h4>
                <p className="text-gray-400">{approach.description}</p>
            </div>
        </div>
    );
};

export default WorkApproachCard;