import React from "react";

// Audio controller for playing music and uploading files
function AudioController(props) {
  return (
    <div>
      <audio controls />
      <button className="btn btn-outline-primary">
        <label>
          <input type="file" accept="audio/*" />
        </label>
      </button>
    </div>
  );
}

export default AudioController;
