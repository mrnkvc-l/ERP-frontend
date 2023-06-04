import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Variables } from '../Variables';
import '../style/MainPage.css';

export class Home extends Component {
  render() {
    return (
      <div className="main-page">
        <header className="hero-section">
          <div className="hero-content">
            <h1>Welcome to SneakerWorld</h1>
            <p>Find your perfect pair of sneakers</p>
            <Link to="/info" className="cta-button">
              Shop Now
            </Link>
          </div>
        </header>

        <section className="center-section">
          <div className="center-content">
            <h2>Discover the Latest Trends</h2>
            <p>Explore our curated selection of the hottest sneaker styles.</p>
          </div>
        </section>
        
        <section className="about-section">
          <h2>About Us</h2>
          <p>
            SneakerWorld is your one-stop destination for the latest and most
            stylish sneakers. We offer a wide range of sneakers from leading
            brands. Browse through our collection and find the perfect pair that
            matches your style.
          </p>
        </section>
        
        <section className="login-section">
          <h2>Log In / Register</h2>
          <p>
            Log in or register an account to get access to exclusive deals,
            updates, and more.
          </p>
          <Link to="/login" className="cta-button">
            Log In / Register
          </Link>
        </section>
        
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} SneakerWorld. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}
