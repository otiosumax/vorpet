import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "./components/header";
import "../styles/index.css";
import "../styles/popup.css";
import Pet from "./components/pet";
import Statistics from "./components/statistics";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <div id="wrapper">
      <Pet />
    </div>
    <Statistics />
    <h3 id="footer">
      Keep your vorpet{" "}
      <span style={{ color: "var(--primary-color)" }}>ALIVE!</span>
    </h3>
  </StrictMode>,
);
