import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Variables } from '../Variables';
import '../style/Register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class RegisterPage extends Component {
  handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const surname = event.target.surname.value;
    const username = event.target.username.value;
    const password = event.target.password.value;
    const email = event.target.email.value;
    const address = event.target.address.value;
    const city = event.target.city.value;

    const korisnikData = {
      ime: name,
      prezime: surname,
      tipKorisnika: 'USER',
      username: username,
      password: password,
      email: email,
      adresa: address,
      grad: city,
    };

    try {
      const response = await fetch(Variables.API_URL + 'korisnici', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(korisnikData),
      });

      if (response.ok) {
        // Registration successful
        toast.success('Registration successful!', { autoClose: 2000 });
        // Redirect or perform any other actions after successful registration
        // For example, you can redirect to the login page
      } else {
        // Registration failed
        const responseData = await response.text();
        if (response.status === 422) {
          // Display the validation error message to the user
          toast.error('Registration failed: ' + responseData);
        } else {
          // Handle other error cases
          console.log('Registration failed:', responseData);
        }
      }
    } catch (error) {
      // Handle any network or other errors
      console.log('Error:', error);
    }
  };

  render() {
    return (
      <div className="registration-page">
        <h2>Registration</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="input-row">
            <label htmlFor="name">Name</label>
            <input className="left-input" type="text" id="name" name="name" />
            <label htmlFor="surname">Surname</label>
            <input className="right-input" type="text" id="surname" name="surname" />
          </div>
          <div className="input-row">
            <label htmlFor="username">Username</label>
            <input className="left-input" type="text" id="username" name="username" />
            <label htmlFor="password">Password</label>
            <input className="right-input" type="password" id="password" name="password" />
          </div>
          <div className="input-row">
            <label htmlFor="email">Email</label>
            <input className="left-input" type="email" id="email" name="email" />
            <label htmlFor="address">Address</label>
            <input className="right-input" type="text" id="address" name="address" />
          </div>
          <div className="input-row">
            <label htmlFor="city">City</label>
            <input className="left-input" type="text" id="city" name="city" />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p className='registration-p'>
          Already have an account? <Link to="/login" style={{ color: '#f44336' }}>Log in!</Link>
        </p>
      </div>
    );
  }
}
