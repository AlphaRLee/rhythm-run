import MultiHistory from "../util/MultiHistory";
import NoteData from "../util/NoteData";

/**
 * Many instruments have harmonics and chords
 * This analyzer seeks common rises over time and correlates those notes together
 */
export default class ChordAnalyzer {
  constructor() {
    // History of all energies by frequency
    this.energiesHistories = new MultiHistory();
    this.risingEnergiesHistories = new MultiHistory();

    this.minRisingThreshold = 0.1; // How much the rising edge needs before being considered

    this.notesData = [];

    // FIXME: delete
    this.debug = [];
  }

  update(energies) {
    this.energiesHistories.add(energies);
    this.updateRisingEdge();
    this.notesData = this.findChordNotes();
  }

  output() {
    return this.notesData;
  }

  updateRisingEdge() {
    const risingEnergies = this.energiesHistories.map((history) => history.lastDiff());
    this.risingEnergiesHistories.add(risingEnergies);
  }

  /**
   * Find which notes have the highest rising edge. Rising edge must be above this.minRisingThreshold
   * @returns {Array<NoteData>} An array of notes with the highest rising edge, or an empty array if there is none
   */
  findChordNotes() {
    const lastRises = this.risingEnergiesHistories.last();

    // Sorted rising energies, in descending order. Mapped with the original index
    const filteredRises = lastRises
      .map((n, i) => ({ value: n, index: i }))
      .filter((entry) => entry.value >= this.minRisingThreshold);

    let sortedRises = filteredRises.slice();
    sortedRises.sort((a, b) => b.value - a.value);

    // Simplified approach, just take the highest note and discard the rest

    const notesData = [];
    if (sortedRises.length) {
      const highestEntry = sortedRises[0];

      // FIXME: Delete debugger
      this.debug = Array(lastRises.length).fill(0);
      this.debug[highestEntry.index] = highestEntry.value;

      notesData.push(
        new NoteData({
          freqIndex: highestEntry.index,
          history: this.energiesHistories.history(highestEntry.index),
        })
      );
    }

    return notesData;
  }
}
