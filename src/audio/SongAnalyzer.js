import AudioMotionAnalyzer from "audiomotion-analyzer";
import ChordAnalyzer from "./noteAnalyzer/ChordAnalyzer";
import DurationAnalyzer from "./noteAnalyzer/DurationAnalyzer";
import TempoAnalyzer from "./noteAnalyzer/TempoAnalyzer";
import BarBuilder from "./noteAnalyzer/BarBuilder";
import { frequencies, harmonicIndices, frequencyToNote } from "./util/frequencyUtils";

export default class SongAnalyzer {
  constructor(canvas, audioSource) {
    this.audioSource = audioSource;
    this.audioMotion = new AudioMotionAnalyzer(null, {
      source: audioSource,
      useCanvas: false,
      // width: window.innerWidth,
      // height: window.innerHeight,
      // mode: 2,
      // radial: true,
      // spinSpeed: 0.2,
      onCanvasDraw: this.update.bind(this), // Bind this explicitly to SongAnalyzer
    });

    this.canvas = canvas;
    this.canvasCtx = this.canvas.getContext("2d");

    this.timer = 0;

    // Analyzers
    this.tempoAnalyzer = new TempoAnalyzer();
    this.chordAnalyzer = new ChordAnalyzer();
    this.durationAnalyzer = new DurationAnalyzer();
    this.barBuilder = new BarBuilder();

    // FIXME: utility tools, delete --------------------
    this.energyThreshold = 50;
    this.showCandidateNotes = false;
    this.risingThreshold = 100;
    this.fallingThreshold = 40;
    this.lowFreqIndex = 27; // C3 - Notes lower than this will not apply penalization on its harmonics when they are detected
    this.suppressFactor = 0.9; // How much to suppress a harmonic, relative to the harmonic before it

    this.energyFrame = [];
    this.energyDerivFreq = [];
    // -------------------------------------------------
  }

  update() {
    this.background();

    if (this.audioSource.paused) return;

    let energies = this.calculateEnergies();
    const diffEnergies = this.subtractAverageEnergy(energies, true);
    // energies = diffEnergies;
    const noteCandidates = this.calculateNoteCandidates(energies);

    this.tempoAnalyzer.update(this.audioMotion.getEnergy(), this.timer);

    this.chordAnalyzer.update(energies, this.timer);
    const risingNotes = this.chordAnalyzer.output();

    this.durationAnalyzer.update(risingNotes, this.timer);

    this.drawNotes(this.canvasCtx, this.energyFrame, noteCandidates, this.energyDerivFreq);
    this.drawDebug(this.canvasCtx, this.durationAnalyzer.debug); // FIXME: delete
    this.drawTimeDebug(
      this.canvasCtx,
      this.tempoAnalyzer.midBeatHistory.map((b) => ({ value: b.energy, time: b.endTime })),
      this.timer
    );
    this.timer++;
  }

