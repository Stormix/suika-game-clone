import { Circle, Vec2 } from 'planck-js';
import { BALL_TYPES, METERS_TO_PIXELS } from '../config';
import { Game } from '../game';
import { Ball } from './ball';

export class PreviewBall extends Ball {
  constructor(type: BALL_TYPES, game: Game, position?: Vec2) {
    super(type, game, position);
  }

  createBody(): void {
    this.body = this._game.world.createBody({
      type: 'static',
      position: this._game.engine.pixiToPlanckCoords(this._initialPosition),
      fixedRotation: true,
      userData: this.id,
      active: false
    });

    this.body.createFixture({
      shape: new Circle(this._radius / METERS_TO_PIXELS)
    });
  }

  update(): void {
    // TODO:
    const position = this._game.engine.planckToPixiCoords(this.body!.getPosition());
    this.graphics.position.set(position.x, position.y);

    const rotation = this.body!.getAngle();
    this.graphics.rotation = -rotation;
  }

  clone(override: { initialPosition?: Vec2 }): PreviewBall {
    return new PreviewBall(this._type, this._game, override.initialPosition ?? this._initialPosition);
  }
}
