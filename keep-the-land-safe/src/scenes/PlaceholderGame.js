import React from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import BackButton from '../components/BackButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';

const PlaceholderGame = ({ navigateTo, completeGame, gameId, title }) => (
  <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #87CEEB 0%, #5a9e2f 50%, #3d7a1a 100%)' }}>
    <BackButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />
    <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
      <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 22, padding: '24px 40px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.2)', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 32, color: '#1a1a1a', marginBottom: 8 }}>{title}</div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: '#666' }}>Coming soon!</div>
      </div>

      <FirefighterCharacter size={180} />

      <button
        onClick={() => { completeGame(gameId); navigateTo(SCENES.MAIN_MAP); }}
        style={{
          marginTop: 20, background: '#F819E7', border: '3px solid #BB10AE',
          borderBottom: '6px solid #BB10AE', borderRadius: 30,
          padding: '12px 36px', fontFamily: "'Fredoka One',cursive",
          fontSize: 20, color: 'white', cursor: 'pointer',
        }}
      >
        Complete (Debug)
      </button>
    </div>
  </div>
);

export default PlaceholderGame;
