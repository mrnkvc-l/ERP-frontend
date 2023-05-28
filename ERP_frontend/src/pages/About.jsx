import React, { Component } from 'react';

export class About extends Component {
  render() {
    return (
        <div>
        <header>
          <h1>Welcome to Our Store</h1>
        </header>
        <main>
          <section>
            <h2>About Us</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              hendrerit dui in risus volutpat, nec luctus odio aliquet. Donec
              pretium velit id risus convallis, vitae eleifend libero ultrices.
            </p>
          </section>
          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions or need assistance, please don't hesitate
              to contact us.
            </p>
            <p>Email: info@example.com</p>
            <p>Phone: 123-456-7890</p>
          </section>
        </main>
        <footer>
          <p>&copy; {new Date().getFullYear()} Our Store. All rights reserved.</p>
        </footer>
      </div>
    )
  }
}
