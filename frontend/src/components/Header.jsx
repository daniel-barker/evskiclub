import React from "react";
import { Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
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
              <NavDropdown title="Admin" id="navbar-font">
                <LinkContainer to="/admin/user/list">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/event/list">
                  <NavDropdown.Item>Events</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/news/list">
                  <NavDropdown.Item>News</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/images/list">
                  <NavDropdown.Item>Image List</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/images/upload">
                  <NavDropdown.Item>Image Upload</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/members/list">
                  <NavDropdown.Item>Add Membership Unit</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
            {userInfo && (
              <>
                <LinkContainer id="navbar-font" to="/home">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer id="navbar-font" to="/gallery">
                  <Nav.Link>Gallery</Nav.Link>
                </LinkContainer>
                <LinkContainer id="navbar-font" to="/about">
                  <Nav.Link>About</Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={logoutHandler}>
                  <Image src={logo} alt="logo" className="logo" />
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
