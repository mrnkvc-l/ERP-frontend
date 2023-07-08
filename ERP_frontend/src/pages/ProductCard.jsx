import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Variables } from '../Variables';
import defaultImage from '../assets/default-image.png';
import '../style/Product.css';

export default class ProductCard extends Component {
  state = {
    pathimg: null,
  }

  componentDidMount() {
    this.getPath();
  }
  
  getPath = async () => {
    try {
      const { idInfo } = this.props.info;
      const response = await fetch(`${Variables.API_URL}slike/${idInfo}`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ pathimg: data[0]?.adresa });
      } else {
        console.log('Error: ', error);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  handleClick = () => {
    const {info, onButtonAction} = this.props;
    if (typeof onButtonAction === 'function') {
      onButtonAction(info);
    }
  }

  handleClickDelete = () => {
    const {info, onButtonActionDel} = this.props;
    if(typeof onButtonActionDel === 'function'){
      onButtonActionDel(info);
    }
  }

  render() {
    const { info, isAdmin } = this.props;
    const { naziv, cena, stanje, popust } = info;  

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
        <div className='bla'>
        <div className="product-image">
          {this.state.pathimg ? (
            <img src={this.state.pathimg} style={{ height: "200px", width: "200px" }}/>
          ) : (
            <img src={defaultImage} style={{ height: "200px", width: "200px" }}/>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-title">{naziv}</h3>
          <p className="product-price" >{displayPrice}</p>
          <button
            className={`details-button ${!stanje ? 'disabled' : ''}`}
            disabled={!stanje && !isAdmin}
            style={{marginBottom: '10px', paddingBottom: '10px'}}
            onClick={() => window.location.assign(`http://localhost:5173/productPage/${info.idInfo}`)}
          >
            {stanje ? 'Details' : 'Out of Stock'}
          </button>
          {isAdmin ? (<button style={{color: "black"}} onClick={() => this.handleClick(info.idInfo)}>Edit</button>) : ""
  }{isAdmin ? (<button style={{color: "black", marginTop: '5px'}} onClick={() => this.handleClickDelete(info.idInfo)}>Delete</button>) : ""
}
        </div>
        </div>
      </div>
    );
  }
}
