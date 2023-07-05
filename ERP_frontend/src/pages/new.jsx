import React, { Component } from "react";
import { Variables } from "../Variables";
import "../style/Admin.css";

export class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      kolekcije: [],
      modalKolekcija: false,
      newKolekcija: {
        naziv: "",
        opis: "",
      },
    };
  }

  refreshList() {
    fetch(Variables.API_URL + "kolekcije")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ kolekcije: data });
      });
  }

  componentDidMount() {
    this.refreshList();
  }

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

  handleModalClose = () => {
    this.setState({ modalKolekcija: false });
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
    const { kolekcije, modalKolekcija, newKolekcija } = this.state;

    return (
      <div>
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
                    onClick={() =>
                      this.handleKolekcijaEdit(pdj.idKolekcija)
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
                      this.handleKolekcijaDelete(pdj.idKolekcija)
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
      </div>
    );
  }
}
