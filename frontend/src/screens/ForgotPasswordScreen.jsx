import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Image } from 'react-bootstrap';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import club_logo from '../assets/images/club_logo.jpg';

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

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      width: '35rem',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      border: '1px solid #ccc',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.9)',
      borderRadius: '10px',
    },
  };

  return (
    <Modal
      isOpen={true} // Assuming you always want to show the modal when the component is rendered
      contentLabel="Forgot Password Modal"
      style={customStyles}
    >
      <div className="text-center">
        <Image src={club_logo} fluid />
      </div>
      <h2 className="text-center">Forgot Password</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email</Form.Label>
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
    </Modal>
  );
};

export default ForgotPasswordScreen;
