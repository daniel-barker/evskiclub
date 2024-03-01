import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Image } from 'react-bootstrap';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import club_logo from '../assets/images/club_logo.png';

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('Password reset email sent. Please check your inbox.');
      navigate('/login'); // Optionally navigate back to login or stay on the page
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to send reset email.');
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
      <h2 className="text-center">Forgot Password</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label className="mx-1">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={isLoading}>
          Send Reset Link
        </Button>
        {isLoading && <Loader />}
      </Form>
    </div>
  );
};

export default ForgotPasswordScreen;
