import React from 'react';
import PlayButton from '../components/PlayButton';
import { SCENES } from '../scenes';
import asset from '../asset';

const Cloud = ({ width }) => (
  <div style={{ position: 'relative', width, height: width * 0.45 }}>
    <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '60%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '45%', height: '70%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '50%', width: '38%', height: '55%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
  </div>
);

const OpeningScreen = ({ navigateTo }) => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Background image — show more land (bottom-centered) */}
      <img
        src={asset(`/Opening Screen.png`)}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 45%',
          zIndex: 0,
        }}
      />

      {/* Animated clouds on top */}
      <div style={{ position: 'absolute', top: '5%', left: '4%', zIndex: 3, animation: 'cloudDrift 4s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={130} />
      </div>
      <div style={{ position: 'absolute', top: '3%', left: '46%', zIndex: 3, animation: 'cloudDrift 6s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }}>
        <Cloud width={100} />
      </div>
      <div style={{ position: 'absolute', top: '6%', right: '8%', zIndex: 3, animation: 'cloudDrift 5s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={150} />
      </div>

      {/* Title — centered upper area */}
      <div style={{
        position: 'absolute',
        top: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        textAlign: 'center',
      }}>
        <div style={{
          background: 'white',
          border: '4px solid #1F93BA',
          borderRadius: 50,
          padding: '16px 52px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
          display: 'inline-block',
        }}>
          <div style={{
            fontFamily: "'Fugaz One', cursive",
            fontSize: 'clamp(32px, 5vw, 60px)',
            color: '#1a1a1a',
            lineHeight: 1.2,
            letterSpacing: 1,
            whiteSpace: 'nowrap',
          }}>
            Junior Firefighter
          </div>
        </div>
      </div>

      {/* Play button — centered middle */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}>
        <PlayButton
          onClick={() => navigateTo(SCENES.INTRO)}
          label="PLAY!"
          size="large"
          color="#F819E7"
          borderColor="#BB10AE"
          textColor="white"
        />
      </div>
    </div>
  );
};

export default OpeningScreen;
