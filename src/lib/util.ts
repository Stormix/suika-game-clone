import { BALL_TYPES } from './config';

export const ballColor = (type: string) => {
  let hash = 0;
  type.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, '0');
  }
  return colour;
};

export const randomBallType = () => {
  return Object.values(BALL_TYPES)[Math.floor(Math.random() * Object.values(BALL_TYPES).length)];
};
