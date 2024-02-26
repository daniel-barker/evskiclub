import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import club_logo from "../assets/images/club_logo.jpg";

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/home");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password"); // Assuming you have a route set up for this
  };

  // Adjusted modalStyle for container
  const bigModalStyle = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "32rem",
      padding: "20px",
      border: "1px solid #ccc",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
      borderRadius: "10px",
      background: "#fff",
      zIndex: 1050,
    }
  };

  return (
    <div style={bigModalStyle.container}>
      <div className="text-center">
        <Image src={club_logo} fluid />
      </div>
      <h2 className="text-center">Sign In</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="username" className="my-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="my-3">
          Sign In
        </Button>
        <div className="text-center">
          <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
        </div>
        <div className="text-center mt-3">
          Don't have an account? <a href="/register">Register</a>
        </div>
        {isLoading && <Loader />}
      </Form>
    </div>
  );
};

export default LoginScreen;
