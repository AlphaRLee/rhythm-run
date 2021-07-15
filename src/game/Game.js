import Player from "./Player";
import Platform from "./platform/Platform";

class Game {
  constructor({ width, height }) {
    this.isRunning = false;

    this.width = width;
    this.height = height;

    this.gravity = 1;

    this.platforms = this.createPlatforms([
      { x: 50, y: 600, width: 200, height: 50, createdTime: 0 },
      { x: 350, y: 500, width: 200, height: 50, createdTime: 0 },
      { x: 500, y: 600, width: 200, height: 50, createdTime: 0 },
      { x: 700, y: 400, width: 200, height: 50, createdTime: 0 },
    ]);
    this.player = new Player({ game: this, x: 100, y: 200 });
    this.playerCameraPos = { x: 250, y: 400 }; // Fix the player at this position visually

    this.timer = 0;
  }

  update(frameCount, keysHeld, notes) {
    if (!this.isRunning) return;

    // this.handleNotes(notes);

    this.player.update(frameCount);
    this.handleKeysHeld(keysHeld);

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
    if (key == "w") {
      this.player.jump();
    }
  };

  createPlatforms = (platformData) => platformData.map((data) => new Platform({ game: this, ...data }));

  handleNotes(notes) {
    notes = notes.filter((noteIndex) => noteIndex !== 0);
    if (!notes.length) {
      return;
    }

    const xOffset = this.timer * 8;
    const yScale = -100;
    const platformData = notes.map((note) => ({
      x: xOffset,
      y: yScale * note + 300,
      width: 50,
      height: 20,
      createdTime: this.timer,
    }));
    this.platforms.push(...this.createPlatforms(platformData));

    this.removeOldPlatforms();
  }

  removeOldPlatforms() {
    const duration = 100;
    const expiryTime = this.timer - duration;
    this.platforms = this.platforms.filter((platform) => platform.createdTime >= expiryTime);
  }
}

export default Game;
