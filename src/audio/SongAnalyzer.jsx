import React from "react";
import AudioVisualizer from "./AudioVisualizer";

function SongAnalyzer(props) {
  const { audioRef, setNotes } = props;

  /*
    TODO: SongAnalyzer sequence
    Extract audio from AudioVisualizer
    Frequency energy --- NoteAnalyzer --> Notes
    Notes --- PatternAnalyzer --> Patterns
    Patterns output for consumption into platforms
  */

  return <AudioVisualizer audioRef={audioRef} setNotes={setNotes} />;
}

export default SongAnalyzer;
