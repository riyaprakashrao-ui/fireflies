import React, { useState, useEffect, useRef } from 'react';
import FirefighterCharacter from '../components/FirefighterCharacter';
import DialogueBox from '../components/DialogueBox';
import PlayButton from '../components/PlayButton';
import BackButton from '../components/BackButton';
import MapButton from '../components/MapButton';
import { SCENES } from '../scenes';
import asset from '../asset';
import { HiddenPrefetch, SCENE_ASSETS, StackedBg } from '../preloadAssets';

const IconSunny = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    <circle cx="36" cy="36" r="14" fill="#F5C518" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
      <rect key={deg} x="34" y="4" width="4" height="12" rx="2" fill="#F5A000" transform={`rotate(${deg} 36 36)`} />
    ))}
  </svg>
);

const IconWindy = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    <path d="M8 28 C22 22, 34 22, 48 28 C56 32, 56 20, 48 18" fill="none" stroke="#4FC3F7" strokeWidth="4" strokeLinecap="round" />
    <path d="M8 40 C24 34, 40 34, 54 40 C62 44, 62 32, 54 30" fill="none" stroke="#29B6F6" strokeWidth="4" strokeLinecap="round" />
    <path d="M12 52 C26 48, 38 48, 50 52" fill="none" stroke="#81D4FA" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="58" cy="22" rx="6" ry="10" fill="#66BB6A" transform="rotate(25 58 22)" />
    <ellipse cx="64" cy="38" rx="5" ry="8" fill="#43A047" transform="rotate(-15 64 38)" />
  </svg>
);

const IconCloudy = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    <ellipse cx="30" cy="40" rx="18" ry="14" fill="#90A4AE" />
    <ellipse cx="44" cy="36" rx="16" ry="13" fill="#78909C" />
    <ellipse cx="22" cy="36" rx="12" ry="10" fill="#B0BEC5" />
  </svg>
);

const IconRainy = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    <ellipse cx="36" cy="28" rx="20" ry="14" fill="#78909C" />
    <ellipse cx="24" cy="30" rx="12" ry="10" fill="#90A4AE" />
    <path d="M24 46 q4 10 0 16" fill="none" stroke="#29B6F6" strokeWidth="4" strokeLinecap="round" />
    <path d="M36 48 q4 10 0 16" fill="none" stroke="#039BE5" strokeWidth="4" strokeLinecap="round" />
    <path d="M48 46 q4 10 0 16" fill="none" stroke="#29B6F6" strokeWidth="4" strokeLinecap="round" />
    <path d="M30 44 q4 8 0 14" fill="none" stroke="#4FC3F7" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const FACT_ICONS = {
  temp: asset('/weather-temperature.png'),
  humidity: asset('/weather-humidity.png'),
  precip: asset('/weather-precipitation.png'),
};

const WeatherIcon = ({ src, Fallback, size = 72, fallbackSrc }) => {
  const [current, setCurrent] = useState(src);
  useEffect(() => { setCurrent(src); }, [src]);
  if (!current) return <Fallback size={size} />;
  return (
    <img
      src={current}
      alt=""
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
        else setCurrent(null);
      }}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
};

