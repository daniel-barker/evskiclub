import React, { useState } from "react";
import { Modal, Row, Col, Card, Button } from "react-bootstrap";
import Calendar from "../components/Calendar";
import LatestNews from "../components/LatestNews";
import MemberPageCarousel from "../components/MemberPageCarousel";

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
      <MemberPageCarousel />
      <div className="member-page-container">
        <Row className="mt-3 justify-content-center align-items-center">
          <Col md={8} className="p-2">
            <LatestNews />
          </Col>
        </Row>
        <Row className="mt-3 mx-1">
          <Col md={3} className="p-2">
            <Card onClick={handleShowHistory} style={{ cursor: "pointer" }}>
              <Card.Img src={club_history} />
            </Card>
          </Col>
          <Col md={3} className="p-2">
            <Card
              onClick={handleShowMemberDirectory}
              style={{ cursor: "pointer" }}
            >
              <Card.Img src={member_directory} />
            </Card>
          </Col>
          <Col md={3} className="p-2">
            <Card onClick={handleShowBylaws} style={{ cursor: "pointer" }}>
              <Card.Img src={club_bylaws} />
            </Card>
          </Col>
          <Col md={3} className="p-2">
            <Card onClick={handleShowHouseRules} style={{ cursor: "pointer" }}>
              <Card.Img src={house_rules} />
            </Card>
          </Col>
        </Row>
      </div>

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
