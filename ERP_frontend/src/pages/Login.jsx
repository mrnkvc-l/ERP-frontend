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
        // Login successful
        const data = await response.json();
        const token = data.token;

        console.log(data);
        
        // Handle the token, e.g., store it in local storage
        localStorage.setItem('token', token);

        toast.success('Login successful!', { autoClose: 2000 });
        // Redirect or perform any other actions after successful login
        // For example, you can redirect to the home page
        
      } else {
        // Login failed
        console.log('Login failed');
      }
    } catch (error) {
      // Handle any network or other errors
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
          Don't have an account? <Link to="/register">Sign up!</Link>
        </p>
      </div>
    );
  }
}

/*
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Variables } from '../Variables';
import '../style/Login.css';

class LoginPage extends Component {
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
        // Login successful
        const data = await response.json();
        const token = data.token;

        // Handle the token, e.g., store it in local storage
        localStorage.setItem('token', token);

        // Redirect or perform any other actions after successful login
        // For example, you can redirect to the home page
        this.props.history.push('/');
      } else {
        // Login failed
        console.log('Login failed');
      }
    } catch (error) {
      // Handle any network or other errors
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
          Don't have an account? <Link to="/register">Sign up!</Link>
        </p>
      </div>
    );
  }
}

export default LoginPage;

*/ 
