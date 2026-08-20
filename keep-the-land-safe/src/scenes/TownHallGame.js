import React, { useState } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import BackButton from '../components/BackButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';
import asset from '../asset';
import { HiddenPrefetch, SCENE_ASSETS } from '../preloadAssets';

const GO_BAG_ICONS = [
  { name: 'Photos', image: asset('/photos.png') },
  { name: 'Pets', image: asset('/pets.png') },
  { name: 'Papers', image: asset('/documentsicon.png') },
  { name: 'First-Aid', image: asset('/firstaid.png') },
  { name: 'Water', image: asset('/water.png') },
  { name: 'Prescriptions', image: asset('/prescriptions.png') },
  { name: 'Flashlight', image: asset('/flashlight.png') },
  { name: 'Precious Items', image: asset('/preciousitems.png') },
  { name: 'Battery & Chargers', image: asset('/batteryandcharger.png') },
  { name: 'Cash', image: asset('/cash.png') },
];

// Items for the drag game — some correct, some wrong
const GAME_ITEMS = [
  { id: 'water', name: 'Water Bottle', image: asset('/waterbottle.png'), correct: true },
  { id: 'docs', name: 'Documents', image: asset('/documents.png'), correct: true },
  { id: 'medicine', name: 'Medicine', image: asset('/medicine.png'), correct: true },
  { id: 'soccer', name: 'Soccer Ball', image: asset('/soccerball.png'), correct: false },
  { id: 'doll', name: 'Doll', image: asset('/doll.png'), correct: false },
];

const INTRO_SLIDES = [
  { text: "Sometimes families need to leave fast. A go-bag helps!" },
  { text: "A go-bag holds important things you take when you leave fast." },
];