const WEATHER = [
  {
    id: 'sunny',
    title: 'Sunny and Dry',
    iconSrc: asset('/weather-sunny.png'),
    Fallback: IconSunny,
    risk: 'HIGH FIRE RISK WEATHER',
    high: true,
    facts: [
      { iconSrc: FACT_ICONS.temp, text: 'Temperature: 80–100°F (Hot)' },
      { iconSrc: FACT_ICONS.humidity, text: 'Humidity: 10–30% (Very Dry)' },
      { iconSrc: FACT_ICONS.precip, text: 'Precipitation: 0–10% chance (Little to no rain)' },
    ],
    blurb: "When it's very hot and dry outside, the sun dries out grass, leaves, and sticks. These dry things can catch fire much easier than when they are cool and damp.",
  },
  {
    id: 'windy',
    title: 'Windy',
    iconSrc: asset('/weather-windy.png'),
    Fallback: IconWindy,
    risk: 'HIGH FIRE RISK WEATHER',
    high: true,
    facts: [
      { iconSrc: FACT_ICONS.temp, text: 'Temperature: 65–90°F (Warm)' },
      { iconSrc: FACT_ICONS.humidity, text: 'Humidity: 20–40% (Low–Medium)' },
      { iconSrc: FACT_ICONS.precip, text: 'Precipitation: 0–20% chance (Usually little rain)' },
    ],
    blurb: 'Wind can push flames farther and faster, and it dries things out. On windy days, sparks can travel and start new fires.',
  },
  {
    id: 'cloudy',
    title: 'Cloudy and Damp',
    iconSrc: asset('/weather-cloudy.png'),
    Fallback: IconCloudy,
    risk: 'LOW FIRE RISK WEATHER',
    high: false,
    facts: [
      { iconSrc: FACT_ICONS.temp, text: 'Temperature: 55–75°F (Cool and Mild)' },
      { iconSrc: FACT_ICONS.humidity, text: 'Humidity: 60–80% (Moist air)' },
      { iconSrc: FACT_ICONS.precip, text: 'Precipitation: 20–50% chance (Some rain possible)' },
    ],
    blurb: 'Cloudy, damp air keeps plants from drying out as fast. Fires have a harder time starting and spreading when things stay moist.',
  },
  {
    id: 'rainy',
    title: 'Rainy',
    iconSrc: asset('/weather-rainy.png'),
    Fallback: IconRainy,
    risk: 'LOW FIRE RISK WEATHER',
    high: false,
    facts: [
      { iconSrc: FACT_ICONS.temp, text: 'Temperature: 50–70°F (Cool)' },
      { iconSrc: FACT_ICONS.humidity, text: 'Humidity: 80–100% (Very High)' },
      { iconSrc: FACT_ICONS.precip, text: 'Precipitation: 60–100% chance (Lots of rain)' },
    ],
    blurb: 'Rain soaks the ground and plants, so they are much less likely to catch fire. Rainy days are usually lower fire-risk days.',
  },
];

const IconCar = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    <rect x="8" y="50" width="56" height="8" rx="2" fill="#C9A15A" />
    <rect x="14" y="28" width="44" height="18" rx="4" fill="#E53935" />
    <rect x="22" y="20" width="20" height="12" rx="3" fill="#EF9A9A" />
    <circle cx="24" cy="48" r="6" fill="#333" />
    <circle cx="48" cy="48" r="6" fill="#333" />
  </svg>
);
const IconTool = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    <rect x="30" y="18" width="8" height="36" rx="2" fill="#90A4AE" transform="rotate(-25 34 36)" />
    <polygon points="36,14 42,26 30,26" fill="#F5C518" />
    <polygon points="48,20 54,30 42,28" fill="#FF9800" />
    <polygon points="28,22 22,32 32,30" fill="#FFE082" />
  </svg>
);
const IconCamp = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    <rect x="14" y="50" width="44" height="8" rx="3" fill="#6D4C41" transform="rotate(-18 36 54)" />
    <rect x="14" y="50" width="44" height="8" rx="3" fill="#5D4037" transform="rotate(18 36 54)" />
    <path d="M36 18 C28 32, 24 42, 36 50 C48 42, 44 32, 36 18Z" fill="#FF9800" />
    <path d="M36 26 C32 34, 30 40, 36 46 C42 40, 40 34, 36 26Z" fill="#FFEB3B" />
  </svg>
);
const IconFireworks = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72">
    {[[36,20,'#29B6F6'],[22,32,'#66BB6A'],[50,30,'#E53935'],[36,40,'#F5C518']].map(([cx,cy,c], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="3" fill={c} />
        {[0,45,90,135].map(d => (
          <line key={d} x1={cx} y1={cy} x2={cx} y2={cy - 10} stroke={c} strokeWidth="2" strokeLinecap="round" transform={`rotate(${d} ${cx} ${cy})`} />
        ))}
      </g>
    ))}
  </svg>
);

