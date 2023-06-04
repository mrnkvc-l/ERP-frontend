import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../style/Product.css';

export default class ProductCard extends Component {
  render() {
    const { info } = this.props;
    const { naziv, opis, cena, stanje, popust } = info;  

    const discountedPrice = cena * (1 - popust);
    const displayPrice = popust > 0 ? (
      <div style={{ color: 'red' }}>
        <del style={{ color: 'red' }}>{cena} RSD</del>
        {' '}
        {discountedPrice.toFixed(2)} RSD
      </div>
    ) : (
      `${cena} RSD`
    );

    return (
      <div className="product-card">
        <div className='product-info'>
          <h3 className="product-title">{naziv}</h3>
          <p className="product-description">{opis}</p>
          <p className="product-price" >{displayPrice}</p>
        </div>
        <button
          className={`details-button ${!stanje ? 'disabled' : ''}`}
          disabled={!stanje}
          onClick={() => window.location.assign(`http://localhost:5173/productPage/${info.idInfo}`)}
        >
          {stanje ? 'Details' : 'Out of Stock'}
        </button>
      </div>
    );
  }
}
