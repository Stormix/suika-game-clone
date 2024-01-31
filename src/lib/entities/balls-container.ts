import Color from 'color';
import { Edge, Vec2 } from 'planck-js';
import { METERS_TO_PIXELS } from '../config';
import { Game } from '../game';
import { Entity } from './entity';

export class BallsContainer extends Entity {
  private _size: Vec2;

  /**
   *
   * @param size Size of the container in pixels
   * @param game
   */
  constructor(size: Vec2, game: Game) {
    super('Balls Container', game);
    this._size = size;
  }

  draw() {
    const position = this._game.engine.planckToPixiCoords(this.body!.getPosition());
    this.graphics.position.set(position.x, position.y);

    // Draw container
    this.graphics.lineStyle(1, Color({ r: 255, g: 255, b: 255 }).rgbNumber(), 1);

    // Left:
    this.graphics.moveTo(-this.width / 2, -this.height / 2);
    this.graphics.lineTo(-this.width / 2, this.height / 2);

    // Right:
    this.graphics.moveTo(this.width / 2, -this.height / 2);
    this.graphics.lineTo(this.width / 2, this.height / 2);

    // Bottom:
    this.graphics.moveTo(-this.width / 2, this.height / 2);
    this.graphics.lineTo(this.width / 2, this.height / 2);
  }

  update(): void {
    // NO-OP (Static body)
  }

  createBody(): void {
    this.body = this._game.world.createBody({
      type: 'static',
      position: Vec2(this._game.widthSI / 2, this._game.heightSI / 4)
    });

    // Create Left, Right and bottom walls

    // LEFT:
    this.body.createFixture({
      shape: new Edge(Vec2(-this.widthSI / 2, -this.heightSI / 2), Vec2(-this.widthSI / 2, this.heightSI / 2))
    });

    // RIGHT
    this.body.createFixture({
      shape: new Edge(Vec2(this.widthSI / 2, -this.heightSI / 2), Vec2(this.widthSI / 2, this.heightSI / 2))
    });

    // BOTTOM
    this.body.createFixture({
      shape: new Edge(Vec2(-this.widthSI / 2, -this.heightSI / 2), Vec2(this.widthSI / 2, -this.heightSI / 2))
    });
  }

  toString(): string {
    return `BallsContainer(${this.id})`;
  }

  get width() {
    return this._size.x;
  }

  get height() {
    return this._size.y;
  }

  get position() {
    return this._game.engine.planckToPixiCoords(this.body!.getPosition());
  }

  get widthSI() {
    return this._size.x / METERS_TO_PIXELS;
  }
  get heightSI() {
    return this._size.y / METERS_TO_PIXELS;
  }
}
