import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../style/Login.css';

export class RegisterPage extends Component {

 render() {
    return(
    <div className="registration-page">
      <h2>Registration</h2>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" />

        <label htmlFor="surname">Surame</label>
        <input type="text" id="surname" name="surname" />

        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />

        <label htmlFor="adress">Adress</label>
        <input type="text" id="adress" name="adress" />

        <label htmlFor="grad">City</label>
        <input type="text" id="city" name="city" />

        <button type="submit">Sign Up</button>
      </form>
    </div>
    )
 }
}