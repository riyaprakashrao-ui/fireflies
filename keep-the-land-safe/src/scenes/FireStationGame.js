import React, { useState, useRef } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import BackButton from '../components/BackButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';

// Info slides data
const SLIDES = [
  {
    bg: 'firestation',
    title: 'Evacuation Routes',
    text: "Sometimes, it gets to a point where people have to leave their homes for a bit in order to stay safe from a fire. This is called \"evacuation\". Fire officials and the police work together to create a plan for evacuation.",
  },
  {
    bg: 'blueprint',
    text: "In case of evacuating a building, architects make sure to add in safe exits to each room.",
  },
  {
    bg: 'exit',
    text: "And exit signs are clearly marked. Just like with a building, there are also plans for evacuating a town.",
  },
  {
    bg: 'assembly',
    text: "An assembly point is a safe meeting spot picked ahead of time, away from trees and dry brush, where everyone gathers if a wildfire is coming. When it's time to evacuate, families go straight there instead of wasting time — so everyone can be counted, and grown-ups know who's safe before leaving the area together.",
  },
  {
    bg: 'road',
    text: "It's important that the roads on the evacuation route are well lit with lots of street lamps.",
  },
  {
    bg: 'factors',
    title: null,
    text: "Fire officials decide when and where to evacuate based on the fire, wind, and terrain. They create routes keeping traffic in mind to make sure people can get out and firefighters can come in. Always keep a phone or radio handy to tune into updates from fire safety officials.",
  },
  {
    bg: 'firestation',
    text: "Now, it's your turn to help us come up with an evacuation route for the town!",
  },
];

// Maze grid: 0 = grass, 1 = road, 2 = fire (blocked road)
const MAZE_ROWS = 9;
const MAZE_COLS = 13;
const MAZE = [
  [0,1,1,1,0,0,1,1,1,1,0,0,0],
  [0,1,0,1,0,0,1,0,0,1,0,0,0],
  [0,1,0,1,1,1,1,0,0,1,1,1,0],
  [0,1,0,0,0,2,0,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,2,1,1,1,0],
  [0,0,0,2,0,0,0,1,0,0,0,1,0],
  [0,1,1,1,1,0,0,1,1,1,0,1,0],
  [0,1,0,0,1,1,1,1,0,1,1,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,1,1],
];
const START = { row: 0, col: 1 };
const END = { row: 8, col: 12 };

