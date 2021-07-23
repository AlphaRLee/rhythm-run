import React, { useEffect, useRef, useState } from "react";
import SpectrumAnalyzer from "./SpectrumAnalyzer"; // TODO: Delete, used for temp analysis only
import SongAnalyzer from "./SongAnalyzer";

function AudioVisualizer(props) {
  const { audioRef, setBarData } = props;

  const audioCanvasRef = useRef(null);
  const [songAnalyzer, setSongAnalyzer] = useState();

  // FIXME: Temp state variables for calibration --------------
  const [input1, setInput1] = useState(0.1);
  const [input2, setInput2] = useState(0.1);
  // ----------------------------------------------------------

  useEffect(() => {
    if (!audioRef.current || !audioCanvasRef.current) {
      return;
    }

    setSongAnalyzer(new SongAnalyzer(audioCanvasRef.current, audioRef.current, setBarData));
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
      <>
        <div className="position-absolute w-100 h-100">
          <canvas ref={audioCanvasRef} width={window.innerWidth} height={window.innerHeight} />
        </div>
        {/* <SpectrumAnalyzer audioRef={audioRef} audioMotion={songAnalyzer?.audioMotion} /> */}
        <div className="position-absolute">
          <div className="form-group row">
            <label htmlFor="input1" className="text-white col-3">
              Input 1
            </label>
            <div className="col-9">
              <input type="number" className="form-control" id="input1" value={input1} onChange={onInput1Change} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="input2" className="text-white col-3">
              Input 2
            </label>
            <div className="col-9">
              <input type="number" className="form-control" id="input2" value={input2} onChange={onInput2Change} />
            </div>
          </div>
        </div>
      </>
    );
  };

  return tempDisplay();
}

export default AudioVisualizer;
