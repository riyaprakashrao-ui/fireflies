import React, { useState } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import BackButton from '../components/BackButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';

const Cloud = ({ width }) => (
  <div style={{ position: 'relative', width, height: width * 0.45 }}>
    <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '60%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '45%', height: '70%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '50%', width: '38%', height: '55%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
  </div>
);

const LINES = [
  'Congratulations! You’ve successfully completed 5 ways to keep your home and town safer in case of a fire.',
  'Here’s a Junior Firefighter badge for your hard work.',
  'Feel free to return to the map to play any of the games again!',
];

const FinalCongratsScreen = ({ navigateTo }) => {
  const [idx, setIdx] = useState(0);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <img src="/openingscenebg.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', zIndex: 0 }} />
      <img src="/firestationasset.png" alt="" style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '75%', maxWidth: 800, objectFit: 'contain', zIndex: 1 }} />

      <div style={{ position: 'absolute', top: '4%', left: '3%', zIndex: 2, animation: 'cloudDrift 4s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={120} />
      </div>
      <div style={{ position: 'absolute', top: '2%', left: '50%', zIndex: 2, animation: 'cloudDrift 6s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }}>
        <Cloud width={90} />
      </div>
      <div style={{ position: 'absolute', top: '5%', right: '5%', zIndex: 2, animation: 'cloudDrift 5s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={140} />
      </div>

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', zIndex: 2 }} />

      <BackButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />
      <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

      <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 20, maxWidth: '94%' }}>
        <FirefighterCharacter size={220} />
        <div style={{ marginBottom: 30 }}>
          <DialogueBox
            text={LINES[idx]}
            image={idx >= 1 ? '/jr-badge.png' : null}
            imageSize={120}
            onNext={() => {
              if (idx < LINES.length - 1) setIdx(idx + 1);
              else navigateTo(SCENES.MAIN_MAP);
            }}
            onBack={idx > 0 ? () => setIdx(idx - 1) : null}
            showName={false}
            style={{ maxWidth: idx >= 1 ? 560 : 460 }}
          />
        </div>
      </div>
    </div>
  );
};

export default FinalCongratsScreen;
