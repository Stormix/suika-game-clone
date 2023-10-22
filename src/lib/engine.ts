/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Container } from 'pixi.js';
import { Vec2 } from 'planck-js';
import Stats from 'stats.js';
import { DEBUG_MODE, METERS_TO_PIXELS } from './config';
import { Game } from './game';
import logger from './logger';
import { Renderer } from './renderer';

declare global {
  interface Window {
    // TODO: investigate why this is not working
    __PIXI_STAGE__: Container;
    __PIXI_RENDERER__: Renderer;
  }
}

export class Engine {
  private _canvas: HTMLCanvasElement;
  private _renderer: Renderer;
  private _game: Game | undefined;
  private _stats: Stats;
  private _aspect: number;

  gameTime = 0;
  elapsedTime = 0;

  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this._canvas = canvas;
    this.width = width;
    this.height = height;
    this._renderer = new Renderer(this.width, this.height, canvas);
    this._stats = new Stats();

    // Calculate aspect ratio
    this._aspect = this.calculateAspectRatio(this.width, this.height);
  }

  private calculateAspectRatio(width: number, height: number) {
    if (width > height) {
      return width / height;
    } else {
      return height / width;
    }
  }

  public start(game: Game): void {
    logger.info('Engine started');
    this._game = game;

    // Display stats
    if (DEBUG_MODE) {
      this._stats.showPanel(0);
      document.body.appendChild(this._stats.dom);

      // @ts-ignore
      globalThis.__PIXI_STAGE__ = game.scene;
      // @ts-ignore
      globalThis.__PIXI_RENDERER__ = this._renderer;
    }

    this._game.start();
    this._loop(0);
  }

  private _loop(newTime: number): void {
    const lastTime = this.gameTime;
    this.gameTime = newTime;

    const deltaTime = (this.gameTime - lastTime) / 1000;
    this.elapsedTime += deltaTime;

    if (DEBUG_MODE) this._stats.begin();
    this._update(deltaTime);
    this._render();
    if (DEBUG_MODE) this._stats.end();

    requestAnimationFrame((time) => this._loop(time));
  }

  private _update(deltaTime: number): void {
    this._game?.update(deltaTime);
  }

  private _render(): void {
    this._game?.render();
  }

  public stop(): void {
    logger.info('Engine stopped');
  }

  get renderer(): Renderer {
    return this._renderer;
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  planckToPixiCoords(vec: Vec2): Vec2 {
    return Vec2(vec.x * METERS_TO_PIXELS, this.height - vec.y * METERS_TO_PIXELS);
  }

  pixiToPlanckCoords(vec: Vec2): Vec2 {
    return Vec2(vec.x / METERS_TO_PIXELS, (this.height - vec.y) / METERS_TO_PIXELS);
  }
}
