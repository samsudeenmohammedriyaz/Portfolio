const AnimatedBackground = () => {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-90"></div>
        {/* Add your animated elements here (particles, gradients, etc.) */}
      </div>
    );
  };
  
  export default AnimatedBackground;