import React, { useState, useEffect } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import BackButton from '../components/BackButton';
import HowToButton from '../components/HowToButton';
import { SCENES, GAME_ORDER } from '../scenes';
import asset from '../asset';
import { preloadScene } from '../preloadAssets';

const Cloud = ({ width }) => (
  <div style={{ position: 'relative', width, height: width * 0.45 }}>
    <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '60%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '45%', height: '70%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '50%', width: '38%', height: '55%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
  </div>
);

const LOCATIONS = [
  { id: SCENES.FIRE_STATION, label: 'Fire Station', x: '70%', y: '28%', w: 280, h: 170 },
  { id: SCENES.HOME_SAFETY,  label: 'Home',         x: '66%', y: '58%', w: 210, h: 150 },
  { id: SCENES.TOWN_HALL,    label: 'Town Hall',     x: '62%', y: '84%', w: 230, h: 150 },
  { id: SCENES.FIELD_MAP,    label: 'Field',         x: '22%', y: '80%', w: 210, h: 140 },
  { id: SCENES.WOODS,        label: 'Weather Watch Woods', x: '21%', y: '52%', w: 250, h: 160 },
];

const SPOTLIGHT_MESSAGES = {
  [SCENES.FIRE_STATION]: { text: "Start at the Fire Station. That's where our learning begins! Click on the sign to get started.", pos: '72% 25%' },
  [SCENES.HOME_SAFETY]: { text: "Next let's head home to learn how to keep it fire-safe.", pos: '63% 56%' },
  [SCENES.TOWN_HALL]: { text: "Next stop: Town Hall! Let's learn about making go bags.", pos: '60% 85%' },
  [SCENES.FIELD_MAP]: { text: "Time to head to the Field! We'll learn about keeping big patches of land safe.", pos: '20% 85%' },
  [SCENES.WOODS]: { text: "Last stop: Weather Watch Woods! Let's learn how weather affects fires.", pos: '15% 50%' },
};

const MainMapScreen = ({ navigateTo, completedGames }) => {
  const [showIntro, setShowIntro] = useState(true);
  const allDone = GAME_ORDER.every(g => completedGames.includes(g));

  // Find the next game to play
  const nextGame = GAME_ORDER.find(g => !completedGames.includes(g)) || null;
  const spotlightData = nextGame ? SPOTLIGHT_MESSAGES[nextGame] : null;

  const isUnlocked = (gameId) => {
    return true; // TEMP: all unlocked for development
  };

  useEffect(() => {
    if (nextGame) preloadScene(nextGame);
    GAME_ORDER.forEach((id) => preloadScene(id));
  }, [nextGame]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <img src={asset("/mapwithsigns.png")} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%', zIndex: 0 }} />

      {/* Animated clouds */}
      <div style={{ position: 'absolute', top: '3%', left: '4%', zIndex: 2, animation: 'cloudDrift 4s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={120} />
      </div>
      <div style={{ position: 'absolute', top: '1%', left: '45%', zIndex: 2, animation: 'cloudDrift 6s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }}>
        <Cloud width={100} />
      </div>
      <div style={{ position: 'absolute', top: '4%', right: '8%', zIndex: 2, animation: 'cloudDrift 5s ease-in-out infinite alternate', pointerEvents: 'none' }}>
        <Cloud width={130} />
      </div>

      {/* Title */}
      <BackButton onClick={() => navigateTo(SCENES.TITLE)} />
      <HowToButton onClick={() => navigateTo(SCENES.ONBOARDING)} />
      <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
        <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '12px 40px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
          <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 32, color: '#1a1a1a' }}>Your Town</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800, color: '#239622' }}>Tap a place to help out!</div>
        </div>
      </div>

      {/* Location clickable areas — positioned over the signs in the image */}
      {LOCATIONS.map(loc => {
        const unlocked = isUnlocked(loc.id);
        return (
          <div
            key={loc.id}
            onClick={() => { if (unlocked) navigateTo(loc.id); }}
            onTouchStart={() => preloadScene(loc.id)}
            style={{
              position: 'absolute', left: loc.x, top: loc.y,
              transform: 'translate(-50%, -50%)',
              cursor: unlocked ? 'pointer' : 'not-allowed',
              zIndex: 26,
              width: loc.w, height: loc.h,
              borderRadius: 8,
              background: 'transparent',
            }}
            onMouseEnter={e => {
              preloadScene(loc.id);
              if (unlocked) e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }}
            onMouseLeave={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
          />
        );
      })}

      {/* Spotlight on next game — stays as they progress */}
      {spotlightData && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none',
          background: `radial-gradient(ellipse 22% 28% at ${spotlightData.pos}, transparent 0%, rgba(0,0,0,0.58) 72%)`,
        }} />
      )}

      {/* Blaze intro */}
      {showIntro && spotlightData && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={180} />
          <DialogueBox
            text={spotlightData.text}
            onNext={() => setShowIntro(false)}
            showName={false}
            style={{ maxWidth: 400, marginBottom: 20 }}
          />
        </div>
      )}

      {/* All done message */}
      {showIntro && allDone && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={180} />
          <DialogueBox
            text="You've completed all 5 missions! You're a true Junior Firefighter! Tap any location to play again."
            onNext={() => setShowIntro(false)}
            showName={false}
            style={{ maxWidth: 400, marginBottom: 20 }}
          />
        </div>
      )}

      {/* Blaze standing after intro dismissed — click to show dialogue again */}
      {!showIntro && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10, cursor: 'pointer' }} onClick={() => setShowIntro(true)}>
          <FirefighterCharacter size={180} />
        </div>
      )}
    </div>
  );
};

export default MainMapScreen;
