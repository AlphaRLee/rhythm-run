import React, { useEffect, useRef } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";

function AudioVisualizer(props) {
  const { audioRef } = props;

  const audioCanvasRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!audioRef) {
      return;
    }
  }, [audioRef]);

  return <div ref={audioCanvasRef} className="absolute-canvas" />;
}

export default AudioVisualizer;