const CAUSES = [
  {
    id: 'car',
    title: 'Park on Dry Grass',
    reveal: 'Hot cars can make dry grass catch fire.',
    iconSrc: asset('/ignition-car.png'),
    iconOnSrc: asset('/ignition-car-fire.png'),
    Fallback: IconCar,
  },
  {
    id: 'tool',
    title: 'Metal Tool Spark',
    reveal: 'Metal tools can make sparks that start fires.',
    iconSrc: asset('/ignition-tool.png'),
    iconOnSrc: asset('/ignition-tool-fire.png'),
    Fallback: IconTool,
  },
  {
    id: 'camp',
    title: 'Unattended Campfire',
    reveal: 'Leaving a campfire alone can start a wildfire.',
    iconSrc: asset('/ignition-campfire.png'),
    iconOnSrc: asset('/ignition-campfire-spread.png'),
    Fallback: IconCamp,
  },
  {
    id: 'fireworks',
    title: 'Fireworks',
    reveal: 'Fireworks can make sparks that start fires.',
    iconSrc: asset('/ignition-fireworks.png'),
    iconOnSrc: asset('/ignition-fireworks-fire.png'),
    Fallback: IconFireworks,
  },
];

const SPARK_INTRO = "Let's see how fires can start. Some fires start by accident. Let's try a few examples.";

const RISK_ZONES = [
  { id: 'low', label: 'LOW', min: -90, max: -54 },
  { id: 'moderate', label: 'MODERATE', min: -54, max: -18 },
  { id: 'high', label: 'HIGH', min: -18, max: 18 },
  { id: 'veryhigh', label: 'VERY HIGH', min: 18, max: 54 },
  { id: 'extreme', label: 'EXTREME', min: 54, max: 91 },
];

const PIVOT_Y = 0.72;

const RiskMeter = ({ deg, onDegChange }) => {
  const boxRef = useRef(null);
  const dragging = useRef(false);

  const setFromEvent = (e) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * PIVOT_Y;
    let next = Math.atan2(e.clientX - cx, cy - e.clientY) * (180 / Math.PI);
    onDegChange(Math.max(-90, Math.min(90, next)));
  };

  const onDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromEvent(e);
  };
  const onMove = (e) => { if (dragging.current) setFromEvent(e); };
  const onUp = () => { dragging.current = false; };

  return (
    <div
      ref={boxRef}
      style={{ position: 'relative', width: '100%', maxWidth: 400, margin: '0 auto', touchAction: 'none', cursor: 'grab' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <img src={asset("/dial.png")} alt="" draggable={false} style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: `${PIVOT_Y * 100}%`,
          width: 34,
          height: '44%',
          transform: `translate(-50%, -100%) rotate(${deg}deg)`,
          transformOrigin: 'center bottom',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))',
        }}
      >
        <svg viewBox="0 0 34 120" width="100%" height="100%" overflow="visible">
          <polygon points="17,2 3,118 31,118" fill="white" stroke="#3E2723" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div style={{
    flex: 1, border: '3px solid #1F93BA', borderRadius: 14,
    padding: '6px 8px 7px', textAlign: 'center',
  }}>
    <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>{label}</div>
    <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: '#1a1a1a' }}>{value}</div>
  </div>
);

const FireRiskQuiz = ({ onCorrect }) => {
  const [deg, setDeg] = useState(36);
  const [wrong, setWrong] = useState(false);
  const zone = RISK_ZONES.find(z => deg >= z.min && deg < z.max) || RISK_ZONES[0];

  const handleDone = () => {
    if (zone.id === 'low') onCorrect();
    else {
      setWrong(true);
      setTimeout(() => setWrong(false), 1600);
    }
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -52%)',
        width: '92%',
        maxWidth: 1040,
        display: 'flex',
        gap: 14,
        alignItems: 'stretch',
        zIndex: 12,
      }}>
        <div style={{
          flex: 1, background: 'white', border: '4px solid #1F93BA', borderRadius: 22,
          padding: '14px 16px 16px', boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
        }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: '#1a1a1a' }}>Today's Weather Report</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={asset("/weather-thunderstorm.png")} alt="" style={{ width: 92, height: 92, objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 34, color: '#1a1a1a', lineHeight: 1 }}>49° F</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 17, fontWeight: 800, color: '#333' }}>Thunderstorm</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <StatBox label="Precipitation" value={'5" Today'} />
            <StatBox label="Humidity" value="90%" />
          </div>
          <div style={{
            border: '3px solid #1F93BA', borderRadius: 14, padding: '7px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>Wind</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Wind 2mph</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Gusts 5mph</div>
            </div>
            <img src={asset("/weather-compass.png")} alt="" style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
          </div>
        </div>

        <div style={{
          flex: 1, background: 'white', border: '4px solid #E53935', borderRadius: 22,
          padding: '14px 16px 10px', boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', minWidth: 0, gap: 6,
        }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: '#1a1a1a' }}>Predict Fire Risk</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800, color: '#333', lineHeight: 1.35 }}>
            Weather can make fires more dangerous. Drag arrow to the correct section to predict the fire risk.
          </div>
          <RiskMeter deg={deg} onDegChange={d => { setDeg(d); setWrong(false); }} />
        </div>
      </div>

      {wrong && (
        <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
          <div style={{
            background: 'white', border: '3px solid #E53935', borderRadius: 20, padding: '10px 22px',
            fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800,
            boxShadow: '0 6px 18px rgba(0,0,0,0.18)', animation: 'shake 0.4s ease',
          }}>
            Not quite! Look at the rain, humidity, and wind.
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 16, right: '3%', zIndex: 20 }}>
        <PlayButton
          label="Submit"
          size="medium"
          color="#F819E7"
          borderColor="#BB10AE"
          textColor="white"
          onClick={handleDone}
        />
      </div>
    </>
  );
};

