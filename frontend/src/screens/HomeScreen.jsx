import React from "react";
import { Container, Image } from "react-bootstrap";
import holidayvalley from "../assets/images/holidayvalley.jpeg";

const HomeScreen = () => {
  return (
    <>
      <Image src={holidayvalley} alt="hero" fluid />
      <Container>test</Container>
    </>
  );
};

export default HomeScreen;
