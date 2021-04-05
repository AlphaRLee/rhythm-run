class Player {
  constructor({ game, x, y }) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;

    this.userSpeed = { x: 0, y: 0 };
    this.envSpeed = { x: 0, y: 0 };
    this.walkSpeed = 10;
    this.jumpSpeed = -15;
  }

  update(frameCount) {
    this.applySpeeds();
    this.fall();
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
}

export default Player;
