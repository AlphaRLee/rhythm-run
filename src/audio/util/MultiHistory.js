/**
 * History of all the energies
 * Stored as an array of HistoryQueues
 */
export default class MultiHistory {
  constructor({ maxLength = 200 } = { maxLength: 200 }) {
    this.maxLength = maxLength;
    this.histories = [];
  }

  at(i) {
    return this.histories.map((history) => history[i]);
  }

  last(i = 0) {
    return this.histories.map((history) => history[history.length - 1 - i]);
  }

  /**
   * Add new entries to all histories
   * @param {*} audioMotion
   */
  add(entries) {
    if (entries.length != this.histories.length) {
      throw `MultiHistory length of ${this.histories.length} does not match entries of length ${entries.length}`;
    }

    this.histories.forEach((history, i) => history.add(entries[i]));
  }

  /**
   * Run an array map callback on all histories
   * @param {Function} cb Callback to run
   */
  map(cb) {
    return this.histories.map(cb);
  }
}
