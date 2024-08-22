import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import club_logo from "../assets/images/club_logo.png";

const RegistrationScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      try {
        const res = await register({
          username,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
      } catch (err) {
        toast.error(err?.data?.message || err.data || err.error);
      }
    }
  };

  const bigModalStyle = {
    container: {
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "32rem",
      padding: "20px",
      border: "1px solid #ccc",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.9)",
      color: "#01467f",
      zIndex: 1050,
    },
  };

  return (
  <div style={bigModalStyle.container}>
    <div className="text-center">
      <Image src={club_logo} fluid />
    </div>
    <h2 className="text-center mb-4">Register</h2> {/* Added mb-4 for consistent spacing after heading */}
    <Form onSubmit={submitHandler}>
      <Form.Group controlId="username" className="mb-4">
        <Form.Label>Username</Form.Label>
        <Form.Control
          className="w-100"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="name" className="mb-4">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="email" className="mb-4">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="password" className="mb-4">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="confirmPassword" className="mb-4">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Form.Group>
      <Button
        type="submit"
        variant="primary"
        className="mb-4 w-100"  // Button width to full and margin-bottom for consistency
        disabled={isLoading}
      >
        Register
      </Button>
      <div className="mb-3 text-center"> {/* Text centered with appropriate bottom margin */}
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
      {isLoading && <Loader />}
    </Form>
  </div>
);
};
export default RegistrationScreen;
