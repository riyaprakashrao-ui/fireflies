import React from 'react';

const HomeButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 30,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    <img src="/home.png" alt="Home" style={{ width: 48, height: 48, objectFit: 'contain' }} />
  </button>
);

export default HomeButton;
