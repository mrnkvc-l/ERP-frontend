import React, { Component } from "react";
import { Variables } from "../Variables";
import "../style/User.css";

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isEditMode: false,
      updatedUser: null,
      racuni: [],
      expandedOrderId: null,
      sracuna: [],
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    const userId =
      decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    fetch(Variables.API_URL + "korisnici/" + userId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const user = data;
        this.setState({ user, updatedUser: { ...user } });
      })
      .catch((error) => {
        console.error("Error retrieving user information:", error);
      });

    fetch(Variables.API_URL + "racuni/kupac/" + userId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const racuni = data;
        this.setState({ racuni });
      });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      updatedUser: {
        ...prevState.updatedUser,
        [name]: value,
      },
    }));
  };

  toggleEditMode = () => {
    this.setState((prevState) => ({
      isEditMode: !prevState.isEditMode,
      updatedUser: { ...prevState.user },
    }));
  };

  handleUpdateUser = () => {
    const { updatedUser } = this.state;
    const token = localStorage.getItem("token");

    fetch(Variables.API_URL + "korisnici", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User updated:", data);
        this.setState((prevState) => ({
          user: { ...prevState.updatedUser },
          isEditMode: false,
        }));
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  toggleExpandedOrder = (orderId) => {
    this.setState((prevState) => ({
      expandedOrderId: prevState.expandedOrderId === orderId ? null : orderId,
    }));
    const token = localStorage.getItem("token");
    fetch(Variables.API_URL + "sracuna/" + orderId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sracuna = data;
        this.setState({ sracuna });
        console.log(sracuna);
      });
  };

  render() {
    const { user, isEditMode, updatedUser, racuni, expandedOrderId, sracuna } =
      this.state;

    return (
      <div className="najveci">
        <div className="user-page">
          <h1>User Page</h1>
          {user && (
            <div className="user-info">
              <h2>User Information</h2>
              <p>
                <span className="label">Name:</span>{" "}
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
                <span className="label">Last Name:</span>{" "}
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
                <span className="label">Username:</span>{" "}
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
                <span className="label">Email:</span>{" "}
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
                <span className="label">Password:</span>{" "}
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
                <span className="label">Address:</span>{" "}
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
                <span className="label">City:</span>{" "}
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
                  <button
                    className="save-button"
                    onClick={this.handleUpdateUser}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={this.toggleEditMode}
                  >
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
        <div className="racuni-page" style={{ width: "80%" }}>
          <h2>Previous orders:</h2>
          <div className="table-container" style={{ width: "80%" }}>
            <table>
              <thead style={{ backgroundColor: "black" }}>
                <tr>
                  <th>Date</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {racuni.map((rac) => (
                  <React.Fragment key={rac.idRacun}>
                    <tr key={rac.idRacun}>
                      <td>{new Date(rac.datum).toLocaleDateString()}</td>
                      <td>{rac.ukupnaCena}</td>
                      <td>
                        <button
                          onClick={() => this.toggleExpandedOrder(rac.idRacun)}
                        >
                          {expandedOrderId === rac.idRacun
                            ? "Hide details"
                            : "See details"}
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === rac.idRacun && (
                      <tr>
                        <td colSpan="3">
                          {sracuna &&
                            sracuna.map((item, index) => (
                              <React.Fragment key={item.id}>
                                <div>
                                  <p>
                                    Name: <a href={`http://localhost:5173/productPage/${item.proizvod.proizvodInfo.idInfo}`} style={{color: "white"}}>{item.proizvod.proizvodInfo.naziv}</a> 
                                  </p>
                                  <p>Size: {item.proizvod.velicina.oznaka}  Quantity: {item.kolicina}</p>
                                  <p>Price: {item.cena}</p>
                                </div>
                                {index !== sracuna.length - 1 && <hr />}
                              </React.Fragment>
                            ))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
