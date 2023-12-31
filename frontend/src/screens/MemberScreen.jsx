import React, { useState } from "react";
import { Container, Modal, Row, Col, Card, Button } from "react-bootstrap";
import Calendar from "../components/Calendar";
import LatestNews from "../components/LatestNews";

import club_bylaws from "../assets/images/club_bylaws.jpg";
import member_directory from "../assets/images/member_directory.jpg";
import club_history from "../assets/images/club_history.jpg";
import house_rules from "../assets/images/house_rules.jpg";

import bylaws from "../assets/pdfs/bylaws.pdf";
import directory from "../assets/pdfs/directory.pdf";
import ClubHistory from "../components/ClubHistory";
import HouseRules from "../components/HouseRules";

const MemberScreen = () => {
  const [showBylaws, setShowBylaws] = useState(false);
  const [showMemberDirectory, setShowMemberDirectory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHouseRules, setShowHouseRules] = useState(false);

  const handleShowBylaws = () => setShowBylaws(true);
  const handleHideBylaws = () => setShowBylaws(false);
  const handleShowMemberDirectory = () => setShowMemberDirectory(true);
  const handleHideMemberDirectory = () => setShowMemberDirectory(false);
  const handleShowHistory = () => setShowHistory(true);
  const handleHideHistory = () => setShowHistory(false);
  const handleShowHouseRules = () => setShowHouseRules(true);
  const handleHideHouseRules = () => setShowHouseRules(false);

  return (
    <>
      <Container className="member-page-container">
        <Row>
          <Col md={6}>
            <LatestNews />
          </Col>
          <Col md={2}></Col>
          <br />
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Photo Gallery Carousel</Card.Title>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="dflex justify-content-center">
          <Col md={8}>
            <br />

            <div style={{ backgroundColor: "#f5f5f5" }}>
              <Calendar />
            </div>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card onClick={handleShowHistory} style={{ cursor: "pointer" }}>
              <Card.Img src={club_history} />
            </Card>
          </Col>
          <Col>
            <Card
              onClick={handleShowMemberDirectory}
              style={{ cursor: "pointer" }}
            >
              <Card.Img src={member_directory} />
            </Card>
          </Col>
          <Col>
            <Card onClick={handleShowBylaws} style={{ cursor: "pointer" }}>
              <Card.Img src={club_bylaws} />
            </Card>
          </Col>
          <Col>
            <Card onClick={handleShowHouseRules} style={{ cursor: "pointer" }}>
              <Card.Img src={house_rules} />
            </Card>
          </Col>
        </Row>
      </Container>

      {/* MODALS */}

      {/* HISTORY MODAL */}
      <Modal
        show={showHistory}
        onHide={handleHideHistory}
        size="xl"
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Club History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClubHistory />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideHistory}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MEMBER DIRECTORY MODAL */}
      <Modal
        show={showMemberDirectory}
        onHide={handleHideMemberDirectory}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Member Directory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={directory}
            title="Member Directory"
            width="100%"
            height="500px"
            style={{ border: "none" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideMemberDirectory}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* BYLAW MODAL */}
      <Modal show={showBylaws} onHide={handleHideBylaws} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Club Bylaws</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={bylaws}
            title="Club Bylaws"
            width="100%"
            height="500px"
            style={{ border: "none" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideBylaws}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* HOUSE RULES MODAL */}
      <Modal
        show={showHouseRules}
        onHide={handleHideHouseRules}
        size="xl"
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>House Rules</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HouseRules />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideHouseRules}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MemberScreen;
