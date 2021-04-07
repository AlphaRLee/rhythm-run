import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import playButtonImg from "~/assets/play_button.png";

// Audio controller for playing music and uploading files
function AudioUserController(props) {
  const { audioRef, onPlay } = props;

  const [fileLoaded, setFileLoaded] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [missingFileError, setMissingFileError] = useState(null);

  const handleOnPlay = () => {
    if (!fileLoaded) {
      setMissingFileError("Please upload a song");
      return;
    }

    onPlay();
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const src = URL.createObjectURL(file);
      audioRef.current.src = src;
      setFileLoaded(true);
      setFileName(file.name);
      setMissingFileError(null);
    },
    [audioRef]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="row">
      <div className="col-m-6 col-lg-9 align-items-center d-flex">
        <div className="d-block">
          <div {...getRootProps()}>
            <button className="btn btn-outline-light ms-3 mb-2">
              <input className="song-input" {...getInputProps()} accept="audio/*" />
              {isDragActive ? "Drag file here" : "Upload song"}
            </button>
          </div>
          <br />
          <span className="mt-0">
            {missingFileError ? (
              <span className="text-danger" style={{ opacity: 1 }}>
                {missingFileError}
              </span>
            ) : (
              fileName || <>&nbsp;</>
            )}
          </span>
        </div>
      </div>
      <div className="col-m-6 col-lg-3 align-items-center d-flex">
        <img src={playButtonImg} className="play-button img-fluid" onClick={handleOnPlay} />
      </div>
    </div>
  );
}

export default AudioUserController;
