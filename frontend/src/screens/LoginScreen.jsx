import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import club_logo from "../assets/images/club_logo.png";

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
      <h2 className="text-center mb-4">Sign In</h2> {/* Added mb-4 for consistent spacing after heading */}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="username" className="mb-4"> {/* Updated class for bottom margin */}
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="mb-4"> {/* Updated class for bottom margin */}
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mb-4 w-100"> {/* Full width and margin */}
          Sign In
        </Button>
        <div className="text-center mb-2"> {/* Added text-center and bottom margin */}
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="text-center mb-3"> {/* Added text-center and bottom margin */}
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        {isLoading && <Loader />}
      </Form>
    </div>
  );

};

export default LoginScreen;
