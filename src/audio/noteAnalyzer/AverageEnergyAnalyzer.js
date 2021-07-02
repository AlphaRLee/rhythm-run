export class TempoAnalyzer {
  constructor() {
    this.energyHistory = [];
    this.risingEdgeHistory = [];
    this.maxHistoryLength = 200;

    this.newPeakDetected = false;
    this.peak = {
      time: 0,
      value: -Infinity,
    };
    this.prevPeak = null;
  }

  update(avgEnergy, timer) {
    this.newPeakDetected = false;

    this.addToHistory(avgEnergy, this.energyHistory, this.maxHistoryLength);
    this.convolveTail(avgEnergy);
    this.updatePeak(timer);
  }

  /**
   * Push the entry in and maintain the array length
   * @param {Number} value
   * @param {Array} history
   * @param {Number} maxHistoryLength
   */
  addToHistory(value, history, maxHistoryLength) {
    history.push(x);
    if (history.length >= maxHistoryLength) {
      history.splice(0, history.length - maxHistoryLength);
    }
  }

  /**
   * Run an rising-edge-detecting convolution on the tail (latest) of the history
   */
  convolveTail(energy) {
    const kernel = [1, 0, -1];
    const reversedKernel = [-1, 0, 1]; // Reversed elements in kernel to simplify array indexing
    let sum = 0;
    for (let i = 0; i < kernel.length; i++) {
      const signalIndex = this.energyHistory.length - i - 1;
      const signalVal = signalIndex >= 0 ? this.energyHistory[signalIndex] : 0;
      sum += signalVal * kernel[i];
    }

    this.addToHistory(sum, this.risingEdgeHistory, this.maxHistoryLength);
  }

  /**
   * Find if latest signal has peaked or not
   */
  updatePeak(timer) {
    const index = this.risingEdgeHistory.length - 1;
    if (this.risingEdgeHistory[index] <= 0 || this.risingEdgeHistory[index - 1]) return;

    this.prevPeak = this.peak;
    this.peak = { time: timer - 1, value: this.risingEdgeHistory[index - 1] };
    this.newPeakDetected = true;
  }

  /*
    FIXME: Next items on list
      Calculate time since last peak
      Calculate "consistency" score, from 0 to 1 how close this matches prev peak timing (or peak before)
      Update prev peak timing with weighted average
   */
}
