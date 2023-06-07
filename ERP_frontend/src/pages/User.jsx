import React, { Component } from 'react';
import { Variables } from '../Variables';
import '../style/User.css';

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isEditMode: false,
      updatedUser: null
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    console.log(decodedToken);
    console.log(userId);

    fetch(Variables.API_URL + 'korisnici/' + userId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const user = data;
        this.setState({ user, updatedUser: { ...user } });
      })
      .catch(error => {
        console.error('Error retrieving user information:', error);
      });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      updatedUser: {
        ...prevState.updatedUser,
        [name]: value
      }
    }));
  };

  toggleEditMode = () => {
    this.setState(prevState => ({
      isEditMode: !prevState.isEditMode,
      updatedUser: { ...prevState.user }
    }));
  };

  handleUpdateUser = () => {
    const { updatedUser } = this.state;
    const token = localStorage.getItem("token");
  
    fetch(Variables.API_URL + 'korisnici', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedUser)
    })
      .then(response => response.json())
      .then(data => {
        console.log('User updated:', data);
        this.setState(prevState => ({
          user: { ...prevState.updatedUser },
          isEditMode: false
        }));
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };
  

  render() {
    const { user, isEditMode, updatedUser } = this.state;

    return (
      <div className='najveci'>
        <div className="user-page">
          <h1>User Page</h1>
          {user && (
            <div className="user-info">
              <h2>User Information</h2>
              <p>
                <span className="label">Name:</span>{' '}
                {isEditMode ? (
                  <input
                    type="text"
                    name="ime"
                    value={updatedUser.ime}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  user.ime
                )}
              </p>
              <p>
                <span className="label">Last Name:</span>{' '}
                {isEditMode ? (
                  <input
                    type="text"
                    name="prezime"
                    value={updatedUser.prezime}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  user.prezime
                )}
              </p>
              <p>
                <span className="label">Username:</span>{' '}
                {isEditMode ? (
                  <input
                    type="text"
                    name="username"
                    value={updatedUser.username}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  user.username
                )}
              </p>
              <p>
                <span className="label">Email:</span>{' '}
                {isEditMode ? (
                  <input
                    type="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  user.email
                )}
              </p>
              <p>
                <span className="label">Password:</span>{' '}
                {isEditMode ? (
                  <input
                    type="password"
                    name="password"
                    value={updatedUser.password}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  user.password
                )}
              </p>
              <p>
                <span className="label">Address:</span>{' '}
                {isEditMode ? (
                  <input
                    type="text"
                    name="adresa"
                    value={updatedUser.adresa}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  user.adresa
                )}
              </p>
              <p>
                <span className="label">City:</span>{' '}
                {isEditMode ? (
                  <input
                    type="text"
                    name="grad"
                    value={updatedUser.grad}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  user.grad
                )}
              </p>
              {isEditMode ? (
                <div className="edit-buttons">
                  <button className="save-button" onClick={this.handleUpdateUser}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={this.toggleEditMode}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="edit-button" onClick={this.toggleEditMode}>
                  Edit User
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
