const SectionTitle = ({ children, gradientFrom = 'from-purple-400', gradientTo = 'to-pink-400' }) => {
    return (
      <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
        {children}
      </h2>
    );
  };
  
  export default SectionTitle;