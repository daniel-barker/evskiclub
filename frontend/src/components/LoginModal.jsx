import React from "react";
import Modal from "react-modal";

export default function LoginModal({ isOpen, onRequestClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Sign In Modal"
    >
      <h2>Sign In</h2>
      <button onClick={onRequestClose}>Close</button>
      {/* Your sign-in form goes here */}
    </Modal>
  );
}
