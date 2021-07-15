import Platform from "../Platform";

export default class RestPattern {
  constructor(game) {
    super(game);
    this.name = "RestPattern";
  }

  /**
   * Tests that there is no melody
   * @param {Array} notesData
   */
  fitScore(notesData) {
    let score = 0;
    const maxEnergyThreshold = 0.3;

    notesData.forEach((noteData) => {
      if (noteData.energy <= maxEnergyThreshold) {
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
  build(notesData) {
    const noteHeight = 10;
    const minNoteLength = 50;
    const baseY = 0;

    return [
      new Platform({
        game: this.game,
        x: noteData.time,
        y: baseY,
        width: Max(noteData.duration, minNoteLength),
        height: noteHeight,
        createdTime: noteData.time,
      }),
    ];
  }
}
