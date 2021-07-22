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

  update(energies, time) {
    this.energiesHistories.add(energies);
    this.updateRisingEdge();
    this.notesData = this.findChordNotes(time);
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
   * @param {number} time The current time
   * @returns {Array<NoteData>} An array of notes with the highest rising edge, or an empty array if there is none
   */
  findChordNotes(time) {
    const lastRises = this.risingEnergiesHistories.last();

    // Sorted rising energies, in descending order. Mapped with the original index
    const filteredRises = this.applyMidtoneWeights(lastRises);

    // FIXME: Delete debugger
    // this.debug = Array(lastRises.length).fill(0);
    // filteredRises.forEach(({ index, weightedValue }) => (this.debug[index] = weightedValue));

    let sortedRises = filteredRises.slice();
    sortedRises.sort((a, b) => b.weightedValue - a.weightedValue);

    // Simplified approach, just take the highest note and discard the rest

    const notesData = [];
    if (sortedRises.length) {
      const highestEntry = sortedRises[0];

      // FIXME: Delete debugger
      // this.debug = Array(lastRises.length).fill(0);
      // this.debug[highestEntry.index] = highestEntry.weightedValue;

      notesData.push(
        new NoteData({
          freqIndex: highestEntry.index,
          history: this.energiesHistories.history(highestEntry.index),
          startTime: time,
        })
      );
    }

    return notesData;
  }

  /**
   * Boost the weight for notes in the midtones and suppres notes in the bass
   */
  applyMidtoneWeights(lastRises) {
    const weightedRises = lastRises.map((n, i) => ({
      value: n,
      index: i,
      weightedValue: n * this.midtoneWeightSigmoid(i),
    }));

    return weightedRises.filter((entry) => entry.weightedValue >= this.minRisingThreshold);
  }

  /**
   * Two sigmoid functions multiplied together
   * freqIndex 30-80 are largely unaffected, anything outside tapers off
   * @param {*} freqIndex
   * @returns Value between 0 to 1
   */
  midtoneWeightSigmoid(freqIndex) {
    const dropoffRate = 0.15; // Numbers close to 0 = slow taper, +numbers = left->right is low->high
    const lowCutoff = 13.5; // 27 / 2, so roughly C3 is unaffected
    const highCutoff = 93.5; // 88 + (99 - 88) / 2, so roughly C8 is unaffected

    // Sigmoid is 1 / (1 + e^-x), modified to double-sigmoid: [1 / (1 + e^-a(x-k))] * [1 / (1 + e^-a(x-k))]
    return (
      1 /
      ((1 + Math.exp(-dropoffRate * (freqIndex - lowCutoff))) * (1 + Math.exp(dropoffRate * (freqIndex - highCutoff))))
    );
  }
}
