import React, { useEffect, useRef } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";

function AudioVisualizer(props) {
  const { audioRef } = props;

  const audioCanvasRef = useRef(null);
  let audioMotion = null;

  let energiesHistory = [];
  const energyFramesCount = 20;

  const onCanvasDraw = () => {
    const frequencies = {
      kickDrum: 114,
      snare: 218,
    };
    audioMotion.getEnergy();
  };

  useEffect(() => {
    if (!audioRef.current || !audioCanvasRef.current) {
      return;
    }

    audioMotion = new AudioMotionAnalyzer(audioCanvasRef.current, {
      source: audioRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      mode: 6,
      radial: true,
      spinSpeed: 0.2,
      showScaleX: false,
      // onCanvasDraw,
    });
  }, [audioRef, audioCanvasRef]);

  return <div ref={audioCanvasRef} className="position-absolute w-100 h-100" />;
}

export default AudioVisualizer;
