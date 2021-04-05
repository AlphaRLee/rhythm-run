class Platform {
  constructor({ game, x, y, width, height } = {}) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx, frameCount) {
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Platform;
