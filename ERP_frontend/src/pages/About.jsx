import React, { Component } from 'react';
import '../style/About.css';

export class About extends Component {
  render() {
    return (
      <div className="about-container">
        <header>
          <h1 className="about-title">Welcome to Our Store</h1>
        </header>
        <main>
          <section className="about-section">
            <h2 className="about-section-title">About Us</h2>
            <p className="about-section-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              hendrerit dui in risus volutpat, nec luctus odio aliquet. Donec
              pretium velit id risus convallis, vitae eleifend libero ultrices.
            </p>
          </section>
          <section className="about-section">
            <h2 className="about-section-title">Contact Us</h2>
            <p className="about-section-description">
              If you have any questions or need assistance, please don't hesitate
              to contact us.
            </p>
            <p className="contact-info">Email: info@example.com</p>
            <p className="contact-info">Phone: 123-456-7890</p>
          </section>
        </main>
        <footer>
          <p className="footer-text">&copy; {new Date().getFullYear()} Our Store. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}
