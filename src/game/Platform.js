import Sprite from "./Sprite";

class Platform extends Sprite {
  constructor(opts) {
    super(opts);
    this.createdTime = opts.createdTime;
  }

  draw(ctx, frameCount) {
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Platform;
