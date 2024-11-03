import {
  useGetImagesQuery,
  useGetImageTagsQuery,
} from "../slices/imageApiSlice";
import { Col, Row, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

const GalleryScreen = () => {
  const { data: images, isLoading, error } = useGetImagesQuery();
  const {
    data: tags,
    isLoading: isLoadingTags,
    error: errorTags,
  } = useGetImageTagsQuery();

  if (isLoadingTags) return <div>Loading tags...</div>;
  if (errorTags) return <div>Error: {errorTags.message}</div>;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container>
      <Row className="align-items-center my-4">
        <Col>
          <h1 className="text-center display-6 fw-bold">Member Gallery</h1>
          <p className="text-center text-muted">
            Email Pictures to Have Them Added!
          </p>
        </Col>
      </Row>
      <Gallery>
        <Row className="g-4">
          {images.map((img, index) => (
            <Col key={index} xs={6} sm={4} md={3} lg={3} xl={2}>
              <Item
                original={img.image}
                thumbnail={img.thumbnail}
                width={img.width}
                height={img.height}
                title={img.title}
                caption={img.description}
              >
                {({ ref, open }) => (
                  <Card
                    className="border-0 shadow-sm"
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Img
                      ref={ref}
                      onClick={open}
                      src={img.thumbnail}
                      alt={img.title}
                      className="rounded"
                      style={{
                        transition: "transform 0.2s",
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    <Card.Body className="p-2 text-center">
                      <Card.Title className="text-truncate mb-0 small">
                        {img.title}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                )}
              </Item>
            </Col>
          ))}
        </Row>
      </Gallery>
      <div className="mt-5 text-center">
        <h2>Tags</h2>
        <Row className="justify-content-center mt-2">
          {tags.map((tag, index) => (
            <Col xs="auto" key={index} className="mb-2">
              <Link
                to={`/gallery/${tag}`}
                className="btn btn-outline-primary-custom"
              >
                {tag}
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default GalleryScreen;
