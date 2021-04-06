import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Canvas from "./Canvas";
import Game from "./game/Game";
import AudioVisualizer from "./audio/AudioVisualizer";
import LandingMenu from "./menu/LandingMenu";

function App() {
  const [isMenuOpen, setMenuOpen] = useState(true);
  const audioRef = useRef(null);

  const game = new Game({ width: window.innerWidth, height: window.innerHeight });

  const keysHeld = {};
  let lastKeyDown = null;

  const onStartPlay = () => {
    setMenuOpen(false);
  };

  const onPlay = () => {
    audioRef.current.play();
  };

  const onKeyDown = (event) => {
    const key = event.key;
    keysHeld[key] = true;

    // Send the key event for the first time the key is pressed
    if (key != lastKeyDown) {
      game.onKeyDown(key);
    }
    lastKeyDown = key;
  };

  const onKeyUp = (event) => {
    const key = event.key;
    keysHeld[event.key] = false;

    if (key == lastKeyDown) {
      lastKeyDown = null; // Clear last key down after key is released
    }
  };

  const updateScreenSize = (ctx) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    game.width = width;
    game.height = height;

    return { width, height };
  };

  const draw = (ctx, frameCount) => {
    const { width, height } = updateScreenSize(ctx);

    game.update(frameCount, keysHeld);
    game.draw(ctx, frameCount);
  };

  return (
    <>
      <audio ref={audioRef} />
      <AudioVisualizer audioRef={audioRef} />
      <Canvas draw={draw} tabIndex={0} onKeyDown={onKeyDown} onKeyUp={onKeyUp} className="absolute-canvas" />
      <CSSTransition
        in={isMenuOpen}
        unmountOnExit
        classNames="menu"
        timeout={300}
        onEnter={() => console.log("huh")}
        onExited={onPlay}
      >
        <LandingMenu key={"landingMenu"} audioRef={audioRef} onPlay={onStartPlay} />
      </CSSTransition>
    </>
  );
}

export default App;
