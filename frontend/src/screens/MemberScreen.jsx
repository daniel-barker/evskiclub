import React, { useState } from "react";
import { Modal, Row, Col, Card, Button } from "react-bootstrap";
import LatestNews from "../components/LatestNews";
import LatestPosts from "../components/LatestPosts";
import MemberPageCarousel from "../components/MemberPageCarousel";

import bylaws from "../assets/pdfs/bylaws.pdf";
import directory from "../assets/pdfs/directory.pdf";
import ClubHistory from "../components/ClubHistory";
import HouseRules from "../components/HouseRules";

// Import images
import clubHistoryImg from "../assets/images/club_history.jpg";
import bylawsImg from "../assets/images/club_constitution.jpg";
import houseRulesImg from "../assets/images/house_rules.jpg";

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
      <div className="member-page-container mx-5">
        <Row className="mt-5">
          <Col md={7} className="p-2">
            <LatestNews />
          </Col>
          <Col md={5} className="p-2">
            <LatestPosts />
          </Col>
        </Row>

        <Row className="mt-5 mx-1 justify-content-center">
          <Col md={4} className="p-2">
            <Card
              onClick={handleShowHistory}
              className="member-screen-links text-center"
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <img
                  src={clubHistoryImg}
                  alt="Club History"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  className="mb-3"
                />
                <Card.Title>Club History</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="p-2">
            <Card
              onClick={handleShowBylaws}
              className="member-screen-links text-center"
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <img
                  src={bylawsImg}
                  alt="Club By-Laws"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  className="mb-3"
                />
                <Card.Title>Club By-Laws</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="p-2">
            <Card
              onClick={handleShowHouseRules}
              className="member-screen-links text-center"
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <img
                  src={houseRulesImg}
                  alt="House Rules"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  className="mb-3"
                />
                <Card.Title>House Rules</Card.Title>
              </Card.Body>
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
