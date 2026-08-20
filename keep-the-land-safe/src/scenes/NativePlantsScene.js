import React, { useState } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import BackButton from '../components/BackButton';
import HomeButton from '../components/HomeButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';

const INTRO_TEXTS = [
  "These plants are not from this area, so they burn easily. It's important to replant native plants that are more resistant to fires.",
];

const PLANTS = [
  { id: 'cherry', name: 'Catalina Cherry Tree', image: '/cherry-tree.png', dropSize: 120,
    facts: [
      'Thick, waxy leaves that hold water',
      "Doesn't drop a lot of dry leaves/needles like pine trees do",
      'No oily sap or wood (unlike trees like eucalyptus, which burn easily)',
    ]},
  { id: 'fuchsia', name: 'California Fuchsia', image: '/fushcia.png', dropSize: 80,
    facts: [
      'Leaves stay moist, even in summer',
      'Grows low and spread out, not tall and woody',
      'No oily parts that catch fire easily',
    ]},
  { id: 'poppy', name: 'California Poppy', image: '/poppy.png', dropSize: 80,
    facts: [
      'Small and low to the ground — no tall dry parts for fire to climb',
      'Juicy, watery leaves and stems',
      "Doesn't leave much dead stuff behind",
    ]},
];

const NativePlantsScene = ({ navigateTo, completeLevel }) => {
  // Phases: intro -> learn -> summary -> drag -> success
  const [phase, setPhase] = useState('intro');
  const [introIdx, setIntroIdx] = useState(0);
  const [expandedPlant, setExpandedPlant] = useState(null);
  const [placedPlants, setPlacedPlants] = useState([]);
  const [draggingPlant, setDraggingPlant] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  // Drag handlers
  const handleDragStart = (plantId, e) => {
    setDraggingPlant(plantId);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!draggingPlant) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e) => {
    if (!draggingPlant) return;
    // If dropped on the right side (the grass field area), place it
    const bounds = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - bounds.left) / bounds.width) * 100;
    const yPct = ((e.clientY - bounds.top) / bounds.height) * 100;

    if (xPct > 20) { // dropped on the field (right of panel)
      const clampedY = Math.max(yPct, 42); // push to top of grass if dropped in sky
      const newPlaced = [...placedPlants, { id: draggingPlant, x: xPct, y: clampedY }];
      setPlacedPlants(newPlaced);
    }
    setDraggingPlant(null);
  };

  // Plants always available — library style, never removed
  const availablePlants = PLANTS;

  return (
    <div
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Background — changes per phase */}
      <img
        src={phase === 'intro' ? '/firebreak-bg.png' : '/native-plants-field.png'}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
      />

      {/* Back button — goes to previous phase */}
      <BackButton onClick={() => {
        if (phase === 'intro') navigateTo(SCENES.FIELD_MAP);
        else if (phase === 'learn') setPhase('intro');
        else if (phase === 'summary') setPhase('learn');
        else if (phase === 'drag') setPhase('summary');
        else if (phase === 'success') setPhase('drag');
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
              else setPhase('learn');
            }}
            onBack={introIdx > 0 ? () => setIntroIdx(introIdx - 1) : null}
            showName={false}
            style={{ maxWidth: 600, marginBottom: 16 }}
          />
        </div>
      )}

      {/* ═══ LEARN ═══ */}
      {phase === 'learn' && (
        <>
          {/* Instruction text top */}
          <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '90%', maxWidth: 700 }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '14px 32px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                Tap to learn more about these plants.
              </p>
            </div>
          </div>

          {/* Blaze on left */}
          <div style={{ position: 'absolute', bottom: '3%', left: '2%', zIndex: 10 }}>
            <FirefighterCharacter size={240} />
          </div>

          {/* Plant cards */}
          {!expandedPlant && (
            <div style={{ position: 'absolute', top: '28%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexWrap: 'nowrap', gap: 20, zIndex: 15 }}>
              {PLANTS.map(plant => (
                <div
                  key={plant.id}
                  onClick={() => setExpandedPlant(plant.id)}
                  style={{
                    background: 'white', border: '3px solid #FFD23F',
                    borderRadius: 14, padding: '20px 24px',
                    width: 240, cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src={plant.image} alt={plant.name} style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 10 }} />
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>{plant.name}</div>
                </div>
              ))}
            </div>
          )}

          {/* Expanded card with dimmed background */}
          {expandedPlant && (
            <>
              <div onClick={() => setExpandedPlant(null)} style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 25,
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'white', border: '3px solid #FFD23F', borderRadius: 18,
                padding: '28px 36px', zIndex: 30, width: '70%', maxWidth: 600,
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                animation: 'none',
              }}>
                {(() => {
                  const plant = PLANTS.find(p => p.id === expandedPlant);
                  return (
                    <>
                      <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 24, fontWeight: 900, color: '#1a1a1a', marginBottom: 16 }}>{plant.name}</div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
                        <img src={plant.image} alt={plant.name} style={{ width: 140, height: 140, objectFit: 'contain', flexShrink: 0 }} />
                        <ul style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
                          {plant.facts.map((fact, i) => (
                            <li key={i}>{fact}</li>
                          ))}
                        </ul>
                      </div>
                      <button onClick={() => setExpandedPlant(null)} style={{
                        marginTop: 20, background: '#F819E7', border: 'none', borderRadius: 18,
                        padding: '8px 20px', fontFamily: "'Fredoka One',cursive", fontSize: 15,
                        color: 'white', cursor: 'pointer',
                      }}>Close</button>
                    </>
                  );
                })()}
              </div>
            </>
          )}

          {/* Next button */}
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20 }}>
            <button onClick={() => setPhase('summary')} style={{
              background: '#F819E7', border: '3px solid #BB10AE',
              borderBottom: '6px solid #BB10AE', borderRadius: 30,
              padding: '12px 36px', fontFamily: "'Fredoka One',cursive",
              fontSize: 20, color: 'white', cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
            }}>Next</button>
          </div>
        </>
      )}

      {/* ═══ SUMMARY ═══ */}
      {phase === 'summary' && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={160} />
          <DialogueBox
            text={'Why these are all "fire-safe" plants:\n• They stay juicy, not dry\n• They don\'t have oils that burn hot\n• They don\'t pile up dead leaves/branches\n• They grow low and spaced out, so fire can\'t climb or spread easily'}
            onNext={() => setPhase('drag')}
            showName={false}
            style={{ maxWidth: 600, marginBottom: 16 }}
          />
        </div>
      )}

      {/* ═══ DRAG & DROP ═══ */}
      {phase === 'drag' && (
        <>
          {/* Instruction text top */}
          <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '90%', maxWidth: 700 }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '14px 32px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                Drag and drop the plants into the grass to protect it!
              </p>
            </div>
          </div>

          {/* Plant cards on the left */}
          <div style={{ position: 'absolute', top: '16%', left: '2%', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 15 }}>
            {availablePlants.map(plant => (
              <div
                key={plant.id}
                onMouseDown={(e) => handleDragStart(plant.id, e)}
                style={{
                  background: 'white', border: '3px solid #FFD23F',
                  borderRadius: 12, padding: '10px 14px',
                  width: 140, cursor: 'grab', textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  userSelect: 'none',
                }}
              >
                <img src={plant.image} alt={plant.name} style={{ width: 70, height: 70, objectFit: 'contain', pointerEvents: 'none' }} />
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 800, color: '#1a1a1a', marginTop: 4 }}>{plant.name}</div>
              </div>
            ))}
          </div>

          {/* Placed plants on the field */}
          {placedPlants.map((pp, i) => {
            const plant = PLANTS.find(p => p.id === pp.id);
            return (
              <div key={i} style={{
                position: 'absolute', left: `${pp.x}%`, top: `${pp.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 8, animation: 'popIn 0.4s ease',
              }}>
                <img src={plant.image} alt={plant.name} style={{ width: plant.dropSize, height: plant.dropSize, objectFit: 'contain', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' }} />
              </div>
            );
          })}

          {/* Dragging ghost */}
          {draggingPlant && (
            <div style={{
              position: 'fixed', left: dragPos.x, top: dragPos.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 100, pointerEvents: 'none', opacity: 0.8,
            }}>
              <img src={PLANTS.find(p => p.id === draggingPlant).image} alt="" style={{ width: 80, height: 80, objectFit: 'contain' }} />
            </div>
          )}

          {/* Next button — always visible once at least one plant placed */}
          {placedPlants.length > 0 && (
            <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20 }}>
              <button onClick={() => { setPhase('success'); completeLevel(SCENES.NATIVE_PLANTS); }} style={{
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

          {/* Placed plants stay visible */}
          {placedPlants.map((pp, i) => {
            const plant = PLANTS.find(p => p.id === pp.id);
            return (
              <div key={i} style={{
                position: 'absolute', left: `${pp.x}%`, top: `${pp.y}%`,
                transform: 'translate(-50%, -50%)', zIndex: 8,
              }}>
                <img src={plant.image} alt={plant.name} style={{ width: plant.dropSize, height: plant.dropSize, objectFit: 'contain', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' }} />
              </div>
            );
          })}

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

export default NativePlantsScene;
