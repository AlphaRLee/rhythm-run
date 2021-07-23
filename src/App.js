import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Canvas from "./Canvas";
import Game from "./game/Game";
import SongAnalyzer from "./audio/SongAnalyzer";
import LandingMenu from "./menu/LandingMenu";
import AudioVisualizer from "./audio/AudioVisualizer";

function App() {
  const [isMenuOpen, setMenuOpen] = useState(true);
  const audioRef = useRef(null);
  const notesRef = useRef([]);

  const gameRef = useRef(new Game({ width: window.innerWidth, height: window.innerHeight }));
  const game = gameRef.current;

  const keysHeld = {};
  let lastKeyDown = null;

  const onStartPlay = () => {
    setMenuOpen(false);
  };

  const onPlay = () => {
    audioRef.current.play();
    game.isRunning = true;
    // FIXME: Focus on the canvas again with canvasRef.current.focus()
  };

  const onAudioEnd = () => {
    setMenuOpen(true);
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
    game.update(frameCount, keysHeld, notesRef.current);
    game.draw(ctx, frameCount);
  };

  // MUTUALLY EXCLUSIVE WITH renderMenuWithoutTransition
  const renderMenuWithTransition = () => (
    <CSSTransition in={isMenuOpen} unmountOnExit classNames="menu" timeout={300} onExited={onPlay}>
      <LandingMenu key={"landingMenu"} audioRef={audioRef} onPlay={onStartPlay} />
    </CSSTransition>
  );

  // MUTUALLY EXCLUSIVE WITH renderMenuWithTransition
  // Using this one as temp for now because transitions seem broken
  const renderMenuWithoutTransition = () =>
    isMenuOpen && (
      <LandingMenu
        audioRef={audioRef}
        onPlay={() => {
          onStartPlay();
          onPlay();
        }}
      />
    );

  return (
    <div>
      <AudioVisualizer audioRef={audioRef} setNotes={(notes) => (notesRef.current = notes)} />
      {/* FIXME: Restore canvas */}
      {/* <Canvas draw={draw} tabIndex={0} onKeyDown={onKeyDown} onKeyUp={onKeyUp} className="absolute-canvas" /> */}

      <div className="position-absolute" style={{ right: 10, top: 10 }}>
        <audio ref={audioRef} onEnded={onAudioEnd} controls />
      </div>

      {/* renderMenuWithTransition() */}
      {renderMenuWithoutTransition()}
    </div>
  );
}

export default App;
