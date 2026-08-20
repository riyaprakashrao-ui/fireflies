import React from 'react';
import asset from '../asset';

const FirefighterCharacter = ({ size = 180, speaking = false, waving = false, style = {}, expression = 'happy' }) => {

  return (
    <div style={{
      width: size,
      height: size * 1.4,
      position: 'relative',
      flexShrink: 0,
      ...style,
    }}>
      <img
        src={asset("/firefighter.png")}
        alt="Blaze the Firefighter"
        fetchPriority="high"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom',
          animation: 'none',
          filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.35))',
        }}
      />

      {/* Speaking indicator dots */}
      {false && speaking && (
        <div style={{
          position: 'absolute',
          top: '5%',
          right: '-10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6 + i * 2,
              height: 6 + i * 2,
              borderRadius: '50%',
              background: '#F5C518',
              animation: 'speakPulse 0.6s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FirefighterCharacter;
