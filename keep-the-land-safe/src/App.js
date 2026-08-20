import React, { useState, useCallback } from 'react';
import './App.css';
import { SCENES } from './scenes';
import TitleScreen from './scenes/TitleScreen';
import OnboardingScreen from './scenes/OnboardingScreen';
import MainMapScreen from './scenes/MainMapScreen';
import FieldIntroScene from './scenes/FieldIntroScene';
import WorldMapScreen from './scenes/WorldMapScreen';
import FirebreakScene from './scenes/FirebreakScene';
import NativePlantsScene from './scenes/NativePlantsScene';
import GoatsScene from './scenes/GoatsScene';
import ControlledBurnScene from './scenes/ControlledBurnScene';
import VictoryScreen from './scenes/VictoryScreen';
import FireStationGame from './scenes/FireStationGame';
import HomeSafetyGame from './scenes/HomeSafetyGame';
import TownHallGame from './scenes/TownHallGame';
import WeatherWatchWoods from './scenes/WeatherWatchWoods';
import FinalCongratsScreen from './scenes/FinalCongratsScreen';
import SceneTransition from './components/SceneTransition';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'monospace', padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>Error</div>
          <pre style={{ background: '#333', padding: 20, borderRadius: 8, fontSize: 13, maxWidth: '80vw', overflow: 'auto', color: '#ff6b6b', whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ marginTop: 20, padding: '10px 24px', background: '#F5C518', border: 'none', borderRadius: 12, fontSize: 16, cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function clearSavedProgress() {
  try {
    localStorage.removeItem('completedGames');
    localStorage.removeItem('completedLevels');
    localStorage.removeItem('hasSeenOnboarding');
  } catch (e) { /* ignore */ }
}

function App() {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.has('reset')) {
      clearSavedProgress();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  const [currentScene, setCurrentScene] = useState(SCENES.TITLE);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionColor, setTransitionColor] = useState('#2d5a1b');

  // Game 4 (Field) mini-game level completion
  const [completedLevels, setCompletedLevels] = useState(() => {
    try { const s = localStorage.getItem('completedLevels'); return s ? JSON.parse(s) : []; } catch { return []; }
  });

  // Main game (5 locations) completion
  const [completedGames, setCompletedGames] = useState(() => {
    try { const s = localStorage.getItem('completedGames'); return s ? JSON.parse(s) : []; } catch { return []; }
  });

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    try { return localStorage.getItem('hasSeenOnboarding') === 'true'; } catch { return false; }
  });

  const navigateTo = useCallback((scene, color) => {
    setTransitionColor(color || '#2d5a1b');
    setTransitioning(true);
    setTimeout(() => { setCurrentScene(scene); setTransitioning(false); }, 500);
  }, []);

  const completeLevel = useCallback((levelName) => {
    setCompletedLevels(prev => {
      const updated = prev.includes(levelName) ? prev : [...prev, levelName];
      localStorage.setItem('completedLevels', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeGame = useCallback((gameId) => {
    setCompletedGames(prev => {
      const updated = prev.includes(gameId) ? prev : [...prev, gameId];
      localStorage.setItem('completedGames', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
  }, []);

  const props = { navigateTo, completedLevels, completeLevel, completedGames, completeGame, hasSeenOnboarding, completeOnboarding };

  const renderScene = () => {
    switch (currentScene) {
      // Top level
      case SCENES.TITLE:       return <TitleScreen {...props} />;
      case SCENES.ONBOARDING:  return <OnboardingScreen {...props} />;
      case SCENES.MAIN_MAP:    return <MainMapScreen {...props} />;

      // Game 4: Field / Defensible Space
      case SCENES.FIELD_INTRO: return <FieldIntroScene {...props} />;
      case SCENES.FIELD_MAP:   return <WorldMapScreen {...props} />;
      case SCENES.FIREBREAK:   return <FirebreakScene {...props} />;
      case SCENES.NATIVE_PLANTS: return <NativePlantsScene {...props} />;
      case SCENES.GOATS:       return <GoatsScene {...props} />;
      case SCENES.CONTROLLED_BURN: return <ControlledBurnScene {...props} />;
      case SCENES.FIELD_VICTORY: return <VictoryScreen {...props} />;

      // Placeholder games
      case SCENES.FIRE_STATION: return <FireStationGame {...props} />;
      case SCENES.HOME_SAFETY:  return <HomeSafetyGame {...props} />;
      case SCENES.TOWN_HALL:    return <TownHallGame {...props} />;
      case SCENES.WOODS:        return <WeatherWatchWoods {...props} />;
      case SCENES.FINAL_CONGRATS: return <FinalCongratsScreen {...props} />;

      default: return <TitleScreen {...props} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        {renderScene()}
        <SceneTransition active={transitioning} color={transitionColor} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
