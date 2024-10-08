import React from "react";
import { Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../assets/images/club_logo.png";

const Header = () => {
  const location = useLocation();
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
  const excludedHeaderPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  if (excludedHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect className="custom-navbar">
        <LinkContainer to="/">
          <Navbar.Brand className="custom-logo">
            <Image
              src={logo}
              alt="Ellicottville Ski Club Logo"
              style={{ height: "120px" }}
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {userInfo && userInfo.isAdmin && (
              <NavDropdown title="Admin" id="navbar-font">
                <LinkContainer to="/admin/news/list">
                  <NavDropdown.Item>News</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/images/list">
                  <NavDropdown.Item>Gallery</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/bb">
                  <NavDropdown.Item>Bulletin Board</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/members/list">
                  <NavDropdown.Item>Member Directory</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/user/list">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
            {userInfo && (
              <>
                <LinkContainer id="navbar-font" to="/home">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <NavDropdown title="Community" id="navbar-font">
                  <LinkContainer id="navbar-font" to="/news">
                    <Nav.Link>News</Nav.Link>
                  </LinkContainer>
                  <LinkContainer id="navbar-font" to="/gallery">
                    <Nav.Link>Gallery</Nav.Link>
                  </LinkContainer>
                  <LinkContainer id="navbar-font" to="/bb">
                    <Nav.Link>Bulletin Board</Nav.Link>
                  </LinkContainer>
                  <LinkContainer id="navbar-font" to="/directory">
                    <Nav.Link>Directory</Nav.Link>
                  </LinkContainer>
                  <LinkContainer id="navbar-font" to="/calendar">
                    <Nav.Link>Calendar</Nav.Link>
                  </LinkContainer>
                </NavDropdown>
                <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
