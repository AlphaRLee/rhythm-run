import React, { useEffect, useRef } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";

function AudioVisualizer(props) {
  const { sourceElement } = props;

  const audioCanvasRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {}, [sourceElement]);

  return <div ref={audioCanvasRef} className="absolute-canvas" />;
}

export default AudioVisualizer;
