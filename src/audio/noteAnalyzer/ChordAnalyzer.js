import HistoryQueue from "../util/HistoryQueue";

/**
 * Many instruments have harmonics and chords
 * This analyzer seeks common rises over time and correlates those notes together
 */
class ChordAnalyzer {
  constructor() {
    // History of all energies by frequency
    this.energiesHistories = new HistoryQueue();
    this.risingEnergiesHistories = new HistoryQueue();
  }

  update(energies) {
    this.energiesHistories.add(energies);
    /*
    FIXME: 
      Steal the convolveTail method from TempoAnalyzer
      Calculate the covolution on the tail for all frequencies
      Test if, for each frequency, there is a similar trend
        (consider sorting frequencies by rising edges and correlating those)
      Return the largest of those notes

    Part 2: loose correlation
      Why: If notes rise together, match. But if they fall at slightly different paces, still need to match
        This should narrow down noise 
      Record history of rising chord matches vs current direction
      If last harmonic was close to current then just look for average in colvolved result
      
    */
  }
}
