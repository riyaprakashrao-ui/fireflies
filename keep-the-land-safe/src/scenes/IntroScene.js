import React from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import BackButton from '../components/BackButton';
import { SCENES } from '../scenes';

const Cloud = ({ width }) => (
  <div style={{ position: 'relative', width, height: width * 0.45 }}>
    <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '60%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '45%', height: '70%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '50%', width: '38%', height: '55%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
  </div>
);

const IntroScene = ({ navigateTo }) => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Background */}
      <img
        src={`/frame2background.png`}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 45%',
          zIndex: 0,
        }}
      />

      {/* Back button */}
      <BackButton onClick={() => navigateTo(SCENES.OPENING)} />

      {/* Animated clouds */}
      <div style={{ position: 'absolute', top: '4%', left: '3%', zIndex: 3, animation: 'cloudDrift 4s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={120} />
      </div>
      <div style={{ position: 'absolute', top: '2%', left: '50%', zIndex: 3, animation: 'cloudDrift 6s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }}>
        <Cloud width={90} />
      </div>
      <div style={{ position: 'absolute', top: '5%', right: '6%', zIndex: 3, animation: 'cloudDrift 5s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={140} />
      </div>

      {/* Blaze — large, left side */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '3%',
        zIndex: 10,
      }}>
        <FirefighterCharacter size={320} />
      </div>

      {/* Speech bubble — closer to Blaze's face, with speaking dots */}
      <div style={{
        position: 'absolute',
        top: '34%',
        left: '30%',
        zIndex: 10,
        maxWidth: 420,
        animation: 'fadeIn 0.8s ease 0.3s both',
      }}>
        <div style={{
          background: 'white',
          border: '3px solid #1F93BA',
          borderRadius: 16,
          padding: '24px 28px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
          position: 'relative',
        }}>
          {/* Speech bubble tail pointing left toward Blaze */}
          <div style={{
            position: 'absolute',
            left: -18,
            top: '40%',
            width: 0, height: 0,
            borderTop: '12px solid transparent',
            borderBottom: '12px solid transparent',
            borderRight: '18px solid #1F93BA',
          }} />
          <div style={{
            position: 'absolute',
            left: -12,
            top: '41%',
            width: 0, height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: '14px solid white',
          }} />

          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1.6,
            margin: 0,
          }}>
            It's important to keep big patches of land safe as well. Too many plants can be a fire hazard. These big patches are called defensible spaces. Play along to see how we keep them safe!
          </p>
        </div>

        {/* Speaking dots animation */}
        <div style={{
          display: 'flex',
          gap: 6,
          marginTop: 10,
          marginLeft: 20,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#1F93BA',
              animation: 'speakPulse 1s ease-in-out infinite',
              animationDelay: `${i * 0.25}s`,
            }} />
          ))}
        </div>
      </div>

      {/* Next button — bottom right, pink */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '5%',
        zIndex: 20,
      }}>
        <button
          onClick={() => navigateTo(SCENES.WORLD_MAP)}
          style={{
            background: '#F819E7',
            border: '3px solid #BB10AE',
            borderBottom: '6px solid #BB10AE',
            borderRadius: 30,
            padding: '12px 36px',
            fontFamily: "'Fredoka One', cursive",
            fontSize: 20,
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IntroScene;
