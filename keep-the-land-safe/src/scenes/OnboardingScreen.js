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

const SLIDES = [
  { title: "Your Mission", text: "You'll help firefighters, learn about wildfires, and help families get ready. The game is set up into 5 different mini-games to help prepare you to be safe!", image: null },
  { title: "A Quick Safety Note", text: "This is a game. In real life, always ask an adult for help and never play with fire.", image: null },
  { title: "How to Navigate", text: "This is the Map button. It takes you back to the main town map.", image: '/mapbutton.png' },
  { title: "How to Navigate", text: "This is the Home button. It takes you back to the menu of the mini-game you're playing.", image: '/home.png' },
  { title: "How to Navigate", text: "This is the Back button. It takes you to the previous screen.", image: 'back' },
  { title: "How to Navigate", text: "This is the Next button. It moves you forward to the next screen.", image: 'next' },
];

const OnboardingScreen = ({ navigateTo, hasSeenOnboarding, completeOnboarding }) => {
  const [idx, setIdx] = useState(0);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <img src="/openingscenebg.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', zIndex: 0 }} />

      {/* Fire station */}
      <img src="/firestationasset.png" alt="" style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '75%', maxWidth: 800, objectFit: 'contain', zIndex: 1 }} />

      {/* Animated clouds */}
      <div style={{ position: 'absolute', top: '4%', left: '3%', zIndex: 2, animation: 'cloudDrift 4s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={120} />
      </div>
      <div style={{ position: 'absolute', top: '2%', left: '50%', zIndex: 2, animation: 'cloudDrift 6s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }}>
        <Cloud width={90} />
      </div>
      <div style={{ position: 'absolute', top: '5%', right: '5%', zIndex: 2, animation: 'cloudDrift 5s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={140} />
      </div>

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 2 }} />

      {/* Back to title */}
      <BackButton onClick={() => navigateTo(hasSeenOnboarding ? SCENES.MAIN_MAP : SCENES.TITLE)} />
      <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

      {/* Title banner */}
      <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '80%', maxWidth: 600 }}>
        <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '16px 36px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
          <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 'clamp(24px, 4vw, 42px)', color: '#1a1a1a' }}>
            {SLIDES[idx].title}
          </div>
        </div>
      </div>

      {/* Blaze + speech box */}
      <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 20 }}>
        <FirefighterCharacter size={220} />
        <div style={{ marginBottom: 30 }}>
          <DialogueBox
            text={SLIDES[idx].text}
            image={SLIDES[idx].image}
            onNext={() => {
              if (idx < SLIDES.length - 1) setIdx(idx + 1);
              else {
                if (completeOnboarding) completeOnboarding();
                navigateTo(SCENES.MAIN_MAP);
              }
            }}
            onBack={idx > 0 ? () => setIdx(idx - 1) : null}
            showName={false}
            style={{ maxWidth: 400 }}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
