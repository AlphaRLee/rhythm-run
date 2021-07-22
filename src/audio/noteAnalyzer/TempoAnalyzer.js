import HistoryQueue from "../util/HistoryQueue";

export class TempoAnalyzer {
  constructor() {
    this.avgEnergyHistory = new HistoryQueue({ maxLength: 108 });
    this.avgRisingHistory = new HistoryQueue({ maxLength: 108 });

    this.midBeatHistory = new HistoryQueue({ maxLength: 10 });
    this.strongBeatHistory = new HistoryQueue({ maxLength: 10 });

    this.midPeakRisingThreshold = 0.06;
    this.strongPeakRisingThreshold = 0.08;

    this.beatTimeCooldown = 3; // How many frames must pass before a beat is accepted

    // Output - "frames per beat"
    this.fallbackStrongTempo = 50;
    this.fallbackMidTempo = 25;
    this.strongTempo = 50;
    this.midTempo = 25;

    // FIXME: Debug
    this.debug = 0;
  }

  update(averageEnergy, time) {
    this.debug = 0; // FIXME: Delete

    this.avgEnergyHistory.add(averageEnergy);
    const lastDiff = this.avgEnergyHistory.lastDiff();
    this.avgRisingHistory.add(lastDiff);

    if (lastDiff > this.midPeakRisingThreshold) {
      this.recordMidBeat(averageEnergy, lastDiff, time);
    }
  }

  recordMidBeat(averageEnergy, lastDiff, time) {
    // Bail out if cooldown hasn't finished
    if (this.midBeatHistory.length && time - this.midBeatHistory.last().time < this.beatTimeCooldown) return;

    this.debug = averageEnergy; // FIXME: delete

    if (lastDiff >= this.strongPeakRisingThreshold) {
      this.recordStrongBeat(averageEnergy, time);
      this.calculateTempo();
    }

    this.recordBeat(this.midBeatHistory, averageEnergy, time, this.fallbackMidTempo);

    // this.printDebug(time); // FIXME: delete
  }

  recordStrongBeat(averageEnergy, time) {
    this.recordBeat(this.strongBeatHistory, averageEnergy, time, this.fallbackStrongTempo);

    this.debug = 0.8; // FIXME: delete
  }

  recordBeat(beatHistory, averageEnergy, time, fallbackTempo) {
    let duration = beatHistory.length ? time - beatHistory.last().time : fallbackTempo;

    // Fallback to last beat duration if beat is significantly behind last beat
    if (beatHistory.length && duration > 2 * beatHistory.last().duration) duration = beatHistory.last().duration;

    beatHistory.add({ time, value: averageEnergy, duration });
  }

  printDebug(time) {
    const timeWindow = 400;
    const inWindow = (peakHistory) => peakHistory.filter((peak) => time - peak.time <= timeWindow);
    const scores = [inWindow(this.midBeatHistory).length, inWindow(this.strongBeatHistory).length];
    const ratio = scores[1] ? (scores[0] / scores[1]).toFixed(2) : scores[0] + "exceed";
    console.log("!!! midPeak/strongPeak length in " + timeWindow, scores[0], scores[1], ratio);
  }

  calculateTempo() {
    if (!this.strongBeatHistory.length) return;

    this.strongTempoDurationSum = this.strongBeatHistory.reduce(
      ({ sum, last }, peak) => ({
        sum: peak.time - last + sum,
        last: peak.time,
      }),
      { sum: 0, last: this.strongBeatHistory.length ? this.strongBeatHistory[0].time : 0 }
    )?.sum;
    this.strongTempo = this.strongTempoDurationSum / this.strongBeatHistory.length;

    console.log("!!! strongTempo", this.strongTempo);
  }

  /*
    FIXME: Next items on list
      Calculate time since last peak
      Calculate "consistency" score, from 0 to 1 how close this matches prev peak timing (or peak before)
      Update prev peak timing with weighted average
   */
}