const TownHallGame = ({ navigateTo, completeGame }) => {
  // Phases: intro -> grid -> family -> instructions -> game -> success
  const [phase, setPhase] = useState('intro');
  const [introIdx, setIntroIdx] = useState(0);
  const [packedItems, setPackedItems] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [showResult, setShowResult] = useState(false);

  const handleDragStart = (itemId, e) => {
    e.preventDefault();
    setDraggingItem(itemId);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!draggingItem) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e) => {
    if (!draggingItem) return;
    // Check if dropped on the bag area (right side)
    const bounds = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - bounds.left) / bounds.width) * 100;
    if (xPct > 65) {
      if (!packedItems.includes(draggingItem) && packedItems.length < 3) {
        setPackedItems(prev => [...prev, draggingItem]);
      }
    }
    setDraggingItem(null);
  };

  const handleFinished = () => {
    const correctItems = GAME_ITEMS.filter(i => i.correct).map(i => i.id);
    const allCorrectPacked = correctItems.every(id => packedItems.includes(id));
    const noWrongPacked = packedItems.every(id => GAME_ITEMS.find(i => i.id === id)?.correct);

    if (allCorrectPacked && noWrongPacked) {
      setShowResult('success');
      setTimeout(() => {
        setPhase('success');
        completeGame(SCENES.TOWN_HALL);
      }, 1500);
    } else {
      setShowResult('error');
      // Remove wrong items from the bag so the player can try again
      setTimeout(() => {
        setPackedItems(prev => prev.filter(id => GAME_ITEMS.find(i => i.id === id)?.correct));
        setShowResult(false);
      }, 3000);
    }
  };

  const availableItems = GAME_ITEMS.filter(item => !packedItems.includes(item.id));

  return (
    <div
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <HiddenPrefetch urls={SCENE_ASSETS[SCENES.TOWN_HALL]} />
      {/* ═══ INTRO ═══ */}
      {phase === 'intro' && (
        <>
          <img src={asset("/reccenter.png")} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 1 }} />
          <BackButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />
          <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

          <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={180} />
            <DialogueBox
              text={INTRO_SLIDES[introIdx].text}
              onNext={() => {
                if (introIdx < INTRO_SLIDES.length - 1) setIntroIdx(introIdx + 1);
                else setPhase('grid');
              }}
              onBack={introIdx > 0 ? () => setIntroIdx(introIdx - 1) : null}
              showName={false}
              style={{ maxWidth: 450, marginBottom: 20 }}
            />
          </div>
        </>
      )}

      {/* ═══ GRID — What's in a go bag ═══ */}
      {phase === 'grid' && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: '#3B6DAA', zIndex: 0 }} />
          <BackButton onClick={() => setPhase('intro')} />
          <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '4%', zIndex: 10 }}>
            <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 'clamp(28px,4.5vw,44px)', color: 'white', marginBottom: 8, fontStyle: 'italic' }}>What's In A Go-Bag?</div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 24 }}>It's important to know what to take in case of an evacuation.</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, maxWidth: 900, width: '92%' }}>
              {GO_BAG_ICONS.map((item, i) => (
                <div key={i} style={{ background: 'white', border: '3px solid #D4A817', borderRadius: 10, padding: '24px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 160 }}>
                  <img src={item.image} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2 }}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20 }}>
            <button onClick={() => setPhase('family')} style={{ background: '#F819E7', border: '3px solid #BB10AE', borderBottom: '6px solid #BB10AE', borderRadius: 30, padding: '14px 44px', fontFamily: "'Fredoka One',cursive", fontSize: 22, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>Next</button>
          </div>
        </>
      )}

      {/* ═══ FAMILY ═══ */}
      {phase === 'family' && (
        <>
          <img src={asset("/reccenter.png")} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 1 }} />
          <BackButton onClick={() => setPhase('grid')} />
          <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

          {/* Title */}
          <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
            <div style={{ background: 'white', border: '3px solid #F819E7', borderRadius: 20, padding: '14px 32px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
              <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 26, color: '#1a1a1a' }}>Help The Town Get Ready</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, color: '#666' }}>Help this family pack their go-bag</div>
            </div>
          </div>

          {/* Family */}
          <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 16, zIndex: 10, alignItems: 'flex-end' }}>
            <img src={asset("/family1.png")} alt="" style={{ height: 220, objectFit: 'contain' }} />
            <img src={asset("/family2.png")} alt="" style={{ height: 200, objectFit: 'contain' }} />
            <img src={asset("/family3.png")} alt="" style={{ height: 160, objectFit: 'contain' }} />
          </div>

          {/* Start packing button */}
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20 }}>
            <button onClick={() => setPhase('instructions')} style={{ background: '#F819E7', border: '3px solid #BB10AE', borderBottom: '6px solid #BB10AE', borderRadius: 30, padding: '12px 36px', fontFamily: "'Fredoka One',cursive", fontSize: 20, color: 'white', cursor: 'pointer' }}>Start Packing</button>
          </div>
        </>
      )}

      {/* ═══ INSTRUCTIONS ═══ */}
      {phase === 'instructions' && (
        <>
          <img src={asset("/reccenter.png")} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 1 }} />
          <BackButton onClick={() => setPhase('family')} />
          <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

          <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={180} />
            <DialogueBox
              text={"Drag each item you think belongs in the go-bag to the bag on the right.\n\nMake sure to avoid those that do not.\n\nWhen you're done, hit the \"Finished\" button to check!"}
              onNext={() => setPhase('game')}
              showName={false}
              style={{ maxWidth: 450, marginBottom: 20 }}
            />
          </div>
        </>
      )}

      {/* ═══ GAME — Drag & Drop ═══ */}
      {phase === 'game' && (
        <>
          <img src={asset("/reccenter.png")} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          <BackButton onClick={() => setPhase('instructions')} />
          <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

          {/* Backpack on the left */}
          <img src={asset("/backpack.png")} alt="" style={{ position: 'absolute', bottom: '8%', left: '5%', width: 140, objectFit: 'contain', zIndex: 5 }} />

          {/* Items scattered in the middle */}
          <div style={{ position: 'absolute', bottom: '10%', left: '22%', display: 'flex', gap: 20, flexWrap: 'wrap', maxWidth: '40%', zIndex: 10, alignItems: 'flex-end' }}>
            {availableItems.map(item => (
              <img
                key={item.id}
                src={item.image}
                alt={item.name}
                draggable={false}
                onMouseDown={(e) => handleDragStart(item.id, e)}
                style={{ width: 70, height: 70, objectFit: 'contain', cursor: 'grab', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' }}
              />
            ))}
          </div>

          {/* Drop zone — bag slots on the right */}
          <div style={{ position: 'absolute', top: '15%', right: '5%', width: 180, background: 'white', border: '3px solid #F819E7', borderRadius: 16, padding: 12, zIndex: 15, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 700, color: '#666', textAlign: 'center', marginBottom: 4 }}>Click an item to remove it</div>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                onClick={() => {
                  if (packedItems[i]) {
                    setPackedItems(prev => prev.filter((_, idx) => idx !== i));
                  }
                }}
                style={{ height: 55, border: '2px solid #1F93BA', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: packedItems[i] ? '#E8F4FD' : 'white', cursor: packedItems[i] ? 'pointer' : 'default', transition: 'transform 0.1s ease' }}
              >
                {packedItems[i] && (
                  <img src={GAME_ITEMS.find(item => item.id === packedItems[i])?.image} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                )}
              </div>
            ))}
          </div>

          {/* Dragging ghost */}
          {draggingItem && (
            <div style={{ position: 'fixed', left: dragPos.x, top: dragPos.y, transform: 'translate(-50%, -50%)', zIndex: 100, pointerEvents: 'none', opacity: 0.8 }}>
              <img src={GAME_ITEMS.find(item => item.id === draggingItem)?.image} alt="" style={{ width: 70, height: 70, objectFit: 'contain' }} />
            </div>
          )}

          {/* Result feedback */}
          {showResult && (
            <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 30, background: 'white', border: '3px solid #1F93BA', borderRadius: 20, padding: '14px 28px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                {showResult === 'success' ? 'Great choices! You packed the right items!' : "Not quite! Make sure to pack all the important items and leave out things that don't belong."}
              </p>
            </div>
          )}

          {/* Finished button */}
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20 }}>
            <button onClick={handleFinished} style={{ background: '#F819E7', border: '3px solid #BB10AE', borderBottom: '6px solid #BB10AE', borderRadius: 30, padding: '12px 36px', fontFamily: "'Fredoka One',cursive", fontSize: 20, color: 'white', cursor: 'pointer' }}>Finished</button>
          </div>
        </>
      )}

      {/* ═══ SUCCESS ═══ */}
      {phase === 'success' && (
        <>
          <img src={asset("/reccenter.png")} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 1 }} />

          <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={180} />
            <DialogueBox
              text="Nice Work! In real life, grown-ups help pack go-bags. You did a great job learning what goes inside!"
              onNext={() => navigateTo(SCENES.MAIN_MAP)}
              showName={false}
              style={{ maxWidth: 450, marginBottom: 20 }}
            />
          </div>

          <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />
        </>
      )}
    </div>
  );
};

export default TownHallGame;
