import React from "react";
import { Container, Image } from "react-bootstrap";
import skipic from "../assets/images/skipic.jpg";

const HomeScreen = () => {
  return (
    <>
      <Image src={skipic} alt="hero" className="body-padding" fluid />
      <Container>test</Container>
    </>
  );
};

export default HomeScreen;
