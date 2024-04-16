import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import Location from "./Components/Location";
import Logo from "./Components/Logo";
import ClaimForm from "./Components/Popups/ClaimForm";
import Confirmation from "./Components/Popups/Confirmation";
import SpinWheel from "./Components/Popups/SpinWheel";
import { getCookie } from "./functions/cookie";

function App() {
  const [popup, setPopup] = useState({ display: false, type: "spinWheel" });

  const screen = getCookie("screen");

  useEffect(() => {
    switch (screen) {
      case "spinWheel":
        setPopup({ display: true, type: "spinWheel" });
        break;
      case "claimForm":
        setPopup({ display: true, type: "claimForm" });
        break;
      case "confirmation":
        setPopup({ display: true, type: "confirmation" });
        break;
      default:
        setPopup({ display: false, type: "spinWheel" });
        break;
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [popup]);

  return (
    <div className="main-container" id="main_container">
      <Logo />
      {popup.display === false ? <Location updatePopup={setPopup} /> : ""}

      {popup.display === true && popup.type === "spinWheel" ? (
        <SpinWheel updatePopup={setPopup} />
      ) : (
        ""
      )}

      {popup.display === true && popup.type === "claimForm" ? (
        <ClaimForm updatePopup={setPopup} />
      ) : (
        ""
      )}

      {popup.display === true && popup.type === "confirmation" ? (
        <Confirmation />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
