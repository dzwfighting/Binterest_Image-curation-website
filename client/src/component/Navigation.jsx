import React from "react";
import "../App.css";
import "../style/navigation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Navigation = () => {
  return (
    <div className="hei">
      <Navbar className="bg" expand="lg">
        <Container>
          {/* <Navbar.Brand href="/">All Images List</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="dis">
                All Images List
              </Nav.Link>
              <Nav.Link href="/my-bin" className="dis">
                Bin
              </Nav.Link>
              <Nav.Link href="/my-posts" className="dis">
                All Upload images
              </Nav.Link>
              <Nav.Link href="/new-post" className="dis">
                Upload posts
              </Nav.Link>
              <Nav.Link href="/popularity" className="dis">
                Popularity
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/">
          All Images List
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/my-bin">
          Bin
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/my-posts">
          All Upload images
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/new-post">
          Upload posts
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/popularity">
          Popularity
        </Link>
      </div> */}
    </div>
  );
};

export default Navigation;
