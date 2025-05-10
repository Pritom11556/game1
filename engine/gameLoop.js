export class GameLoop {
  constructor(engine) {
    this.engine = engine;
    this.lastTime = 0;
    this.running = false;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }
}