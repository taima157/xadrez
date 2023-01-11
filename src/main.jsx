import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ChessProvider } from "./context/chess";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChessProvider>
      <App />
    </ChessProvider>
  </React.StrictMode>
);
