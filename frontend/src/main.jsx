import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { exposeEval } from "./utils/eval";

exposeEval(); // 👈 REQUIRED

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
