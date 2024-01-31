export const DEBUG_MODE = true;
export const METERS_TO_PIXELS = 100;
export const BALL_SIZE_SCALE = 15;

export enum BALL_TYPES {
  Cherries = 'Cherries',
  Grapes = 'Grapes',
  Strawberry = 'Strawberry',
  Orange = 'Orange',
  Apple = 'Apple',
  Pear = 'Pear',
  Dekopon = 'Dekopon',
  Peach = 'Peach',
  Pineapple = 'Pineapple',
  Melon = 'Melon',
  Watermelon = 'Watermelon'
}

export const BALL_SIZES: Record<BALL_TYPES, number> = {
  [BALL_TYPES.Cherries]: 0.5,
  [BALL_TYPES.Grapes]: 1,
  [BALL_TYPES.Strawberry]: 1.5,
  [BALL_TYPES.Orange]: 2,
  [BALL_TYPES.Apple]: 2.5,
  [BALL_TYPES.Pear]: 3,
  [BALL_TYPES.Dekopon]: 3.5,
  [BALL_TYPES.Peach]: 4,
  [BALL_TYPES.Pineapple]: 4.5,
  [BALL_TYPES.Melon]: 5,
  [BALL_TYPES.Watermelon]: 5.5
};

export const OFFSET = 100;
export const SPAWN_POSITION_Y = 100;
