export default class BarData {
  constructor({ notesData, startBeat, endBeat }) {
    this.notesData = notesData;
    this.startBeat = startBeat;
    this.endBeat = endBeat;
  }

  get duration() {
    return this.endBeat.duration;
  }

  get startTime() {
    return this.startBeat.endTime;
  }

  get endTime() {
    return this.endBeat.endTime;
  }

  /**
   * Get the 0%, 25%, 50% and 75% timestamps as an array
   */
  quarterTimes() {
    const quarterDuration = this.duration / 4;
    let times = [];
    for (let i = 0; i < 4; i++) {
      times.push(this.startTime + i * quarterDuration);
    }
    return times;
  }
}
