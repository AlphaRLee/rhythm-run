import NoteData from "../util/NoteData";

export default class DurationAnalyzer {
  constructor() {
    this.trackedNotes = new Map();
    this.releasedNotes = []; // notes that have been just released. Cleared every update cycle

    this.minEnergyThreshold = 0.2;
    this.sustainThreshold = 0.13; // How much a note's energy can vary before it's no longer considered the same note

    // FIXME: Delete
    this.debug = [];
  }

  /**
   *
   * @param {Array<NoteData>} notesData
   * @param {Array<number>} energies
   * @param {number} time
   */
  update(notesData, time) {
    this.releasedNotes = [];

    // Start tracking any new notes from notesData
    notesData.forEach((noteData) => {
      if (!this.trackedNotes.has(noteData.freqIndex)) {
        this.trackedNotes.set(noteData.freqIndex, noteData);
      }
    });

    this.trackedNotes.forEach((noteData) => this.updateNote(noteData, time));

    // FIXME: delete
    this.debug = Array(99).fill(0); // FIXME: Delete
    this.trackedNotes.forEach((noteData) => (this.debug[noteData.freqIndex] = noteData.history.last()));
  }

  /**
   * Update a note's energy and check whether it should continue to be tracked or not
   * @param {NoteData} noteData
   */
  updateNote(noteData, time) {
    const hasEnergy = noteData.history.last() >= this.minEnergyThreshold;
    const withinRisingThreshold = Math.abs(noteData.history.lastDiff()) < this.sustainThreshold;

    // Test if note should be tracked
    if (!hasEnergy || !withinRisingThreshold) {
      noteData.endTime = time;
      this.releasedNotes.push(noteData);
      this.trackedNotes.delete(noteData.freqIndex);

      // FIXME: What happens if the note goes up? Should register as a new noteData
      return;
    }
  }
}
