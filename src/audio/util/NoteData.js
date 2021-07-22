import HistoryQueue from "./HistoryQueue";

export default class NoteData {
  /**
   * Represents data about one note. Best used for long-duration notes in low counts
   * @param {Object} param0
   * @param {number} param0.freqIndex
   * @param {HistoryQueue} param0.history
   * @param {number} param0.startTime
   * @param {number} param0.endTime
   */
  constructor({ freqIndex, history, startTime = undefined, endTime = undefined } = {}) {
    this.freqIndex = freqIndex;
    this.history = history;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  get duration() {
    if (typeof this.startTime === "undefined" || typeof this.endTime === "undefined") {
      throw `Cannot get duration of note with undefined start time or end time. startTime: ${this.startTime}, endTime: ${this.endTime}`;
    }

    return this.endTime - this.startTime;
  }
}
