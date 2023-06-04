import React, { Component } from 'react';
import '../style/Cart.css';

export default class CartTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      error: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await fetch('http://localhost:5164/api/stavke', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const cartItemsData = await response.json();
        this.setState({ cartItems: cartItemsData});
      }else if (response.status === 404) {
        this.setState({ cartItems: [], error: 'No items in cart' });
      } else {
        throw new Error('Error fetching data');
      }
    } catch (error) {
      this.setState({ error: error.message});
    }
  };

  handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5164/api/stavke/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Item deleted successfully
        // You can update the UI or fetch the data again if needed
        this.fetchData();
      }else {
        throw new Error('Error deleting item');
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { cartItems, error } = this.state;
    const totalPrice = cartItems.reduce((sum, item) => sum + item.proizvod.proizvodInfo.cena*(1-item.proizvod.proizvodInfo.popust)*item.kolicina, 0);

    if (error) {
        return (
          <div className="error">
            <div>
              <p>{error}</p>
              {error === 'No items in cart' && (
                <div>
                  <p>Click the button below to go to the products page.</p>
                  <button className="button">
                Go to Products
              </button>
                </div>
              )}
            </div>
          </div>
        );
      }
      

    return (
        <div className='najveci' style={{ alignItems: 'center' }}>
      <table className="cart-table" style={{ minWidth: '80vw' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price(1 piece)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.proizvod.idProizvod}>
              <td>{item.proizvod.proizvodInfo.naziv}</td>
              <td>{item.proizvod.velicina.oznaka}</td>
              <td>{item.kolicina}</td>
              <td>{item.proizvod.proizvodInfo.cena*(1-item.proizvod.proizvodInfo.popust)} RSD</td>
              <td>
              <button
                    type="button"
                  className="btn btn-light mr-1"
                  onClick={() => this.handleDelete(item.proizvod.idProizvod)}
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="black"
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
        <tfoot style={{ borderTop: '1px solid black' }}>
          <tr>
            <td colSpan="2"></td>
            <td>Total:</td>
            <td>{totalPrice} RSD</td>
            <td><button style={{ backgroundColor: '#007bff' }}>Buy</button></td>
          </tr>
        </tfoot>
      </table>
      </div>
    );
  }
}
