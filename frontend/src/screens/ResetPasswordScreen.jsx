import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import { useResetPasswordMutation } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import club_logo from "../assets/images/club_logo.png";

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      toast.success("Your password has been reset successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(error.data?.message || "Failed to reset password.");
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.0)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "35rem",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      border: "1px solid #ccc",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.9)",
      borderRadius: "10px",
    },
  };

  return (
    <Modal
      isOpen={true}
      contentLabel="Reset Password Modal"
      style={customStyles}
    >
      <Form onSubmit={handleSubmit}>
        <div className="text-center">
          <Image src={club_logo} fluid className="mb-4" />
        </div>
        <Form.Group controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoading}>
          Reset Password
        </Button>
        {isLoading && <Loader />}
      </Form>
    </Modal>
  );
};

export default ResetPasswordScreen;
