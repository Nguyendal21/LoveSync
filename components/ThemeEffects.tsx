import React, { useEffect, useState } from 'react';
import { ThemeType } from '../types';

interface ThemeEffectsProps {
  theme: ThemeType;
}

const ThemeEffects: React.FC<ThemeEffectsProps> = ({ theme }) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const count = 30; // Number of particles
    const newParticles: React.ReactNode[] = [];

    let content = '';
    let className = 'weather-particle fall-animation';
    let typeClass = '';

    switch (theme) {
      case 'WINTER':
      case 'CHRISTMAS':
        content = '❄️';
        typeClass = 'snowflake';
        break;
      case 'AUTUMN':
        content = '🍁';
        typeClass = 'leaf';
        break;
      case 'SPRING':
        content = '🌸';
        typeClass = 'flower';
        break;
      case 'NATIONAL_DAY':
        content = '⭐️';
        typeClass = 'text-yellow-400';
        break;
      case 'VALENTINE':
        content = '❤️';
        typeClass = 'text-rose-400 opacity-50';
        break;
      default:
        setParticles([]);
        return;
    }

    for (let i = 0; i < count; i++) {
      const style = {
        left: `${Math.random() * 100}vw`,
        animationDuration: `${5 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * 5}s`,
        fontSize: `${10 + Math.random() * 20}px`,
      };
      
      // Randomize leaf variety
      let displayContent = content;
      if (theme === 'AUTUMN') {
          const leaves = ['🍁', '🍂', '🍃'];
          displayContent = leaves[Math.floor(Math.random() * leaves.length)];
      }

      newParticles.push(
        <div key={i} className={`${className} ${typeClass}`} style={style}>
          {displayContent}
        </div>
      );
    }

    setParticles(newParticles);
  }, [theme]);

  return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">{particles}</div>;
};

export default ThemeEffects;