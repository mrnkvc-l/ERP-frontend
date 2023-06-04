import React, { Component } from 'react';
import { Variables } from '../Variables';
import '../style/ProductPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class ProductPage extends Component {
  state = {
    product: null,
    selectedSize: null,
    quantity: 0,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const path = window.location.pathname;
    const idInfo = path.split('/').pop();

    console.log(idInfo);
    try {
      const response = await fetch(`${Variables.API_URL}proizvodi/info/${idInfo}`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ product: data });
        console.log(data);
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      if (error && error.response && error.response.status === 500) {
        toast.error('Item is already in cart!');
      } else {
        console.log('Error:', error);
      }
    }    
  };

  handleSizeSelection = (size) => {
    const { product, selectedSize } = this.state;

    if (selectedSize === size) {
      this.setState({
        selectedSize: null,
        quantity: 0,
      });
    } else {
      const selectedSize = product.find((item) => item.velicina === size);
      const quantity = selectedSize ? selectedSize.ukupnaKolicina : 0;
  
      this.setState({
        selectedSize: selectedSize ? selectedSize.velicina : null,
        quantity: quantity === 0 ? 0 : 1,
      });
    }
  };
  
  handleQuantityChange = (event) => {
    const { value } = event.target;
    const { product, selectedSize } = this.state;
  
    let updatedQuantity = parseInt(value);
    if (isNaN(updatedQuantity) || updatedQuantity < 1) {
      updatedQuantity = 1;
    } else {
      const selectedProduct = product.find((item) => item.velicina === selectedSize);
      const availableQuantity = selectedProduct ? selectedProduct.ukupnaKolicina : 0;
      const idproizvod = selectedProduct ? selectedProduct.idProizvod : null;
      updatedQuantity = Math.min(updatedQuantity, availableQuantity);
      this.setState({ idproizvod }); // Update the idproizvod in the state
    }
  
    this.setState({ quantity: updatedQuantity });
  };
  
  extractIdProizvod = () => {
    const { product, selectedSize } = this.state;
    const selectedProduct = product.find((item) => item.velicina === selectedSize);
    return selectedProduct ? selectedProduct.idProizvod : null;
  };

  handleAddToCart = async () => {
    const { selectedSize, quantity } = this.state;
    const token = localStorage.getItem('token');
    const idproizvod = this.extractIdProizvod();

    const payload = {
      idproizvod,
      kolicina: quantity,
    };

    try {
      console.log(JSON.stringify(payload));
      const response = await fetch('http://localhost:5164/api/stavke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Item added to cart successfully!');
      } else if (response.status === 500) {
        toast.error(<span style={{ color: 'black' }}>Item is already in cart!</span>);
      }else {
        throw new Error('Error adding item to cart');
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };
    
  
  render() {
    const { product, selectedSize, quantity } = this.state;
  
    return (
      <div className="product-page">
        <ToastContainer />
        {product && (
          <div className="product-container">
            <div className="product-info">
              <h2 className="product-title">{product[0].proizvodInfo.naziv}</h2>
              <p className="product-description">{product[0].proizvodInfo.opis}</p>
              <p className="product-manufacturer">Manufacturer: {product[0].proizvodInfo.proizvodjac.naziv}</p>
              <p className="product-category">Category: {product[0].proizvodInfo.kategorija.naziv}</p>
              <p className="product-collection">Collection: {product[0].proizvodInfo.kolekcija.naziv}</p>
            </div>
            <div className="product-details">
              <p className="product-price">
                Price: {product[0].proizvodInfo.popust > 0 ? <del>{product[0].proizvodInfo.cena} RSD</del> : ''}
                {' '}
                {product[0].proizvodInfo.popust > 0 ? (product[0].proizvodInfo.cena * (1 - product[0].proizvodInfo.popust)).toFixed(2) : product[0].proizvodInfo.cena} RSD
              </p>
              <h3 className="sizes-heading">Sizes:</h3>
              <div className="size-buttons">
                {product.map((item) => (
                  <button
                    className={`size-button ${selectedSize === item.velicina ? 'selected' : ''} ${item.ukupnaKolicina === 0 ? 'out-of-stock' : ''}`}
                    key={item.idProizvod}
                    onClick={() => this.handleSizeSelection(item.velicina)}
                    disabled={item.ukupnaKolicina === 0}
                  >
                    {item.velicina.oznaka}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <div className="quantity-input">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity === 0 ? 1 : quantity}
                    min="1"
                    max={quantity ? quantity.ukupnaKolicina : 0}
                    onChange={this.handleQuantityChange}
                  />
                  {quantity === 0 && <p className="out-of-stock-message">Out of stock</p>}
                  <button className="add-to-cart-button" onClick={this.handleAddToCart}>
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
