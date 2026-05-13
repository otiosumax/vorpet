import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "../components/header";
import '../styles/index.css'
import "../styles/popup.css";
import Pet from "../components/pet";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <div id="wrapper">
      <Pet />
    </div>
  </StrictMode>,
);
