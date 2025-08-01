const MobileMenu = ({ isOpen, navItems, onClose }) => {
    return (
        <div
            className={`md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
                }`}
        >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="text-2xl text-gray-300 hover:text-purple-400 transition-colors duration-300"
                        onClick={onClose}
                    >
                        {item.name}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default MobileMenu;