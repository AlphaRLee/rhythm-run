import React, { useEffect, useRef } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";

function AudioVisualizer(props) {
  const { audioRef } = props;

  const audioCanvasRef = useRef(null);
  let audioMotion = null;

  let energiesHistory = [];
  const energyFramesCount = 1;

  const frequencies = Object.freeze([
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

  // Exponential equation to convert from index i to the corresponding frequency
  // Scale (s) and rate (r) used in exponential equation f(i) = s * r^i
  // Numbers created by entering frequencies into a regression model. rate is roughly 2^(1/12)
  const indexToFreqScale = 27.5007742362;
  const indexToFreqRate = 1.05946289375;

  const energyThreshold = 50; // FIXME: This is -50db, energy will be a totally different unit. More accurate method would be X db above the bass (roughly 50-60 db)
  const risingThreshold = 50; // FIXME: Needs calibration
  const fallingThreshold = 40; // FIXME: Needs calibration
  const lowFreqIndex = 27; // C3 - Notes lower than this will not apply penalization on its harmonics when they are detected
  const suppressFactor = 0.7; // How much to suppress a harmonic, relative to the harmonic before it

  let energyFrame = [];
  let energyDerivFreq = []; // d(energies)/df
  let noteCandidates = [];

  let suppressedEnergies = []; // FIXME: Only used for visuals, delete

  const calculateEnergies = () => {
    energyFrame = frequencies.map((f) => audioMotion.getEnergy(f) * 500);

    if (energiesHistory.length >= energyFramesCount) {
      energiesHistory.shift();
    }
    energiesHistory.push(energyFrame);

    suppressedEnergies = Array(frequencies.length).fill(0);
    energyDerivFreq = []; // d(energies)/df
    for (let i = 0; i < energyFrame.length - 1; i++) {
      energyDerivFreq.push(energyFrame[i + 1] - energyFrame[i]); // Hack: Ignoring fact that derivative should divide by df (but df is variable here!)
    }

    noteCandidates = [];
    let localMaxFreqIndex = 0;
    let localMaxEnergy = -1;
    for (let i = 0; i < energyFrame.length - 1; i++) {
      const energy = energyFrame[i];

      // Must be above minimum thershold
      if (energy - suppressedEnergies[i] < energyThreshold) {
        continue;
      }

      // Record if a frequency is above the rising edge threshold
      if (energyDerivFreq[i] >= risingThreshold) {
        localMaxFreqIndex = i;
        localMaxEnergy = energy;
      }

      // Find the frequency with the highest energy for a group of freqs above the threshold
      if (localMaxEnergy > 0 && energy > localMaxEnergy) {
        localMaxFreqIndex = i;
        localMaxEnergy = energy;
      }

      // Store the highest energy freq for a group of freqs
      if (energyDerivFreq[i] <= fallingThreshold) {
        noteCandidates.push(localMaxFreqIndex);

        // Suppress harmonics FIXME: Belongs in separate function
        if (localMaxFreqIndex >= lowFreqIndex) {
          let currentSuppressFactor = suppressFactor;
          harmonicIndices(localMaxFreqIndex).forEach((harmonicIndex) => {
            const suppression = localMaxEnergy * currentSuppressFactor;
            suppressedEnergies[harmonicIndex] += suppression;
            currentSuppressFactor *= suppressFactor;
          });
        }
      }
    }

    /*
     TODO:
      Low weights on very low registers (except for bass drump)
        Song of Storms has A2 (110) at beginning, but it's easier to hear A3 (220)
      Search for "peaks". 3-4 notes wide are good
      The tallest harmonic isn't the same as the fundamental frequency
      Chords will be inevitable. You can probably choose highest note
      -50db is a good enough threshold to not get fund freq too low
        Will need to shave off bass - Song of Storms tends to peak at -30db
    */
  };

  const semitones = 12;
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Get the indices of the notes that are harmonics to the given frequency
  // Note - this excldues the frequency index itself
  const harmonicIndices = (freqIndex) => {
    let harmonics = [];
    for (let i = freqIndex + semitones; i < frequencies.length; i += semitones) {
      harmonics.push(i);
    }
    return harmonics;
  };

  const frequencyToNote = (freqIndex) => {
    freqIndex += 9;

    const octave = Math.floor(freqIndex / semitones);
    const note = noteNames[freqIndex % semitones];
    return `${note}${octave}`;
  };

  // Just for fun, delete
  const spinByEnergy = () => {
    audioMotion.spinSpeed = Math.pow(audioMotion.getEnergy() + 0.5, 2);
  };

  const drawNotes = (ctx, energyFrame, noteCandidates, energyDerivFreq) => {
    const scale = 20;

    ctx.fillStyle = "#88aaff";
    for (let i = 0; i < energyFrame.length; i++) {
      const height = energyFrame[i];

      if (noteCandidates.includes(i)) {
        ctx.fillStyle = "#ffffff";
        ctx.fillText(frequencyToNote(i), i * scale, window.innerHeight - 530);

        ctx.fillStyle = "#ffff77";
        ctx.fillRect(i * scale, window.innerHeight - 500, scale - 1, 500);

        ctx.fillStyle = "#88aaff";
      }

      ctx.fillRect(i * scale, window.innerHeight - height, scale - 1, height);
    }

    // ctx.fillStyle = "pink";
    // energyDerivFreq.forEach((height, i) => {
    //   ctx.fillRect(i * scale + scale / 2, window.innerHeight - height, scale - 1, height);
    // });
  };

  const onCanvasDraw = () => {
    calculateEnergies();

    const ctx = audioMotion.canvasCtx;
    ctx.textAlign = "start";
    ctx.font = "20px Georgia";

    const scale = 20;

    drawNotes(ctx, energyFrame, noteCandidates, energyDerivFreq);
    spinByEnergy(); // FIXME: Just for fun, delete
  };

  useEffect(() => {
    if (!audioRef.current || !audioCanvasRef.current) {
      return;
    }

    audioMotion = new AudioMotionAnalyzer(audioCanvasRef.current, {
      source: audioRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      // mode: 6,
      mode: 2,
      radial: true,
      spinSpeed: 0.2,
      // showScaleX: false,
      // showScaleY: true,
      onCanvasDraw,
    });
  }, [audioRef, audioCanvasRef]);

  return <div ref={audioCanvasRef} className="position-absolute w-100 h-100" />;
}

export default AudioVisualizer;
