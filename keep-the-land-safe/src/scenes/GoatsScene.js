import React, { useState } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import BackButton from '../components/BackButton';
import HomeButton from '../components/HomeButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';

// Grass patches scattered across the field
const INITIAL_GRASS = [
  { id: 0, x: 18, y: 40 }, { id: 1, x: 45, y: 38 }, { id: 2, x: 70, y: 40 },
  { id: 3, x: 30, y: 56 }, { id: 4, x: 62, y: 54 }, { id: 5, x: 85, y: 58 },
  { id: 6, x: 15, y: 70 }, { id: 7, x: 42, y: 72 }, { id: 8, x: 68, y: 78 },
  { id: 9, x: 88, y: 76 }, { id: 10, x: 50, y: 86 }, { id: 11, x: 20, y: 86 },
];

// Native plants positioned in their own clear areas (no grass nearby)
const NATIVE_PLANTS = [
  { id: 'n0', x: 8, y: 55, image: '/fushcia.png', size: 70 },
  { id: 'n1', x: 37, y: 50, image: '/poppy.png', size: 65 },
  { id: 'n2', x: 55, y: 64, image: '/fushcia.png', size: 70 },
  { id: 'n3', x: 92, y: 48, image: '/poppy.png', size: 65 },
  { id: 'n4', x: 28, y: 82, image: '/poppy.png', size: 65 },
  { id: 'n5', x: 75, y: 68, image: '/fushcia.png', size: 70 },
];

const INTRO_TEXTS = [
  "Here we have tall grass, which is more fuel for a fire. Short grass is less fuel. Goats eat tall grass and small plants. This is a natural, eco-friendly way to reduce fuel!",
  "But remember — goats should only eat the tall grass, not the native plants! Those are fire-safe and we want to keep them.",
];

