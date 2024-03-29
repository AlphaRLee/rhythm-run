import React, { useEffect, useRef } from "react";

const useCanvas = (draw) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      draw && draw(ctx, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
      frameCount++;
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
};

export default useCanvas;
