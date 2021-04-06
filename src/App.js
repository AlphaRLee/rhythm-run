import React from "react";
import { TransitionGroup } from "react-transition-group";
import Canvas from "./Canvas";
import Game from "./game/Game";
import AudioVisualizer from "./audio/AudioVisualizer";
import LandingMenu from "./menu/LandingMenu";

function App() {
  const game = new Game({ width: window.innerWidth, height: window.innerHeight });

  const keysHeld = {};
  let lastKeyDown = null;

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
      <AudioVisualizer />
      <Canvas draw={draw} tabIndex={0} onKeyDown={onKeyDown} onKeyUp={onKeyUp} className="absolute-canvas" />
      <TransitionGroup transitionName="landing-menu" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
        <LandingMenu key={"landingMenu"} />
      </TransitionGroup>
    </>
  );
}

export default App;
