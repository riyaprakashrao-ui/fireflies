import React from 'react';
import asset from './asset';
import { SCENES } from './scenes';

const a = (...files) => files.map((f) => asset(f.startsWith('/') ? f : `/${f}`));

export const SCENE_ASSETS = {
  [SCENES.TITLE]: a('/openingscenebg.png', '/firestationasset.png', '/firefighter.png', '/mapbutton.png'),
  [SCENES.ONBOARDING]: a('/openingscenebg.png', '/firestationasset.png', '/firefighter.png', '/mapbutton.png', '/home.png'),
  [SCENES.MAIN_MAP]: a('/mapwithsigns.png', '/firefighter.png', '/mapbutton.png', '/home.png'),
  [SCENES.FIRE_STATION]: a(
    '/openingscenebg.png', '/firestationasset.png', '/blueprint.png', '/assembly.png',
    '/assembly point.png', '/exit sign.png', '/road.png', '/fire.png', '/wind.png',
    '/terrain.png', '/phone.png', '/campfire-flame.png', '/firefighter.png', '/mapbutton.png', '/home.png'
  ),
  [SCENES.HOME_SAFETY]: a(
    '/house.png', '/roof-class-a.png', '/roof-leaves.png', '/hole.png', '/vent.png',
    '/vent-hole.png', '/vent-leaves.png', '/cleanfence-bg.png', '/fence-wood.png',
    '/fence-safe.png', '/firefighter.png', '/mapbutton.png', '/home.png'
  ),
  [SCENES.TOWN_HALL]: a(
    '/reccenter.png', '/photos.png', '/pets.png', '/documentsicon.png', '/firstaid.png',
    '/water.png', '/prescriptions.png', '/flashlight.png', '/preciousitems.png',
    '/batteryandcharger.png', '/cash.png', '/waterbottle.png', '/documents.png',
    '/medicine.png', '/soccerball.png', '/doll.png', '/family1.png', '/family2.png',
    '/family3.png', '/backpack.png', '/firefighter.png', '/mapbutton.png', '/home.png'
  ),
  [SCENES.FIELD_INTRO]: a('/frame2background.png', '/firefighter.png'),
  [SCENES.FIELD_MAP]: a(
    '/frame2background.png', '/assets/Firebreak.png', '/assets/NativePlant.png',
    '/assets/Goat.png', '/assets/Fire.png', '/firefighter.png', '/mapbutton.png', '/home.png'
  ),
  [SCENES.FIREBREAK]: a('/firebreak-bg.png', '/firebreakrect.png', '/firefighter.png', '/home.png'),
  [SCENES.NATIVE_PLANTS]: a(
    '/firebreak-bg.png', '/native-plants-field.png', '/cherry-tree.png',
    '/fushcia.png', '/poppy.png', '/firefighter.png', '/home.png'
  ),
  [SCENES.GOATS]: a(
    '/native-plants-field.png', '/fushcia.png', '/poppy.png', '/grass.png',
    '/goat.png', '/firefighter.png', '/home.png'
  ),
  [SCENES.CONTROLLED_BURN]: a(
    '/dryplantbg.png', '/native-plants-field.png', '/campfire-flame.png',
    '/firefighter.png', '/home.png'
  ),
  [SCENES.FIELD_VICTORY]: a(
    '/frame2background.png', '/assets/Firebreak.png', '/assets/NativePlant.png',
    '/assets/Goat.png', '/assets/Fire.png', '/firefighter.png'
  ),
  [SCENES.WOODS]: a(
    '/woods-cards-bg.png', '/frame2background.png', '/weather-temperature.png',
    '/weather-humidity.png', '/weather-precipitation.png', '/weather-sunny.png',
    '/weather-windy.png', '/weather-cloudy.png', '/weather-rainy.png',
    '/weather-thunderstorm.png', '/weather-compass.png', '/ignition-car.png',
    '/ignition-car-fire.png', '/ignition-tool.png', '/ignition-tool-fire.png',
    '/ignition-campfire.png', '/ignition-campfire-spread.png', '/ignition-fireworks.png',
    '/ignition-fireworks-fire.png', '/dial.png', '/firework.png', '/campfire-flame.png',
    '/campfire-logs.png', '/fire.png', '/firefighter.png', '/mapbutton.png', '/home.png'
  ),
  [SCENES.FINAL_CONGRATS]: a(
    '/openingscenebg.png', '/firestationasset.png', '/jr-badge.png', '/firefighter.png'
  ),
};

export const ALL_ASSETS = [...new Set(Object.values(SCENE_ASSETS).flat())];

// Keep decoded bitmaps alive so first click-through does not re-decode from disk.
const imageCache = new Map();
const inflight = new Map();

export function preloadUrl(url) {
  if (!url || typeof url !== 'string' || url === 'back' || url === 'next') {
    return Promise.resolve();
  }
  if (imageCache.has(url)) return Promise.resolve();
  if (inflight.has(url)) return inflight.get(url);

  const promise = new Promise((resolve) => {
    const img = new Image();
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      imageCache.set(url, img);
      resolve();
    };
    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(done).catch(done);
      } else {
        done();
      }
    };
    img.onerror = done;
    img.src = url;
    if (img.complete && img.naturalWidth) {
      if (typeof img.decode === 'function') {
        img.decode().then(done).catch(done);
      } else {
        done();
      }
    }
  });

  inflight.set(url, promise);
  promise.finally(() => inflight.delete(url));
  return promise;
}

export function preloadScene(scene) {
  const urls = SCENE_ASSETS[scene] || [];
  return Promise.all(urls.map(preloadUrl));
}

export async function preloadAllAssets({ onProgress } = {}) {
  const urls = ALL_ASSETS;
  const total = urls.length;
  let done = 0;
  const report = () => onProgress && onProgress(done, total);
  report();

  let index = 0;
  const workerCount = Math.min(12, urls.length);
  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (index < urls.length) {
      const url = urls[index];
      index += 1;
      await preloadUrl(url);
      done += 1;
      report();
    }
  }));
}

export function HiddenPrefetch({ urls }) {
  const list = [...new Set((urls || []).filter(Boolean))];
  if (!list.length) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
        left: -9999,
      }}
    >
      {list.map((src) => (
        <img key={src} src={src} alt="" />
      ))}
    </div>
  );
}

export function StackedBg({ src, sources, objectPosition = 'center bottom', zIndex = 0 }) {
  const list = [...new Set((sources || []).filter(Boolean))];
  return (
    <>
      {list.map((url) => (
        <img
          key={url}
          src={url}
          alt=""
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
            zIndex,
            opacity: url === src ? 1 : 0,
            transition: 'opacity 0.12s linear',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}
