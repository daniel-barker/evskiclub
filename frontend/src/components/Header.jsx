import React from "react";
import { Navbar, Nav, NavDropdown, Image, NavLink } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";
import LoginModal from "./LoginModal";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  useEffect(() => {}, [isSignInModalOpen]);

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
    <header>
      <Navbar expand="lg" collapseOnSelect className="custom-navbar">
        <LinkContainer to="/">
          <Navbar.Brand>
            <h1>Ellicottville Ski Club</h1>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {userInfo && userInfo.isAdmin && (
              <NavDropdown title="Admin" id="adminmenu">
                <LinkContainer to="/admin/user/list">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/event/list">
                  <NavDropdown.Item>Events</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
            {userInfo && (
              <>
                <NavLink to="/home">Home</NavLink>
                <Image
                  src={logo}
                  alt="logo"
                  className="logo"
                  onClick={logoutHandler}
                />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <LoginModal
        isOpen={isSignInModalOpen}
        onRequestClose={handleCloseSignInModal}
      />
    </header>
  );
};

export default Header;
