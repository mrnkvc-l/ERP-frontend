import React, { Component } from "react";
import { Variables } from "../Variables";
import "../style/Admin.css";

export class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      proizvodi: [],

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
        console.log(data);
        this.setState({ velicine: data });
      });
    fetch(Variables.API_URL + "proizvodjaci")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ proizvodjaci: data });
      });

    fetch(Variables.API_URL + "kolekcije")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ kolekcije: data });
      });

    fetch(Variables.API_URL + "kategorije")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ kategorije: data });
      });

    fetch(Variables.API_URL + "proizvodi")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
    const velicina = this.state.velicine.find(
      (pdj) => pdj.idVelicina === id
    );

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

  handleProizvodjacAdd = () => {
    this.setState({
      modalProizvodjac: true,
      newProizvodjac: {
        idProizvodjac: "",
        naziv: "",
        adresa: "",
      },
    });
  };

  handleInputChangeProizvodjac = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newProizvodjac: {
        ...prevState.newProizvodjac,
        [name]: value,
      },
    }));
  };

  handleProizvodjacSubmit = (e) => {
    e.preventDefault();
    const { newProizvodjac } = this.state;
    const token = localStorage.getItem("token");

    if (newProizvodjac.idProizvodjac) {
      this.updateProizvodjac(newProizvodjac, token);
    } else {
      this.addProizvodjac(newProizvodjac, token);
    }
  };

  addProizvodjac = (proizvodjac, token) => {
    fetch(Variables.API_URL + "proizvodjaci", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(proizvodjac),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Proizvodjac added:", data);
        this.refreshList();
        this.setState({ modalProizvodjac: false });
      })
      .catch((error) => {
        console.error("Error adding proizvodjac:", error);
      });
  };

  updateProizvodjac = (proizvodjac, token) => {
    fetch(Variables.API_URL + `proizvodjaci`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(proizvodjac),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Proizvodjac updated:", data);
        this.refreshList();
        this.setState({ modalProizvodjac: false });
      })
      .catch((error) => {
        console.error("Error updating proizvodjac:", error);
      });
  };

  handleProizvodjacEdit = (id) => {
    const proizvodjac = this.state.proizvodjaci.find(
      (pdj) => pdj.idProizvodjac === id
    );

    this.setState({
      newProizvodjac: {
        idProizvodjac: proizvodjac.idProizvodjac,
        naziv: proizvodjac.naziv,
        adresa: proizvodjac.adresa,
      },
      modalProizvodjac: true,
    });
  };

  handleProizvodjacDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this proizvodjac?"
      )
    ) {
      const token = localStorage.getItem("token");

      fetch(Variables.API_URL + `proizvodjaci/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            this.setState((prevState) => ({
              proizvodjaci: prevState.proizvodjaci.filter(
                (pdj) => pdj.idProizvodjac !== id
              ),
              error: null,
            }));
          } else {
            throw new Error("Failed to delete proizvodjac");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setState({
            error: error.message || "Failed to delete proizvodjac",
          });
        });
    }
  };

  handleKategorijaAdd = () => {
    this.setState({
      modalKategorija: true,
      newKategorija: {
        idKategorija: "",
        naziv: "",
        opis: "",
      },
    });
  };

  handleInputChangeKategorija = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newKategorija: {
        ...prevState.newKategorija,
        [name]: value,
      },
    }));
  };

  handleKategorijaSubmit = (e) => {
    e.preventDefault();
    const { newKategorija } = this.state;
    const token = localStorage.getItem("token");

    if (newKategorija.idKategorija) {
      this.updateKategorija(newKategorija, token);
    } else {
      this.addKategorija(newKategorija, token);
    }
  };

  addKategorija = (kategorija, token) => {
    fetch(Variables.API_URL + "kategorije", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(kategorija),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Kategorija added:", data);
        this.refreshList();
        this.setState({ modalKategorija: false });
      })
      .catch((error) => {
        console.error("Error adding kategorija:", error);
      });
  };

  updateKategorija = (kategorija, token) => {
    fetch(Variables.API_URL + `kategorije`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(kategorija),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Kategorija updated:", data);
        this.refreshList();
        this.setState({ modalKategorija: false });
      })
      .catch((error) => {
        console.error("Error updating kategorija:", error);
      });
  };

  handleKategorijaEdit = (id) => {
    const kategorija = this.state.kategorije.find(
      (pdj) => pdj.idKategorija === id
    );

    this.setState({
      newKategorija: {
        idKategorija: kategorija.idKategorija,
        naziv: kategorija.naziv,
        opis: kategorija.opis,
      },
      modalKategorija: true,
    });
  };

  handleKategorijaDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this kategorija?"
      )
    ) {
      const token = localStorage.getItem("token");

      fetch(Variables.API_URL + `kategorije/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            this.setState((prevState) => ({
              kategorije: prevState.kategorije.filter(
                (pdj) => pdj.idKategorija !== id
              ),
              error: null,
            }));
          } else {
            throw new Error("Failed to delete kategorija");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setState({
            error: error.message || "Failed to delete kategorija",
          });
        });
    }
  };

  handleKolekcijaAdd = () => {
    this.setState({
      modalKolekcija: true,
      newKolekcija: {
        idKolekcija: "",
        naziv: "",
        opis: "",
      },
    });
  };

  handleInputChangeKolekcija = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newKolekcija: {
        ...prevState.newKolekcija,
        [name]: value,
      },
    }));
  };

  handleKolekcijaSubmit = (e) => {
    e.preventDefault();
    const { newKolekcija } = this.state;
    const token = localStorage.getItem("token");

    if (newKolekcija.idKolekcija) {
      this.updateKolekcija(newKolekcija, token);
    } else {
      this.addKolekcija(newKolekcija, token);
    }
  };

  addKolekcija = (kolekcija, token) => {
    fetch(Variables.API_URL + "kolekcije", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(kolekcija),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Kolekcija added:", data);
        this.refreshList();
        this.setState({ modalKolekcija: false });
      })
      .catch((error) => {
        console.error("Error adding kolekcija:", error);
      });
  };

  updateKolekcija = (kolekcija, token) => {
    fetch(Variables.API_URL + `kolekcije`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(kolekcija),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Kolekcija updated:", data);
        this.refreshList();
        this.setState({ modalKolekcija: false });
      })
      .catch((error) => {
        console.error("Error updating kolekcija:", error);
      });
  };

  handleKolekcijaEdit = (id) => {
    const kolekcija = this.state.kolekcije.find(
      (pdj) => pdj.idKolekcija === id
    );

    this.setState({
      newKolekcija: {
        idKolekcija: kolekcija.idKolekcija,
        naziv: kolekcija.naziv,
        opis: kolekcija.opis,
      },
      modalKolekcija: true,
    });
  };

  handleKolekcijaDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this kolekcija?"
      )
    ) {
      const token = localStorage.getItem("token");

      fetch(Variables.API_URL + `kolekcije/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            this.setState((prevState) => ({
              kolekcije: prevState.kolekcije.filter(
                (pdj) => pdj.idKolekcija !== id
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
                    onClick={() =>
                      this.handleVelicinaEdit(pdj.idVelicina)
                    }
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
                    onClick={() =>
                      this.handleVelicinaDelete(pdj.idVelicina)
                    }
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
              <th>IDProizvodjac</th>
              <th>Naziv</th>
              <th>Adresa</th>
              <th>
                <button
                  type="button"
                  className="btn btn-light btn-sm float-right"
                  onClick={this.handleProizvodjacAdd}
                >
                  Add
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {proizvodjaci.map((pdj) => (
              <tr key={pdj.idProizvodjac}>
                <td>{pdj.idProizvodjac}</td>
                <td>{pdj.naziv}</td>
                <td>{pdj.adresa}</td>
                <td>
                  <button
                    type="button"
                    className="btn mr-1"
                    onClick={() =>
                      this.handleProizvodjacEdit(pdj.idProizvodjac)
                    }
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
                    onClick={() =>
                      this.handleProizvodjacDelete(pdj.idProizvodjac)
                    }
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

        {/* Modal for adding new proizvodjac */}
        <div
          className={`modal ${modalProizvodjac ? "show" : ""}`}
          style={{ display: modalProizvodjac ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "black" }}>
                  Modal Proizvodjac
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
                <form onSubmit={this.handleProizvodjacSubmit}>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="naziv" style={{ color: "black" }}>
                      Naziv
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="naziv"
                      name="naziv"
                      style={{ color: "black" }}
                      value={newProizvodjac.naziv}
                      onChange={this.handleInputChangeProizvodjac}
                    />
                  </div>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="adresa" style={{ color: "black" }}>
                      Adresa
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="adresa"
                      name="adresa"
                      style={{ color: "black" }}
                      value={newProizvodjac.adresa}
                      onChange={this.handleInputChangeProizvodjac}
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
              <th>IDKolekcija</th>
              <th>Naziv</th>
              <th>Opis</th>
              <th>
                <button
                  type="button"
                  className="btn btn-light btn-sm float-right"
                  onClick={this.handleKolekcijaAdd}
                >
                  Add
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {kolekcije.map((pdj) => (
              <tr key={pdj.idKolekcija}>
                <td>{pdj.idKolekcija}</td>
                <td>{pdj.naziv}</td>
                <td>{pdj.opis}</td>
                <td>
                  <button
                    type="button"
                    className="btn mr-1"
                    onClick={() => this.handleKolekcijaEdit(pdj.idKolekcija)}
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
                    onClick={() => this.handleKolekcijaDelete(pdj.idKolekcija)}
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

        {/* Modal for adding new kolekcija */}
        <div
          className={`modal ${modalKolekcija ? "show" : ""}`}
          style={{ display: modalKolekcija ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "black" }}>
                  Modal Kolekcija
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
                <form onSubmit={this.handleKolekcijaSubmit}>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="naziv" style={{ color: "black" }}>
                      Naziv
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="naziv"
                      name="naziv"
                      style={{ color: "black" }}
                      value={newKolekcija.naziv}
                      onChange={this.handleInputChangeKolekcija}
                    />
                  </div>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="opis" style={{ color: "black" }}>
                      Opis
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="opis"
                      name="opis"
                      style={{ color: "black" }}
                      value={newKolekcija.opis}
                      onChange={this.handleInputChangeKolekcija}
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
              <th>IDKategorija</th>
              <th>Naziv</th>
              <th>Opis</th>
              <th>
                <button
                  type="button"
                  className="btn btn-light btn-sm float-right"
                  onClick={this.handleKategorijaAdd}
                >
                  Add
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {kategorije.map((pdj) => (
              <tr key={pdj.idKategorija}>
                <td>{pdj.idKategorija}</td>
                <td>{pdj.naziv}</td>
                <td>{pdj.opis}</td>
                <td>
                  <button
                    type="button"
                    className="btn mr-1"
                    onClick={() => this.handleKategorijaEdit(pdj.idKategorija)}
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
                    onClick={() =>
                      this.handleKategorijaDelete(pdj.idKategorija)
                    }
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

        {/* Modal for adding new kategorija */}
        <div
          className={`modal ${modalKategorija ? "show" : ""}`}
          style={{ display: modalKategorija ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "black" }}>
                  Modal Kategorija
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
                <form onSubmit={this.handleKategorijaSubmit}>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="naziv" style={{ color: "black" }}>
                      Naziv
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="naziv"
                      name="naziv"
                      style={{ color: "black" }}
                      value={newKategorija.naziv}
                      onChange={this.handleInputChangeKategorija}
                    />
                  </div>
                  <div className="form-group" style={{ color: "black" }}>
                    <label htmlFor="opis" style={{ color: "black" }}>
                      Opis
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="opis"
                      name="opis"
                      style={{ color: "black" }}
                      value={newKategorija.opis}
                      onChange={this.handleInputChangeKategorija}
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
                  <button type="button" className="btn mr-1">
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
      </div>
    );
  }
}
