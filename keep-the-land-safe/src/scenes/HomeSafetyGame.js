import React, { useState, useEffect } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import PlayButton from '../components/PlayButton';
import BackButton from '../components/BackButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';

const BG = {
  house: '/house.png',
  classA: '/roof-class-a.png',
  leaves: '/roof-leaves.png',
  hole: '/hole.png',
  vent: '/vent.png',
  ventHole: '/vent-hole.png',
  ventLeaves: '/vent-leaves.png',
  fenceBg: '/cleanfence-bg.png',
  fenceWood: '/fence-wood.png',
  fenceSafe: '/fence-safe.png',
};

const Cloud = ({ width }) => (
  <div style={{ position: 'relative', width, height: width * 0.45 }}>
    <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '60%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '45%', height: '70%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
    <div style={{ position: 'absolute', bottom: '20%', left: '50%', width: '38%', height: '55%', background: 'white', borderRadius: 999, opacity: 0.92 }} />
  </div>
);

const SkyClouds = () => (
  <>
    <div style={{ position: 'absolute', top: '3%', left: '4%', zIndex: 4, animation: 'cloudDrift 4s ease-in-out infinite alternate', pointerEvents: 'none' }}>
      <Cloud width={120} />
    </div>
    <div style={{ position: 'absolute', top: '1%', left: '45%', zIndex: 4, animation: 'cloudDrift 6s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }}>
      <Cloud width={100} />
    </div>
    <div style={{ position: 'absolute', top: '4%', right: '8%', zIndex: 4, animation: 'cloudDrift 5s ease-in-out infinite alternate', pointerEvents: 'none' }}>
      <Cloud width={130} />
    </div>
  </>
);

const VENT_SPOTS = [
  { id: 'roof', label: 'Roof vents are on top of the roof', left: '49%', top: '38%' },
  { id: 'soffit', label: 'Soffit vents are under the roof overhang', left: '27%', top: '61%' },
  { id: 'wall', label: 'Wall vents are high up in the house', left: '64%', top: '55%' },
  { id: 'foundation', label: 'Foundation vents are in the bottom parts of the house', left: '67%', top: '85%' },
];

const STEPS = [
  {
    id: 'intro',
    bg: 'house',
    type: 'talk',
    text: "It's important that our own homes are ready in case there is a fire. We are going to take a look at different parts of a house and make sure they're in good shape!",
  },
  {
    id: 'look',
    bg: 'house',
    type: 'talk',
    text: "Let's take a look at a roof!",
  },
  {
    id: 'armor',
    bg: 'house',
    type: 'talk',
    text: "A safe roof is like a knight's armor! It's made of tough stuff that doesn't catch fire easily: like metal, clay tiles, and Class A coverings! Wood shingles are unsafe.",
  },
  {
    id: 'classA',
    bg: 'classA',
    type: 'talk',
    text: 'Class A is the most fire resistant and it is made of asphalt fiberglass shingles, concrete, and flat/barrel-shaped tiles.',
  },
  {
    id: 'gutters',
    bg: 'leaves',
    type: 'talk',
    text: 'It is also important that the gutters are clean, no leaves sitting in them. Safe roofs also have no holes or gaps in them.',
  },
  {
    id: 'quizIntro',
    bg: 'house',
    type: 'talk',
    text: "Let's see if you know what a safe roof looks like!",
  },
  { id: 'quiz', bg: 'classA', type: 'quiz', showHole: true, question: 'Is this roof safe?', hint: 'Not quite! Look closely — does that roof have a hole?' },
  {
    id: 'feedback',
    bg: 'classA',
    type: 'talk',
    showHole: true,
    text: 'This roof is not safe because it has a hole in it. However, there are no leaves in the gutter and the shingles are Class A. Once we fix the hole, this roof will be safe!',
  },
  { id: 'fix', bg: 'classA', type: 'fix', showHole: true, successText: "Great job! Let's see how else we can keep our homes safe." },

  {
    id: 'ventLook',
    bg: 'vent',
    type: 'talk',
    text: "Let's take a look at an air vent!",
  },
  {
    id: 'ventScreen',
    bg: 'vent',
    type: 'talk',
    text: 'Safe vents have a very fine metal screen over them. Unsafe vents have big holes or broken screens where embers can sneak in.',
  },
  { id: 'ventSpots', bg: 'house', type: 'orbs' },
  {
    id: 'ventLeavesTalk',
    bg: 'house',
    type: 'talk',
    showFoundationOrb: true,
    text: 'Leaves or dirt near a vent is dangerous. It makes it easier for a fire to spread into the house.',
  },
  {
    id: 'ventQuizIntro',
    bg: 'house',
    type: 'talk',
    showFoundationOrb: true,
    text: "Let's see if you know what a safe vent looks like!",
  },
  {
    id: 'ventQuiz',
    bg: 'vent',
    type: 'quiz',
    showVentHole: true,
    showVentLeaves: true,
    question: 'Is this vent safe?',
    hint: 'Not quite! Look closely — do you see a hole and leaves?',
  },
  {
    id: 'ventFeedback',
    bg: 'vent',
    type: 'talk',
    showVentHole: true,
    showVentLeaves: true,
    text: 'This vent is not safe because there is a hole and leaves caught in it. Once we clean the leaves out and fix the hole, this vent will be safe!',
  },
  {
    id: 'ventFix',
    bg: 'vent',
    type: 'fix',
    showVentHole: true,
    showVentLeaves: true,
    successText: "Great job! Let's see how else we can keep our homes safe.",
  },
  {
    id: 'fenceLook',
    bg: 'fenceBg',
    type: 'talk',
    showFenceWood: true,
    text: "Let's take a look at a fence!",
  },
  {
    id: 'fenceMaterials',
    bg: 'fenceBg',
    type: 'talk',
    showFenceSafe: true,
    text: "The safest fences are made of materials that don't burn, like steel or fiber cement. You don't have to replace your whole fence at once, just start with the section closest to your home! Keep the area around your fence clear of leaves, mulch, and plants to give your home the best chance!",
  },
  {
    id: 'fenceQuizIntro',
    bg: 'house',
    type: 'talk',
    text: "Let's see if you know what a safe fence looks like!",
  },
  {
    id: 'fenceQuiz',
    bg: 'fenceBg',
    type: 'quiz',
    showFenceWood: true,
    question: 'Is this fence safe?',
    hint: 'Not quite! Think about what this fence is made of.',
  },
  {
    id: 'fenceFeedback',
    bg: 'fenceBg',
    type: 'talk',
    showFenceWood: true,
    text: 'This fence is not safe because it is made of wood, which can burn. However, the area around the fence is clear, which is safe. Once we rebuild the fence out of fiber cement it will be safe!',
  },
  {
    id: 'fenceFix',
    bg: 'fenceBg',
    type: 'fix',
    showFenceWood: true,
    showFenceSafe: true,
    successText: "Great job! You learned how to keep your home safe. Let's head back to the map to see what else we can learn.",
    completeHome: true,
  },
];

const ImageBg = ({ src, style = {} }) => {
  const [ok, setOk] = useState(true);
  useEffect(() => { setOk(true); }, [src]);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#8BE4FF', zIndex: 0 }} />
      {ok && src && (
        <img
          src={src}
          alt=""
          onError={() => setOk(false)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center bottom',
            zIndex: 0,
            ...style,
          }}
        />
      )}
    </>
  );
};

