import React from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import PlayButton from '../components/PlayButton';
import MapButton from '../components/MapButton';
import HowToButton from '../components/HowToButton';
import { SCENES } from '../scenes';
import asset from '../asset';
import { HiddenPrefetch, SCENE_ASSETS } from '../preloadAssets';

const Cloud = ({ width }) => (
  <div style={{ position: 'relative', width, height: width * 0.45 }}>
    <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '60%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '45%', height: '70%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '50%', width: '38%', height: '55%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
  </div>
);

const TitleScreen = ({ navigateTo, hasSeenOnboarding }) => (
  <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
    <HiddenPrefetch urls={[...SCENE_ASSETS[SCENES.TITLE], ...SCENE_ASSETS[SCENES.MAIN_MAP], ...SCENE_ASSETS[SCENES.ONBOARDING]]} />
    <img src={asset("/openingscenebg.png")} alt="" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      objectFit: 'cover', objectPosition: 'center bottom', zIndex: 0,
    }} />

    <img src={asset("/firestationasset.png")} alt="" style={{
      position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
      width: '75%', maxWidth: 800, objectFit: 'contain', zIndex: 1,
    }} />

    <div style={{ position: 'absolute', top: '4%', left: '3%', zIndex: 2, animation: 'cloudDrift 4s ease-in-out infinite alternate', pointerEvents: 'none' }}>
      <Cloud width={120} />
    </div>
    <div style={{ position: 'absolute', top: '2%', left: '50%', zIndex: 2, animation: 'cloudDrift 6s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }}>
      <Cloud width={90} />
    </div>
    <div style={{ position: 'absolute', top: '5%', right: '5%', zIndex: 2, animation: 'cloudDrift 5s ease-in-out infinite alternate', pointerEvents: 'none' }}>
      <Cloud width={140} />
    </div>

    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 2 }} />

    {hasSeenOnboarding && (
      <HowToButton side="left" onClick={() => navigateTo(SCENES.ONBOARDING)} />
    )}
    <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

    <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '80%', maxWidth: 600 }}>
      <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '16px 36px', textAlign: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ fontFamily: "'Fugaz One',cursive", fontSize: 'clamp(24px, 4vw, 42px)', color: '#1a1a1a' }}>
          You're a Junior Firefighter!
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 20 }}>
      <FirefighterCharacter size={220} />
      <div style={{ marginBottom: 30 }}>
        <DialogueBox
          text="You get to help the fire station keep the town safe."
          showNext={false}
          showName={false}
          style={{ maxWidth: 400 }}
        />
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: '6%', right: '4%', zIndex: 22 }}>
      <PlayButton
        onClick={() => navigateTo(hasSeenOnboarding ? SCENES.MAIN_MAP : SCENES.ONBOARDING)}
        label="PLAY!"
        size="large"
        color="#F819E7"
        borderColor="#BB10AE"
        textColor="white"
      />
    </div>
  </div>
);

export default TitleScreen;
