import React, { useState, useCallback } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import BackButton from '../components/BackButton';
import HomeButton from '../components/HomeButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';
import asset from '../asset';
import { HiddenPrefetch, SCENE_ASSETS } from '../preloadAssets';

const MIN_WIDTH = 120;
const MIN_HEIGHT = 200;

const INTRO_TEXTS = [
  "Plants everywhere - fire can spread! A firebreak is a clear area of land that helps stop fires from spreading. Imagine a wide path where there are no trees, bushes, or anything else that can burn.",
  "This empty space makes it very hard for a fire to jump across. Firebreaks are a key tool used to fight and control wildfires. They slow down or even stop a fire's movement, protecting homes, forests, and wildlife.",
  "Fires need fuel, oxygen, and heat to burn. A firebreak removes the fuel. When a fire reaches a firebreak, it runs out of things to burn. This causes the fire to slow down, weaken, or even die out. Firefighters can then work more safely to put the fire out.",
  "Firebreaks can be natural or man-made. Some forms of natural firebreaks include rivers and lakes, rocky areas, and valleys. People also create man-made firebreaks to protect specific areas.",
  "Firebreaks are important for protecting homes, helping firefighters, and preventing damage.",
  "Let's work on creating a firebreak!",
];

const FirebreakScene = ({ navigateTo, completeLevel }) => {
  const [phase, setPhase] = useState('intro');
  const [introIdx, setIntroIdx] = useState(0);
  const [tooSmall, setTooSmall] = useState(false);
  const [showFirebreak, setShowFirebreak] = useState(false);

  // Resizable box state — starts small in the center
  const [box, setBox] = useState({ x: 40, y: 25, width: 8, height: 20 }); // percentages
  const [dragging, setDragging] = useState(null); // which handle: 'n','s','e','w','ne','nw','se','sw'

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

      if (dragging.includes('e')) { width = Math.max(5, px - x); }
      if (dragging.includes('w')) { const newX = Math.min(px, right - 5); width = right - newX; x = newX; }
      if (dragging.includes('s')) { height = Math.max(5, py - y); }
      if (dragging.includes('n')) { const newY = Math.min(py, bottom - 5); height = bottom - newY; y = newY; }

      // Clamp to bounds
      x = Math.max(0, Math.min(x, 95));
      y = Math.max(0, Math.min(y, 95));
      width = Math.max(5, Math.min(width, 100 - x));
      height = Math.max(5, Math.min(height, 100 - y));

      return { x, y, width, height };
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleSubmit = () => {
    // Must span nearly full height (top of hill to bottom)
    // Box top must be within top 15% and box bottom must be within bottom 15%
    const boxTop = box.y;
    const boxBottom = box.y + box.height;
    if (boxTop > 15 || boxBottom < 85) {
      setTooSmall(true);
      setTimeout(() => setTooSmall(false), 3000);
      return;
    }
    setShowFirebreak(true);
    setTimeout(() => {
      setPhase('success');
      completeLevel(SCENES.FIREBREAK);
    }, 1200);
  };

  // Handle styles for resize corners/edges
  const handleStyle = (cursor) => ({
    position: 'absolute', width: 18, height: 18,
    background: '#1F93BA', border: '2px solid white',
    borderRadius: '50%', cursor, zIndex: 5,
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>

      <HiddenPrefetch urls={SCENE_ASSETS[SCENES.FIREBREAK]} />
      {/* Background */}
      <img src={asset("/firebreak-bg.png")} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />

      {/* Back button — goes to previous phase */}
      <BackButton onClick={() => {
        if (phase === 'intro') navigateTo(SCENES.FIELD_MAP);
        else if (phase === 'draw') setPhase('intro');
        else if (phase === 'success') setPhase('draw');
      }} />

      {/* Home button — goes to map */}
      <HomeButton onClick={() => navigateTo(SCENES.FIELD_MAP)} />

      {/* ═══ INTRO ═══ */}
      {phase === 'intro' && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={160} />
          <DialogueBox
            text={INTRO_TEXTS[introIdx]}
            onNext={() => {
              if (introIdx < INTRO_TEXTS.length - 1) setIntroIdx(introIdx + 1);
              else setPhase('draw');
            }}
            onBack={introIdx > 0 ? () => setIntroIdx(introIdx - 1) : null}
            showName={false}
            style={{ maxWidth: 600, marginBottom: 16 }}
          />
        </div>
      )}

      {/* ═══ DRAW (resizable box) ═══ */}
      {phase === 'draw' && (
        <>
          {/* Mouse move/up listener on full area */}
          <div
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: dragging ? 'grabbing' : 'default' }}
          >
            {/* The resizable box */}
            <div style={{
              position: 'absolute',
              left: `${box.x}%`, top: `${box.y}%`,
              width: `${box.width}%`, height: `${box.height}%`,
              border: '3px dashed #8B5E3C',
              background: 'rgba(139,94,60,0.2)',
              borderRadius: 6,
              transition: dragging ? 'none' : 'all 0.1s ease',
            }}>
              {/* Resize handles — corners */}
              <div onMouseDown={(e) => handleMouseDown('nw', e)} style={{ ...handleStyle('nw-resize'), top: -9, left: -9 }} />
              <div onMouseDown={(e) => handleMouseDown('ne', e)} style={{ ...handleStyle('ne-resize'), top: -9, right: -9 }} />
              <div onMouseDown={(e) => handleMouseDown('sw', e)} style={{ ...handleStyle('sw-resize'), bottom: -9, left: -9 }} />
              <div onMouseDown={(e) => handleMouseDown('se', e)} style={{ ...handleStyle('se-resize'), bottom: -9, right: -9 }} />

              {/* Resize handles — edges */}
              <div onMouseDown={(e) => handleMouseDown('n', e)} style={{ ...handleStyle('n-resize'), top: -9, left: '50%', transform: 'translateX(-50%)' }} />
              <div onMouseDown={(e) => handleMouseDown('s', e)} style={{ ...handleStyle('s-resize'), bottom: -9, left: '50%', transform: 'translateX(-50%)' }} />
              <div onMouseDown={(e) => handleMouseDown('w', e)} style={{ ...handleStyle('w-resize'), left: -9, top: '50%', transform: 'translateY(-50%)' }} />
              <div onMouseDown={(e) => handleMouseDown('e', e)} style={{ ...handleStyle('e-resize'), right: -9, top: '50%', transform: 'translateY(-50%)' }} />

              {/* Label inside */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800, color: '#5a3a10', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
                  ↔ Drag edges to resize!
                </span>
              </div>
            </div>

            {/* Firebreak image (appears after submit) */}
            {showFirebreak && (
              <div style={{
                position: 'absolute',
                left: `${box.x}%`, top: `${box.y}%`,
                width: `${box.width}%`, height: `${box.height}%`,
                overflow: 'hidden',
                animation: 'fadeIn 1s ease',
              }}>
                <img src={asset("/firebreakrect.png")} alt="" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
              </div>
            )}
          </div>

          {/* Too small warning */}
          {tooSmall && (
            <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 30 }}>
              <FirefighterCharacter size={130} />
              <div style={{
                background: 'white', border: '3px solid #1F93BA', borderRadius: 16,
                padding: '18px 24px', maxWidth: 480, boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                marginBottom: 14,
              }}>
                <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.5, margin: 0 }}>
                  Nice try, but we want to make sure that the firebreak is big enough to stop the fire from going further!
                </p>
              </div>
            </div>
          )}

          {/* Blaze + instructions */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={130} />
            <div style={{
              background: 'white', border: '3px solid #1F93BA', borderRadius: 16,
              padding: '18px 24px', maxWidth: 440, boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
              marginBottom: 14,
            }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.5, margin: 0 }}>
                Drag the edges to make the firebreak tall and wide enough!
              </p>
            </div>
          </div>

          {/* Submit button */}
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20 }}>
            <button onClick={handleSubmit} style={{
              background: '#F819E7', border: '3px solid #BB10AE',
              borderBottom: '6px solid #BB10AE', borderRadius: 30,
              padding: '12px 36px', fontFamily: "'Fredoka One',cursive",
              fontSize: 20, color: 'white', cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
            }}>Submit</button>
          </div>
        </>
      )}

      {/* ═══ SUCCESS ═══ */}
      {phase === 'success' && (
        <>
          {/* Firebreak image in place */}
          <div style={{
            position: 'absolute',
            left: `${box.x}%`, top: `${box.y}%`,
            width: `${box.width}%`, height: `${box.height}%`,
            overflow: 'hidden', zIndex: 5,
          }}>
            <img src={asset("/firebreakrect.png")} alt="" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
          </div>

          {/* Blaze + success */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={160} />
            <DialogueBox
              text="Great work! The fire won't be able to pass through! Want to draw it again? Click Redo to explore some more!"
              showNext={false}
              showName={false}
              style={{ maxWidth: 400, marginBottom: 16 }}
            />
          </div>

          {/* Redo button — bottom left */}
          <div style={{ position: 'absolute', bottom: '5%', left: '5%', zIndex: 25 }}>
            <button onClick={() => { setPhase('draw'); setShowFirebreak(false); }} style={{
              background: '#FE8340', border: '3px solid #CE600A',
              borderBottom: '5px solid #CE600A', borderRadius: 30,
              padding: '10px 24px', fontFamily: "'Fredoka One',cursive",
              fontSize: 16, color: 'white', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>Redo</button>
          </div>

          {/* Next button — bottom right */}
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 25 }}>
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

export default FirebreakScene;