const HeaderBanner = ({ title, sub }) => (
  <div style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 15, width: '86%', maxWidth: 820 }}>
    <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 28, padding: '10px 24px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
      <p style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: '#1a1a1a', margin: 0 }}>{title}</p>
      {sub && <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 800, color: '#1a1a1a', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  </div>
);

const SunnyReport = () => (
  <div style={{
    width: 280, background: 'white', border: '4px solid #1F93BA', borderRadius: 22,
    padding: '12px 14px 14px', boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
    display: 'flex', flexDirection: 'column', gap: 8,
  }}>
    <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: '#1a1a1a' }}>Today's Weather Report</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src={asset("/weather-sunny.png")} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />
      <div>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, lineHeight: 1 }}>95° F</div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 800 }}>Sunny</div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <StatBox label="Precipitation" value={'0" Today'} />
      <StatBox label="Humidity" value="5%" />
    </div>
    <div style={{
      border: '3px solid #1F93BA', borderRadius: 14, padding: '6px 10px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Wind</div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>2mph</div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Gusts 5mph</div>
      </div>
      <img src={asset("/weather-compass.png")} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
    </div>
  </div>
);

const SceneOverlays = ({ windy, fireworks }) => (
  <>
    {windy && [0, 1, 2].map(i => (
      <img key={i} src={asset("/weather-windy.png")} alt="" style={{
        position: 'absolute', top: `${18 + i * 16}%`, left: `${12 + i * 22}%`, width: 90, zIndex: 6,
        animation: `cloudDrift ${2 + i * 0.6}s ease-in-out infinite alternate`,
        pointerEvents: 'none', opacity: 0.95,
      }} />
    ))}
    {fireworks && [
      { top: '34%', left: '12%', w: 150 },
      { top: '30%', left: '40%', w: 180 },
      { top: '36%', left: '66%', w: 140 },
    ].map((b, i) => (
      <img
        key={i}
        src={asset("/firework.png")}
        alt=""
        style={{
          position: 'absolute', top: b.top, left: b.left, width: b.w, height: 'auto',
          zIndex: 8, pointerEvents: 'none',
          animation: `starTwinkle ${1.4 + i * 0.35}s ease-in-out infinite`,
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.45))',
        }}
      />
    ))}
  </>
);