const FireStationGame = ({ navigateTo, completeGame }) => {
  const [phase, setPhase] = useState('info'); // info, draw, success
  const [slideIdx, setSlideIdx] = useState(0);
  const [drawnCells, setDrawnCells] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState('draw'); // draw, erase
  const [history, setHistory] = useState([]);

  const cellKey = (r, c) => `${r}-${c}`;

  const handleCellInteraction = (row, col) => {
    if (MAZE[row][col] === 0 || MAZE[row][col] === 2) return; // can't draw on grass or fire

    if (tool === 'draw') {
      if (!drawnCells.includes(cellKey(row, col))) {
        setHistory(prev => [...prev, [...drawnCells]]);
        setDrawnCells(prev => [...prev, cellKey(row, col)]);
      }
    } else if (tool === 'erase') {
      if (drawnCells.includes(cellKey(row, col))) {
        setHistory(prev => [...prev, [...drawnCells]]);
        setDrawnCells(prev => prev.filter(c => c !== cellKey(row, col)));
      }
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      setDrawnCells(history[history.length - 1]);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleDone = () => {
    setPhase('complete'); // show the path, then they click next
  };

  const handleFinish = () => {
    setPhase('success');
    completeGame(SCENES.FIRE_STATION);
  };

  const getBg = (slide) => {
    switch (slide.bg) {
      case 'firestation': return null; // handled separately
      case 'blueprint': return '/blueprint.png';
      case 'exit': return null; // green CSS background
      case 'assembly': return '/assembly.png';
      case 'road': return '/road.png';
      case 'factors': return '/openingscenebg.png';
      default: return '/openingscenebg.png';
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* ═══ INFO PHASE ═══ */}
      {phase === 'info' && (
        <>
          {/* Background */}
          {SLIDES[slideIdx].bg === 'exit' ? (
            <div style={{ position: 'absolute', inset: 0, background: '#1B5E20', zIndex: 0 }} />
          ) : SLIDES[slideIdx].bg === 'firestation' ? (
            <img src="/openingscenebg.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', zIndex: 0 }} />
          ) : SLIDES[slideIdx].bg === 'assembly' ? (
            <img src="/assembly point.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%', zIndex: 0 }} />
          ) : (
            <img src={getBg(SLIDES[slideIdx])} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', zIndex: 0 }} />
          )}

          {/* Exit sign image centered */}
          {SLIDES[slideIdx].bg === 'exit' && (
            <img src="/exit sign.png" alt="" style={{ position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)', width: '40%', maxWidth: 400, objectFit: 'contain', zIndex: 1 }} />
          )}

          {/* Fire station asset on first and last slide */}
          {SLIDES[slideIdx].bg === 'firestation' && (
            <img src="/firestationasset.png" alt="" style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '75%', maxWidth: 800, objectFit: 'contain', zIndex: 1 }} />
          )}

          {/* Dim overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 2 }} />

          {/* Title if exists */}
          {SLIDES[slideIdx].title && (
            <div style={{ position: 'absolute', top: '4%', left: '12%', zIndex: 20 }}>
              <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 30, padding: '12px 32px', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
                <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 28, color: '#1a1a1a' }}>{SLIDES[slideIdx].title}</div>
              </div>
            </div>
          )}

          {/* Factors icons */}
          {SLIDES[slideIdx].bg === 'factors' && (
            <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, zIndex: 20 }}>
              {['/fire.png', '/wind.png', '/terrain.png', '/phone.png'].map((img, i) => (
                <div key={i} style={{ background: 'white', border: '3px solid #FFD23F', borderRadius: 16, padding: 20, width: 240, height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={img} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          )}

          {/* Blaze + dialogue */}
          <div style={{ position: 'absolute', bottom: '3%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={140} />
            <DialogueBox
              text={SLIDES[slideIdx].text}
              onNext={() => {
                if (slideIdx < SLIDES.length - 1) setSlideIdx(slideIdx + 1);
                else setPhase('draw');
              }}
              onBack={slideIdx > 0 ? () => setSlideIdx(slideIdx - 1) : null}
              showName={false}
              style={{ maxWidth: 400, marginBottom: 10 }}
            />
          </div>

          <BackButton onClick={() => {
            if (slideIdx > 0) setSlideIdx(slideIdx - 1);
            else navigateTo(SCENES.MAIN_MAP);
          }} />
          <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />
        </>
      )}

      {/* ═══ DRAW PHASE (MAZE) ═══ */}
      {phase === 'draw' && (
        <>
          {/* Light blue background */}
          <div style={{ position: 'absolute', inset: 0, background: '#E1F5FE', zIndex: 0 }} />

          <BackButton onClick={() => setPhase('info')} />
          <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

          {/* Instruction */}
          <div style={{ position: 'absolute', top: '2%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '80%', maxWidth: 600 }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 30, padding: '10px 28px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                Draw a route from START to EXIT, avoiding the fires!
              </p>
            </div>
          </div>

          {/* Maze grid */}
          <div
            style={{
              position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)',
              display: 'grid',
              gridTemplateColumns: `repeat(${MAZE_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${MAZE_ROWS}, 1fr)`,
              width: '85%', maxWidth: 900,
              aspectRatio: `${MAZE_COLS}/${MAZE_ROWS}`,
              zIndex: 10, gap: 2,
            }}
            onMouseDown={() => setDrawing(true)}
            onMouseUp={() => setDrawing(false)}
            onMouseLeave={() => setDrawing(false)}
          >
            {MAZE.flat().map((cell, i) => {
              const row = Math.floor(i / MAZE_COLS);
              const col = i % MAZE_COLS;
              const key = cellKey(row, col);
              const isDrawn = drawnCells.includes(key);
              const isStart = row === START.row && col === START.col;
              const isEnd = row === END.row && col === END.col;

              return (
                <div
                  key={key}
                  onMouseDown={() => handleCellInteraction(row, col)}
                  onMouseEnter={() => { if (drawing) handleCellInteraction(row, col); }}
                  style={{
                    background: cell === 0 ? '#D0EBFA'
                      : cell === 2 ? '#444'
                      : isDrawn ? '#FFD23F'
                      : '#555',
                    borderRadius: 3,
                    position: 'relative',
                    cursor: cell === 1 ? 'pointer' : 'default',
                    border: isStart ? '3px solid #4CAF50' : isEnd ? '3px solid #F819E7' : 'none',
                  }}
                >
                  {/* Road markings */}
                  {cell === 1 && !isDrawn && (
                    <div style={{ position: 'absolute', inset: '40% 20%', background: '#FFD23F', borderRadius: 1, opacity: 0.4 }} />
                  )}
                  {/* Fire on blocked roads */}
                  {cell === 2 && (
                    <img src="/campfire-flame.png" alt="" style={{ position: 'absolute', inset: '10%', width: '80%', height: '80%', objectFit: 'contain', transformOrigin: 'center bottom', animation: 'fireFlicker 0.3s ease-in-out infinite' }} />
                  )}
                  {/* Start label */}
                  {isStart && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka One',cursive", fontSize: 14, color: '#fff', background: '#4CAF50', padding: '2px 4px', borderRadius: 3 }}>START</div>
                  )}
                  {/* End label */}
                  {isEnd && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka One',cursive", fontSize: 14, color: '#fff', background: '#F819E7', padding: '2px 4px', borderRadius: 3 }}>EXIT</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tool buttons */}
          <div style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 20 }}>
            <button onClick={() => setTool('draw')} style={{ background: tool === 'draw' ? '#1F93BA' : '#64B5F6', border: 'none', borderRadius: 20, padding: '10px 26px', fontFamily: "'Fredoka One',cursive", fontSize: 16, color: 'white', cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,0,0,0.2)' }}>Draw</button>
            <button onClick={() => setTool('erase')} style={{ background: tool === 'erase' ? '#C62828' : '#EF5350', border: 'none', borderRadius: 20, padding: '10px 26px', fontFamily: "'Fredoka One',cursive", fontSize: 16, color: 'white', cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,0,0,0.2)' }}>Erase</button>
            <button onClick={handleUndo} style={{ background: '#FFD23F', border: 'none', borderRadius: 20, padding: '10px 26px', fontFamily: "'Fredoka One',cursive", fontSize: 16, color: '#1a1a1a', cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,0,0,0.2)' }}>Undo</button>
            <button onClick={handleDone} style={{ background: '#4CAF50', border: 'none', borderRadius: 20, padding: '10px 26px', fontFamily: "'Fredoka One',cursive", fontSize: 16, color: 'white', cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,0,0,0.2)' }}>Submit</button>
          </div>

          {/* Pink Next button */}
          <div style={{ position: 'absolute', bottom: '4%', right: '4%', zIndex: 20 }}>
            <button onClick={handleDone} style={{ background: '#F819E7', border: '3px solid #BB10AE', borderBottom: '6px solid #BB10AE', borderRadius: 30, padding: '10px 30px', fontFamily: "'Fredoka One',cursive", fontSize: 18, color: 'white', cursor: 'pointer' }}>Next</button>
          </div>
        </>
      )}

      {/* ═══ COMPLETE (show path, click next) ═══ */}
      {phase === 'complete' && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: '#E8F4FD', zIndex: 0 }} />

          <BackButton onClick={() => setPhase('draw')} />
          <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

          {/* Instruction */}
          <div style={{ position: 'absolute', top: '2%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '80%', maxWidth: 600 }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 30, padding: '10px 28px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                Great route! Here's your evacuation plan.
              </p>
            </div>
          </div>

          {/* Maze with drawn path visible */}
          <div style={{
            position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)',
            display: 'grid',
            gridTemplateColumns: `repeat(${MAZE_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${MAZE_ROWS}, 1fr)`,
            width: '85%', maxWidth: 900,
            aspectRatio: `${MAZE_COLS}/${MAZE_ROWS}`,
            zIndex: 10, gap: 2,
          }}>
            {MAZE.flat().map((cell, i) => {
              const row = Math.floor(i / MAZE_COLS);
              const col = i % MAZE_COLS;
              const key = cellKey(row, col);
              const isDrawn = drawnCells.includes(key);
              const isStart = row === START.row && col === START.col;
              const isEnd = row === END.row && col === END.col;

              return (
                <div key={key} style={{
                  background: cell === 0 ? '#D0EBFA' : cell === 2 ? '#444' : isDrawn ? '#FFD23F' : '#555',
                  borderRadius: 3, position: 'relative',
                  border: isStart ? '3px solid #4CAF50' : isEnd ? '3px solid #F819E7' : 'none',
                }}>
                  {cell === 1 && !isDrawn && <div style={{ position: 'absolute', inset: '40% 20%', background: '#FFD23F', borderRadius: 1, opacity: 0.4 }} />}
                  {cell === 2 && <img src="/campfire-flame.png" alt="" style={{ position: 'absolute', inset: '10%', width: '80%', height: '80%', objectFit: 'contain', transformOrigin: 'center bottom', animation: 'fireFlicker 0.3s ease-in-out infinite' }} />}
                  {isStart && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka One',cursive", fontSize: 14, color: '#fff', background: '#4CAF50', padding: '2px 4px', borderRadius: 3 }}>START</div>}
                  {isEnd && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka One',cursive", fontSize: 14, color: '#fff', background: '#F819E7', padding: '2px 4px', borderRadius: 3 }}>EXIT</div>}
                </div>
              );
            })}
          </div>

          {/* Next button */}
          <div style={{ position: 'absolute', bottom: '4%', right: '4%', zIndex: 20 }}>
            <button onClick={handleFinish} style={{ background: '#F819E7', border: '3px solid #BB10AE', borderBottom: '6px solid #BB10AE', borderRadius: 30, padding: '10px 30px', fontFamily: "'Fredoka One',cursive", fontSize: 18, color: 'white', cursor: 'pointer' }}>Next</button>
          </div>
        </>
      )}

      {/* ═══ SUCCESS ═══ */}
      {phase === 'success' && (
        <FireStationVictory navigateTo={navigateTo} />
      )}
    </div>
  );
};

const FireStationVictory = ({ navigateTo }) => (
  <>
    <img src="/openingscenebg.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', zIndex: 0 }} />
    <img src="/firestationasset.png" alt="" style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '75%', maxWidth: 800, objectFit: 'contain', zIndex: 1 }} />
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', zIndex: 2 }} />

    <BackButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />
    <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

    <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 20 }}>
      <FirefighterCharacter size={220} />
      <div style={{ marginBottom: 30 }}>
        <DialogueBox
          text="Great job! You planned an evacuation route. Now everyone knows how to get out safely."
          onNext={() => navigateTo(SCENES.MAIN_MAP)}
          showName={false}
          style={{ maxWidth: 460 }}
        />
      </div>
    </div>
  </>
);

export default FireStationGame;
