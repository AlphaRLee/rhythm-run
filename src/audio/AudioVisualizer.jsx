import React, { useEffect, useRef, useState } from "react";
import SongAnalyzer from "./SongAnalyzer";

function AudioVisualizer(props) {
  const { audioRef, songAnalyzerRef, setBarData } = props;

  const audioCanvasRef = useRef(null);
  const songAnalyzer = songAnalyzerRef.current;

  // FIXME: Temp state variables for calibration --------------
  const [input1, setInput1] = useState(0.1);
  const [input2, setInput2] = useState(0.1);
  // ----------------------------------------------------------

  useEffect(() => {
    if (!audioRef.current || !audioCanvasRef.current) {
      return;
    }

    songAnalyzerRef.current = new SongAnalyzer(audioCanvasRef.current, audioRef.current, setBarData);
  }, [audioRef, audioCanvasRef]);

  // return <div ref={audioCanvasRef} className="position-absolute w-100 h-100" />; // FIXME: Restore - empty canvas

  // FIXME: Delete - canvas with controls
  // TEMP - State updates for form controls
  const onInput1Change = (event) => {
    // event.preventDefault();
    setInput1(event.target.value);
  };
  const onInput2Change = (event) => {
    setInput2(event.target.value);
  };

  // TEMP - Use external controls to calibrate songAnalyzer
  useEffect(() => {
    if (!audioRef.current || !songAnalyzer) return;

    // songAnalyzer.durationAnalyzer.minEnergyThreshold = input1;
    // songAnalyzer.durationAnalyzer.sustainThreshold = input2;
  }, [input1, input2, audioRef]);

  const tempDisplay = () => {
    return (
      <div className="position-absolute w-100 h-100">
        <canvas ref={audioCanvasRef} width={window.innerWidth} height={window.innerHeight} />
      </div>
    );
  };

  return tempDisplay();
}

export default AudioVisualizer;
