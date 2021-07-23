import BeatData from "../util/BeatData";
import HistoryQueue from "../util/HistoryQueue";

export default class TempoAnalyzer {
  constructor() {
    this.avgEnergyHistory = new HistoryQueue({ maxLength: 108 });
    this.avgRisingHistory = new HistoryQueue({ maxLength: 108 });

    this.midBeatHistory = new HistoryQueue({ maxLength: 30 });
    this.strongBeatHistory = new HistoryQueue({ maxLength: 30 });

    this.midPeakRisingThreshold = 0.03; // Rising minimum
    this.strongPeakEnergyThreshold = 0.18; // Energy minimum

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

  outputBeats() {
    const beats = [];
    if (this.midBeat) beats.push(this.midBeatHistory.last());
    if (this.strongBeat) beats.push(this.strongBeatHistory.last());

    return beats;
  }

  recordMidBeat(averageEnergy, lastDiff, time) {
    // Bail out if cooldown hasn't finished
    if (this.midBeatHistory.length && time - this.midBeatHistory.last().endTime < this.beatTimeCooldown) return;

    if (averageEnergy >= this.strongPeakEnergyThreshold) {
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

    // Fallback to last beat duration if beat is significantly behind last beat
    if (beatHistory.length && duration > 2 * beatHistory.last().duration) duration = beatHistory.last().duration;

    beatHistory.add(new BeatData({ energy: averageEnergy, startTime: time - duration, endTime: time, type }));
  }

  calculateTempo() {
    if (!this.strongBeatHistory.length) return;
    this.strongTempoDurationSum = this.strongBeatHistory.reduce((sum, peak) => sum + peak.duration, 0);
    this.strongTempo = this.strongTempoDurationSum / this.strongBeatHistory.length;
  }
}
