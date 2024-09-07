import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaTrash, FaEdit, FaBinoculars } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetImagesQuery,
  useDeleteImageMutation,
} from "../../slices/imageApiSlice";

const ImageListScreen = () => {
  const { data: images, refetch, isLoading, error } = useGetImagesQuery();
  const [deleteImage, { isLoading: loadingDelete }] = useDeleteImageMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete an image?")) {
      try {
        await deleteImage(id);
        toast.success("Image deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container className="mt-4 form-background">
      <Row className="align-items-center">
        <Col>
          <Link to="/" className="btn btn-primary my-3">
            Go Back
          </Link>
        </Col>
        <Col>
          <h1>Images</h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/images/upload" className="btn btn-primary my-3">
            <FaEdit /> Upload Image
          </Link>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>TITLE</th>
              <th>TAGS</th>
              <th>CAROUSEL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr key={image._id}>
                <td>
                  <img
                    src={`${process.env.PUBLIC_URL}/${image.thumbnail}`}
                    alt={image.title}
                    style={{ width: "100px" }}
                  />
                </td>
                <td>{image.title}</td>
                <td>{image.tags.join(", ")}</td>
                <td>{image.carousel ? "Yes" : "No"}</td>
                <td>
                  <LinkContainer to={`/admin/images/${image._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaBinoculars />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(image._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
export default ImageListScreen;
