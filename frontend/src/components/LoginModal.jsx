import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Loader from "./Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const isModalOpen = !userInfo;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "20rem",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      border: "1px solid #ccc",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.9)",
      borderRadius: "10px",
    },
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={handleClose}
      contentLabel="Sign In Modal"
      style={customStyles}
    >
      <h2>Sign In</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" className="my-3">
          Sign In
        </Button>
        {isLoading && <Loader />}
      </Form>
    </Modal>
  );
};

export default LoginModal;
