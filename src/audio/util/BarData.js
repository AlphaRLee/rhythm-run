export default class BarData {
  constructor({ notesData, startBeat, endBeat, midBeats = [] }) {
    this.notesData = notesData;
    this.startBeat = startBeat;
    this.endBeat = endBeat;
    this.midBeats = midBeats;

    this.beatNotes = this.calculateBeatNotes();
  }

  get duration() {
    return this.endBeat.endTime - (this.startBeat?.endTime ? this.startBeat.endTime : 0);
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

  midBeatTimes() {
    return this.midBeats.map((beat) => beat.endTime);
  }

  calculateBeatNotes() {
    const starTimeThreshold = 3;
    const times = this.midBeatTimes();

    const filteredNotes = [];
    let i = 0;

    times.forEach((time) => {
      let targetNote = null;
      while (!targetNote && i < this.notesData.length) {
        if (Math.abs(time - this.notesData[i].startTime) <= starTimeThreshold) targetNote = this.notesData[i];
        i++;
      }

      if (targetNote) {
        filteredNotes.push(targetNote);
      }
    });

    return filteredNotes;
  }
}
