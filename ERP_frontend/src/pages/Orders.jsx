import React, { Component } from "react";
import { Variables } from "../Variables";

export class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      racuni: [],
      expandedOrderId: null,
      sracuna: [],
      modal: false,
      putRacun:{
        idRacun: null,
        kupac: null,
        datum: null,
        cena: null,
      }
    };
  }

  componentDidMount() {
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

  }

  render() {
    const { racuni, expandedOrderId, sracuna, modal, putRacun } = this.state;

    return (
      <div style={{ height: "80vh" }}>
        <div className="table-container" style={{ width: "80vw" }}>
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
                      <button style={{ marginLeft: "10px" }} onClick={() => this.handleUpdate(rac.idRacun)}>Edit</button>
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
                            <React.Fragment key={item.id}>
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
                                  <button style={{ marginLeft: "10px" }}>
                                    Edit
                                  </button>
                                  <button style={{ marginLeft: "10px" }}>
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
