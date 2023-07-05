import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Korisnik } from "./pages/Korisnik";
import { BrowserRouter, Route, NavLink, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { ProductList } from "./pages/ProductList";
import { FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { React } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import ProductPage from "./pages/ProductPage";
import CartTable from "./pages/Cart";
import UserPage from "./pages/User";
import { Orders } from "./pages/Orders";
import { Admin } from "./pages/Admin";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

function logout() {
  localStorage.clear();
  decodedRole = "";
  window.location.reload();
}

//const stripePromise = loadStripe("pk_test_51NFGyvEvevgtQ9r2tK7CZjKkoi47gg3ZY5vyFqdShriSCKJaSY9gRetFi0d1Gaa7eECqD4HE4riQ8g7Np9m0bWxA00F3INjZ0d");

function App() {
  const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = atob(token.split(".")[1]);
        const {
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
        } = JSON.parse(decodedToken);
        return role;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return null;
  };

  const isAdmin = getUserRole() === "ADMIN";
  const notlogedin = getUserRole() === null;

  return (
    <BrowserRouter>
      <div className="navigation-bar">
        <Navbar expand="lg">
          <Container>
            <Navbar.Brand as={NavLink} to="/">
              Home
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ml-auto" style={{ color: "#f2f2f2" }}>
                <Nav.Link as={NavLink} to="/info">
                  Products
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about">
                  About Us
                </Nav.Link>
                {notlogedin && (
                  <Nav.Link as={NavLink} to="/login">
                    Login/Register
                  </Nav.Link>
                )}
                {isAdmin && (
                  <Nav.Link as={NavLink} to="/korisnik">
                    Korisnici
                  </Nav.Link>
                )}
                {isAdmin && (
                  <Nav.Link as={NavLink} to="/admin">
                    Admin
                  </Nav.Link>
                )}
                {isAdmin && (
                  <Nav.Link as={NavLink} to="/orders">
                    ORDERS
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
            {!notlogedin && (
              <Navbar.Brand as={NavLink} to="/" onClick={() => logout()}>
                <Button className="logout-button">Log out</Button>
              </Navbar.Brand>
            )}
            {!notlogedin && (
              <Navbar.Brand as={NavLink} to="/cart">
                <FaShoppingCart className="cart-icon" />
              </Navbar.Brand>
            )}
            {!notlogedin && (
              <Navbar.Brand as={NavLink} to="/user">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                </svg>
              </Navbar.Brand>
            )}
          </Container>
        </Navbar>
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/info" element={<ProductList isAdmin={isAdmin} />} />
            <Route path="/about" element={<About />} />
            <Route path="/korisnik" element={<Korisnik />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cart" element={<CartTable />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/productPage/:idInfo"
              element={<ProductPage isAdmin={isAdmin} />}
            />
            <Route path="/user" element={<UserPage />} />
          </Routes>
        </Container>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
