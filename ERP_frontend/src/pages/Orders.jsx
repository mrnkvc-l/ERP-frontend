import React, { Component } from "react";
import { Variables } from "../Variables";
import "../style/Orders.css";

export class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      racuni: [],
      expandedOrderId: null,
      sracuna: [],
      modal: false,
      putRacun: {
        idRacun: null,
        kupac: null,
        datum: null,
        ukupnaCena: null,
      },
      modalItem: false,
      putStavka: {
        idRacun: null,
        idStavkaRacuna: null,
        cena: null,
        kolicina: null,
        popust: null,
        proizvod: null,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    const token = localStorage.getItem("token");

    fetch(Variables.API_URL + "racuni", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const racuni = data;
        this.setState({ racuni });
      })
      .catch((error) => {
        console.error("Error retrieving user information:", error);
      });
  }

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

  handleDelete = (orderId) => {
    if (
      window.confirm("Are you sure you want to permanently delete this order?")
    ) {
      const token = localStorage.getItem("token");

      fetch(Variables.API_URL + `racuni/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            this.setState((prevState) => ({
              racuni: prevState.racuni.filter((rac) => rac.idRacun !== orderId),
              error: null,
            }));
          } else {
            throw new Error("Failed to delete order");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setState({
            error: error.message || "Failed to delete order",
          });
        });
    }
  };

  handleUpdate = (id) => {
    console.log(id);

    const racun = this.state.racuni.find((rac) => rac.idRacun === id);

    console.log(racun);

    this.openModal(racun);
  };

  openModal = (racun) => {
    this.setState({
      modal: true,
      putRacun: {
        idRacun: racun.idRacun,
        kupac: racun.kupac,
        datum: racun.datum,
        ukupnaCena: racun.ukupnaCena,
      },
    });
  };

  closeModal = () => {
    this.setState({
      modal: false,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      putRacun: {
        ...prevState.putRacun,
        [name]: value,
      },
    }));
  };

  saveEdit = () => {
    const token = localStorage.getItem("token");

    fetch(Variables.API_URL + "racuni", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        idRacun: this.state.putRacun.idRacun,
        idKupac: this.state.putRacun.kupac.idKorisnik,
        ukupnaCena: this.state.putRacun.ukupnaCena,
        datum: this.state.putRacun.datum,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.refreshList();
        this.setState({ modal: false });
      })
      .catch((error) => {
        console.error("Error updating racun:", error);
      });
  };

  handleDeleteStavka = (idStavka, idRacun) => {
    if (
      window.confirm("Are you sure you want to permanently delete this stavka?")
    ) {
      const token = localStorage.getItem("token");

      fetch(Variables.API_URL + `sracuna/${idStavka}/${idRacun}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.reload();
          } else {
            throw new Error("Failed to delete order");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setState({
            error: error.message || "Failed to delete order",
          });
        });
    }
  };

  handleUpdateStavka = (stavka) => {
    console.log(stavka);
    this.openItemModal(stavka);
  };

  openItemModal = (stavka) => {
    this.setState({
      modalItem: true,
      putStavka: {
        idRacun: stavka.racun.idRacun,
        idStavkaRacuna: stavka.idStavkaRacuna,
        cena: stavka.cena,
        kolicina: stavka.kolicina,
        popust: stavka.popust,
        proizvod: stavka.proizvod.idProizvod,
      },
    });
  };

  closeItemModal = () => {
    this.setState({
      modalItem: false,
    });
  };

  handleChangeItem = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      putStavka: {
        ...prevState.putStavka,
        [name]: value,
      },
    }));
  };

  saveEditItem = () => {
    const token = localStorage.getItem("token");

    fetch(Variables.API_URL + "sracuna", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        idRacun: this.state.putStavka.idRacun,
        idStavkaRacuna: this.state.putStavka.idStavkaRacuna,
        cena: this.state.putStavka.cena,
        kolicina: this.state.putStavka.kolicina,
        popust: this.state.putStavka.popust,
        idProizvod: this.state.putStavka.proizvod,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ modalItem: false });
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating stavka:", error);
      });
  };

  render() {
    const {
      racuni,
      expandedOrderId,
      sracuna,
      modal,
      putRacun,
      modalItem,
      putStavka,
    } = this.state;

    return (
      <div style={{ minHeight: "80vh" }}>
        <div className="table-container" style={{ width: "80vw" }}>
          {modal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={this.closeModal}>
                  &times;
                </span>
                <h2>Edit Racun</h2>
                <div>
                  <label htmlFor="edit-kupac">Kupac:</label>
                  <input
                    type="text"
                    id="edit-kupac"
                    value={putRacun.kupac.idKorisnik}
                    disabled
                    onChange={(e) =>
                      this.setState({
                        putRacun: {
                          ...putRacun,
                          kupac: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="edit-datum">Datum:</label>
                  <input
                    type="date"
                    id="edit-datum"
                    value={new Date(putRacun.datum).toISOString().substr(0, 10)}
                    onChange={(e) =>
                      this.setState({
                        putRacun: {
                          ...putRacun,
                          datum: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="edit-cena">Cena:</label>
                  <input
                    type="number"
                    id="edit-cena"
                    value={putRacun.ukupnaCena}
                    onChange={(e) =>
                      this.setState({
                        putRacun: {
                          ...putRacun,
                          ukupnaCena: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <button onClick={this.saveEdit}>Save</button>
                  <button onClick={this.closeModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          {modalItem && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={this.closeItemModal}>
                  &times;
                </span>
                <h2>Edit Stavka</h2>
                <div>
                  <label htmlFor="edit-item-cena">Cena:</label>
                  <input
                    type="number"
                    id="edit-item-cena"
                    value={putStavka.cena}
                    onChange={(e) =>
                      this.setState({
                        putStavka: {
                          ...putStavka,
                          cena: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="edit-item-kolicina">Kolicina:</label>
                  <input
                    type="number"
                    id="edit-item-kolicina"
                    value={putStavka.kolicina}
                    onChange={(e) =>
                      this.setState({
                        putStavka: {
                          ...putStavka,
                          kolicina: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="edit-item-popust">Popust:</label>
                  <input
                    type="number"
                    id="edit-item-popust"
                    value={putStavka.popust}
                    onChange={(e) =>
                      this.setState({
                        putStavka: {
                          ...putStavka,
                          popust: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <button onClick={this.saveEditItem}>Save</button>
                  <button onClick={this.closeItemModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          <table>
            <thead style={{ backgroundColor: "black" }}>
              <tr>
                <th>User</th>
                <th>Date</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {racuni.map((rac) => (
                <React.Fragment key={rac.idRacun}>
                  <tr key={rac.idRacun}>
                    <td>
                      <a
                        href={`http://localhost:5173/user/${rac.kupac.idKorisnik}`}
                        style={{ color: "white" }}
                      >
                        {rac.kupac.ime}
                      </a>
                    </td>
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
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => this.handleUpdate(rac.idRacun)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => this.handleDelete(rac.idRacun)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === rac.idRacun && (
                    <tr>
                      <td colSpan="4">
                        {sracuna &&
                          sracuna.map((item, index) => (
                            <React.Fragment key={item.idStavkaRacuna}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div>
                                  <p>
                                    Name:{" "}
                                    <a
                                      href={`http://localhost:5173/productPage/${item.proizvod.proizvodInfo.idInfo}`}
                                      style={{ color: "white" }}
                                    >
                                      {item.proizvod.proizvodInfo.naziv}
                                    </a>
                                  </p>
                                  <p>
                                    Size: {item.proizvod.velicina.oznaka}{" "}
                                    Quantity: {item.kolicina}
                                  </p>
                                  <p>Price: {item.cena}</p>
                                </div>
                                <div style={{ marginLeft: "20px" }}>
                                  <button
                                    style={{ marginLeft: "10px" }}
                                    onClick={() =>
                                      this.handleUpdateStavka(item)
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    style={{ marginLeft: "10px" }}
                                    onClick={() =>
                                      this.handleDeleteStavka(
                                        item.idStavkaRacuna,
                                        rac.idRacun
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
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
    );
  }
}
