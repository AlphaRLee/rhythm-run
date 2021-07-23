import BarData from "../util/BarData";
import BeatData from "../util/BeatData";
import HistoryQueue from "../util/HistoryQueue";
import NoteData from "../util/NoteData";

export default class BarBuilder {
  constructor() {
    this.notesInBar = new Set();
    this.startBeat = null;
    this.midBeats = new HistoryQueue({ maxLength: 100 });
    this.lastBarTime = 0;

    this.minBarTime = 25;
    this.maxBarTime = 60;

    this.releasedBar = null;
  }

  /**
   *
   * @param {Array<NoteData>} notesData
   * @param {Array<BeatData} beatsData
   * @param {number} time
   */
  update(notesData, beatsData, time) {
    this.releasedBar = null;

    const endBeat = this.awaitEndBeat(beatsData, time);
    if (endBeat) {
      this.buildBar(endBeat, time);
    }

    // Add the note if it does not exist yet
    notesData.forEach((note) => this.notesInBar.add(note));
    const candidateBeats = beatsData.filter((beat) => beat.type === "mid");
    candidateBeats.forEach((beat) => this.midBeats.add(beat));
  }

  outputBar() {
    return this.releasedBar;
  }

  awaitEndBeat(beatsData, time) {
    const duration = time - this.lastBarTime;
    if (duration < this.minBarTime) return null;

    let endBeat = beatsData.find((beat) => beat.type === "strong");
    if (endBeat) {
      return endBeat;
    } else if (duration > this.maxBarTime && this.midBeats.length) {
      endBeat = this.midBeats.last();
      endBeat.type = "strong"; // Forcefully promote the beat to strong to end bar
      console.log("!!! forced endbeat", endBeat); // FIXME: dELETE
      return endBeat;
    }

    return null;
  }

  buildBar(endBeat, time) {
    this.releasedBar = new BarData({
      notesData: [...this.notesInBar],
      startBeat: this.startBeat,
      endBeat,
      midBeats: this.midBeats,
    });

    this.cycleBeat(endBeat, endBeat.endTime);
  }

  cycleBeat(endBeat, endTime) {
    this.notesInBar.clear();
    this.startBeat = endBeat; // End of this bar is the start fo the next bar
    this.midBeats = new HistoryQueue({ maxLength: 100 });
    this.lastBarTime = endTime;
  }
}
