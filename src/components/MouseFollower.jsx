import { useEffect, useState } from 'react';

const MouseFollower = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="fixed w-6 h-6 rounded-full bg-purple-500/20 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transition: 'transform 0.1s ease-out',
            }}
        ></div>
    );
};

export default MouseFollower;