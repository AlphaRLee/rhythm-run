import BarData from "../../../audio/util/BarData";
import Platform from "../Platform";
import PlatformPattern from "./PlatformPattern";

export default class RisingPattern extends PlatformPattern {
  constructor(game) {
    super(game);
    this.name = "RisingPattern";
  }

  /**
   * Tests that each successive note has a higher frqeuency than the last
   * @param {BarData} barData
   */
  fitScore(barData) {
    const notesData = barData.beatNotes;
    let score = 0;
    let lastFreqIndex = 0;

    return Math.random();
  }

  build(barData) {
    const notesData = barData.beatNotes;
    const noteHeight = 10;
    const minNoteLength = 50;

    const xOffset = -15;

    return notesData.map(
      (noteData, i) =>
        new Platform({
          game: this.game,
          x: noteData.startTime * this.game.timeToX + xOffset,
          y: 700 - noteData.freqIndex * 10,
          width: Math.max(noteData.duration * this.game.timeToX, minNoteLength),
          height: noteHeight,
          createdTime: noteData.startTime,
        })
    );
  }
}
