export default class BeatData {
  constructor({ energy, startTime = undefined, endTime, type = "mid" }) {
    this.energy = energy;
    this.type = type;

    this.startTime = startTime;
    this.endTime = endTime;
  }

  get duration() {
    if (typeof this.startTime === "undefined" || typeof this.endTime === "undefined") return;
    return this.endTime - this.startTime;
  }
}
