import React, { Component } from 'react';
import '../style/Product.css';

export default class ProductCard extends Component {
  render() {
    const { info } = this.props;
    const { naziv, opis, cena } = info;
    
    return (
      <div className="product-card">
        <div className='product-info'>
          <h3 className="product-title">{naziv}</h3>
          <p className="product-description">{opis}</p>
          <p className="product-price">{cena} RSD</p>
        </div>
        <button className="add-to-cart-button">
          Details
        </button>
      </div>
    );
  }
}
