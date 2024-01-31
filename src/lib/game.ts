import { EntityCreatePayload, EntityRemovePayload, QueueItem, QueueType } from '@/types/queue';
import { Container, DisplayObject } from 'pixi.js';
import { Vec2, World } from 'planck-js';
import { BALL_TYPES, METERS_TO_PIXELS, OFFSET, SPAWN_POSITION_Y } from './config';
import { Engine } from './engine';
import { Ball } from './entities/ball';
import { BallsContainer } from './entities/balls-container';
import { Entity } from './entities/entity';
import { PreviewBall } from './entities/preview-ball';
import logger from './logger';
import { Queue } from './queue';
import { getNextBallType, randomBallType } from './util';

export class Game {
  private _engine: Engine;
  private _scene: Container;
  private _world: World;
  private _entities: Entity[] = [];
  private _queue: Queue<QueueItem> = new Queue();
  private _nextBall: BALL_TYPES = BALL_TYPES.Cherries;
  private _currentBall: BALL_TYPES = BALL_TYPES.Cherries;
  private _hoverBall: PreviewBall | undefined;
  private _previewBall: PreviewBall | undefined;
  private _score: number = 0;

  constructor(engine: Engine) {
    this._engine = engine;
    this._scene = new Container();
    this._scene.name = 'Game Scene';
    this._world = new World({
      gravity: new Vec2(0.0, -9.81)
    });
  }

  public init(): void {
    logger.info('Game initialized');

    this._nextBall = randomBallType();

    this._previewBall = new PreviewBall(this._nextBall, this, Vec2(this.engine.width - OFFSET, SPAWN_POSITION_Y));
    this._hoverBall = this._previewBall!.clone({
      initialPosition: Vec2(this.engine.width / 2, 100)
    });

    this._entities.push(new BallsContainer(Vec2(300, 400), this));
    this._entities.push(new Ball(BALL_TYPES.Cherries, this));

    this._entities.push(this._hoverBall);
    this._entities.push(this._previewBall);

    this._entities.forEach((entity) => {
      entity.init();
      this._scene.addChild(entity.graphics as DisplayObject);
    });

    this.registerListeners();
  }

  public registerListeners(): void {
    this.world.on('begin-contact', (contact) => {
      const bodyA = contact.getFixtureA().getBody();
      const bodyB = contact.getFixtureB().getBody();

      const entityAId = bodyA.getUserData();
      const entityBId = bodyB.getUserData();

      const entityA = this._entities.find((e) => e.id === entityAId);
      const entityB = this._entities.find((e) => e.id === entityBId);

      if (!entityA || !entityB) return;

      // Check if the two balls are of the same type:
      if (entityA instanceof Ball && entityB instanceof Ball && entityA.type === entityB.type) {
        const contactPoint = contact.getWorldManifold(undefined)?.points?.[0];
        if (!contactPoint) return;

        this._queue.enqueue({
          type: QueueType.EntityRemove,
          payload: {
            id: entityA.id
          }
        });

        this._queue.enqueue({
          type: QueueType.EntityRemove,
          payload: {
            id: entityB.id
          }
        });

        const spawnPosition = this._engine.planckToPixiCoords(contactPoint);

        this._queue.enqueue({
          type: QueueType.EntityCreate,
          payload: {
            create: (game) => Ball.spawn(game, spawnPosition.x, spawnPosition.y, getNextBallType(entityA.type))
          }
        });

        this._score += 10;
      }
    });

    // Spawn ball on click
    this.engine.renderer.view.addEventListener?.('click', (event) => {
      const e = event as MouseEvent;
      const position = Vec2(e.offsetX, e.offsetY);

      if (!this.withinXBounds(position)) return;

      this._currentBall = this._nextBall;

      this._nextBall = randomBallType();
      this._previewBall!.type = this._nextBall;
      this._hoverBall!.type = this._nextBall;

      this._queue.enqueue({
        type: QueueType.EntityCreate,
        payload: {
          create: (game) => Ball.spawn(game, position.x, SPAWN_POSITION_Y, this._currentBall)
        }
      });
    });

    // On cursor hover
    this.engine.renderer.view.addEventListener?.('mousemove', (event) => {
      const e = event as MouseEvent;
      const position = Vec2(e.offsetX, e.offsetY);
      if (!this.withinXBounds(position)) return;
      this._hoverBall!.body?.setPosition(this._engine.pixiToPlanckCoords(Vec2(position.x, SPAWN_POSITION_Y)));
    });
  }

  get gameArea() {
    return {
      x: this.container.position.x - this.container.width / 2,
      y: this.container.position.y - this.container.height / 2,
      width: this.container.width,
      height: this.container.height
    };
  }

  public withinXBounds(position: Vec2): boolean {
    return position.x > this.gameArea.x && position.x < this.gameArea.x + this.gameArea.width;
  }

  public withinYBounds(position: Vec2): boolean {
    return position.y > this.gameArea.y && position.y < this.gameArea.y + this.gameArea.height;
  }

  public withinBounds(position: Vec2): boolean {
    return this.withinXBounds(position) && this.withinYBounds(position);
  }

  public start(): void {
    logger.info('Game started');
    this.init();
  }

  public stop(): void {
    logger.info('Game stopped');
  }

  public update(deltaTime: number): void {
    this.processQueue();

    this._entities.forEach((entity) => {
      entity.update(deltaTime);
    });

    this._world.step(deltaTime);
  }

  public render(): void {
    this._engine.renderer.render(this._scene);
  }

  addEntity(entity: Entity): void {
    this._entities.push(entity);
    this._scene.addChild(entity.graphics as DisplayObject);
  }

  removeEntity(entity: Entity): void {
    entity.destroy();
    this._entities = this._entities.filter((e) => e !== entity);
  }

  processQueue(): void {
    const queueItem = this._queue.dequeue();
    if (!queueItem) return;

    const { type, payload } = queueItem;

    logger.info(`Processing queue item: ${type}`, payload);

    switch (type) {
      case QueueType.EntityCreate: {
        const entity = (payload as EntityCreatePayload).create(this);
        this.addEntity(entity);
        break;
      }
      case QueueType.EntityRemove: {
        const entity = this._entities.find((e) => e.id === (payload as EntityRemovePayload).id);
        if (!entity) return;
        this.removeEntity(entity);
        break;
      }
    }
  }

  get world() {
    return this._world;
  }

  get width() {
    return this._engine.width;
  }

  get height() {
    return this._engine.height;
  }

  get widthSI() {
    return this.width / METERS_TO_PIXELS;
  }
  get heightSI() {
    return this.height / METERS_TO_PIXELS;
  }

  get renderer() {
    return this._engine.renderer;
  }

  get scene() {
    return this._scene;
  }

  get engine() {
    return this._engine;
  }

  get container() {
    return this._entities.find((e) => e instanceof BallsContainer) as BallsContainer;
  }
}
