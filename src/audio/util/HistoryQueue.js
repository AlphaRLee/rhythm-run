/**
 * An queue that holds the history of energies for one frequency range
 * Extends conventional array functionality
 */
export default class HistoryQueue extends Array {
  constructor({ maxLength = 200 } = { maxLength: 200 }) {
    this.maxLength = maxLength;
  }

  /**
   * Add a new value in and drop any values beyond the max length
   * @param {*} value
   */
  add(value) {
    this.push(value);
    if (this.length >= this.maxLength) {
      this.splice(0, this.length - this.maxLength);
    }
  }
}