const Overlay = ({ src, popping, gone, shiftX = '0%', origin = '50% 50%' }) => {
  const [ok, setOk] = useState(true);
  useEffect(() => { setOk(true); }, [src]);
  if (!ok || gone) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', transform: `translateX(${shiftX})` }}>
      <img
        src={src}
        alt=""
        onError={() => setOk(false)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          transformOrigin: origin,
          animation: popping ? 'holePop 0.7s ease forwards' : 'holeIdle 1.4s ease-in-out infinite',
        }}
      />
    </div>
  );
};

const FadeOverlay = ({ src, hiding, zIndex = 2 }) => {
  const [ok, setOk] = useState(true);
  useEffect(() => { setOk(true); }, [src]);
  if (!ok) return null;
  return (
    <img
      src={src}
      alt=""
      onError={() => setOk(false)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center bottom',
        zIndex,
        pointerEvents: 'none',
        opacity: hiding ? 0 : 1,
        transform: hiding ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    />
  );
};

const GlowOrb = ({ left, top, size = 54 }) => (
  <div style={{
    position: 'absolute',
    left,
    top,
    width: size,
    height: size,
    marginLeft: -size / 2,
    marginTop: -size / 2,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,230,80,0.95) 0%, rgba(255,210,0,0.7) 40%, rgba(255,210,0,0) 72%)',
    boxShadow: '0 0 18px 8px rgba(255,220,60,0.55)',
    animation: 'orbGlow 1.6s ease-in-out infinite',
    zIndex: 8,
    pointerEvents: 'none',
  }} />
);

const LeafPile = ({ left, top }) => (
  <img
    src={BG.ventLeaves}
    alt=""
    style={{
      position: 'absolute',
      left,
      top,
      width: 120,
      height: 100,
      objectFit: 'none',
      objectPosition: '84.9% 73%',
      transform: 'translate(-50%, -62%) scale(1.7)',
      transformOrigin: 'center',
      zIndex: 10,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.28))',
    }}
  />
);

