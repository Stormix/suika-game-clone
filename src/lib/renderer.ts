import Color from 'color';
import { Renderer as _Renderer } from 'pixi.js';

export class Renderer extends _Renderer {
  constructor(width: number, height: number, canvas: HTMLCanvasElement) {
    super({
      width,
      height,
      view: canvas,
      backgroundColor: Color('black').rgbNumber()
    });
  }
}
