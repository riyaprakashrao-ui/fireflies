import React from 'react';
import asset from '../asset';
import FirefighterCharacter from './FirefighterCharacter';

const Cloud = ({ width }) => (
  <div style={{ position: 'relative', width, height: width * 0.45 }}>
    <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '60%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '45%', height: '70%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '50%', width: '38%', height: '55%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
  </div>
);

const LoadingScreen = ({ progress = 0 }) => {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#1a3a0a' }}>
      <img src={asset('/openingscenebg.png')} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center bottom', zIndex: 0,
      }} />
      <img src={asset('/firestationasset.png')} alt="" style={{
        position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '75%', maxWidth: 800, objectFit: 'contain', zIndex: 1,
      }} />

      <div style={{ position: 'absolute', top: '4%', left: '3%', zIndex: 2, animation: 'cloudDrift 4s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={120} />
      </div>
      <div style={{ position: 'absolute', top: '2%', left: '50%', zIndex: 2, animation: 'cloudDrift 6s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }}>
        <Cloud width={90} />
      </div>
      <div style={{ position: 'absolute', top: '5%', right: '5%', zIndex: 2, animation: 'cloudDrift 5s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={140} />
      </div>

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2 }} />

      <div style={{
        position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%, -50%)',
        zIndex: 20, width: '86%', maxWidth: 520, textAlign: 'center',
      }}>
        <div style={{
          background: 'white', border: '3px solid #1F93BA', borderRadius: 28,
          padding: '22px 28px 20px', boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
        }}>
          <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 'clamp(22px, 4vw, 34px)', color: '#1a1a1a', marginBottom: 8 }}>
            Junior Firefighter
          </div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1F93BA', marginBottom: 16 }}>
            Getting the town ready...
          </div>
          <div style={{
            width: '100%', height: 18, borderRadius: 999, background: '#E8F4FA',
            border: '3px solid #1F93BA', overflow: 'hidden',
          }}>
            <div style={{
              width: `${pct}%`, height: '100%', borderRadius: 999,
              background: '#F819E7', transition: 'width 0.2s ease',
            }} />
          </div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800, color: '#555', marginTop: 8 }}>
            {pct}%
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '4%', left: '3%', zIndex: 20 }}>
        <FirefighterCharacter size={180} />
      </div>
    </div>
  );
};

export default LoadingScreen;
