/*
  TODO: Analyze notes to refine
  Add weight to:
    Sustained notes
    Loudest notes in local area
    Rising group 
      By frequency (00000112882110000)
      By time (00000887553221100000)
    Bass energy
    Average energy (snare drum)
    Notes near high-scoring notes after they're played
  
  Subtract weight from:
    Sustained silence
    Notes at or below average energy
    Harmonics
      Any set of frequencies that match one another, keep the highest, subtract the rest
      Split by bass/midrange, ignore treble

  Keep notes above a threshold weight
  Array of notes at times can be fed into pattern analyzer
*/
class NoteAnalyzer {
  constructor({ audioMotion = null }) {
    this.audioMotion = audioMotion;

    this.avgEnergy = 0;
    this.energyWeights = [];
    this.energyFrame = [];
    this.energyTimeChange = []; // d/dt(energyFrame) for last frame
  }

  /**
   * Called once per frame
   */
  update() {}

  /**
   * Remove weights from harmonic frequencies
   * Assume the highest energy frequency is the "heard" frequency (usually the fundamental frequency)
   * For each range (bass/midrange)
   *  Any frequency that rise or fall in-time with the fundamental are assumed to be a harmonic
   */
  weighHarmonics() {}
}

export default NoteAnalyzer;
