import HistoryQueue from "./HistoryQueue";

export default class NoteData {
  /**
   * Represents data about one note. Best used for long-duration notes in low counts
   * @param {Object} param0
   * @param {number} param0.freqIndex
   * @param {HistoryQueue} param0.history
   * @param {number} param0.timeStart
   * @param {number} param0.timeEnd
   */
  constructor({ freqIndex, history, timeStart = undefined, timeEnd = undefined } = {}) {
    this.freqIndex = freqIndex;
    this.history = history;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
  }

  get duration() {
    if (typeof this.timeStart === "undefined" || typeof this.timeEnd === "undefined") {
      throw `Cannot get duration of note with undefined start time or end time. timeStart: ${this.timeStart}, timeEnd: ${this.timeEnd}`;
    }

    return this.timeEnd - this.timeStart;
  }
}
