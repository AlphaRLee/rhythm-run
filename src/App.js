import React from "react";
import Canvas from "./Canvas";

function App() {
  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    const radius = Math.max(Math.floor(20 * Math.sin(frameCount * 0.05) + 10), 0);
    ctx.arc(50, 100, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  return <Canvas draw={draw} />;
}

export default App;
