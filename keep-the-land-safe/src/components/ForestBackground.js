import React from 'react';
import asset from '../asset';

const ForestBackground = ({ style = {}, showPath = true, timeOfDay = 'day', showSmoke = false, showFire = false }) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      ...style,
    }}>
      {/* Your custom background image */}
      <img
        src={asset("/background.png")}
        alt="Forest background"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* Subtle overlay tint for different times of day */}
      {timeOfDay === 'sunset' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,100,0,0.18)',
          pointerEvents: 'none',
        }} />
      )}
      {timeOfDay === 'dusk' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(30,10,80,0.35)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Animated clouds layered on top */}
      <div style={{ position: 'absolute', top: '5%', left: '4%', animation: 'cloudDrift 4s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={130} />
      </div>
      <div style={{ position: 'absolute', top: '3%', left: '46%', animation: 'cloudDrift 6s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }}>
        <Cloud width={100} />
      </div>
      <div style={{ position: 'absolute', top: '6%', right: '8%', animation: 'cloudDrift 5s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={150} />
      </div>

      {/* Smoke overlay */}
      {showSmoke && [0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute', left: `${48 + i * 4}%`, top: '45%',
          fontSize: 28 + i * 8,
          animation: `smokeDrift ${1.8 + i * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
          opacity: 0.65,
          pointerEvents: 'none',
        }}>💨</div>
      ))}

      {/* Fire overlay */}
      {showFire && [46, 50, 54, 58, 62].map((x, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${x}%`, top: '60%',
          fontSize: 28 + i * 3,
          animation: `fireFlicker ${0.25 + i * 0.05}s ease-in-out infinite`,
          pointerEvents: 'none',
        }}>🔥</div>
      ))}

      {/* Vignette for depth */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

const Cloud = ({ width }) => (
  <div style={{ position: 'relative', width, height: width * 0.45 }}>
    <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '60%', background: 'white', borderRadius: 999, opacity: 0.88 }} />
    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '45%', height: '70%', background: 'white', borderRadius: 999, opacity: 0.88 }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '50%', width: '38%', height: '55%', background: 'white', borderRadius: 999, opacity: 0.88 }} />
  </div>
);

export default ForestBackground;
