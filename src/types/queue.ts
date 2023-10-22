import { Entity } from '@/lib/entities/entity';
import { Game } from '@/lib/game';

export interface Queuable {
  id: string;
}

export enum QueueType {
  EntityCreate = 'EntityCreate',
  EntityRemove = 'EntityRemove'
}

export interface QueueItem {
  type: QueueType;
  payload: EntityCreatePayload | EntityRemovePayload;
}

export interface EntityCreatePayload {
  create: (game: Game) => Entity;
}

export interface EntityRemovePayload {
  id: string;
}
