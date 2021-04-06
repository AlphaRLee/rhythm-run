import React from "react";
import AudioUserController from "../audio/AudioUserController";
import OverlayMenu from "./OverlayMenu";

function LandingMenu(props) {
  const { audioRef, onPlay } = props;

  const menuStyle = {
    backgroundColor: "#444444",
    opacity: 0.9,
  };

  return (
    <OverlayMenu>
      <div className="mb-5">
        <h1 className="display-1">Rhythm Run</h1>
        <p>
          A platformer built to the beat
          <br />
          By Richard Lee&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://github.com/AlphaRLee/rhythm-run" target="_blank" className="link-light">
            <i className="fa fa-github fa-lg"></i>
          </a>
        </p>
      </div>
      {audioRef && <AudioUserController audioRef={audioRef} onPlay={onPlay} />}
    </OverlayMenu>
  );
}

export default LandingMenu;
