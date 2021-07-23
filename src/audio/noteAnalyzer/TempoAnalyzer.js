import BeatData from "../util/BeatData";
import HistoryQueue from "../util/HistoryQueue";

export default class TempoAnalyzer {
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
    this.strongBeat = false;
    this.midBeat = false;
  }

  update(averageEnergy, time) {
    this.strongBeat = false;
    this.midBeat = false;

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

    if (lastDiff >= this.strongPeakRisingThreshold) {
      this.recordStrongBeat(averageEnergy, time);
      this.calculateTempo();
    }

    this.recordBeat(this.midBeatHistory, averageEnergy, time, this.fallbackMidTempo, "mid");
    this.midBeat = true;
  }

  recordStrongBeat(averageEnergy, time) {
    this.recordBeat(this.strongBeatHistory, averageEnergy, time, this.fallbackStrongTempo, "strong");
    this.strongBeat = true;
  }

  recordBeat(beatHistory, averageEnergy, time, fallbackTempo, type) {
    let duration = beatHistory.length ? time - beatHistory.last().endTime : fallbackTempo;

    console.log("!!! duration", duration);

    // Fallback to last beat duration if beat is significantly behind last beat
    if (beatHistory.length && duration > 2 * beatHistory.last().duration) duration = beatHistory.last().duration;

    beatHistory.add(new BeatData({ energy: averageEnergy, startTime: time - duration, endTime: time, type }));
  }

  calculateTempo() {
    if (!this.strongBeatHistory.length) return;

    console.log("!!! strongBeatHisto.last()", this.strongBeatHistory.last(), this.strongBeatHistory.last().duration);
    this.strongTempoDurationSum = this.strongBeatHistory.reduce((sum, peak) => sum + peak.duration, 0);
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
