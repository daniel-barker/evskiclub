import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

const PendingApprovalScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <Alert variant="info">
            <Alert.Heading>Account Pending Approval</Alert.Heading>
            <p>
              Thank you for registering with{" "}
              <strong>Ellicottville Ski Club</strong>!
            </p>
            <p>
              Your account is currently pending approval. This process is in
              place to ensure the safety and security of our community.
            </p>
            <hr />
            <h5>What happens next?</h5>
            <ul>
              <li>
                Our administrators are reviewing your registration and will
                activate your account soon.
              </li>
              <li>
                This process can take up to <strong>48 hours</strong>. We
                appreciate your patience!
              </li>
              <li>
                You will receive an email notification once your account has
                been approved and activated. Please check your inbox (and spam
                folder) for updates.
              </li>
            </ul>
            <hr />
            <h5>Need help or have questions?</h5>
            <p>
              If you need immediate assistance or have any questions, please
              don't hesitate to contact us at{" "}
              <strong>secretary@ellicottvilleskiclub.com</strong>. We're here to
              help!
            </p>
            <p>
              Thank you for your patience and understanding. We're excited to
              welcome you to our community!
            </p>
            <Button
              onClick={logoutHandler}
              variant="primary"
              className="float-right"
            >
              Go Back
            </Button>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default PendingApprovalScreen;
