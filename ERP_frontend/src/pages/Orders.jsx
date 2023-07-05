import React, { Component } from "react";
import { Variables } from "../Variables";

export class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      racuni: [],
      expandedOrderId: null,
      sracuna: [],
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

  render() {
    const { racuni, expandedOrderId, sracuna } = this.state;

    return (
        <div style={{height: "80vh"}}>
      <div className="table-container" style={{ width: "80vw"}}>
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
                    <button style={{marginLeft: "10px"}}>Edit</button>
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
                                Name:{" "}
                                <a
                                  href={`http://localhost:5173/productPage/${item.proizvod.proizvodInfo.idInfo}`}
                                  style={{ color: "white" }}
                                >
                                  {item.proizvod.proizvodInfo.naziv}
                                </a>
                              </p>
                              <p>
                                Size: {item.proizvod.velicina.oznaka} Quantity:{" "}
                                {item.kolicina}
                              </p>
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
    );
  }
}
