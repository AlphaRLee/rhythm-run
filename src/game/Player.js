import Sprite, { edges } from "./Sprite";
import { collidedEdge, spriteCollide } from "./util/collide";

class Player extends Sprite {
  constructor({ game, x, y }) {
    super({ game, x, y, width: 50, height: 50 });

    this.userSpeed = { x: 0, y: 0 };
    this.envSpeed = { x: 0, y: 0 };
    this.walkSpeed = 10; // FIXME: 10
    this.jumpSpeed = -20;
  }

  update(frameCount) {
    this.applySpeeds();
    this.fall();
    this.handlePlatformsCollide(this.game.platforms);
  }

  draw(ctx, frameCount) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  applySpeeds() {
    this.move({
      x: this.userSpeed.x + this.envSpeed.x,
      y: this.userSpeed.y + this.envSpeed.y,
    });
  }

  move({ x = 0, y = 0 } = {}) {
    this.x += x;
    this.y += y;
  }

  fall() {
    this.envSpeed.y += this.game.gravity;
  }

  jump() {
    this.envSpeed.y = this.jumpSpeed;
  }

  handlePlatformsCollide(platforms) {
    for (const platform of platforms) {
      if (spriteCollide(this, platform)) {
        this.onPlatformCollide(platform);
        return;
      }
    }
  }

  onPlatformCollide(platform) {
    const verticalCollide = () => {
      this.userSpeed.x = 0;
      this.envSpeed.x = 0;
    };
    const horizontalCollide = () => {
      this.userSpeed.y = 0;
      this.envSpeed.y = 0;
    };

    const playerEdge = collidedEdge(this, platform);
    if (playerEdge == edges.LEFT) {
      verticalCollide();
      this.x = platform.right;
    } else if (playerEdge == edges.RIGHT) {
      verticalCollide();
      this.x = platform.x - this.width;
    } else if (playerEdge == edges.TOP) {
      horizontalCollide();
      this.y = platform.bottom;
    } else if (playerEdge == edges.BOTTOM) {
      horizontalCollide();
      this.y = platform.y - this.height;
    }
  }
}

export default Player;
