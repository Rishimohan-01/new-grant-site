import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { setCookie } from "../functions/cookie";

function Location(props) {
  // states
  const [location, setLocation] = useState("Delhi NCR");
  const [outlets, setOutlets] = useState([]);
  const [outlet, setOutlet] = useState("");

  // variables
  const outletInfo = [
    {
      location: "Delhi NCR",
      outlets: ["Pabelo Bar", "Lucky Restaurant and Bar"],
    },
    {
      location: "Mumbai Central",
      outlets: ["Krish Bar", "Vihar Family Restaurant and Bar"],
    },
  ];

  // side effects
  // load outlet details based on the location on initial rendering
  useEffect(() => {
    outletInfo.map((outletDetails) => {
      if (outletDetails.location === location) {
        setOutlets(outletDetails.outlets);
        setOutlet(outletDetails.outlets[0]);
      }
    });
  }, []);

  // load outlet details based on the location on change of the lcoation
  useEffect(() => {
    outletInfo.map((outletDetails) => {
      if (outletDetails.location === location) {
        setOutlets(outletDetails.outlets);
        setOutlet(outletDetails.outlets[0]);
      }
    });
  }, [location]);

  const handleLocation = (e) => {
    setLocation(e.target.value);
  };

  const handlePopup = () => {
    props.updatePopup((prevState) => {
      return { ...prevState, display: true };
    });
    setCookie("location", location, 1);
    setCookie("outlet", outlet, 1);
    setCookie("screen", "spinWheel", 1);
  };

  const handleOutlet = (e) => {
    setOutlet(e.target.value);
  };

  // checkbox validation
  const [isChecked, setIsChecked] = useState(false);
  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <Container fluid className="location">
        <Row>
          <Col>
            <h2>Unlock incredible offers with just a few quick details!</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Select
                aria-label="Select Location"
                value={location}
                onChange={(e) => handleLocation(e)}
              >
                {outletInfo.map((outlet) => {
                  return (
                    <option value={outlet.location}>{outlet.location}</option>
                  );
                })}
              </Form.Select>

              <Form.Select
                aria-label="Select Outlet"
                onChange={(e) => handleOutlet(e)}
              >
                {outlets.map((outletName) => {
                  if (outlet === outletName) {
                    return (
                      <option value={outletName} selected>
                        {outletName}
                      </option>
                    );
                  } else {
                    return <option value={outletName}>{outletName}</option>;
                  }
                })}
              </Form.Select>

              <Form.Check
                style={{ color: "#ffffff" }}
                onChange={handleOnChange}
                // onChange={(e) => setIsChecked(e.target.checked)}
                type={"checkbox"}
                id={`checkbox`}
                label={`By checking this box, i hereby accept that i am of official
            drinking age and I agree to the Terms and Conditions
            relating to this offer.`}
                required
              />

              <div className="button-container">
                <Button
                  type="button"
                  disabled={!isChecked}
                  onClick={() => handlePopup()}
                >
                  View Offers
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Location;