  background() {
    this.canvasCtx.fillStyle = "#000000";
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  calculateEnergies() {
    return frequencies.map((f) => this.audioMotion.getEnergy(f));
  }

  subtractAverageEnergy(energies, floorZero = false) {
    const averageEnergy = this.audioMotion.getEnergy();
    return energies.map((n) => {
      const diff = n - averageEnergy;
      return floorZero && diff < 0 ? 0 : diff;
    });
  }

  // TODO: Review if this is useful anymore, else just delete
  calculateNoteCandidates(energies) {
    this.energyFrame = energies.map((n) => n * 500);
    let { energyFrame, energyDerivFreq } = this;

    let suppressedEnergies = Array(frequencies.length).fill(0);
    energyDerivFreq = []; // d(energies)/df
    for (let i = 0; i < energyFrame.length - 1; i++) {
      energyDerivFreq.push(energyFrame[i + 1] - energyFrame[i]); // Hack: Ignoring fact that derivative should divide by df (but df is variable here!)
    }

    let noteCandidates = [];
    let localMaxFreqIndex = 0;
    let localMaxEnergy = -1;
    for (let i = 0; i < energyFrame.length - 1; i++) {
      const energy = energyFrame[i];

      // Must be above minimum thershold
      if (energy - suppressedEnergies[i] < this.energyThreshold) {
        continue;
      }

      // Record if a frequency is above the rising edge threshold
      // FIXME: delete if conditional
      if (energyDerivFreq[i] >= this.risingThreshold) {
        localMaxFreqIndex = i;
        localMaxEnergy = energy;
      }

      // Find the frequency with the highest energy for a group of freqs above the threshold
      if (localMaxEnergy > 0 && energy > localMaxEnergy) {
        localMaxFreqIndex = i;
        localMaxEnergy = energy;
      }

      // Store the highest energy freq for a group of freqs
      if (energyDerivFreq[i] <= this.fallingThreshold) {
        noteCandidates.push(localMaxFreqIndex);

        // Suppress harmonics FIXME: Belongs in separate function
        if (localMaxFreqIndex >= this.lowFreqIndex) {
          let currentSuppressFactor = this.suppressFactor;
          harmonicIndices(localMaxFreqIndex).forEach((harmonicIndex) => {
            const suppression = localMaxEnergy * currentSuppressFactor;
            suppressedEnergies[harmonicIndex] += suppression;
            currentSuppressFactor *= this.suppressFactor;
          });
        }
      }
    }

    return noteCandidates;
  }

  // Just for fun, spin the audioMotion visualizer. Currently unused
  spinByEnergy() {
    this.audioMotion.spinSpeed = Math.pow(this.audioMotion.getEnergy() + 0.5, 2);
  }

  drawNotes(ctx, energyFrame, noteCandidates, energyDerivFreq) {
    ctx.textAlign = "start";
    ctx.font = "18px Comfortaa";

    const scale = 20;

    ctx.fillStyle = "#88aaff";
    for (let i = 0; i < energyFrame.length; i++) {
      const height = energyFrame[i];

      if (noteCandidates.includes(i)) {
        this.drawCandidateNote(ctx, i, scale);

        ctx.fillStyle = "#88aaff";
      }

      ctx.fillRect(i * scale, window.innerHeight - height, scale - 1, height);
    }
  }

  drawCandidateNote(ctx, i, scale) {
    if (!this.showCandidateNotes) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillText(frequencyToNote(i), i * scale, window.innerHeight - 530);

    ctx.fillStyle = "#ffff77";
    ctx.fillRect(i * scale, window.innerHeight - 500, scale - 1, 500);
  }

  // FIXME: Temp function for drawing debug info, delete when done
  drawDebug(ctx, debugEntries) {
    const xScale = 20;
    const yScale = 500;
    ctx.fillStyle = "#ffff88";
    for (let i = 0; i < debugEntries.length; i++) {
      const height = debugEntries[i] * yScale;
      ctx.fillRect(i * xScale, window.innerHeight - height, xScale - 1, height);
    }
  }

  // FIXME: Temp function for debug info in the time axis, delete when done
  drawTimeDebug(ctx, debugEntries, time) {
    const timeWindow = 300;
    const visibleEntries = debugEntries
      .filter((e) => e.time > time - timeWindow)
      .map((e) => ({ ...e, visibleTime: e.time - (time - timeWindow) }));

    const xOffset = 100;
    const xScale = 1.5;
    const yScale = 250;
    ctx.fillStyle = "#ffff88";
    visibleEntries.forEach((e) => {
      const height = e.value * yScale;
      ctx.fillRect(e.visibleTime * xScale + xOffset, window.innerHeight / 4 - height, 2, height);
    });

    ctx.fillStyle = "#ffffff";
    ctx.font = "10px Comfortaa";
    for (let i = (Math.floor((time - timeWindow) / 50) + 1) * 50; i < time; i += 50) {
      const x = i - (time - timeWindow);
      ctx.fillText(i, x * xScale + xOffset, window.innerHeight / 4 + 7);
    }
  }
}
