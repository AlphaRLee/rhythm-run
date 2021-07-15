import Platform from "../Platform";

export default class RisingPattern {
  constructor(game) {
    super(game);
    this.name = "RisingPattern";
  }

  /**
   * Tests that each successive note has a higher frqeuency than the last
   * @param {Array} notesData
   */
  fitScore(notesData) {
    let score = 0;
    let lastFrequency = 0;

    notesData.forEach((noteData) => {
      if (noteData.frequency > lastFrequency) {
        score++;
      } else {
        score--;
      }

      lastFrequency = noteData.frequency;
    });

    return score / notesData.length;
  }

  build(notesData) {
    const noteHeight = 10;
    const minNoteLength = 10;
    const yIncrease = 30;
    const baseY = notesData[0].frequency;

    return notesData.map(
      (noteData) =>
        new Platform({
          game: this.game,
          x: noteData.time,
          y: baseY + i * yIncrease,
          width: Max(noteData.duration, minNoteLength),
          height: noteHeight,
          createdTime: noteData.time,
        })
    );
  }
}
