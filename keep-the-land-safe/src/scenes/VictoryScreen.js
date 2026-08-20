import React, { useState, useEffect } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import ForestBackground from '../components/ForestBackground';
import PlayButton from '../components/PlayButton';
import BackButton from '../components/BackButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';

const ACHIEVEMENTS = [
  { id: SCENES.FIREBREAK,       title: 'Firebreak Builder',   image: '/assets/Firebreak.png',    scale: '65%', desc: 'Cleared dry grass to stop fire spreading!' },
  { id: SCENES.NATIVE_PLANTS,   title: 'Native Plant Expert', image: '/assets/NativePlant.png',  scale: '90%', desc: 'Planted fire-resistant California natives!' },
  { id: SCENES.GOATS,           title: 'Goat Wrangler',       image: '/assets/Goat.png',         scale: '90%', desc: 'Used goats to clear dangerous dry grass!' },
  { id: SCENES.CONTROLLED_BURN, title: 'Fire Safety Pro',     image: '/assets/Fire.png',         scale: '55%', desc: 'Learned how professionals do controlled burns!' },
];

const FACTS = [
  'Wildfires need fuel, heat, and oxygen to burn. Remove the fuel and you stop the fire!',
  'Firebreaks can be roads, rivers, or cleared strips of land — anything fire cannot cross!',
  'California native plants evolved with fire and are much more fire-resistant than non-native plants!',
  'One goat can eat up to 8 pounds of vegetation per day — that is a lot of fire fuel removed!',
  'Controlled burns have been used by Indigenous peoples for thousands of years to manage land!',
  'After a controlled burn, new plants grow back stronger and healthier than before!',
];

const VictoryScreen = ({ navigateTo, completedLevels }) => {
  const [factIdx, setFactIdx] = useState(0);
  const [factVisible, setFactVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => { setFactIdx(p => (p + 1) % FACTS.length); setFactVisible(true); }, 350);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const allDone = ACHIEVEMENTS.every(a => completedLevels.includes(a.id));

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <ForestBackground showPath={false} timeOfDay="day" />
      <BackButton onClick={() => navigateTo(SCENES.FIELD_MAP)} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '3vh', zIndex: 10, overflowY: 'auto' }}>

        {/* Title — white bg, blue outline, Fugaz One, black text (matches map) */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ background: 'white', border: '4px solid #1F93BA', borderRadius: 22, padding: '14px 40px', boxShadow: '0 6px 24px rgba(0,0,0,0.2)', display: 'inline-block' }}>
            <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 'clamp(26px, 4vw, 48px)', color: '#1a1a1a', lineHeight: 1.2 }}>
              {allDone ? 'Land Protector!' : 'Great Work!'}
            </div>
            <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 14, color: '#239622', fontWeight: 800, marginTop: 4 }}>
              {allDone ? 'You completed all 4 land safety missions!' : completedLevels.length + '/4 missions complete!'}
            </div>
          </div>
        </div>

        {/* Blaze + message */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
          <FirefighterCharacter size={120} />
          <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 16, padding: '14px 18px', maxWidth: 280, boxShadow: '0 6px 24px rgba(0,0,0,0.15)', position: 'relative', marginBottom: 18 }}>
            <div style={{ position: 'absolute', left: -17, bottom: 20, width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderRight: '17px solid #1F93BA' }} />
            <div style={{ position: 'absolute', left: -11, bottom: 22, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '12px solid white' }} />
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.5, margin: 0 }}>
              {allDone
                ? "You're an amazing land protector! Our forests are safer because of you!"
                : "Great job! Go back to the map and try the other missions to become a full land protector!"}
            </p>
          </div>
        </div>

        {/* Achievement boxes — same cards as the map */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'nowrap', justifyContent: 'center', marginBottom: 16, padding: '0 14px' }}>
          {ACHIEVEMENTS.map((a) => {
            const earned = completedLevels.includes(a.id);
            return (
              <div key={a.id} style={{
                width: 150, height: 190,
                background: 'white',
                border: '3px solid #FFD23F',
                borderRadius: 16, overflow: 'hidden',
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              }}>
                {/* Image area — takes top portion */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, minHeight: 0 }}>
                  <img src={a.image} alt={a.title} style={{
                    maxWidth: '60%', maxHeight: 80,
                    objectFit: 'contain',
                  }} />
                </div>
                {/* Text at bottom */}
                <div style={{
                  background: 'rgba(255,255,255,0.92)',
                  borderTop: '2px solid #FFD23F',
                  padding: '6px 8px', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 12, color: '#1a1a1a', lineHeight: 1.2 }}>{a.title}</div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, color: '#239622', fontWeight: 800, lineHeight: 1.2, marginTop: 2 }}>{a.desc}</div>
                </div>
                {earned && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(31,147,186,0.15)', borderRadius: 14 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Fun fact ticker — white bg, blue outline */}
        <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 16, padding: '12px 22px', maxWidth: 580, width: '90%', textAlign: 'center', marginBottom: 16, minHeight: 58, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.5, margin: 0, opacity: factVisible ? 1 : 0, transition: 'opacity 0.35s ease' }}>
            Did you know? {FACTS[factIdx]}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <PlayButton onClick={() => navigateTo(SCENES.FIELD_MAP)} label="Back to Map" size="medium" color="#F819E7" borderColor="#BB10AE" textColor="white" />
          <PlayButton onClick={() => { localStorage.removeItem('completedLevels'); navigateTo(SCENES.MAIN_MAP); }} label="Start Over" size="medium" color="#FE8340" borderColor="#CE600A" textColor="white" />
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;
