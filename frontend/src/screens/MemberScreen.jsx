import { Row, Col, Card } from "react-bootstrap";
import LatestNews from "../components/LatestNews";
import LatestPosts from "../components/LatestPosts";
import MemberPageCarousel from "../components/MemberPageCarousel";

import bboard from "../assets/images/bboard.png";
import memdir from "../assets/images/memdir.png";
import calendar from "../assets/images/calendar.png";
import gallery from "../assets/images/gallery.png";
import news from "../assets/images/news.png";

const MemberScreen = () => {
  return (
    <>
      <MemberPageCarousel />
      <div className="member-page-container mx-5">
        <Row className="mt-5">
          <Col></Col>
          <Col md={5} className="p-2">
            <LatestNews />
          </Col>
          <Col></Col>
          <Col md={3} className="p-2">
            <LatestPosts />
          </Col>
          <Col></Col>
        </Row>

        <Row className="mt-5 mx-1 justify-content-center">
          <Col className="p-2">
            <Card
              className="member-screen-links text-center"
              style={{ cursor: "pointer" }}
              onClick={() => (window.location.href = "/news")}
            >
              <Card.Body>
                <img
                  src={news}
                  alt="News"
                  style={{
                    width: "128px",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  className="mb-3"
                />
                <Card.Title>News</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col className="p-2">
            <Card
              className="member-screen-links text-center"
              style={{ cursor: "pointer" }}
              onClick={() => (window.location.href = "/gallery")}
            >
              <Card.Body>
                <img
                  src={gallery}
                  alt="Gallery"
                  style={{
                    width: "128px",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  className="mb-3"
                />
                <Card.Title>Gallery</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col className="p-2">
            <Card
              className="member-screen-links text-center"
              style={{ cursor: "pointer" }}
              onClick={() => (window.location.href = "/bb")}
            >
              <Card.Body>
                <img
                  src={bboard}
                  alt="Bulletin Board"
                  style={{
                    width: "128px",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  className="mb-3"
                />
                <Card.Title>Bulletin Board</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col className="p-2">
            <Card
              className="member-screen-links text-center"
              style={{ cursor: "pointer" }}
              onClick={() => (window.location.href = "/directory")}
            >
              <Card.Body>
                <img
                  src={memdir}
                  alt="Directory"
                  style={{
                    width: "128px",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  className="mb-3"
                />
                <Card.Title>Directory</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col className="p-2">
            <Card
              className="member-screen-links text-center"
              style={{ cursor: "pointer" }}
              onClick={() => (window.location.href = "/calendar")}
            >
              <Card.Body>
                <img
                  src={calendar}
                  alt="Calendar"
                  style={{
                    width: "128px",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  className="mb-3"
                />
                <Card.Title>Calendar</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MemberScreen;
