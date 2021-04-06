import React from "react";

function OverlayMenu(props) {
  const { fontFamily = "Comfortaa, cursive" } = props;

  const menuStyle = {
    backgroundColor: "#444444",
    opacity: 0.9,
  };

  return (
    <div className="position-absolute w-100 h-100 d-flex" style={menuStyle}>
      <div className="container my-auto d-flex justify-content-center">
        <div className="text-white" style={{ fontFamily }}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default OverlayMenu;
