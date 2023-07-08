import React, { Component } from "react";
import { useState } from "react";
import { Variables } from "../Variables";
import "../style/ProductPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from 'react-bootstrap';

export default class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      selectedSize: null,
      quantity: 0,
      imagePaths: [],
      idInfo: null,
      selectedImageIndex: 0,
      selectedFile: null,
      formValues: {
        idVelicina: 0,
        idProizvodInfo: 0,
        ukupnaKolicina: 0,
      },
      velicine: [],
      showModal: false,
    };
  }

  componentDidMount() {
    this.fetchData();
    this.getPath();
  }

  fetchData = async () => {
    const path = window.location.pathname;
    const idInfo = path.split("/").pop();
    try {
      const response = await fetch(
        `${Variables.API_URL}proizvodi/info/${idInfo}`
      );
      if (response.ok) {
        const data = await response.json();
        this.setState({ product: data, idInfo: idInfo });
      } else {
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      if (error && error.response && error.response.status === 500) {
        toast.error("Item is already in cart!");
      } else {
        console.log("Error:", error);
      }
    }

    const sizesResponse = await fetch(Variables.API_URL + "velicine");
    if (!sizesResponse.ok) {
      throw new Error("Failed to fetch categories");
    }
    const sizesData = await sizesResponse.json();
    this.setState({ velicine: sizesData });
  };

  getPath = async () => {
    try {
      const path = window.location.pathname;
      const idInfo = path.split("/").pop();
      const response = await fetch(`${Variables.API_URL}slike/${idInfo}`);
      if (response.ok) {
        const data = await response.json();
        const imagePaths = data.map((item) => item.adresa);
        this.setState({ imagePaths });
      } else {
        throw new Error("Error fetching image paths");
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleImageSelection = (index) => {
    this.setState({ selectedImageIndex: index });
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
      const selectedProduct = product.find(
        (item) => item.velicina === selectedSize
      );
      const availableQuantity = selectedProduct
        ? selectedProduct.ukupnaKolicina
        : 0;
      const idproizvod = selectedProduct ? selectedProduct.idProizvod : null;
      updatedQuantity = Math.min(updatedQuantity, availableQuantity);
      this.setState({ idproizvod });
    }

    this.setState({ quantity: updatedQuantity });
  };

  extractIdProizvod = () => {
    const { product, selectedSize } = this.state;
    const selectedProduct = product.find(
      (item) => item.velicina === selectedSize
    );
    return selectedProduct ? selectedProduct.idProizvod : null;
  };

  handleAddToCart = async () => {
    const { selectedSize, quantity } = this.state;
    const token = localStorage.getItem("token");
    const idproizvod = this.extractIdProizvod();

    const payload = {
      idproizvod,
      kolicina: quantity,
    };

    try {
      console.log(JSON.stringify(payload));
      const response = await fetch("http://localhost:5164/api/stavke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(<span style={{ color: "black" }}>Item is in cart!</span>);
      } else if (response.status === 500) {
        toast.error(
          <span style={{ color: "black" }}>Item is already in cart!</span>
        );
      } else if (response.status === 403) {
        toast.error(
          <span style={{ color: "black" }}>You must log in first!</span>
        );
      } else {
        throw new Error("Error adding item to cart");
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleFileSelect = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleAddPicture = async () => {
    const { selectedFile } = this.state;
    const token = localStorage.getItem("token");
    const idInfo = this.state.idInfo;

    if (!selectedFile) {
      toast.error(<span style={{ color: "black" }}>Please select a file</span>);
      return;
    }

    const formData = new FormData();
    formData.append("model.File", selectedFile);
    formData.append("model.IDInfo", idInfo);

    try {
      const response = await fetch("http://localhost:5164/api/slike", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const filename = await response.json();
        toast.success(
          <span style={{ color: "black" }}>Picture added: {filename}</span>
        );
      } else if (response.status === 403) {
        toast.error(<span style={{ color: "black" }}>Access forbidden</span>);
      } else {
        throw new Error("Error uploading picture");
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleFormInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    this.setState((prevState) => ({
      formValues: {
        ...prevState.formValues,
        [name]: newValue,
      },
    }));
  };

  handleAdd = async () => {
    const { formValues } = this.state;
    const path = window.location.pathname;
    const idInfo = path.split("/").pop();
    formValues.idProizvodInfo = idInfo;
    const token = localStorage.getItem("token");

    console.log("form values: ", formValues);

    try {
      const response = await fetch(Variables.API_URL + "proizvodi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }

    window.location.reload();
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  render() {
    const {
      product,
      selectedSize,
      quantity,
      imagePaths,
      selectedImageIndex,
      selectedFile,
      formValues,
      velicine,
      showModal,
    } = this.state;
    const { isAdmin } = this.props;

    if (product === null) {
      return (
        <div className="product-page">
          <div className="pp-input">
            <label>Size:</label>
            <select
              name="idVelicina"
              value={formValues.idVelicina}
              onChange={this.handleFormInputChange}
              style={{ color: "black", padding: "10px", margin: "20px" }}
            >
              <option value="" style={{ color: "black" }}>
                Select size
              </option>
              {velicine.map((velicine) => (
                <option
                  key={velicine.idVelicina}
                  value={velicine.idVelicina}
                  style={{ color: "black" }}
                >
                  {velicine.oznaka}
                </option>
              ))}
            </select>
            <br />
            <label>Quantity:</label>
            <input
              type="number"
              name="ukupnaKolicina"
              min="1"
              onChange={this.handleFormInputChange}
            ></input>
            <button
              style={{ color: "black", margin: "10px" }}
              onClick={this.handleAdd}
            >
              Add
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="product-page">
          <ToastContainer />
          {product && (
            <div className="product-container">
              <div className="product-images">
                <img
                  src={imagePaths[selectedImageIndex]}
                  alt="Product"
                  className="main-image"
                />
                <div className="small-images">
                  {imagePaths.map((path, index) => (
                    <img
                      key={index}
                      src={path}
                      alt={`Product ${index + 1}`}
                      className={`small-image ${
                        selectedImageIndex === index ? "selected" : ""
                      }`}
                      onClick={() => this.handleImageSelection(index)}
                    />
                  ))}
                </div>
              </div>
              <div className="product-info">
                <h2 className="product-title">
                  {product[0].proizvodInfo.naziv}
                </h2>
                <p className="product-description">
                  {product[0].proizvodInfo.opis}
                </p>
                <p className="product-manufacturer">
                  Manufacturer: {product[0].proizvodInfo.proizvodjac.naziv}
                </p>
                <p className="product-category">
                  Category: {product[0].proizvodInfo.kategorija.naziv}
                </p>
                <p className="product-collection">
                  Collection: {product[0].proizvodInfo.kolekcija.naziv}
                </p>
              </div>
              <div className="product-details">
                <h3 className="sizes-heading">Sizes:</h3>
                <div className="size-buttons">
                  {product.map((item) => (
                    <button
                      className={`size-button ${
                        selectedSize === item.velicina ? "selected" : ""
                      } ${item.ukupnaKolicina === 0 ? "out-of-stock" : ""}`}
                      key={item.idProizvod}
                      onClick={() => this.handleSizeSelection(item.velicina)}
                      disabled={item.ukupnaKolicina === 0}
                    >
                      {item.velicina.oznaka}
                    </button>
                  ))}
                  {isAdmin && <button className="size-button" onClick={this.toggleModal}>+</button>}
                  <Modal show={showModal} onHide={this.toggleModal}>
            <Modal.Header closeButton>
              <Modal.Title style={{color: "black", paddingTop: '80px'}}>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label style={{color: "black"}}>Size:</label>
              <select
                name="idVelicina"
                value={formValues.idVelicina}
                onChange={this.handleFormInputChange}
                className="form-control"
                style={{color: "black", paddingBottom: '1px', height: '40px'}}
              >
                <option value="" style={{color: "black"}}>Select size</option>
                {velicine.map((velicina) => (
                  <option
                    key={velicina.idVelicina}
                    value={velicina.idVelicina}
                    style={{color: "black"}}
                  >
                    {velicina.oznaka}
                  </option>
                ))}
              </select>
              <br />
              <label style={{color: "black"}}>Quantity:</label>
              <input
                type="number"
                name="ukupnaKolicina"
                min="1"
                onChange={this.handleFormInputChange}
                className="form-control"
                style={{color: "black"}}
              ></input>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.toggleModal}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleAdd}>
                Add
              </Button>
            </Modal.Footer>
          </Modal>
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
                    {quantity === 0 && (
                      <p className="out-of-stock-message">Out of stock</p>
                    )}
                    <button
                      className="add-to-cart-button"
                      onClick={this.handleAddToCart}
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
                <p className="product-price">
                  Price:{" "}
                  {product[0].proizvodInfo.popust > 0 ? (
                    <del>{product[0].proizvodInfo.cena} RSD</del>
                  ) : (
                    ""
                  )}{" "}
                  {product[0].proizvodInfo.popust > 0
                    ? (
                        product[0].proizvodInfo.cena *
                        (1 - product[0].proizvodInfo.popust)
                      ).toFixed(2)
                    : product[0].proizvodInfo.cena}{" "}
                  RSD
                </p>
                {isAdmin && (
                  <div>
                    <input type="file" onChange={this.handleFileSelect} />
                    <button
                      className="admin-button"
                      style={{ color: "black", marginTop: "10px" }}
                      onClick={this.handleAddPicture}
                    >
                      Add Picture
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
}
