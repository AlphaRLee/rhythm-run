import Sprite from "./Sprite";

class Platform extends Sprite {
  constructor(spriteOpts) {
    super(spriteOpts);
  }

  draw(ctx, frameCount) {
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Platform;
