import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetAllUnitsQuery } from "../slices/unitApiSlice";
// import dummyImage from "../assets/images/Member_Family_Picture.jpg"; // Dummy image commented out for testing

const MemberDirectory = () => {
  const { data: units, isLoading, error } = useGetAllUnitsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const pageRange = 5;

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const filteredUnits = units?.filter((unit) =>
    unit.members.some(
      (member) =>
        `${member.firstName ?? ""} ${member.lastName ?? ""}`
          .toLowerCase()
          .includes(nameFilter.toLowerCase()) &&
        (member.email ?? "").toLowerCase().includes(emailFilter.toLowerCase())
    )
  );

  const totalPages = filteredUnits
    ? Math.ceil(filteredUnits.length / itemsPerPage)
    : 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUnits = filteredUnits?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the range of page numbers to display
  const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  const endPage = Math.min(totalPages, startPage + pageRange - 1);

  const handleImageClick = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <Row className="align-items-center my-4">
        <Col className="text-center">
          <h2 className="display-6 fw-bold">Membership Directory</h2>{" "}
          {/* Slightly smaller than the Gallery title */}
          <p className="text-center text-muted">
            Find your fellow club members below
          </p>{" "}
          {/* Subtle subtitle */}
        </Col>
      </Row>

      {/* Filter Controls */}
      <Row className="my-3">
        <Col xs={12} md={6} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Filter by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </Col>
        <Col xs={12} md={6} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Filter by Email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || "Failed to fetch units"}
        </Message>
      ) : (
        <>
          {currentUnits.map((unit) => (
            <Card key={unit._id} className="my-4 p-3 shadow-lg rounded-3">
              <Row className="g-0">
                {/* Profile Image Section */}
                <Col
                  md={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className="text-center">
                    <img
                      src={unit.image}
                      alt="Member"
                      className="rounded-3 border"
                      style={{
                        width: "300px",
                        height: "230px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => handleImageClick(unit.image)}
                    />
                    <h5 className="mt-3 text-muted">
                      Member Since: {unit.memberSince}
                    </h5>
                  </div>
                </Col>

                {/* Member Details Section */}
                <Col md={8}>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        {unit.members.map((member) => (
                          <div key={member._id} className="mb-3">
                            <h4 className="fw-bold">{`${member.firstName} ${member.lastName}`}</h4>
                            <p className="mb-1">
                              <strong>Email:</strong> {member.email || "N/A"}
                            </p>
                            {member.phoneNumber.map((phone) => (
                              <p key={phone._id} className="mb-1">
                                <strong>{phone.type}:</strong> {phone.number}
                              </p>
                            ))}
                          </div>
                        ))}
                      </Col>
                      <Col md={6}>
                        {unit.addresses.map((address) => (
                          <div key={address._id} className="mb-3">
                            <h5 className="fw-bold">
                              {address.addressType} Address
                            </h5>
                            <p className="mb-1">{address.street}</p>
                            <p className="mb-1">{`${address.city}, ${address.state} ${address.zip}`}</p>
                          </div>
                        ))}
                      </Col>
                    </Row>
                    <hr />
                    <p className="text-center fst-italic mb-0">
                      {unit.bio || "No bio available."}
                    </p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}

          {/* Modal for Enlarged Image */}
          <Modal show={showModal} onHide={handleCloseModal} centered size="md">
            <Modal.Body className="p-0">
              <Button
                variant="light"
                onClick={handleCloseModal}
                className="news-modal-close"
                style={{
                  fontSize: "1.5rem",
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  border: "none",
                  zIndex: 1000,
                }}
              >
                &times;
              </Button>
              <img
                src={modalImage}
                alt="Enlarged"
                className="img-fluid rounded-3"
                style={{ maxHeight: "80vh", objectFit: "contain" }}
              />
            </Modal.Body>
          </Modal>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mb-3">
            <Button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="mx-1"
            >
              {"<<"}
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1"
            >
              {"<"}
            </Button>
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
              const pageNumber = startPage + index;
              return (
                <Button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={currentPage === pageNumber}
                  className="mx-1"
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1"
            >
              {">"}
            </Button>
            <Button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="mx-1"
            >
              {">>"}
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default MemberDirectory;
