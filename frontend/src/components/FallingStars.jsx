import React from 'react';

const FallingStars = ({ density = 'medium' }) => {
  const getDensityConfig = () => {
    switch (density) {
      case 'light':
        return { count: 3, animations: ['animate-falling-star-1', 'animate-falling-star-fast', 'animate-meteor-shower'] };
      case 'heavy':
        return { 
          count: 8, 
          animations: [
            'animate-falling-star-1', 
            'animate-falling-star-2', 
            'animate-falling-star-3',
            'animate-falling-star-fast',
            'animate-falling-star-slow',
            'animate-meteor-shower',
            'animate-shooting-star',
            'animate-comet-trail'
          ] 
        };
      default: // medium
        return { 
          count: 5, 
          animations: [
            'animate-falling-star-1', 
            'animate-falling-star-2', 
            'animate-falling-star-3',
            'animate-falling-star-fast',
            'animate-meteor-shower'
          ] 
        };
    }
  };

  const { count, animations } = getDensityConfig();

  const getRandomPosition = (index) => {
    const positions = [
      { top: '-50px', left: '10%' },
      { top: '-30px', left: '25%' },
      { top: '-40px', left: '45%' },
      { top: '-60px', left: '65%' },
      { top: '-35px', left: '80%' },
      { top: '-45px', left: '15%' },
      { top: '-55px', left: '55%' },
      { top: '-25px', left: '75%' }
    ];
    return positions[index % positions.length];
  };

  const getStarSize = (index) => {
    const sizes = ['falling-star-small', 'falling-star', 'falling-star-medium', 'falling-star-large', 'falling-star-comet'];
    return sizes[index % sizes.length];
  };

  return (
    <div className="falling-stars-bg">
      {Array.from({ length: count }, (_, index) => {
        const position = getRandomPosition(index);
        const animation = animations[index % animations.length];
        const size = getStarSize(index);
        const delay = (index * 1.5) + 's';
        
        return (
          <div
            key={index}
            className={`falling-star ${size} ${animation}`}
            style={{
              ...position,
              animationDelay: delay,
              animationDuration: `${8 + (index % 5)}s`
            }}
          />
        );
      })}
    </div>
  );
};

export default FallingStars;
