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

    notesData.forEach((noteData) => {
      if (noteData.freqIndex > lastFreqIndex) {
        score++;
      } else {
        score--;
      }

      lastFreqIndex = noteData.freqIndex;
    });

    return score / notesData.length;
  }

  build(barData) {
    const notesData = barData.beatNotes;
    const noteHeight = 10;
    const minNoteLength = 50;

    const xOffset = -15;
    const yIncrease = -80;
    const baseY = notesData[0].freqIndex;
    const durationToWidth = 5;

    return notesData.map(
      (noteData, i) =>
        new Platform({
          game: this.game,
          x: noteData.startTime * this.game.timeToX + xOffset,
          y: baseY + i * yIncrease,
          width: Math.max(noteData.duration * this.game.timeToX, minNoteLength),
          height: noteHeight,
          createdTime: noteData.startTime,
        })
    );
  }
}