const WildFire = ({ intensity, out }) => {
  const scale = out ? 0 : 0.45 + intensity * 1.15;
  const flames = [
    { x: '50%', w: 130, delay: '0s' },
    { x: '38%', w: 78, delay: '0.15s' },
    { x: '62%', w: 70, delay: '0.28s' },
  ];
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: '14%', transform: 'translateX(-50%)',
      width: 260, height: 260, zIndex: 8, pointerEvents: 'none',
      animation: out ? 'fireOut 0.6s ease forwards' : 'fireGrow 0.75s ease',
    }}>
      {flames.map((f, i) => (
        <div key={i} style={{
          position: 'absolute', left: f.x, bottom: 0, width: f.w, marginLeft: -f.w / 2,
          transformOrigin: 'center bottom',
          transform: `scale(${scale})`,
          transition: 'transform 0.45s ease, opacity 0.45s ease',
          opacity: out ? 0 : 1,
        }}>
          <div style={{ transformOrigin: 'center bottom', animation: out ? 'none' : `fireBreathe ${1.8 + i * 0.25}s ease-in-out ${f.delay} infinite` }}>
            <img src={asset("/campfire-flame.png")} alt="" style={{
              width: '100%', height: 'auto', display: 'block', transformOrigin: 'center bottom',
              animation: out ? 'none' : `fireFlicker ${0.28 + i * 0.07}s ease-in-out infinite`,
              filter: 'drop-shadow(0 0 16px rgba(255,120,0,0.55))',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const ConditionSlider = ({ label, value, onChange }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, marginBottom: 6 }}>{label}</div>
    <input
      type="range" min="0" max="100" value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: '#1F93BA', height: 28, cursor: 'pointer' }}
    />
  </div>
);

const PutOutGame = ({ onWin }) => {
  const [wind, setWind] = useState(82);
  const [rain, setRain] = useState(12);
  const [temperature, setTemperature] = useState(82);
  const [clue, setClue] = useState('');
  const [out, setOut] = useState(false);

  const intensity = (wind / 100) * 0.45 + ((100 - rain) / 100) * 0.4 + (temperature / 100) * 0.15;

  const handleTest = () => {
    if (wind <= 30 && rain >= 70 && temperature <= 35) {
      setOut(true);
      setClue('');
      setTimeout(onWin, 700);
      return;
    }
    if (wind > 30) setClue('Nice try! Wind still looks high. Turn the wind down so sparks don’t travel.');
    else if (rain < 70) setClue('Nice try! The grass is still dry. Slide rain up to soak it.');
    else setClue('Nice try! It’s still too hot. Turn the temperature down so things stay cool.');
  };

  return (
    <>
      <HeaderBanner
        title="The fireworks started a fire!"
        sub="Wind carried the sparks into dry grass. Adjust the weather to help put it out."
      />
      <WildFire intensity={intensity} out={out} />
      <div style={{
        position: 'absolute', left: '3%', top: '28%', width: 250, zIndex: 16,
        background: 'white', border: '3px solid #1F93BA', borderRadius: 22,
        padding: '14px 16px 10px', boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
      }}>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, marginBottom: 10 }}>Adjust the conditions</div>
        <ConditionSlider label="Wind" value={wind} onChange={setWind} />
        <ConditionSlider label="Rain" value={rain} onChange={setRain} />
        <ConditionSlider label="Temperature" value={temperature} onChange={setTemperature} />
      </div>
      {clue && (
        <div style={{ position: 'absolute', top: '28%', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
          <div style={{
            background: 'white', border: '3px solid #E53935', borderRadius: 20, padding: '10px 22px',
            fontFamily: "'Nunito',sans-serif", fontSize: 17, fontWeight: 800, maxWidth: 520, textAlign: 'center',
            boxShadow: '0 6px 18px rgba(0,0,0,0.18)', animation: 'shake 0.4s ease',
          }}>
            {clue}
          </div>
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 16, right: '3%', zIndex: 20 }}>
        <PlayButton label="Submit" size="medium" color="#F819E7" borderColor="#BB10AE" textColor="white" onClick={handleTest} />
      </div>
    </>
  );
};

const Campfire = () => {
  const [flame, setFlame] = useState(asset('/campfire-flame.png'));
  const [showLogs, setShowLogs] = useState(true);
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: '15%', transform: 'translateX(-50%)',
      width: 220, height: 230, zIndex: 8, pointerEvents: 'none',
    }}>
      {showLogs && (
        <img
          src={asset("/campfire-logs.png")}
          alt=""
          onError={() => setShowLogs(false)}
          style={{
            position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)',
            width: 200, height: 'auto', zIndex: 1,
          }}
        />
      )}
      <div style={{
        position: 'absolute', left: '50%', bottom: 30, width: 112, marginLeft: -56, zIndex: 2,
      }}>
        <div style={{ transformOrigin: 'center bottom', animation: 'fireBreathe 2.1s ease-in-out infinite' }}>
          <img
            src={flame}
            alt=""
            onError={() => { if (flame !== asset('/fire.png')) setFlame(asset('/fire.png')); }}
            style={{
              display: 'block', width: 112, height: 'auto',
              transformOrigin: 'center bottom',
              animation: 'fireFlicker 0.32s ease-in-out infinite',
              filter: 'drop-shadow(0 0 14px rgba(255,140,0,0.5))',
            }}
          />
        </div>
      </div>
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${30 + i * 10}%`,
            bottom: '48%',
            width: 8, height: 8, zIndex: 3,
            background: i % 2 ? '#F5C518' : '#FF9800',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            animation: `sparkRise ${1.2 + i * 0.25}s ease-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

