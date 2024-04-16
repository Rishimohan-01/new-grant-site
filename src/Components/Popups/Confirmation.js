import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import tickImage from "../../assets/images/tick.png";
import { deleteCookie } from "../../functions/cookie";

function Confirmation(props) {
  const deleteCokies = () => {
    deleteCookie("screen");
    deleteCookie("prize_type");
    deleteCookie("outlet");
    deleteCookie("prize");
    deleteCookie("location");
    window.location.reload();
  };
  return (
    <Container>
      <Row>
        <Col>
          <div className="confirmation">
            <img src={tickImage} alt="" />
            <h2>Thanks for sharing your detail</h2>
            <p>A Grant's representative will call you soon with the details</p>
          </div>

          <div className="button-container">
            <button onClick={() => deleteCokies()}>Test Again</button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Confirmation;
