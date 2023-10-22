import { Circle, Vec2 } from 'planck-js';
import { BALL_SIZES, BALL_SIZE_SCALE, BALL_TYPES, METERS_TO_PIXELS } from '../config';
import { Game } from '../game';
import logger from '../logger';
import { ballColor, randomBallType } from '../util';
import { Entity } from './entity';

export class Ball extends Entity {
  private _radius: number;
  private _initialPosition: Vec2;
  private _type: BALL_TYPES;

  /**
   *
   * @param radius - Ball radius in pixels
   * @param game - Game instance
   * @param _initialPosition - Ball initial position in pixels
   */
  constructor(type: BALL_TYPES, game: Game, _initialPosition?: Vec2) {
    super(`${type} Ball`, game);

    this._radius = BALL_SIZES[type] * BALL_SIZE_SCALE;
    this._initialPosition = _initialPosition ?? Vec2(game.width / 2, game.height / 2);
    this._type = type;
  }

  draw() {
    const position = this._game.engine.planckToPixiCoords(this.body!.getPosition());
    this.graphics.position.set(position.x, position.y);

    // Draw container
    this.graphics.lineStyle(1, ballColor(this._type), 1);
    this.graphics.drawCircle(0, 0, this._radius);

    // Draw orientation line
    this.graphics.lineStyle(1, 0xff0000, 1);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(this._radius, 0);
  }

  update(): void {
    const position = this._game.engine.planckToPixiCoords(this.body!.getPosition());
    this.graphics.position.set(position.x, position.y);

    const rotation = this.body!.getAngle();
    this.graphics.rotation = -rotation;
  }

  createBody(): void {
    this.body = this._game.world.createDynamicBody({
      position: this._game.engine.pixiToPlanckCoords(this._initialPosition),
      fixedRotation: false,
      userData: this.id
    });

    this.body.createFixture({
      shape: new Circle(this._radius / METERS_TO_PIXELS),
      density: 1,
      friction: 0.3,
      restitution: 0.5
    });
  }

  static spawn(game: Game, x: number, y: number): Ball {
    logger.info('Ball spawned at', x, y);
    const ball = new Ball(randomBallType(), game, Vec2(x, y));
    ball.init();
    return ball;
  }

  get width() {
    return this._radius * 2;
  }

  get height() {
    return this._radius * 2;
  }

  get type() {
    return this._type;
  }

  toString(): string {
    return `BallsContainer(${this.id})`;
  }
}
