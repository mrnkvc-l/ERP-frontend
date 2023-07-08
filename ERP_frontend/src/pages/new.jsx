import React, { Component } from "react";
import { Variables } from "../Variables";
import "../style/Admin.css";

export class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      proizvodi: [],
      modalProizvod: false,
      newProizvod: {
        idProizvod: 0,
        idProizvodInfo: 0,
        idVelicina: 0,
        ukupnaKolicina: 0,
      },
      infoi: [],

      velicine: [],
      modalVelicina: false,
      newVelicina: {
        oznaka: "",
      },
      proizvodjaci: [],
      modalProizvodjac: false,
      newProizvodjac: {
        naziv: "",
        adresa: "",
      },
      kategorije: [],
      modalKategorija: false,
      newKategorija: {
        naziv: "",
        opis: "",
      },
      kolekcije: [],
      modalKolekcija: false,
      newKolekcija: {
        naziv: "",
        opis: "",
      },
    };
  }

  refreshList() {
    fetch(Variables.API_URL + "velicine")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ velicine: data });
      });
    fetch(Variables.API_URL + "proizvodjaci")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ proizvodjaci: data });
      });
    fetch(Variables.API_URL + "infoi")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ infoi: data });
      });

    fetch(Variables.API_URL + "kolekcije")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ kolekcije: data });
      });

    fetch(Variables.API_URL + "kategorije")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ kategorije: data });
      });

    fetch(Variables.API_URL + "proizvodi")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ proizvodi: data });
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  handleModalClose = () => {
    this.setState({
      modalVelicina: false,
      modalProizvodjac: false,
      modalKategorija: false,
      modalKolekcija: false,
      modalProizvod: false,
    });
  };

  handleVelicinaAdd = () => {
    this.setState({
      modalVelicina: true,
      newVelicina: {
        idVelicina: "",
        oznaka: "",
      },
    });
  };

  handleInputChangeVelicina = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newVelicina: {
        ...prevState.newVelicina,
        [name]: value,
      },
    }));
  };

  handleVelicinaSubmit = (e) => {
    e.preventDefault();
    const { newVelicina } = this.state;
    const token = localStorage.getItem("token");

    if (newVelicina.idVelicina) {
      this.updateVelicina(newVelicina, token);
    } else {
      this.addVelicina(newVelicina, token);
    }
  };

  addVelicina = (velicina, token) => {
    fetch(Variables.API_URL + "velicine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(velicina),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Velicina added:", data);
        this.refreshList();
        this.setState({ modalVelicina: false });
      })
      .catch((error) => {
        console.error("Error adding velicina:", error);
      });
  };

  updateVelicina = (velicina, token) => {
    fetch(Variables.API_URL + `velicine`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(velicina),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Velicina updated:", data);
        this.refreshList();
        this.setState({ modalVelicina: false });
      })
      .catch((error) => {
        console.error("Error updating velicina:", error);
      });
  };

  handleVelicinaEdit = (id) => {
    const velicina = this.state.velicine.find((pdj) => pdj.idVelicina === id);

    this.setState({
      newVelicina: {
        idVelicina: velicina.idVelicina,
        oznaka: velicina.oznaka,
      },
      modalVelicina: true,
    });
  };

  handleVelicinaDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this velicina?"
      )
    ) {
      const token = localStorage.getItem("token");

      fetch(Variables.API_URL + `velicine/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            this.setState((prevState) => ({
              velicine: prevState.velicine.filter(
                (pdj) => pdj.idVelicina !== id
              ),
              error: null,
            }));
          } else {
            throw new Error("Failed to delete velicina");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setState({
            error: error.message || "Failed to delete velicina",
          });
        });
    }
  };

  handleProizvodDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this proizvod?"
      )
    ) {
      const token = localStorage.getItem("token");

      fetch(Variables.API_URL + `proizvodi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            this.setState((prevState) => ({
              proizvodi: prevState.proizvodi.filter(
                (pro) => pro.idProizvod !== id
              ),
              error: null,
            }));
          } else {
            throw new Error("Failed to delete kolekcija");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setState({
            error: error.message || "Failed to delete kolekcija",
          });
        });
    }
  };

  handleProizvodEdit = (id) => {
    const proizvod = this.state.proizvodi.find((pro) => pro.idProizvod === id);

    this.setState({
      newProizvod: {
        idProizvod: proizvod.idProizvod,
        idProizvodInfo: proizvod.proizvodInfo.idInfo,
        idVelicina: proizvod.velicina.idVelicina,
        ukupnaKolicina: proizvod.ukupnaKolicina,
      },
      modalProizvod: true,
    });
  };

  handleInputChangeProizvod = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newProizvod: {
        ...prevState.newProizvod,
        [name]: value,
      },
    }));
  };

  handleProizvodSubmit = (e) => {
    e.preventDefault();
    const newProizvod = this.state.newProizvod;
    const token = localStorage.getItem("token");

    this.updateProizvod(newProizvod, token);
  }

  updateProizvod = (proizvod, token) => {
    fetch(Variables.API_URL + `proizvodi`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(proizvod),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Proizvod updated:", data);
        this.refreshList();
        this.setState({ modalProizvod: false });
      })
      .catch((error) => {
        console.error("Error updating proizvod:", error);
      });
  };

  render() {
    const {
      velicine,
      proizvodjaci,
      kolekcije,
      kategorije,
      proizvodi,
      modalVelicina,
      newVelicina,
      modalProizvodjac,
      newProizvodjac,
      modalKategorija,
      newKategorija,
      modalKolekcija,
      newKolekcija,
      modalProizvod,
      newProizvod,
      infoi,
    } = this.state;

    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>IDVelicina</th>
              <th>Oznaka</th>
              <th>
                <button
                  type="button"
                  className="btn btn-light btn-sm float-right"
                  onClick={this.handleVelicinaAdd}
                >
                  Add
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {velicine.map((pdj) => (
              <tr key={pdj.idVelicina}>
                <td>{pdj.idVelicina}</td>
                <td>{pdj.oznaka}</td>
                <td>
                  <button
                    type="button"
                    className="btn mr-1"
                    onClick={() => this.handleVelicinaEdit(pdj.idVelicina)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="btn mr-1"
                    onClick={() => this.handleVelicinaDelete(pdj.idVelicina)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for adding new velicina */}
        <div
          className={`modal ${modalVelicina ? "show" : ""}`}
          style={{ display: modalVelicina ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "black" }}>
                  Modal Velicina
                </h5>
                <button
                  type="button"
                  className="close"
                  style={{ color: "black", backgroundColor: "red" }}
                  onClick={this.handleModalClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ color: "black" }}>
                <form onSubmit={this.handleVelicinaSubmit}>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="oznaka" style={{ color: "black" }}>
                      Oznaka
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="oznaka"
                      name="oznaka"
                      style={{ color: "black" }}
                      value={newVelicina.oznaka}
                      onChange={this.handleInputChangeVelicina}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ color: "black" }}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>IDProizvod</th>
              <th>Kolicina</th>
              <th>Naziv</th>
              <th>Velicina</th>
            </tr>
          </thead>
          <tbody>
            {proizvodi.map((pro) => (
              <tr key={pro.idProizvod}>
                <td>{pro.idProizvod}</td>
                <td>{pro.ukupnaKolicina}</td>
                <td>{pro.proizvodInfo.naziv}</td>
                <td>{pro.velicina.oznaka}</td>
                <td>
                  <button
                    type="button"
                    className="btn mr-1"
                    onClick={() => this.handleProizvodEdit(pro.idProizvod)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  </button>
                  <button type="button" className="btn mr-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                      onClick={() => this.handleProizvodDelete(pro.idProizvod)}
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for adding new proizvod */}
        <div
          className={`modal ${modalProizvod ? "show" : ""}`}
          style={{ display: modalProizvod ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "black" }}>
                  Modal Proizvod
                </h5>
                <button
                  type="button"
                  className="close"
                  style={{ color: "black", backgroundColor: "red" }}
                  onClick={this.handleModalClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ color: "black" }}>
                <form onSubmit={this.handleProizvodSubmit}>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="oznaka" style={{ color: "black" }}>
                      Info
                    </label>
                    <select
                      className="form-control"
                      id="idProizvodInfo"
                      name="idProizvodInfo"
                      style={{ color: "black", height: "40px"}}
                      value={newProizvod.idProizvodInfo}
                      onChange={this.handleInputChangeProizvod}
                      required
                    >
                      <option value="" style={{ color: "black" }}>Select Info</option>
                      {infoi.map((info) => (
                        <option key={info.idInfo} value={info.idInfo} style={{ color: "black" }}>
                          {info.naziv}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="oznaka" style={{ color: "black" }}>
                      Velicina
                    </label>
                    <select
                      className="form-control"
                      id="idVelicina"
                      name="idVelicina"
                      style={{ color: "black" }}
                      value={newProizvod.idVelicina}
                      onChange={this.handleInputChangeProizvod}
                      required
                    >
                      <option value="" style={{ color: "black" }}>Select Velicina</option>
                      {velicine.map((velicina) => (
                        <option
                          key={velicina.idVelicina}
                          value={velicina.idVelicina}
                          style={{ color: "black" }}
                        >
                          {velicina.oznaka}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="oznaka" style={{ color: "black" }}>
                      Kolicina
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ukupnaKolicina"
                      name="ukupnaKolicina"
                      style={{ color: "black" }}
                      value={newProizvod.ukupnaKolicina}
                      onChange={this.handleInputChangeProizvod}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ color: "black" }}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
