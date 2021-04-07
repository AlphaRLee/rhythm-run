import Player from "./Player";
import Platform from "./Platform";

class Game {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;

    this.gravity = 1;

    this.platforms = this.createPlatforms();
    this.player = new Player({ game: this, x: 100, y: 200 });
    this.playerCameraPos = { x: 250, y: 400 }; // Fix the player at this position visually
  }

  update(frameCount, keysHeld) {
    this.player.update(frameCount);

    this.handleKeysHeld(keysHeld);
  }

  draw(ctx, frameCount) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, this.width, this.height);

    const { x: cameraX, y: cameraY } = this.calculateCameraPos();
    ctx.translate(cameraX, cameraY);

    this.platforms.forEach((p) => p.draw(ctx, frameCount));
    this.player.draw(ctx, frameCount);

    ctx.translate(-cameraX, -cameraY);
  }

  calculateCameraPos() {
    return {
      x: this.playerCameraPos.x - this.player.x,
      y: this.playerCameraPos.y - this.player.y,
    };
  }

  handleKeysHeld(keysHeld) {
    this.player.userSpeed.x = 0;

    // Right
    if (keysHeld["d"]) {
      this.player.userSpeed.x += this.player.walkSpeed;
    }

    // Left
    if (keysHeld["a"]) {
      this.player.userSpeed.x -= this.player.walkSpeed;
    }
  }

  onKeyDown = (key) => {
    if (key == "w") {
      this.player.jump();
    }
  };

  createPlatforms() {
    // TODO: Fix hardcoded list of platforms
    const platformData = [
      { x: 50, y: 600, width: 200, height: 50 },
      { x: 350, y: 500, width: 200, height: 50 },
      { x: 500, y: 600, width: 200, height: 50 },
      { x: 700, y: 400, width: 200, height: 50 },
    ];

    return platformData.map((data) => new Platform({ game: this, ...data }));
  }
}

export default Game;