const GoatsScene = ({ navigateTo, completeLevel }) => {
  // Phases: intro -> instructions -> play -> success
  const [phase, setPhase] = useState('intro');
  const [introIdx, setIntroIdx] = useState(0);
  const [grass, setGrass] = useState(INITIAL_GRASS);
  const [goatPos, setGoatPos] = useState({ x: 50, y: 60 });
  const [draggingGoat, setDraggingGoat] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [dragStartPos, setDragStartPos] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleMouseMove = (e) => {
    if (!draggingGoat) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    
    // Only count as dragged if moved more than 2%
    if (dragStartPos && (Math.abs(x - dragStartPos.x) > 2 || Math.abs(y - dragStartPos.y) > 2)) {
      setHasDragged(true);
    }
    
    setGoatPos({ x: Math.max(5, Math.min(95, x)), y: Math.max(30, Math.min(90, y)) });
  };

  const handleMouseUp = () => {
    setDraggingGoat(false);
    // Reset hasDragged after a short delay so click event fires first
    setTimeout(() => setHasDragged(false), 50);
  };

  // Tap the goat (only if NOT dragging) — eats nearby grass or shows error for native plants
  const handleGoatTap = (e) => {
    e.stopPropagation();
    // If we just finished dragging, ignore this click and reset
    if (hasDragged) {
      setHasDragged(false);
      return;
    }

    // Check if near a native plant first (must be very close — directly on top)
    const nearNative = NATIVE_PLANTS.some(p => {
      const dist = Math.sqrt((goatPos.x - p.x) ** 2 + (goatPos.y - p.y) ** 2);
      return dist < 5;
    });
    if (nearNative) {
      if (!showError) {
        setShowError(true);
        setTimeout(() => setShowError(false), 2500);
      }
      return;
    }

    // Eat any grass the goat is on top of
    const newGrass = grass.filter(g => {
      const dist = Math.sqrt((goatPos.x - g.x) ** 2 + (goatPos.y - g.y) ** 2);
      return dist > 10;
    });
    if (newGrass.length < grass.length) {
      setGrass(newGrass);
      if (newGrass.length === 0) {
        setTimeout(() => { setPhase('success'); completeLevel(SCENES.GOATS); }, 400);
      }
    }
  };

  const handleGrassClick = () => {};
  const handlePlantClick = () => {};

  return (
    <div
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Background */}
      <img src="/native-plants-field.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />

      {/* Back button — previous phase */}
      <BackButton onClick={() => {
        if (phase === 'intro') navigateTo(SCENES.FIELD_MAP);
        else if (phase === 'instructions') setPhase('intro');
        else if (phase === 'play') setPhase('instructions');
        else if (phase === 'success') setPhase('play');
      }} />

      {/* Home button */}
      <HomeButton onClick={() => navigateTo(SCENES.FIELD_MAP)} />

      {/* ═══ INTRO ═══ */}
      {phase === 'intro' && (
        <>
          {/* Grass visible in background */}
          {grass.map(g => (
            <img key={g.id} src="/grass.png" alt="" style={{
              position: 'absolute', left: `${g.x}%`, top: `${g.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 90, height: 110, objectFit: 'contain',
              zIndex: 5, pointerEvents: 'none',
            }} />
          ))}

          {/* Native plants in background */}
          {NATIVE_PLANTS.map(p => (
            <img key={p.id} src={p.image} alt="" style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
              width: p.size, height: p.size, objectFit: 'contain',
              zIndex: 6, pointerEvents: 'none',
              filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))',
            }} />
          ))}

          <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={160} />
            <DialogueBox
              text={INTRO_TEXTS[introIdx]}
              onNext={() => {
                if (introIdx < INTRO_TEXTS.length - 1) setIntroIdx(introIdx + 1);
                else setPhase('instructions');
              }}
              onBack={introIdx > 0 ? () => setIntroIdx(introIdx - 1) : null}
              showName={false}
              style={{ maxWidth: 600, marginBottom: 16 }}
            />
          </div>
        </>
      )}

      {/* ═══ INSTRUCTIONS ═══ */}
      {phase === 'instructions' && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={160} />
          <DialogueBox
            text={"Here's how to play:\n• Drag the goat over the tall grass\n• Then tap the goat to make it eat!\n• Be careful not to eat the native plants (the flowers)\n• Clear all the tall grass to win!"}
            onNext={() => setPhase('play')}
            showName={false}
            style={{ maxWidth: 600, marginBottom: 16 }}
          />
        </div>
      )}

      {/* ═══ PLAY ═══ */}
      {phase === 'play' && (
        <>
          {/* Instruction */}
          <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '90%', maxWidth: 700 }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '14px 32px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                Drag the goat over the tall grass, then tap the goat to eat it! Don't eat the native plants!
              </p>
            </div>
          </div>

          {/* Grass patches — click to eat */}
          {grass.map(g => (
            <img key={g.id} src="/grass.png" alt="" onClick={() => handleGrassClick(g.id, g.x, g.y)} style={{
              position: 'absolute', left: `${g.x}%`, top: `${g.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 90, height: 110, objectFit: 'contain',
              zIndex: 5, cursor: 'pointer',
            }} />
          ))}

          {/* Native plants — click shows error */}
          {NATIVE_PLANTS.map(p => (
            <img key={p.id} src={p.image} alt="" onClick={handlePlantClick} style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
              width: p.size, height: p.size, objectFit: 'contain',
              zIndex: 6, cursor: 'pointer',
              filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))',
            }} />
          ))}

          {/* Error message */}
          {showError && (
            <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 30 }}>
              <FirefighterCharacter size={120} />
              <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 16, padding: '14px 20px', maxWidth: 400, boxShadow: '0 6px 24px rgba(0,0,0,0.15)', marginBottom: 14 }}>
                <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 17, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.5, margin: 0 }}>
                  Oops! That's a native plant — we want to keep those! They're fire-safe. Only eat the tall grass!
                </p>
              </div>
            </div>
          )}

          {/* Goat — draggable */}
          <img
            src="/goat.png"
            alt="Goat"
            draggable={false}
            onMouseDown={(e) => { e.preventDefault(); setDraggingGoat(true); setHasDragged(false); setDragStartPos({ x: goatPos.x, y: goatPos.y }); }}
            onClick={handleGoatTap}
            style={{
              position: 'absolute',
              left: `${goatPos.x}%`, top: `${goatPos.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 180, height: 180, objectFit: 'contain',
              zIndex: 10,
              cursor: draggingGoat ? 'grabbing' : 'grab',
              filter: 'drop-shadow(3px 6px 8px rgba(0,0,0,0.3))',
            }}
          />

          {/* Progress */}
          {grass.length > 0 && (
            <div style={{ position: 'absolute', top: '14%', right: '4%', zIndex: 20, background: 'white', border: '3px solid #1F93BA', borderRadius: 16, padding: '8px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>
                {INITIAL_GRASS.length - grass.length}/{INITIAL_GRASS.length} eaten!
              </span>
            </div>
          )}

          {/* Next button if all eaten */}
          {grass.length === 0 && (
            <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20 }}>
              <button onClick={() => { setPhase('success'); completeLevel(SCENES.GOATS); }} style={{
                background: '#F819E7', border: '3px solid #BB10AE',
                borderBottom: '6px solid #BB10AE', borderRadius: 30,
                padding: '12px 36px', fontFamily: "'Fredoka One',cursive",
                fontSize: 20, color: 'white', cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
              }}>Next</button>
            </div>
          )}
        </>
      )}

      {/* ═══ SUCCESS ═══ */}
      {phase === 'success' && (
        <>
          {/* Success text */}
          <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '90%', maxWidth: 700 }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '14px 32px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                Good work!
              </p>
            </div>
          </div>

          {/* Goat stays where it finished */}
          <img
            src="/goat.png"
            alt="Goat"
            style={{
              position: 'absolute',
              left: `${goatPos.x}%`, top: `${goatPos.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 180, height: 180, objectFit: 'contain',
              zIndex: 10,
              filter: 'drop-shadow(3px 6px 8px rgba(0,0,0,0.3))',
            }}
          />

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

export default GoatsScene;
