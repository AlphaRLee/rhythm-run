import React, { useEffect, useRef } from "react";
import useCanvas from "./useCanvas";

function Canvas(props) {
  const { draw = null, ...rest } = props;
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} {...rest} />;
}

export default Canvas;
