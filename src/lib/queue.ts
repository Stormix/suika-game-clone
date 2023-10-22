export class Queue<T> {
  private _queue: T[] = [];

  constructor() {}

  enqueue(item: T) {
    this._queue.push(item);
  }

  dequeue() {
    return this._queue.shift();
  }

  get length() {
    return this._queue.length;
  }

  isEmpty() {
    return this.length === 0;
  }

  peek() {
    return !this.isEmpty() ? this._queue[0] : undefined;
  }
}
