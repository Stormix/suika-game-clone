import { nanoid } from 'nanoid';
import { DisplayObject, Graphics } from 'pixi.js';
import { Body } from 'planck-js';
import { Game } from '../game';

export abstract class Entity {
  id: string;
  name: string;
  body: Body | undefined;
  graphics: Graphics;

  protected readonly _game: Game;

  constructor(name: string, game: Game) {
    this.id = nanoid();
    this.name = name;
    this._game = game;

    this.graphics = new Graphics();
    this.graphics.name = `${name} (${this.id})`;
  }

  init() {
    this.createBody();
    this.draw();
  }

  abstract update(deltaTime: number): void;
  abstract draw(): void;
  abstract createBody(): void;

  destroy() {
    this._game.world.destroyBody(this.body!);
    this._game.scene.removeChild(this.graphics as DisplayObject);
  }
}