const woodsBgFor = (phase) => {
  if (phase === 'cards' || phase === 'ignition' || phase === 'riskQuiz') return asset('/woods-cards-bg.png');
  return asset('/frame2background.png');
};

const WoodsBg = ({ src }) => (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #87CEEB 0%, #7BC67E 55%, #3d7a1a 100%)', zIndex: 0 }} />
      <StackedBg
        src={src}
        sources={[asset('/woods-cards-bg.png'), asset('/frame2background.png')]}
      />
    </>
  );

const WeatherWatchWoods = ({ navigateTo, completeGame }) => {
  const [phase, setPhase] = useState('intro');
  const [openId, setOpenId] = useState(null);
  const [seen, setSeen] = useState([]);
  const [weatherDone, setWeatherDone] = useState(false);
  const [revealed, setRevealed] = useState([]);
  const [causeSeen, setCauseSeen] = useState([]);

  const openCard = (id) => {
    setOpenId(id);
    setSeen(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const toggleCause = (id) => {
    setRevealed(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setCauseSeen(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const opened = WEATHER.find(w => w.id === openId);
  const allSeen = seen.length === WEATHER.length || weatherDone;
  const allRevealed = causeSeen.length === CAUSES.length;

  const goBack = () => {
    if (openId) { setOpenId(null); return; }
    if (phase === 'cards') setPhase('intro');
    else if (phase === 'sparkTalk') setPhase('cards');
    else if (phase === 'ignition') setPhase('sparkTalk');
    else if (phase === 'sparkAfter') setPhase('ignition');
    else if (phase === 'campfire') setPhase('sparkAfter');
    else if (phase === 'weatherMatters') setPhase('campfire');
    else if (phase === 'riskIntro') setPhase('weatherMatters');
    else if (phase === 'riskQuiz') setPhase('riskIntro');
    else if (phase === 'riskSuccess') setPhase('riskQuiz');
    else if (phase === 'reportTalk') setPhase('riskSuccess');
    else if (phase === 'thinkFireworks') setPhase('reportTalk');
    else if (phase === 'gettingWindy') setPhase('thinkFireworks');
    else if (phase === 'putOut') setPhase('gettingWindy');
    else if (phase === 'woodsWin') setPhase('putOut');
    else navigateTo(SCENES.MAIN_MAP);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <HiddenPrefetch urls={SCENE_ASSETS[SCENES.WOODS]} />
      <WoodsBg src={woodsBgFor(phase)} />
      <BackButton onClick={goBack} />
      <MapButton onClick={() => navigateTo(SCENES.MAIN_MAP)} />

      {(phase === 'thinkFireworks' || phase === 'gettingWindy' || phase === 'putOut') && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(12, 28, 48, 0.42)', zIndex: 3, pointerEvents: 'none' }} />
          <SceneOverlays
            fireworks={phase === 'thinkFireworks'}
            windy={phase === 'gettingWindy' || phase === 'putOut'}
          />
        </>
      )}

      {phase === 'intro' && (
        <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={200} />
          <DialogueBox
            text="Some weather makes it easier for fires to start and spread! Soon you will learn about four different kinds of weather and how they affect wildfires."
            onNext={() => setPhase('cards')}
            showName={false}
            style={{ maxWidth: 480, marginBottom: 20 }}
          />
        </div>
      )}

      {phase === 'cards' && (
        <>
          <div style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 15, width: '88%' }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 40, padding: '12px 28px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                Try tapping each weather card to learn how it affects wildfires!
              </p>
            </div>
          </div>

          <div style={{ position: 'absolute', left: 4, bottom: '2%', zIndex: 10, pointerEvents: 'none' }}>
            <FirefighterCharacter size={190} />
          </div>

          <div style={{
            position: 'absolute',
            top: '22%',
            left: '24%',
            right: '4%',
            bottom: '18%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 18,
            zIndex: 12,
          }}>
            {WEATHER.map(w => (
              <button
                key={w.id}
                onClick={() => openCard(w.id)}
                style={{
                  background: 'white',
                  border: seen.includes(w.id) ? '4px solid #43A047' : '4px solid #F5C518',
                  borderRadius: 28,
                  padding: '12px 12px 14px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  width: '100%',
                  height: '100%',
                  outline: 'none',
                }}
              >
                <WeatherIcon src={w.iconSrc} Fallback={w.Fallback} size={88} />
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: '#1a1a1a' }}>{w.title}</div>
              </button>
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: 18, right: '3%', zIndex: 20 }}>
            <PlayButton
              label="Next"
              size="medium"
              color="#F819E7"
              borderColor="#BB10AE"
              textColor="white"
              onClick={() => { if (allSeen) { setWeatherDone(true); setPhase('sparkTalk'); } }}
            />
          </div>
        </>
      )}

      {opened && (
        <div
          onClick={() => setOpenId(null)}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '86%',
              maxWidth: 720,
              background: 'white',
              border: '4px solid #F5C518',
              borderRadius: 28,
              padding: '28px 32px 24px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              animation: 'popIn 0.35s ease',
              display: 'flex',
              gap: 28,
            }}
          >
            <button
              onClick={() => setOpenId(null)}
              style={{
                position: 'absolute', top: 12, right: 12, width: 36, height: 36,
                borderRadius: '50%', background: '#E53935', border: 'none', color: 'white',
                fontFamily: "'Fredoka One',cursive", fontSize: 18, cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
              }}
            >
              ✕
            </button>
            <div style={{ flex: '0 0 38%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, paddingTop: 4 }}>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 30, color: '#1a1a1a' }}>{opened.title}</div>
              <WeatherIcon src={opened.iconSrc} Fallback={opened.Fallback} size={110} />
              <div style={{
                marginTop: 'auto', background: '#F5C518',
                borderRadius: 12, padding: '10px 14px',
                fontFamily: "'Fredoka One',cursive", fontSize: 14, color: '#1a1a1a',
                letterSpacing: 0.3,
              }}>
                {opened.risk}
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
              {opened.facts.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#fff', border: '3px solid #1F93BA', borderRadius: 18,
                  padding: '10px 14px',
                }}>
                  <img src={f.iconSrc} alt="" style={{ width: 42, height: 42, objectFit: 'contain', flexShrink: 0 }} />
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 800, color: '#1a1a1a' }}>{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === 'sparkTalk' && (
        <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={200} />
          <DialogueBox
            text={SPARK_INTRO}
            onNext={() => setPhase('ignition')}
            showName={false}
            style={{ maxWidth: 480, marginBottom: 20 }}
          />
        </div>
      )}

      {phase === 'ignition' && (
        <>
          <div style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 15, width: '88%' }}>
            <div style={{ background: 'white', border: '3px solid #1F93BA', borderRadius: 28, padding: '10px 28px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: '#1a1a1a', margin: 0 }}>What Started The Fire?</p>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 800, color: '#1a1a1a', margin: '4px 0 0' }}>Tap one to see what happens.</p>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: '24%',
            left: '3%',
            right: '3%',
            bottom: '16%',
            display: 'flex',
            gap: 16,
            zIndex: 12,
          }}>
            {CAUSES.map(c => {
              const on = revealed.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCause(c.id)}
                  style={{
                    flex: 1,
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={on ? c.iconOnSrc : c.iconSrc}
                    alt={c.title}
                    style={{
                      height: '100%',
                      width: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.2))',
                    }}
                  />
                </button>
              );
            })}
          </div>

          <div style={{ position: 'absolute', bottom: 18, right: '3%', zIndex: 20 }}>
            <PlayButton
              label="Next"
              size="medium"
              color="#F819E7"
              borderColor="#BB10AE"
              textColor="white"
              onClick={() => { if (allRevealed) setPhase('sparkAfter'); }}
            />
          </div>
        </>
      )}

      {phase === 'sparkAfter' && (
        <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={200} />
          <DialogueBox
            text="Even small sparks can cause fires."
            onNext={() => setPhase('campfire')}
            showName={false}
            style={{ maxWidth: 480, marginBottom: 20 }}
          />
        </div>
      )}

      {phase === 'campfire' && (
        <>
          <Campfire />
          <div style={{ position: 'absolute', bottom: 18, right: '3%', zIndex: 20 }}>
            <PlayButton
              label="Next"
              size="medium"
              color="#F819E7"
              borderColor="#BB10AE"
              textColor="white"
              onClick={() => setPhase('weatherMatters')}
            />
          </div>
        </>
      )}

      {phase === 'weatherMatters' && (
        <>
          <Campfire />
          <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={200} />
            <DialogueBox
              text="But weather matters too..."
              onNext={() => setPhase('riskIntro')}
              showName={false}
              style={{ maxWidth: 420, marginBottom: 20 }}
            />
          </div>
        </>
      )}

      {phase === 'riskIntro' && (
        <>
          <Campfire />
          <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={200} />
            <DialogueBox
              text="Check the weather report and tell me how risky a fire might be today."
              onNext={() => setPhase('riskQuiz')}
              showName={false}
              style={{ maxWidth: 520, marginBottom: 20 }}
            />
          </div>
        </>
      )}

      {phase === 'riskQuiz' && (
        <FireRiskQuiz onCorrect={() => setPhase('riskSuccess')} />
      )}

      {phase === 'riskSuccess' && (
        <>
          <Campfire />
          <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
            <FirefighterCharacter size={200} />
            <DialogueBox
              text="Nice job! High humidity and low wind help keep fires from spreading. Let’s play out an actual scenario."
              onNext={() => setPhase('reportTalk')}
              showName={false}
              style={{ maxWidth: 520, marginBottom: 20 }}
            />
          </div>
        </>
      )}

      {phase === 'reportTalk' && (
        <>
          <div style={{ position: 'absolute', right: '5%', top: '16%', zIndex: 16 }}>
            <SunnyReport />
          </div>
          <div style={{ position: 'absolute', bottom: '6%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 10, zIndex: 25, maxWidth: '52%' }}>
            <FirefighterCharacter size={210} />
            <DialogueBox
              text="Let’s check out the report first. It’s sunny and dry today."
              onNext={() => setPhase('thinkFireworks')}
              showName={false}
              compact
              style={{ maxWidth: 380, marginBottom: 28 }}
            />
          </div>
        </>
      )}

      {phase === 'thinkFireworks' && (
        <>
          <HeaderBanner title="Think about it" sub="Fireworks land in dry grass. What do you think will happen?" />
          <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', zIndex: 12 }}>
            <FirefighterCharacter size={160} />
          </div>
          <div style={{ position: 'absolute', bottom: 16, right: '3%', zIndex: 20 }}>
            <PlayButton label="Next" size="medium" color="#F819E7" borderColor="#BB10AE" textColor="white" onClick={() => setPhase('gettingWindy')} />
          </div>
        </>
      )}

      {phase === 'gettingWindy' && (
        <>
          <HeaderBanner title="Uh oh" sub="Now it’s getting windy..." />
          <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', zIndex: 12 }}>
            <FirefighterCharacter size={160} />
          </div>
          <div style={{ position: 'absolute', bottom: 16, right: '3%', zIndex: 20 }}>
            <PlayButton label="Next" size="medium" color="#F819E7" borderColor="#BB10AE" textColor="white" onClick={() => setPhase('putOut')} />
          </div>
        </>
      )}

      {phase === 'putOut' && (
        <PutOutGame onWin={() => setPhase('woodsWin')} />
      )}

      {phase === 'woodsWin' && (
        <div style={{ position: 'absolute', bottom: '5%', left: '3%', display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 25 }}>
          <FirefighterCharacter size={200} />
          <DialogueBox
            text="Great work! You now understand how weather conditions affect fires."
            onNext={() => {
              if (completeGame) completeGame(SCENES.WOODS);
              navigateTo(SCENES.FINAL_CONGRATS);
            }}
            showName={false}
            style={{ maxWidth: 480, marginBottom: 20 }}
          />
        </div>
      )}
    </div>
  );
};

export default WeatherWatchWoods;
