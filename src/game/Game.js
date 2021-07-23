import Player from "./Player";
import Platform from "./platform/Platform";
import PlatformBuilder from "./platform/PlatformBuilder";

class Game {
  constructor({ width, height }) {
    this.isRunning = false;

    this.width = width;
    this.height = height;

    this.gravity = 1;

    this.platforms = this.createPlatforms([{ x: 50, y: 400, width: 200, height: 50, createdTime: 0 }]);
    this.player = new Player({ game: this, x: 100, y: 200 });
    this.playerCameraPos = { x: 250, y: 400 }; // Fix the player at this position visually

    this.timeToX = 10;

    this.timer = 0;
    this.platformBuilder = new PlatformBuilder(this);
  }

  update(frameCount, keysHeld, barData) {
    if (!this.isRunning) return;

    this.handleBarData(barData);

    this.player.update(frameCount);
    this.handleKeysHeld(keysHeld);

    this.removeOldPlatforms();
    this.timer++;
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
    if (key == "w" || key == " ") {
      this.player.jump();
    }
  };

  createPlatforms = (platformData) => platformData.map((data) => new Platform({ game: this, ...data }));

  handleBarData(barData) {
    if (this.barData === barData) return; // Await explicit update before building
    this.barData = barData;
    if (this.barData) this.platformBuilder.onReadBar(this.barData);
  }

  removeOldPlatforms() {
    const duration = 800;
    const expiryTime = this.timer - duration;
    this.platforms = this.platforms.filter((platform) => platform.createdTime >= expiryTime);
  }
}

export default Game;
