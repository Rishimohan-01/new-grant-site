import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Helmet from "react-helmet";
import Winwheel from "winwheel/lib/Winwheel";
import wheelImage from "../../assets/images/wheel.png";
import wheelImageMobile from "../../assets/images/wheel-mobile-19.png";
import wheelCenter from "../../assets/images/wheel-center.png";
import prizePointer from "../../assets/images/prize-pointer-4.png";
import { deleteCookie, getCookie, setCookie } from "../../functions/cookie";

const ResultContent = (props) => {
  const [content, setContent] = useState("");
  const result = props.result;
  switch (result) {
    case "goodie":
      setContent("Grant's Merchandise");
      break;
    case "two_plus_one":
      setContent("Crewtime Special 2+1");
      break;
    default:
      setContent("Try again");
      break;
  }
  return (
    <div className="spin-wheel-result">
      {result !== "try_again" ? <p>You've Won</p> : ""}
      <h2>{content}</h2>
    </div>
  );
};

const CreateWheel = (props) => {
  const [showClaimButton, setShowClaimButton] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [result, setResult] = useState("");
  const [displayResult, setDisplayResult] = useState(false);
  const [heading, setHeading] = useState("Ready to test your luck?");
  const [subHeading, setSubHeading] = useState(
    "Spin the wheel to win exciting prices"
  );
  let theWheel = useRef();

  let mainContainer = document.getElementById("main_container");

  const resetWheel = () => {
    mainContainer.classList.remove("fireworks");
    setDisableAnimateBtn(false);
    setHeading("Ready to test your luck?");
    setSubHeading("Spin the wheel to win exciting prizes");
    setDisplayResult(false);
    // theWheel.current.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
    theWheel.current.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.
    theWheel.current.draw(); // Call draw to render changes to the wheel.
    theWheel.current.wheelSpinning = false;
    deleteCookie("prize_type");
    deleteCookie("prize");
    setShowResetButton(false);
    setShowClaimButton(false);
  };

  function resizeCanvas() {
    // Get the canvas
    var canvas = document.getElementById("offerWheel");

    // Get width of window.
    let w, h;
    if (window.innerWidth < 600) {
      w = window.innerWidth - 72;
      h = window.innerWidth - 72;
    } else {
      w = 366;
      h = 366;
    }

    // Set height to the current height of the canvas since we don't adjust it.
    canvas.height = h;
    // Assuming only the width will change to be responsive.
    canvas.width = w;

    // To ensure the wheel stays inside the canvas, work out what is the smaller
    // value between width and height, and set the outerRadius to half of that.
    if (w < h) {
      theWheel.current.outerRadius = w / 2;
    } else {
      theWheel.current.outerRadius = h / 2;
    }

    // In order to keep the wheel in the center of the canvas the centerX and
    // centerY need to be set to the middle point of the canvas.
    theWheel.current.centerX = canvas.width / 2;
    theWheel.current.centerY = canvas.height / 2;

    // Other possible TODO
    // - Alter the font size.
    // - Adjust inner radius if the wheel has one.

    // Re-draw the wheel.
    theWheel.current.draw();
  }

  useEffect(() => {
    theWheel.current = new Winwheel({
      canvasId: "offerWheel",
      drawMode: "image",
      drawText: true,
      centerX: 160,
      centerY: 160,
      // textOrientation: "curved",
      textAlignment: "outer",
      textMargin: 5,
      textFontFamily: "courier",
      numSegments: 6,
      responsive: true,
      segments: [
        { textFillStyle: "rgba(0,0,0,0)", text: "two_plus_one" },
        { textFillStyle: "rgba(0,0,0,0)", text: "goodie" },
        { textFillStyle: "rgba(0,0,0,0)", text: "two_plus_one" },
        { textFillStyle: "rgba(0,0,0,0)", text: "goodie" },
        { textFillStyle: "rgba(0,0,0,0)", text: "two_plus_one" },
        { textFillStyle: "rgba(0,0,0,0)", text: "goodie" },
      ],
      imageOverlay: true,
      lineWidth: 1,
      strokeStyle: "rgba(0,0,0,0)",
      rotationAngle: 0,
      animation: {
        type: "spinToStop",
        duration: 5,
        spins: 12,
      },
    });

    // Create new image object in memory.
    let loadedImg = new Image();
    loadedImg.width = 272;
    loadedImg.height = 272;

    // Create callback to execute once the image has finished loading.
    loadedImg.onload = function () {
      console.log(loadedImg.height);
      theWheel.current.wheelImage = loadedImg; // Make wheelImage equal the loaded image object.

      let canvas = document.getElementById("offerWheel");
      let ctx = canvas.getContext("2d");
      // const dpr = window.devicePixelRatio;
      // const rect = canvas.getBoundingClientRect();
      // canvas.width = rect.width * dpr;
      // canvas.height = rect.height * dpr;
      // ctx.scale(dpr, dpr);
      // canvas.style.width = `${rect.width}px`;
      // canvas.style.height = `${rect.height}px`;
      ctx.imageSmoothingEnabled = true;
      theWheel.current.draw(); // Also call draw function to render the wheel.
    };

    // Set the image source, once complete this will trigger the onLoad callback (above).
    // if (window.innerWidth > 600) {
    //   loadedImg.src = wheelImage;
    // } else {
    loadedImg.src = wheelImageMobile;
    // }
  }, []);

  // useEffect(() => {
  //   resizeCanvas();
  // }, []);

  const wheelResult = () => {
    setTimeout(async () => {
      let winningSegment = theWheel.current.getIndicatedSegment();
      if (winningSegment.text === "try_again") {
        setShowClaimButton(false);
        setShowResetButton(true);
      } else {
        setHeading("Cheers");
        // if (winningSegment.text === "two_plus_one") {
        //   setSubHeading("you’ve just won yourself a drink");
        // } else if (winningSegment.text === "event_pass") {
        //   setSubHeading("you’ve just won yourself an event pass");
        // } else {
        //   setSubHeading("you’ve just won yourself a goodie");
        // }
        mainContainer.classList.add("fireworks");
        let audioElm = document.getElementById("audio2");
        // await audioElm.play();
        if (winningSegment.text === "two_plus_one") {
          setCookie("prize_type", "drink", 1);
        } else if (winningSegment.text === "goodie") {
          setCookie("prize_type", "goodie", 1);
        } else {
          setCookie("prize_type", "event pass", 1);
        }
      }

      theWheel.current.clearCanvas();
      let ctx = theWheel.current.ctx;
      ctx.beginPath();

      // if (window.innerWidth > 600) {
      //   ctx.arc(183, 183, 168, 0, 2 * Math.PI);
      // } else {
      // let arcPosition = theWheel.current.centerX;
      // let theWheelRadius = arcPosition - 10;
      // ctx.arc(arcPosition, arcPosition, theWheelRadius, 0, 2 * Math.PI);
      // }
      ctx.arc(160, 162, 137, 0, 2 * Math.PI);

      ctx.fillStyle = "#B81C1F";
      ctx.fill();
      setResult(winningSegment.text);
      setDisplayResult(true);
      setCookie("prize", winningSegment.text, 1);
      setShowClaimButton(true);
    }, 1000);
  };

  const [disableAnimateBtn, setDisableAnimateBtn] = useState(false);

  const animateWheel = async () => {
    setDisableAnimateBtn(true);
    let audioElm = document.getElementById("audio");
    // await audioElm.play();
    setShowResetButton(false);
    // if (theWheel.current.wheelSpinning === false) {
    theWheel.current.startAnimation();
    theWheel.current.wheelSpinning = true;
    // }
    setTimeout(() => {
      wheelResult();
    }, 5000);
  };

  useEffect(() => {
    console.log(disableAnimateBtn);
  }, [disableAnimateBtn]);

  const claimPrize = () => {
    mainContainer.classList.remove("fireworks");
    props.updatePopup({ display: true, type: "claimForm" });
    setCookie("screen", "claimForm", 1);
  };

  useEffect(() => console.log(result), [result]);

  return (
    <>
      <div className="spin-wheel-heading">
        <h2>{heading}</h2>
        <p>{subHeading}</p>
      </div>
      <div className="wheel-container">
        <audio
          id="audio"
          controls
          src="spin-wheel.mp3"
          type="audio/mp3"
        ></audio>
        <audio id="audio2" controls src="ta-da.mp3" type="audio/mp3"></audio>
        <canvas id="offerWheel" width="320" height="378">
          Canvas not supported, use another browser.
        </canvas>
        {!displayResult ? (
          <>
            <img
              src={prizePointer}
              className="prize-pointer"
              alt=""
              width="17"
            />
            <img src={wheelCenter} className="wheel-center" alt="" />
          </>
        ) : (
          <div>
            {result === "goodie" ? (
              <div className="spin-wheel-result">
                <p>You've Won</p>
                <h2>Grant's Merchandise</h2>
              </div>
            ) : result === "two_plus_one" ? (
              <div className="spin-wheel-result">
                <p>You've Won</p>
                <h2>Crewtime Special 2+1</h2>
              </div>
            ) : result === "event_pass" ? (
              <div className="spin-wheel-result">
                <p>You've Won</p>
                <h2>An Event Pass</h2>
              </div>
            ) : (
              <div className="spin-wheel-result">
                <h2>Try Again</h2>
              </div>
            )}
          </div>
        )}
      </div>

      {result === "two_plus_one" ? (
        <div className="terms">
          <p>
            Get a complimentary 30ml/60ml/750ml Grant's drink on purchase of 2
            30ml/60ml/750ml Grant's.
          </p>
        </div>
      ) : (
        ""
      )}

      <div className="wheel-spacing"></div>

      <div className="button-container">
        {showClaimButton && !showResetButton ? (
          <Button onClick={() => claimPrize()}>Claim Prize</Button>
        ) : !showResetButton ? (
          <Button disabled={disableAnimateBtn} onClick={() => animateWheel()}>
            Spin the Wheel
          </Button>
        ) : (
          ""
        )}

        {showResetButton ? (
          <Button onClick={() => resetWheel()}>Reset Wheel</Button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

function SpinWheel(props) {
  return (
    <>
      <Helmet>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"
          type="text/javascript"
        />
      </Helmet>
      <Container fluid className="spin-wheel-heading">
        <Row>
          <Col>
            <CreateWheel updatePopup={props.updatePopup} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SpinWheel;