const VentCallout = ({ spot }) => (
  <div style={{
    position: 'absolute',
    left: spot.left,
    top: spot.top,
    transform: 'translate(-50%, -130%)',
    zIndex: 9,
    pointerEvents: 'none',
    width: 210,
  }}>
    <div style={{
      background: 'white',
      border: '3px solid #1F93BA',
      borderRadius: 16,
      padding: '8px 12px',
      fontFamily: "'Nunito',sans-serif",
      fontSize: 13,
      fontWeight: 800,
      color: '#1a1a1a',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {spot.label}
    </div>
  </div>
);

const HomeSafetyGame = ({ navigateTo, completeGame }) => {
  const [step, setStep] = useState(0);
  const [guess, setGuess] = useState(null);
  const [fixed, setFixed] = useState(false);
  const [fixing, setFixing] = useState(false);

  const current = STEPS[step];

  const goNext = () => {
    setGuess(null);
    setFixed(false);
    setFixing(false);
    if (current.completeHome) {
      completeGame(SCENES.HOME_SAFETY);
      navigateTo(SCENES.MAIN_MAP);
      return;
    }
    if (current.goToMap) {
      navigateTo(SCENES.MAIN_MAP);
      return;
    }
    if (step >= STEPS.length - 1) {
      navigateTo(SCENES.MAIN_MAP);
      return;
    }
    setStep(s => s + 1);
  };

  const goBack = () => {
    if (step === 0) {
      navigateTo(SCENES.MAIN_MAP);
      return;
    }
    setGuess(null);
    setFixed(false);
    setFixing(false);
    setStep(s => s - 1);
  };

  const handleFix = () => {
    if (fixing || fixed) return;
    setFixing(true);
    setTimeout(() => {
      setFixed(true);
      setFixing(false);
    }, 700);
  };

  const showBlaze = current.type === 'talk';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <ImageBg src={BG[current.bg]} />
      {current.bg !== 'vent' && <SkyClouds />}
      {current.showHole && <Overlay src={BG.hole} popping={fixing} gone={fixed} shiftX="5%" origin="18.7% 48.9%" />}
      {current.showVentHole && <Overlay src={BG.ventHole} popping={fixing} gone={fixed} origin="50.1% 66.8%" />}
      {current.showVentLeaves && <Overlay src={BG.ventLeaves} popping={fixing} gone={fixed} origin="84.9% 73.0%" />}
      {current.showFenceSafe && (
        <FadeOverlay
          src={BG.fenceSafe}
          hiding={current.showFenceWood ? !(fixing || fixed) : false}
          zIndex={2}
        />
      )}
      {current.showFenceWood && (
        <FadeOverlay src={BG.fenceWood} hiding={fixing || fixed} zIndex={3} />
      )}
      {current.showFoundationOrb && (
        <>
          <GlowOrb left="67%" top="85%" />
          <LeafPile left="67%" top="85%" />
        </>
      )}

      <BackButton onClick={goBack} />
      <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

      {current.type === 'orbs' && (
        <>
          {VENT_SPOTS.map(spot => (
            <React.Fragment key={spot.id}>
              <GlowOrb left={spot.left} top={spot.top} />
              <VentCallout spot={spot} />
            </React.Fragment>
          ))}
          <div style={{ position: 'absolute', bottom: 18, right: '4%', zIndex: 20 }}>
            <PlayButton label="Next" size="medium" color="#F819E7" borderColor="#BB10AE" textColor="white" onClick={goNext} />
          </div>
        </>
      )}

      {showBlaze && (
        <>
          <div style={{
            position: 'absolute',
            top: 72,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 25,
            width: '70%',
            maxWidth: 860,
          }}>
            <DialogueBox
              text={current.text}
              onNext={goNext}
              showName={false}
              style={{ width: '100%', padding: '12px 28px', borderRadius: 28 }}
            />
          </div>
          <div style={{ position: 'absolute', bottom: '2%', left: '1%', zIndex: 25 }}>
            <FirefighterCharacter size={130} />
          </div>
        </>
      )}

      {current.type === 'quiz' && (
        <>
          <div style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '70%', maxWidth: 560 }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '12px 32px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                {current.question}
              </p>
            </div>
          </div>

          {guess === 'yes' && (
            <div style={{ position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)', zIndex: 25, background: 'white', border: '3px solid #E53935', borderRadius: 20, padding: '12px 24px', fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, boxShadow: '0 6px 18px rgba(0,0,0,0.18)', animation: 'popIn 0.35s ease' }}>
              {current.hint}
            </div>
          )}

          <div style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 28, zIndex: 20 }}>
            <PlayButton
              label="YES"
              size="medium"
              color="#4CAF50"
              borderColor="#2E7D32"
              textColor="white"
              onClick={() => setGuess('yes')}
            />
            <PlayButton
              label="NO"
              size="medium"
              color="#E53935"
              borderColor="#B71C1C"
              textColor="white"
              onClick={() => { setGuess('no'); setTimeout(goNext, 250); }}
            />
          </div>
        </>
      )}

      {current.type === 'fix' && !fixed && (
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
          <PlayButton
            label={fixing ? 'FIXING...' : 'FIX'}
            size="large"
            color="#F5C518"
            borderColor="#8B6914"
            textColor="white"
            onClick={handleFix}
          />
        </div>
      )}

      {current.type === 'fix' && fixed && (
        <div style={{ position: 'absolute', bottom: '4%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={180} />
          <DialogueBox
            text={current.successText}
            onNext={goNext}
            showName={false}
            style={{ maxWidth: 480, marginBottom: 20 }}
          />
        </div>
      )}
    </div>
  );
};

export default HomeSafetyGame;
