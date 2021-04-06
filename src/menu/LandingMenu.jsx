import React from "react";
import AudioController from "../audio/AudioController";

function LandingMenu(props) {
  const menuStyle = {
    backgroundColor: "#444444",
    opacity: 0.9,
  };

  return (
    <div className="position-absolute w-100 h-100 d-flex" style={menuStyle}>
      <div className="container my-auto">
        <div className="row d-flex text-white mb-5" style={{ fontFamily: "Comfortaa, cursive" }}>
          <h1 className="display-1 mx-auto">Rhythm Run</h1>
          <p>A platformer built to the beat</p>
          <p>
            By Richard Lee&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="https://github.com/AlphaRLee" className="link-light">
              <i className="fa fa-github fa-lg"></i>
            </a>
          </p>
        </div>
        <AudioController />
      </div>
    </div>
  );
}

export default LandingMenu;
