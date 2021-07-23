import BarData from "../util/BarData";
import BeatData from "../util/BeatData";
import NoteData from "../util/NoteData";

export default class BarBuilder {
  constructor() {
    this.notesInBar = new Set();
    this.startBeat = null;
    this.releasedBar = null;
  }

  /**
   *
   * @param {Array<NoteData>} notesData
   * @param {Array<BeatData} beatsData
   * @param {number} time
   */
  update(notesData, beatsData) {
    this.releasedBar = [];

    const endBeat = beatsData.find((beat) => beat.type === "strong");
    if (endBeat) {
      this.releasedBar = new BarData({ notesData: [...this.notesInBar], startBeat: this.startBeat, endBeat });
      this.barData.clear();
      this.startBeat = endBeat; // End of this bar is the start fo the next bar
    }

    // Add the note if it does not exist yet
    notesData.forEach((note) => this.barData.add(note));
  }
}
