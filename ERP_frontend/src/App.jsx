import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import { Proizvodjac } from "./pages/Proizvodjac";
import { Home } from "./pages/Home";
//import { Kolekcija } from "./pages/Kolekcija";
//import { Kategorija } from "./pages/Kategorija";
//import { ProizvodInfo } from "./pages/ProizvodInfo";
import { About } from "./pages/About";
//import { Proizvod } from "./pages/Proizvod";
import { Korisnik } from "./pages/Korisnik";
import { BrowserRouter, Route, NavLink, Routes } from 'react-router-dom';
import './App.css'
import LoginPage from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { ProductList } from "./pages/ProductList";
import { FaShoppingCart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = atob(token.split(".")[1]);
      console.log(decodedToken); // Print the decoded token to the console
      const {
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
      } = JSON.parse(decodedToken);
      return role;
    }
    return null;
  };

  const isAdmin = getUserRole() === "ADMIN";

  return (
    <BrowserRouter>
      <div className="navigation-bar">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={NavLink} to="/">
              Home
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link as={NavLink} to="/info">
                  Proizvodi
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about">
                  About Us
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login">
                  Login/Register
                </Nav.Link>
                {isAdmin && (
                  <Nav.Link as={NavLink} to="/korisnik">
                    Korisnici
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
            <Navbar.Brand as={NavLink} to="/cart">
              <FaShoppingCart className="cart-icon" />
            </Navbar.Brand>
          </Container>
        </Navbar>
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/info" element={<ProductList />} />
            <Route path="/about" element={<About />} />
            <Route path="/korisnik" element={<Korisnik />} />
          </Routes>
        </Container>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
