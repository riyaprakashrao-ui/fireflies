export const SCENES = {
  // Top level
  TITLE: 'title',
  ONBOARDING: 'onboarding',
  MAIN_MAP: 'main_map',

  // Game 4: Defensible Space (Field)
  FIELD_INTRO: 'field_intro',
  FIELD_MAP: 'field_map',
  FIREBREAK: 'firebreak',
  NATIVE_PLANTS: 'native_plants',
  GOATS: 'goats',
  CONTROLLED_BURN: 'controlled_burn',
  FIELD_VICTORY: 'field_victory',

  // Game 1: Fire Station (placeholder)
  FIRE_STATION: 'fire_station',

  // Game 2: Home (roof first, then vents + fences)
  HOME_SAFETY: 'home_safety',

  // Game 3: Town Hall (placeholder)
  TOWN_HALL: 'town_hall',

  // Game 5: Woods (weather cards)
  WOODS: 'woods',

  // After all 5 games
  FINAL_CONGRATS: 'final_congrats',
};

// Order for sequential unlock
export const GAME_ORDER = [
  SCENES.FIRE_STATION,
  SCENES.HOME_SAFETY,
  SCENES.TOWN_HALL,
  SCENES.FIELD_MAP,
  SCENES.WOODS,
];
