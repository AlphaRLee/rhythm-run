import React, { useEffect, useRef, useState } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import SpectrumAnalyzer from "./SpectrumAnalyzer"; // TODO: Delete, used for temp analysis only

function AudioVisualizer(props) {
  const { audioRef, setNotes } = props;

  const audioCanvasRef = useRef(null);
  const timerRef = useRef(0);
  let timer = timerRef.current;
  const audioMotionRef = useRef(null);

  // FIXME: Temp state variables for calibration --------------
  const [risingThresholdIn, setRisingThresholdIn] = useState(110);
  const [audioMotion, setAudioMotion] = useState(null); // Hacky workaround - stateful reference to a ref, should experiment with getting rid of the ref in between
  // ----------------------------------------------------------

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

  const semitones = 12;
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Exponential equation to convert from index i to the corresponding frequency
  // Scale (s) and rate (r) used in exponential equation f(i) = s * r^i
  // Numbers created by entering frequencies into a regression model. Rate is roughly 2^(1/12)
  const indexToFreqScale = 27.5007742362;
  const indexToFreqRate = 1.05946289375;

  const energyThreshold = 50; // FIXME: This is -50db, energy will be a totally different unit. More accurate method would be X db above the bass (roughly 50-60 db)
  // const risingThreshold = 100; // FIXME: Needs calibration, RESTORE
  const fallingThreshold = 40; // FIXME: Needs calibration
  const lowFreqIndex = 27; // C3 - Notes lower than this will not apply penalization on its harmonics when they are detected
  const suppressFactor = 0.9; // How much to suppress a harmonic, relative to the harmonic before it

  let energyFrame = [];
  let energyDerivFreq = []; // d(energies)/df
  let noteCandidates = [];

  let suppressedEnergies = []; // FIXME: Only used for visuals, delete

  const maxHistoryLength = 40; // Max length of any note
  const risingDurationThreshold = 3; // Number of frames a note must be present before considered actively held
  const fallingDurationThreshold = 3; // Number of frames a note must be absent before being considered released
  let risingNoteTimes = Array(frequencies.length).fill([]); // Timestamps when notes have been added
  let fallingNoteTimes = Array(frequencies.length).fill([]); // Timestamps when notes have been removed

  const calculateEnergies = () => {
    energyFrame = frequencies.map((f) => audioMotionRef.current.getEnergy(f) * 500);

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
      // if (energyDerivFreq[i] >= risingThreshold) { // FIXME: Restore
      // FIXME: delete if conditional
      if (energyDerivFreq[i] >= risingThresholdIn) {
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

    setNotes(noteCandidates);
  };

  /**
   * Get the indices of the notes that are harmonics to the given frequency
   * Note - this excldues the frequency index itself
   * @param {Number} freqIndex The index representing the given frequency. E.g. 48 represents 440Hz
   * @returns Array of indices for harmonics
   */
  const harmonicIndices = (freqIndex) => {
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
  const frequencyToNote = (freqIndex) => {
    freqIndex += 9; // Accomodtte 1-based index for notes

    const octave = Math.floor(freqIndex / semitones);
    const note = noteNames[freqIndex % semitones];
    return `${note}${octave}`;
  };

  // Just for fun, spin the audioMotion visualizer
  const spinByEnergy = () => {
    audioMotionRef.current.spinSpeed = Math.pow(audioMotionRef.current.getEnergy() + 0.5, 2);
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
  };

  const onCanvasDraw = () => {
    if (!audioMotionRef.current) return;

    calculateEnergies();

    const ctx = audioMotionRef.current.canvasCtx;
    ctx.textAlign = "start";
    ctx.font = "18px Comfortaa";

    const scale = 20;

    drawNotes(ctx, energyFrame, noteCandidates, energyDerivFreq);
    spinByEnergy();
    timerRef.current++;
  };

  useEffect(() => {
    if (!audioRef.current || !audioCanvasRef.current) {
      return;
    }

    console.log("!!! audioRef", audioRef.current, "audioCanvasRef", audioCanvasRef.current);
    audioMotionRef.current = new AudioMotionAnalyzer(audioCanvasRef.current, {
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
    setAudioMotion(audioMotionRef.current); // FIXME: Hacky debugging, delete if unused
  }, [audioRef, audioCanvasRef]);

  // return <div ref={audioCanvasRef} className="position-absolute w-100 h-100" />; // FIXME: Restore - empty canvas

  // FIXME: Delete - canvas with controls
  const onRisingInputChange = (event) => {
    event.preventDefault();
    setRisingThresholdIn(event.target.value);
  };

  useEffect(() => {
    if (!audioRef.current || !audioMotionRef.current) return;
    audioMotionRef.current.onCanvasDraw = onCanvasDraw;
  }, [risingThresholdIn, audioRef]);

  const tempDisplay = () => {
    return (
      <>
        <div ref={audioCanvasRef} className="position-absolute w-100 h-100" />
        <SpectrumAnalyzer audioRef={audioRef} audioMotion={audioMotion} />
        <div className="position-absolute">
          <div className="form-group row">
            <label htmlFor="input1" className="text-white col-3">
              Input 1
            </label>
            <div className="col-9">
              <input
                type="number"
                className="form-control"
                id="input1"
                value={risingThresholdIn}
                onChange={onRisingInputChange}
              />
              <input
                type="range"
                className="form-range"
                id="customRange1"
                value={risingThresholdIn}
                min={50}
                max={200}
                onChange={onRisingInputChange}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return tempDisplay();
}

export default AudioVisualizer;
