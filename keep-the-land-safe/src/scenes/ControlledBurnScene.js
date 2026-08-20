import React, { useState, useCallback, useEffect } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import BackButton from '../components/BackButton';
import HomeButton from '../components/HomeButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';

const INTRO_TEXTS = [
  "Here we have lots of dry plants. This can help a wildfire spread. Wildfire safety professionals carefully plan a controlled fire to get rid of the dry plants and make room for healthy ones to grow.",
  "These burns work because burning away the old dead plants allows for new ones to grow. Dead leaves and branches pile up over time and can fuel bigger, more dangerous fires. By clearing them out safely on purpose, controlled burns make room for fresh plants and keep future fires smaller and easier to control.",
  "Remember, these burns are done by professionals. You should NEVER try to start a fire on your own because it is very dangerous and can cause a lot of harm.",
  "Now it's your turn! Drag the edges of the box to select the zone you want to burn. Then press Select to start the controlled burn!",
];

const ControlledBurnScene = ({ navigateTo, completeLevel }) => {
  // Phases: intro -> select -> burning -> success
  const [phase, setPhase] = useState('intro');
  const [introIdx, setIntroIdx] = useState(0);

  // Resizable box for zone selection
  const [box, setBox] = useState({ x: 30, y: 25, width: 40, height: 50 });
  const [dragging, setDragging] = useState(null);
  const [burnTimer, setBurnTimer] = useState(0);

  const handleMouseDown = useCallback((handle, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(handle);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    const container = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - container.left) / container.width) * 100;
    const py = ((e.clientY - container.top) / container.height) * 100;

    setBox(prev => {
      let { x, y, width, height } = prev;
      const right = x + width;
      const bottom = y + height;

      if (dragging.includes('e')) { width = Math.max(10, px - x); }
      if (dragging.includes('w')) { const newX = Math.min(px, right - 10); width = right - newX; x = newX; }
      if (dragging.includes('s')) { height = Math.max(10, py - y); }
      if (dragging.includes('n')) { const newY = Math.min(py, bottom - 10); height = bottom - newY; y = newY; }

      x = Math.max(0, Math.min(x, 95));
      y = Math.max(0, Math.min(y, 95));
      width = Math.max(10, Math.min(width, 100 - x));
      height = Math.max(10, Math.min(height, 100 - y));

      return { x, y, width, height };
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  // Burn timer — 8 seconds then transition to success
  useEffect(() => {
    if (phase !== 'burning') return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setBurnTimer(elapsed);
      if (elapsed >= 6) {
        clearInterval(interval);
        setPhase('success');
        completeLevel(SCENES.CONTROLLED_BURN);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [phase, completeLevel]);

  const handleSelect = () => setPhase('burning');

  const handleStyle = (cursor) => ({
    position: 'absolute', width: 18, height: 18,
    background: '#FF3333', border: '2px solid white',
    borderRadius: '50%', cursor, zIndex: 5,
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  });

  // Fire positions inside the selected zone
  const firePositions = [
    { x: 20, y: 25 }, { x: 50, y: 20 }, { x: 80, y: 30 },
    { x: 30, y: 60 }, { x: 60, y: 55 }, { x: 75, y: 70 },
    { x: 15, y: 75 }, { x: 50, y: 80 },
  ];

  return (
    <div
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background — dry plants for intro/select/burning, clean field for success */}
      <img
        src={phase === 'success' ? '/native-plants-field.png' : '/dryplantbg.png'}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, transition: 'opacity 1s ease' }}
      />

      {/* Back button — previous phase */}
      <BackButton onClick={() => {
        if (phase === 'intro') navigateTo(SCENES.FIELD_MAP);
        else if (phase === 'select') setPhase('intro');
        else if (phase === 'burning') {} // can't go back during burn
        else if (phase === 'success') setPhase('select');
      }} />

      {/* Home button */}
      <HomeButton onClick={() => navigateTo(SCENES.FIELD_MAP)} />

      {/* ═══ INTRO ═══ */}
      {phase === 'intro' && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={160} />
          <DialogueBox
            text={INTRO_TEXTS[introIdx]}
            onNext={() => {
              if (introIdx < INTRO_TEXTS.length - 1) setIntroIdx(introIdx + 1);
              else setPhase('select');
            }}
            onBack={introIdx > 0 ? () => setIntroIdx(introIdx - 1) : null}
            showName={false}
            style={{ maxWidth: 600, marginBottom: 16 }}
          />
        </div>
      )}

      {/* ═══ SELECT ZONE ═══ */}
      {phase === 'select' && (
        <>
          {/* Instruction */}
          <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '90%', maxWidth: 700 }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '14px 32px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                Select a zone to burn.
              </p>
            </div>
          </div>

          {/* Resizable zone box */}
          <div style={{
            position: 'absolute',
            left: `${box.x}%`, top: `${box.y}%`,
            width: `${box.width}%`, height: `${box.height}%`,
            border: '3px dashed #333',
            background: 'rgba(200,200,150,0.2)',
            borderRadius: 4,
            zIndex: 10,
            transition: dragging ? 'none' : 'all 0.1s ease',
          }}>
            {/* Resize handles */}
            <div onMouseDown={(e) => handleMouseDown('nw', e)} style={{ ...handleStyle('nw-resize'), top: -9, left: -9 }} />
            <div onMouseDown={(e) => handleMouseDown('ne', e)} style={{ ...handleStyle('ne-resize'), top: -9, right: -9 }} />
            <div onMouseDown={(e) => handleMouseDown('sw', e)} style={{ ...handleStyle('sw-resize'), bottom: -9, left: -9 }} />
            <div onMouseDown={(e) => handleMouseDown('se', e)} style={{ ...handleStyle('se-resize'), bottom: -9, right: -9 }} />
            <div onMouseDown={(e) => handleMouseDown('n', e)} style={{ ...handleStyle('n-resize'), top: -9, left: '50%', transform: 'translateX(-50%)' }} />
            <div onMouseDown={(e) => handleMouseDown('s', e)} style={{ ...handleStyle('s-resize'), bottom: -9, left: '50%', transform: 'translateX(-50%)' }} />
            <div onMouseDown={(e) => handleMouseDown('w', e)} style={{ ...handleStyle('w-resize'), left: -9, top: '50%', transform: 'translateY(-50%)' }} />
            <div onMouseDown={(e) => handleMouseDown('e', e)} style={{ ...handleStyle('e-resize'), right: -9, top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Select button */}
          <button onClick={handleSelect} style={{
            position: 'absolute', top: 70, left: 16, zIndex: 20,
            background: '#FF3333', border: '3px solid #CC0000',
            borderBottom: '6px solid #CC0000', borderRadius: 30,
            padding: '10px 28px', fontFamily: "'Fredoka One',cursive",
            fontSize: 18, color: 'white', cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
          }}>Select</button>

          {/* Next button */}
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20 }}>
            <button onClick={handleSelect} style={{
              background: '#F819E7', border: '3px solid #BB10AE',
              borderBottom: '6px solid #BB10AE', borderRadius: 30,
              padding: '12px 36px', fontFamily: "'Fredoka One',cursive",
              fontSize: 20, color: 'white', cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
            }}>Next</button>
          </div>
        </>
      )}

      {/* ═══ BURNING ═══ */}
      {phase === 'burning' && (
        <>
          {/* Instruction stays */}
          <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '90%', maxWidth: 700 }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '14px 32px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                Burning in progress...
              </p>
            </div>
          </div>

          {/* Fire images flickering inside the zone */}
          <div style={{
            position: 'absolute',
            left: `${box.x}%`, top: `${box.y}%`,
            width: `${box.width}%`, height: `${box.height}%`,
            zIndex: 10,
            opacity: burnTimer < 5 ? 1 : Math.max(0, 1 - (burnTimer - 5)),
            transition: 'opacity 1s ease',
          }}>
            {firePositions.map((pos, i) => (
              <img
                key={i}
                src="/campfire-flame.png"
                alt=""
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`, top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '22%',
                  objectFit: 'contain',
                  animation: `fireFlicker ${0.3 + i * 0.05}s ease-in-out infinite`,
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 4px 12px rgba(255,100,0,0.6))',
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div style={{
            position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)',
            width: '60%', height: 20, background: 'rgba(0,0,0,0.3)', borderRadius: 10, zIndex: 20, overflow: 'hidden',
          }}>
            <div style={{
              width: `${(burnTimer / 6) * 100}%`, height: '100%',
              background: 'linear-gradient(90deg, #FF6600, #FF3300)',
              borderRadius: 10, transition: 'width 0.1s linear',
            }} />
          </div>
        </>
      )}

      {/* ═══ SUCCESS ═══ */}
      {phase === 'success' && (
        <>
          {/* Blaze + success message */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={160} />
            <DialogueBox
              text="Good work! You successfully cleared the dry plants and the land is safer!"
              showNext={false}
              showName={false}
              style={{ maxWidth: 500, marginBottom: 16 }}
            />
          </div>

          {/* Next button */}
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20 }}>
            <button onClick={() => navigateTo(SCENES.FIELD_MAP)} style={{
              background: '#F819E7', border: '3px solid #BB10AE',
              borderBottom: '6px solid #BB10AE', borderRadius: 30,
              padding: '12px 36px', fontFamily: "'Fredoka One',cursive",
              fontSize: 20, color: 'white', cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
            }}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ControlledBurnScene;
