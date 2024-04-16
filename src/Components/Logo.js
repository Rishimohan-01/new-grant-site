import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import grantsLogo from "../assets/images/grants-together-logo-white.png";

function Logo(props) {
  return (
    <Container>
      <Row>
        <Col>
          <img src={grantsLogo} alt="Grants Logo" className="logo" />
        </Col>
      </Row>
    </Container>
  );
}

export default Logo;
