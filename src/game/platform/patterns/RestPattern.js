import Platform from "../Platform";
import PlatformPattern from "./PlatformPattern";

export default class RestPattern extends PlatformPattern {
  constructor(game) {
    super(game);
    this.name = "RestPattern";
  }

  /**
   * Tests that there is no melody
   * @param {Array} notesData
   */
  fitScore(barData) {
    const notesData = barData.beatNotes;
    let score = 0;
    const maxEnergyThreshold = 0.02;

    notesData.forEach((noteData) => {
      if (noteData.history.last() <= maxEnergyThreshold) {
        score++;
      }
    });

    return score / notesData.length;
  }

  /**
   * Build one long patform for the player to simply run across
   * @param {Array} notesData
   * @returns {Array<Platform>} One long platform slightly below the player's position
   */
  build(barData) {
    const noteHeight = 30;
    const minNoteLength = 100;
    const xOffset = -15;
    const baseY = 400;

    return [
      new Platform({
        game: this.game,
        x: barData.startTime * this.game.timeToX + xOffset,
        y: baseY,
        width: Math.max(barData.duration * this.game.timeToX, minNoteLength),
        height: noteHeight,
        createdTime: barData.startTime,
      }),
    ];
  }
}
