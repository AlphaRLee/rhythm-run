import React, { useEffect, useRef, useState } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import SpectrumAnalyzer from "./SpectrumAnalyzer"; // TODO: Delete, used for temp analysis only
import { frequencies, harmonicIndices, frequencyToNote } from "./util/frequencyUtils";
import SongAnalyzer from "./SongAnalyzer";

function AudioVisualizer(props) {
  const { audioRef, setNotes } = props;

  const audioCanvasRef = useRef(null);
  const [songAnalyzer, setSongAnalyzer] = useState();

  // FIXME: Temp state variables for calibration --------------
  const [risingThresholdIn, setRisingThresholdIn] = useState(110);
  const [showCandidateNotes, setShowCandidateNotes] = useState(true);
  // ----------------------------------------------------------

  useEffect(() => {
    if (!audioRef.current || !audioCanvasRef.current) {
      return;
    }

    setSongAnalyzer(new SongAnalyzer(audioCanvasRef.current, audioRef.current));
  }, [audioRef, audioCanvasRef]);

  // return <div ref={audioCanvasRef} className="position-absolute w-100 h-100" />; // FIXME: Restore - empty canvas

  // FIXME: Delete - canvas with controls
  // TEMP - State updates for form controls
  const onRisingInputChange = (event) => {
    event.preventDefault();
    setRisingThresholdIn(event.target.value);
  };
  const onShowCandidateNotesChange = (event) => {
    setShowCandidateNotes(event.target.checked);
  };

  // TEMP - Use external controls to calibrate songAnalyzer
  useEffect(() => {
    if (!audioRef.current || !songAnalyzer) return;

    songAnalyzer.risingThreshold = risingThresholdIn;
    songAnalyzer.showCandidateNotes = showCandidateNotes;
  }, [risingThresholdIn, audioRef, showCandidateNotes]);

  const tempDisplay = () => {
    return (
      <>
        <div ref={audioCanvasRef} className="position-absolute w-100 h-100" />
        {/* <SpectrumAnalyzer audioRef={audioRef} audioMotion={songAnalyzer?.audioMotion} /> */}
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
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="show-yellow"
              checked={showCandidateNotes}
              onChange={onShowCandidateNotesChange}
            />
            <label htmlFor="show-yellow" className="form-check-label text-white">
              Show yellow
            </label>
          </div>
        </div>
      </>
    );
  };

  return tempDisplay();
}

export default AudioVisualizer;
