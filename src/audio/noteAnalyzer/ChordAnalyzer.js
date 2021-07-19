import MultiHistory from "../util/MultiHistory";

/**
 * Many instruments have harmonics and chords
 * This analyzer seeks common rises over time and correlates those notes together
 */
export default class ChordAnalyzer {
  constructor() {
    // History of all energies by frequency
    this.energiesHistories = new MultiHistory();
    this.risingEnergiesHistories = new MultiHistory();

    // FIXME: delete
    this.debug = [];
  }

  update(energies) {
    this.energiesHistories.add(energies);
    this.updateRisingEdge();
    this.findChords();
    /*
    FIXME: 
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

  updateRisingEdge() {
    const kernel = [1, 0, -1];
    const risingEnergies = this.energiesHistories.map((history) => history.convolveTail(kernel));
    this.risingEnergiesHistories.add(risingEnergies);
    this.debug = this.risingEnergiesHistories.last(); // FIXME: Delete
  }

  findChords() {
    const lastRises = this.risingEnergiesHistories.last();
    const nearTolerance = 0.2;
    const minTolerance = 0.5; // How much the rising edge needs before being considered
    let maxEnergyIndex = 0;
    let maxEnergy = 0;

    let avgEnergy = 0; // Running average during iteration

    // Sorted rising energies, in descending order. Mapped with the original index
    const sortedRises = lastRises.map((n, i) => ({ value: n, index: i })).sort((a, b) => b.value - a.value);
  }
}
