import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Variables } from '../Variables';
import '../style/Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class LoginPage extends Component {

  handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await fetch(Variables.API_URL + 'auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);
        window.location.assign("http://localhost:5173/");
      } else {
        toast.error(<span style={{ color: 'black' }}>Login failed!</span>);
        console.log('Login failed');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  render() {
    return (
      <div className="login-page">
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />

          <button type="submit">Log In</button>
        </form>
        <p>
          Don't have an account? <Link to="/register" style={{ color: '#f44336' }}>Sign up!</Link>
        </p>
      </div>
    );
  }
}
