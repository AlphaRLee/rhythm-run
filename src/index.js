import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "regenerator-runtime/runtime.js"; // Global import for async/await keywords
import css from "./assets/style.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
