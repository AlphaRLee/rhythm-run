import AudioMotionAnalyzer from "audiomotion-analyzer";
import ChordAnalyzer from "./noteAnalyzer/ChordAnalyzer";
import DurationAnalyzer from "./noteAnalyzer/DurationAnalyzer";
import TempoAnalyzer from "./noteAnalyzer/TempoAnalyzer";
import BarBuilder from "./noteAnalyzer/BarBuilder";
import HistoryQueue from "./util/HistoryQueue";
import { frequencies, harmonicIndices, frequencyToNote } from "./util/frequencyUtils";

export default class SongAnalyzer {
  constructor(canvas, audioSource, sendOutput) {
    this.delayTime = 1.5;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const aduioSourceNode = audioCtx.createMediaElementSource(audioSource);
    const delayNode = audioCtx.createDelay(5);
    delayNode.delayTime.value = this.delayTime;

    this.audioSource = audioSource;
    this.audioMotion = new AudioMotionAnalyzer(null, {
      source: aduioSourceNode,
      useCanvas: false,
      connectSpeakers: false,
      onCanvasDraw: this.update.bind(this), // Bind this explicitly to SongAnalyzer
    });

    this.audioMotion.connectOutput(delayNode);
    delayNode.connect(audioCtx.destination);

    this.canvas = canvas;
    this.canvasCtx = this.canvas.getContext("2d");

    this.timer = 0;

    // Analyzers
    this.tempoAnalyzer = new TempoAnalyzer();
    this.chordAnalyzer = new ChordAnalyzer();
    this.durationAnalyzer = new DurationAnalyzer();
    this.barBuilder = new BarBuilder();

    // Output
    this.sendOutput = sendOutput;
    this.barData = null; // Last bar

    // Drawing output
    this.delayDrawBuffer = new HistoryQueue({ maxLength: 200 });

    // FIXME: utility tools, delete --------------------
    this.showCandidateNotes = false;
    // -------------------------------------------------
  }

  update() {
    this.background();

    if (this.audioSource.paused) return;

    let energies = this.calculateEnergies();

    this.tempoAnalyzer.update(this.audioMotion.getEnergy(), this.timer);
    const beatsData = this.tempoAnalyzer.outputBeats();

    this.chordAnalyzer.update(energies, this.timer);
    const risingNotes = this.chordAnalyzer.output();

    this.durationAnalyzer.update(risingNotes, this.timer);

    this.barBuilder.update(risingNotes, beatsData, this.timer);
    this.barData = this.barBuilder.outputBar(); // Output the bar
    if (this.barData) {
      this.sendOutput(this.barData);
    }

    this.draw(energies);
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

  draw(newEnergies) {
    this.delayDrawBuffer.add({
      energies: newEnergies,
      debug: this.durationAnalyzer.debug,
      timeDebug: this.tempoAnalyzer.midBeatHistory.map((b) => ({ value: b.energy, time: b.endTime })),
    });

    // Approx 60 calls per second
    const secondsToFrames = 1 * 60;
    if (this.delayDrawBuffer.length < this.delayTime * secondsToFrames + 1) return;

    const { energies, debug, timeDebug } = this.delayDrawBuffer.last(this.delayTime * secondsToFrames);

    this.drawNotes(this.canvasCtx, energies);
    this.drawDebug(this.canvasCtx, debug); // FIXME: delete
    this.drawTimeDebug(this.canvasCtx, timeDebug, this.timer);
  }

  // Just for fun, spin the audioMotion visualizer. Currently unused
  spinByEnergy() {
    this.audioMotion.spinSpeed = Math.pow(this.audioMotion.getEnergy() + 0.5, 2);
  }

  drawNotes(ctx, energyFrame) {
    ctx.textAlign = "start";
    ctx.font = "18px Comfortaa";

    const scale = 20;
    const yScale = 500;

    ctx.fillStyle = "#88aaff";
    for (let i = 0; i < energyFrame.length; i++) {
      const height = energyFrame[i] * yScale;

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
    const timeWindow = 200;
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

    ctx.fillStyle = "#ffffff";
    for (let i = 0; i <= 0.5; i += 0.1) {
      ctx.fillRect(xOffset - 5, window.innerHeight / 4 - i * yScale, 5, 2);
    }
  }
}
