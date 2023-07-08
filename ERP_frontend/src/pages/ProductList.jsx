import React, { Component } from "react";
import ProductCard from "./ProductCard";
import { Variables } from "../Variables";
import "../style/Product.css";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

export class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      products: [],
      filteredProducts: [],
      filters: {
        kategorija: "",
        cena: "",
        stanje: false,
      },
      sortBy: "",
      currentPage: 1,
      productsPerPage: 10,
      categories: [],
      searchQuery: "",
      proizvodi: [],
      showModal: false,

      changeProduct: {
        idInfo: null,
        Naziv: null,
        Opis: null,
        Stanje: false,
        Popust: null,
        Cena: null,
        idKategorija: 0,
        idKolekcija: 0,
        idProizvodjac: 0,
      },

      kategorije: [],
      kolekcije: [],
      manu: [],

      productDel: null,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const response = await fetch(Variables.API_URL + "infoi");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      this.setState({ info: data, products: data, filteredProducts: data });
      const categories = this.getUniqueCategories(data);
      this.setState({ categories });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProizvodi = async () => {
    try {
      const response = await fetch(Variables.API_URL + "infoi");
      if (!response.ok) {
        throw new Error("Failed to fetch proizvodi");
      }
      const data = await response.json();
      this.setState({ proizvodi: data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchAdmin = async () => {
    try {
      const categoriesResponse = await fetch(Variables.API_URL + "kategorije");
      if (!categoriesResponse.ok) {
        throw new Error("Failed to fetch categories");
      }
      const categoriesData = await categoriesResponse.json();
      this.setState({ kategorije: categoriesData });

      const collectionsResponse = await fetch(Variables.API_URL + "kolekcije");
      if (!collectionsResponse.ok) {
        throw new Error("Failed to fetch collections");
      }
      const collectionsData = await collectionsResponse.json();
      this.setState({ kolekcije: collectionsData });

      const manuResponse = await fetch(Variables.API_URL + "proizvodjaci");
      if (!manuResponse.ok) {
        throw new Error("Failed to fetch categories");
      }
      const manuData = await manuResponse.json();
      this.setState({ manu: manuData });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    this.setState(
      (prevState) => ({
        filters: {
          ...prevState.filters,
          [name]: value === "All" ? "" : value,
          [name]: newValue,
        },
        currentPage: 1,
      }),
      () => {
        this.applyFiltersAndSort();
      }
    );
  };

  handleSortChange = (event) => {
    const sortBy = event.target.value;
    this.setState({ sortBy, currentPage: 1 }, () => {
      this.applyFiltersAndSort();
    });
  };

  handleSearchChange = (event) => {
    const { value } = event.target;
    this.setState(
      {
        searchQuery: value,
        currentPage: 1,
      },
      () => {
        this.applyFiltersAndSort();
      }
    );
  };

  applyFiltersAndSort = () => {
    const { products, filters, sortBy, searchQuery } = this.state;
    let filteredProductsCopy = [...products];

    if (filters.kategorija && filters.kategorija !== "All") {
      filteredProductsCopy = filteredProductsCopy.filter(
        (info) =>
          info.kategorija.naziv.toLowerCase() ===
          filters.kategorija.toLowerCase()
      );
    }

    if (filters.cena) {
      const [minPrice, maxPrice] = filters.cena.split("-");
      filteredProductsCopy = filteredProductsCopy.filter(
        (info) =>
          info.cena * (1 - info.popust) >= Number(minPrice) &&
          info.cena * (1 - info.popust) <= Number(maxPrice)
      );
    }

    if (filters.stanje) {
      filteredProductsCopy = filteredProductsCopy.filter((info) => info.stanje);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProductsCopy = filteredProductsCopy.filter(
        (info) =>
          info.naziv.toLowerCase().includes(query) ||
          info.opis.toLowerCase().includes(query)
      );
    }

    if (sortBy === "price-low-to-high") {
      filteredProductsCopy.sort((a, b) => a.cena - b.cena);
    } else if (sortBy === "price-high-to-low") {
      filteredProductsCopy.sort((a, b) => b.cena - a.cena);
    }

    this.setState({ filteredProducts: filteredProductsCopy });
  };

  getUniqueCategories = (products) => {
    const categories = products.reduce((uniqueCategories, info) => {
      const category = info && info.kategorija && info.kategorija.naziv;
      if (!uniqueCategories.includes(category)) {
        uniqueCategories.push(category);
      }
      return uniqueCategories;
    }, []);

    return categories;
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  handleAddProduct = () => {
    this.openForm();
  };

  openForm = () => {
    this.fetchAdmin();
    this.setState({ showModal: true });
  };

  closeForm = () => {
    this.setState({
      changeProduct: {
        idInfo: null,
        Naziv: null,
        Opis: null,
        Stanje: false,
        Popust: null,
        Cena: null,
        idKategorija: 0,
        idKolekcija: 0,
        idProizvodjac: 0,
      },
      showModal: false,
    });
  };

  handleFormInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    this.setState((prevState) => ({
      changeProduct: {
        ...prevState.changeProduct,
        [name]: newValue,
      },
    }));
  };

  handleSaveProduct = async () => {
    const { changeProduct } = this.state;
    const token = localStorage.getItem("token");

    if (changeProduct.idInfo) {
      this.updateProduct(changeProduct, token);
    } else {
      this.addProduct(changeProduct, token);
    }
  };

  addProduct = (changeProduct, token) => {
    console.log(changeProduct);
    try {
      const response = fetch(Variables.API_URL + "infoi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Naziv: changeProduct.Naziv,
          Opis: changeProduct.Opis,
          Stanje: changeProduct.Stanje,
          Popust: changeProduct.Popust,
          Cena: changeProduct.Cena,
          idKategorija: changeProduct.idKategorija,
          idKolekcija: changeProduct.idKolekcija,
          idProizvodjac: changeProduct.idProizvodjac,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      toast.success(<span style={{ color: "black" }}>Product added!</span>);
    } catch (error) {
      console.error("Error saving product:", error);
    }
    this.fetchProducts();
    this.closeForm();

    window.location.reload();
  };

  updateProduct = (changeProduct, token) => {
    console.log(changeProduct);
    try {
      const response = fetch(Variables.API_URL + "infoi", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idInfo: changeProduct.idInfo,
          Naziv: changeProduct.Naziv,
          Opis: changeProduct.Opis,
          Stanje: changeProduct.Stanje,
          Popust: changeProduct.Popust,
          Cena: changeProduct.Cena,
          idKategorija: changeProduct.idKategorija,
          idKolekcija: changeProduct.idKolekcija,
          idProizvodjac: changeProduct.idProizvodjac,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      toast.success(<span style={{ color: "black" }}>Product added!</span>);
    } catch (error) {
      console.error("Error saving product:", error);
    }
    this.fetchProducts();
    this.closeForm();

    window.location.reload();
  };

  handleEdit = (product) => {
    this.setState({
      changeProduct: {
        idInfo: product.idInfo,
        Naziv: product.naziv,
        Opis: product.opis,
        Stanje: product.stanje,
        Popust: product.popust,
        Cena: product.cena,
        idKategorija: product.kategorija.idKategorija,
        idKolekcija: product.kolekcija.idKolekcija,
        idProizvodjac: product.proizvodjac.idProizvodjac,
      },
    });
    this.openForm();
  };

  handleDelete = (productd) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this product?"
      )
    ) {
      const token = localStorage.getItem("token");

      fetch(Variables.API_URL + `infoi/${productd.idInfo}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.reload();
          } else {
            throw new Error("Failed to delete velicina");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setState({
            error: error.message || "Failed to delete velicina",
          });
        });
    }

  }

  render() {
    const { isAdmin } = this.props;
    const {
      filteredProducts,
      filters,
      sortBy,
      currentPage,
      productsPerPage,
      categories,
      searchQuery,
      showModal,
      kategorije,
      kolekcije,
      manu,
      changeProduct,
      productDel,
    } = this.state;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
      <div>
        <div className="filter-sort-container">
          <div className="filter-container">
            <label>
              <input
                type="checkbox"
                name="stanje"
                checked={filters.stanje}
                onChange={this.handleFilterChange}
              />
              Show only available
            </label>
          </div>

          <div className="search-container">
            <input
              type="text"
              name="searchQuery"
              value={searchQuery}
              onChange={this.handleSearchChange}
              placeholder="Search something..."
              className="search-input"
            />
          </div>

          <div className="filter-container">
            <label>Category:</label>
            <select
              name="kategorija"
              value={filters.kategorija}
              onChange={this.handleFilterChange}
              className="sort-select"
              style={{ color: "black" }}
            >
              <option value="" style={{ color: "black" }}>
                All
              </option>
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  style={{ color: "black" }}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <label>Price Range:</label>
            <select
              name="cena"
              value={filters.cena}
              onChange={this.handleFilterChange}
              style={{ color: "black" }}
              className="sort-select"
            >
              <option value="" style={{ color: "black" }}>
                All
              </option>
              <option value="0-5000" style={{ color: "black" }}>
                0 - 5000
              </option>
              <option value="5001-10000" style={{ color: "black" }}>
                5001 - 10000
              </option>
              <option value="10001-20000" style={{ color: "black" }}>
                10001 - 20000
              </option>
            </select>
          </div>

          <div className="filter-container">
            <label>Sort By:</label>
            <select
              value={sortBy}
              onChange={this.handleSortChange}
              style={{ color: "black" }}
              className="sort-select"
            >
              <option value="" style={{ color: "black" }}>
                None
              </option>
              <option value="price-low-to-high" style={{ color: "black" }}>
                Price: Low to High
              </option>
              <option value="price-high-to-low" style={{ color: "black" }}>
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={this.handleAddProduct}
            className="add-product-button"
            style={{ color: "black", marginBottom: "10px" }}
          >
            Add Product
          </button>
        )}

        {showModal && (
          <div className="add-product-form" color="red">
            <Modal
              show={showModal}
              onHide={this.closeForm}
              style={{ paddingTop: "100px" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Modal Product
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ color: "black" }}>
                <label style={{ color: "black" }}>Naziv:</label>
                <input
                  type="text"
                  name="Naziv"
                  style={{ color: "black", borderBottom: "black" }}
                  value={changeProduct.Naziv}
                  onChange={this.handleFormInputChange}
                  required
                />

                {/* Opis */}
                <label style={{ color: "black" }}>Opis:</label>
                <input
                  type="text"
                  name="Opis"
                  style={{ color: "black" }}
                  value={changeProduct.Opis}
                  onChange={this.handleFormInputChange}
                  required
                />

                {/* Popust */}
                <label style={{ color: "black" }}>Popust:</label>
                <input
                  type="number"
                  name="Popust"
                  step="0.1"
                  style={{ color: "black" }}
                  value={changeProduct.Popust}
                  min="0"
                  max="1"
                  onChange={this.handleFormInputChange}
                  required
                />

                {/* Cena */}
                <label style={{ color: "black" }}>Cena:</label>
                <input
                  type="number"
                  name="Cena"
                  style={{ color: "black" }}
                  value={changeProduct.Cena}
                  onChange={this.handleFormInputChange}
                  required
                />

                {/* IDKategorija */}
                <label style={{ color: "black" }}>ID Kategorija:</label>
                <select
                  name="idKategorija"
                  value={changeProduct.idKategorija}
                  onChange={this.handleFormInputChange}
                  style={{ color: "black" }}
                  required
                >
                  <option value="" style={{ color: "black" }}>
                    Select a category
                  </option>
                  {kategorije.map((kategorije) => (
                    <option
                      key={kategorije.idKategorija}
                      value={kategorije.idKategorija}
                      style={{ color: "black" }}
                    >
                      {kategorije.naziv}
                    </option>
                  ))}
                </select>

                {/* IDKolekcija */}
                <label style={{ color: "black" }}>ID Kolekcija:</label>
                <select
                  name="idKolekcija"
                  value={changeProduct.idKolekcija}
                  onChange={this.handleFormInputChange}
                  style={{ color: "black" }}
                  required
                >
                  <option value="" style={{ color: "black" }}>
                    Select a collection
                  </option>
                  {kolekcije.map((kolekcije) => (
                    <option
                      key={kolekcije.idKolekcija}
                      value={kolekcije.idKolekcija}
                      style={{ color: "black" }}
                    >
                      {kolekcije.naziv}
                    </option>
                  ))}
                </select>

                {/* IDProizvodjac */}
                <label style={{ color: "black" }}>ID Proizvodjac:</label>
                <select
                  name="idProizvodjac"
                  value={changeProduct.idProizvodjac}
                  onChange={this.handleFormInputChange}
                  style={{ color: "black" }}
                  required
                >
                  <option value="" style={{ color: "black" }}>
                    Select a manufacturer
                  </option>
                  {manu.map((manu) => (
                    <option
                      key={manu.idProizvodjac}
                      value={manu.idProizvodjac}
                      style={{ color: "black" }}
                    >
                      {manu.naziv}
                    </option>
                  ))}
                </select>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.closeForm}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleSaveProduct}>
                  Save Product
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}

        <div className="product-list">
          {currentProducts.map((product) => (
            <ProductCard
              key={product.idInfo}
              info={product}
              isAdmin={isAdmin}
              onButtonAction={this.handleEdit}
              onButtonActionDel={this.handleDelete}
            />
          ))}
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                className={`btn ${
                  currentPage === pageNumber ? "btn-primary" : "btn-light"
                } mr-1`}
                onClick={() => this.handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
      </div>
    );
  }
}
