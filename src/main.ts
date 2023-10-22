import { Engine } from './lib/engine';
import { Game } from './lib/game';
import logger from './lib/logger';
import './style.scss';

const main = async () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const canvas = document.createElement('canvas');
  app.appendChild(canvas);

  // const width = window.innerWidth;
  const height = window.innerHeight;
  const width = window.innerWidth;

  const engine = new Engine(canvas, width, height);
  const game = new Game(engine);

  engine.start(game);
};

main().catch((err) => logger.error(err));
