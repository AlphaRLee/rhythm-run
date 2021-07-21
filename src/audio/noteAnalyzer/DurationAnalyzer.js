import NoteData from "../util/NoteData";

export default class DurationAnalyzer {
  constructor() {
    this.trackedNotes = new Map();
    this.releasedNotes = []; // notes that have been just released. Cleared every update cycle

    this.sustainThreshold = 0.08; // How much a note's energy can vary before it's no longer considered the same note
  }

  /**
   *
   * @param {Array<NoteData>} notesData
   * @param {Array<number>} energies
   * @param {number} time
   */
  update(notesData, energies, time) {
    this.releasedNotes = [];

    this.notesData.forEach((noteData) => {
      if (!this.trackedNotes.has(noteData.freqIndex)) {
        this.trackedNotes.set(noteData.freqIndex, noteData);
      }
    });

    this.trackedNotes.forEach((noteData) => this.updateNote(noteData, time));
  }

  /**
   * Update a note's energy and check whether it should continue to be tracked or not
   * @param {NoteData} noteData
   */
  updateNote(noteData, time) {
    // Test if note should be tracked
    if (Math.abs(noteData.history.lastDiff()) > this.sustainThreshold) {
      noteData.timeEnd = time;
      this.releasedNotes.push(noteData);
      this.trackedNotes.delete(noteData.freqIndex);

      // FIXME: What happens if the note goes up? Should register as a new noteData
      return;
    }
  }
}
