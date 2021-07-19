// UTILITY COMPONENT - intended to view spectrum of song for debugging purposes. Delete when done

import React, { useRef, useEffect } from "react";
import Canvas from "../Canvas";

function SpectrumAnalyzer(props) {
  const { audioRef, audioMotion } = props;
  const audioElement = audioRef.current;

  const isAudioPlayingRef = useRef(true);
  const avgEnergyHistory = useRef([]);

  const storeAvgEnergy = () => {
    if (audioMotion) avgEnergyHistory.current.push(audioMotion.getEnergy());
  };

  const dumpAvgEnergy = () => {
    console.log(avgEnergyHistory.current.join("\n"));
    avgEnergyHistory.current = [];
  };

  const draw = (ctx, frameCount) => {
    // TODO: draw some visuals here
    if (isAudioPlayingRef.current) storeAvgEnergy();
  };

  useEffect(() => {
    console.log("!!! Spectrum Analyzer audioRef", audioRef.current, audioMotion);
    if (!audioRef.current || !audioMotion) return;

    console.log("!!! REGISTERING AUDIO EVENTS -------------------------------------");
    audioRef.current.onplay = () => (isAudioPlayingRef.current = true);
    audioRef.current.onpause = () => {
      console.log("!!! AUDIO PAUSED");
      dumpAvgEnergy();
      isAudioPlayingRef.current = false;
    };
  }, [audioRef, audioMotion]);

  return <Canvas draw={draw} width={100} height={54} />;
}

export default SpectrumAnalyzer;
