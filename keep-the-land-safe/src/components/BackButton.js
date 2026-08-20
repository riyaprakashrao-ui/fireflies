import React from 'react';

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 30,
      background: '#FE8340',
      border: '3px solid #CE600A',
      borderBottom: '5px solid #CE600A',
      borderRadius: 30,
      padding: '8px 22px',
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
    ← Back
  </button>
);

export default BackButton;
