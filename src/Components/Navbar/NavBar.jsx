import React, { Fragment } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import "./NavBar.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../ReduxStore/auth";

const NavBar = () => {
  const userIsLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const userEmail = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
  };
  return (
    <Fragment>
      <Navbar expand="lg" variant="dark" bg="primary" className="navbar">
        <Container fluid>
          <Navbar.Brand>Mail Box Client</Navbar.Brand>
          {userIsLoggedIn && (
            <div className="user-welcome">
              <p>Welcome, {userEmail}</p>
              <Button
                className="logoutBtn"
                variant="danger"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </Container>
      </Navbar>
    </Fragment>
  );
};

export default NavBar;
