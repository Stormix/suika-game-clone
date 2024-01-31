import { BALL_TYPES } from './config';

export const ballColor = (type: string) => {
  let hash = 0;
  type.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, '0');
  }
  return color;
};

export const randomBallType = () => {
  return Object.values(BALL_TYPES)[Math.floor(Math.random() * Object.values(BALL_TYPES).length)];
};

export const getNextBallType = (currentBallType: BALL_TYPES) => {
  if (!Object.values(BALL_TYPES).includes(currentBallType)) {
    throw new Error(`Invalid ball type: ${currentBallType}`);
  }

  const ballTypes = Object.values(BALL_TYPES);
  const currentBallIndex = ballTypes.indexOf(currentBallType);
  const nextBallIndex = (currentBallIndex + 1) % ballTypes.length;
  return ballTypes[nextBallIndex];
};
