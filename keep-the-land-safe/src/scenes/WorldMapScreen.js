import React, { useState, useEffect } from 'react';
import ForestBackground from '../components/ForestBackground';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import BackButton from '../components/BackButton';
import MapButton from '../components/MapButton';
import PlayButton from '../components/PlayButton';
import { SCENES } from '../scenes';

const LEVELS = [
  { id: SCENES.FIREBREAK,       title: 'Firebreaks',      image: '/assets/Firebreak.png',    scale: '65%' },
  { id: SCENES.NATIVE_PLANTS,   title: 'Native Plants',   image: '/assets/NativePlant.png',  scale: '90%' },
  { id: SCENES.GOATS,           title: 'Goats',           image: '/assets/Goat.png',         scale: '90%' },
  { id: SCENES.CONTROLLED_BURN, title: 'Controlled Burn', image: '/assets/Fire.png',         scale: '55%' },
];

const INTRO_FIRST = [
  'Welcome to the Land Safety Map! Our forest needs your help!',
  'Wildfires spread fast through dry grass and dead plants. We need to protect our land!',
  'I will teach you 4 ways to keep the land safe. Click each area to learn and play!',
];

const INTRO_RETURN = [
  "Here's the Land Safety Map! Our forest needs your help!",
  'Wildfires spread fast through dry grass and dead plants. We need to protect our land!',
  'Click each area to learn and play!',
];

const WorldMapScreen = ({ navigateTo, completedLevels, completeGame }) => {
  const [idx, setIdx] = useState(0);
  const [showDlg, setShowDlg] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [wrapUp, setWrapUp] = useState(false);

  const lines = completedLevels.length > 0 ? INTRO_RETURN : INTRO_FIRST;
  const next = () => idx < lines.length - 1 ? setIdx(idx + 1) : setShowDlg(false);
  const allDone = LEVELS.every(l => completedLevels.includes(l.id));

  useEffect(() => {
    if (allDone && completeGame) completeGame(SCENES.FIELD_MAP);
  }, [allDone, completeGame]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {wrapUp ? (
        <img
          src="/frame2background.png"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', zIndex: 0 }}
        />
      ) : (
        <ForestBackground showPath timeOfDay="day" />
      )}
      <BackButton onClick={() => {
        if (wrapUp) setWrapUp(false);
        else navigateTo(SCENES.FIELD_INTRO);
      }} />
      <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

      {!wrapUp && (
        <>
      {/* Title */}
      <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 20, textAlign: 'center' }}>
        <div style={{ background: 'white', border: '4px solid #1F93BA', borderRadius: 22, padding: '10px 32px', boxShadow: '0 6px 24px rgba(0,0,0,0.2)' }}>
          <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 28, color: '#1a1a1a' }}>Land Safety Map</div>
          <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 13, color: '#239622', fontWeight: 800 }}>
            {completedLevels.length}/{LEVELS.length} areas protected!
          </div>
        </div>
      </div>



      {/* Level cards — 4 in a single row */}
      <div style={{
        position: 'absolute',
        top: '42%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 16,
        zIndex: 15,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {LEVELS.map((level, i) => {
          const done = completedLevels.includes(level.id);
          const isHovered = hovered === level.id;
          return (
            <div
              key={level.id}
              onClick={() => navigateTo(level.id)}
              onMouseEnter={() => setHovered(level.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: 265,
                height: 367,
                background: 'white',
                border: '3px solid #FFD23F',
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHovered
                  ? '0 16px 40px rgba(0,0,0,0.35), 0 0 0 3px #FFD23F'
                  : '0 8px 24px rgba(0,0,0,0.25)',
                transform: isHovered ? 'translateY(-6px) scale(1.03)' : 'scale(1)',
                transition: 'all 0.2s ease',
                animation: `popIn 0.5s ease both`,
                animationDelay: `${i * 0.1}s`,
                flexShrink: 0,
              }}
            >
              {/* Image fills the card */}
              <img
                src={level.image}
                alt={level.title}
                style={{
                  width: level.scale,
                  height: level.scale,
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  margin: 'auto',
                }}
              />

              {/* Title bar at bottom */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                background: 'rgba(255,255,255,0.92)',
                borderTop: '2px solid #FFD23F',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: 18,
                  color: '#1a1a1a',
                }}>
                  {level.title}
                </div>
                {done
                  ? <span style={{ fontSize: 14, fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: 'white', background: '#1F93BA', padding: '3px 10px', borderRadius: 20 }}>DONE</span>
                  : <span style={{ fontSize: 14, fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: 'white', background: '#F819E7', padding: '3px 10px', borderRadius: 20 }}>PLAY →</span>
                }
              </div>

              {/* Completed overlay */}
              {done && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(31,147,186,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 14,
                }}>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next after all 4 are done */}
      {allDone && (
        <div style={{ position: 'absolute', bottom: 28, right: 28, zIndex: 30 }}>
          <PlayButton
            label="Next"
            size="medium"
            color="#F819E7"
            borderColor="#BB10AE"
            textColor="white"
            onClick={() => setWrapUp(true)}
          />
        </div>
      )}

      {/* Firefighter + dialogue */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
        <FirefighterCharacter size={120} speaking={showDlg} expression="happy" />
        {showDlg && (
          <DialogueBox text={lines[idx]} onNext={next} showName={false} style={{ maxWidth: 340, marginBottom: 16 }} />
        )}
      </div>
        </>
      )}

      {wrapUp && (
        <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={200} />
          <DialogueBox
            text="Great job! You learned how to keep the land safe. Let's head back to the map to see what else we can learn."
            onNext={() => navigateTo(SCENES.MAIN_MAP)}
            showName={false}
            style={{ maxWidth: 480, marginBottom: 20 }}
          />
        </div>
      )}


    </div>
  );
};

export default WorldMapScreen;
