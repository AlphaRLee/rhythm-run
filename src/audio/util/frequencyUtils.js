export const frequencies = Object.freeze([
  28, // A0
  29,
  31, // B0
  33, // C1 -------
  35,
  37, // D1
  39,
  41, // E1
  44, // F1
  46,
  49, // G1
  52,
  55, // A1
  58,
  62, // B1
  65, // C2 -------
  69,
  73, // D2
  78,
  82, // E2
  87, // F2
  92,
  98, // G2
  104,
  110, // A2
  117, // B2
  123,
  131, // C3 -------
  139,
  147, // D3
  156,
  165, // E3
  175, // F3
  185,
  196, // G3
  208,
  220, // A3
  233,
  247, // B3
  262, // C4 -------
  277,
  294, // D4
  311,
  330, // E4
  349, // F4
  370,
  392, // G4
  415,
  440, // A4
  466,
  494, // B4
  523, // C5 -------
  554,
  587, // D5
  622,
  659, // E5
  698, // F5
  740,
  784, // G5
  831,
  880, // A5
  932,
  988, // B5
  1047, // C6 -------
  1109,
  1175, // D6
  1245,
  1319, // E6
  1397, // F6
  1480,
  1568, // G6
  1661,
  1760, // A6
  1865,
  1976, // B6
  2093, // C7 -------
  2217,
  2349, // D7
  2489,
  2637, // E7
  2794, // F7
  2960,
  3136, // G7
  3322,
  3520, // A7
  3729,
  3951, // B7
  4186, // C8 -------
  4435,
  4699, // D8
  4978,
  5274, // E8
  5588, // F8
  5920,
  6272, // G8
  6645,
  7040, // A8
  7459,
  7902, // B8
]);

export const semitones = 12;
export const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Exponential equation to convert from index i to the corresponding frequency
// Scale (s) and rate (r) used in exponential equation f(i) = s * r^i
// Numbers created by entering frequencies into a regression model. Rate is roughly 2^(1/12)
export const indexToFreqScale = 27.5007742362;
export const indexToFreqRate = 1.05946289375;

/**
 * Get the indices of the notes that are harmonics to the given frequency
 * Note - this excldues the frequency index itself
 * @param {Number} freqIndex The index representing the given frequency. E.g. 48 represents 440Hz
 * @returns Array of indices for harmonics
 */
export const harmonicIndices = (freqIndex) => {
  let harmonics = [];
  for (let i = freqIndex + semitones; i < frequencies.length; i += semitones) {
    harmonics.push(i);
  }
  return harmonics;
};

/**
 * Convert an index of a frequency to its corresponding note
 * @param {Number} freqIndex The index representing the given frequency. E.g. 48 represents 440Hz
 * @returns The note name. E.g. 440Hz is output as "A4"
 */
export const frequencyToNote = (freqIndex) => {
  freqIndex += 9; // Accomodate 1-based index for notes

  const octave = Math.floor(freqIndex / semitones);
  const note = noteNames[freqIndex % semitones];
  return `${note}${octave}`;
};
