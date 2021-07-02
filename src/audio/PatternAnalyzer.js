/*
  TODO: Pattern analyzer
  Detect tempo:
    periodic silence
    periodic snare drum
      Note - snare might land on medium beat, not strong beat
  
  Extract pattern from tempo:


  Add weight to:
    Repeated patterns
      Overlay a suspected pattern on top of another, min(sum(abs(unknown - known)))
  
  Classify patterns
    Rising sequence
    Falling sequence
    Variant on existing sequence

  Craft platform layout from patterns
*/
class PatternAnalyzer {}

export default PatternAnalyzer;
