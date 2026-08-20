import React from 'react';

const HowToButton = ({ onClick, side = 'right' }) => (
  <button
    onClick={onClick}
    title="How to play"
    style={{
      position: 'absolute',
      top: 16,
      [side]: 16,
      zIndex: 30,
      background: '#1F93BA',
      border: '3px solid #0D6E8A',
      borderBottom: '5px solid #0D6E8A',
      borderRadius: 30,
      padding: '8px 16px',
      fontFamily: "'Fredoka One', cursive",
      fontSize: 16,
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      transition: 'transform 0.15s ease',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    How to play
  </button>
);

export default HowToButton;
