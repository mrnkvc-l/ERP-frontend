import React, { Component } from 'react';
import ProductCard from './ProductCard';
import { Variables } from '../Variables';
import '../style/Product.css';
import { toast } from 'react-toastify';

export class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      products: [],
      filteredProducts: [],
      filters: {
        kategorija: '',
        cena: '',
      },
      sortBy: '',
      currentPage: 1,
      productsPerPage: 10,
      categories: [],
      searchQuery: '',
      proizvodi: [],
      isFormOpen: false,
      formValues: {
        Naziv: '',
        Opis: '',
        Stanje: false,
        Popust: 0,
        Cena: 0,
        idKategorija: 0,
        idKolekcija: 0,
        idProizvodjac: 0,
      },

        kategorije: [],
        kolekcije: [],
        manu: [],
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const response = await fetch(Variables.API_URL + 'infoi');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      this.setState({ info: data, products: data, filteredProducts: data });
      const categories = this.getUniqueCategories(data);
      this.setState({ categories });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  fetchProizvodi = async () => {
    try {
      const response = await fetch(Variables.API_URL + 'infoi');
      if (!response.ok) {
        throw new Error('Failed to fetch proizvodi');
      }
      const data = await response.json();
      this.setState({ proizvodi: data});
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  fetchAdmin = async () => {
    try{
      const categoriesResponse = await fetch(Variables.API_URL + 'kategorije');
    if (!categoriesResponse.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categoriesData = await categoriesResponse.json();
    console.log(categoriesData);
    this.setState({ kategorije: categoriesData });

    const collectionsResponse = await fetch(Variables.API_URL + 'kolekcije');
    if (!collectionsResponse.ok) {
      throw new Error('Failed to fetch collections');
    }
    const collectionsData = await collectionsResponse.json();
    this.setState({ kolekcije: collectionsData });

    const manuResponse = await fetch(Variables.API_URL + 'proizvodjaci');
    if (!manuResponse.ok) {
      throw new Error('Failed to fetch categories');
    }
    const manuData = await manuResponse.json();
    this.setState({ manu: manuData });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  handleFilterChange = (event) => {
    const { name, value } = event.target;
    this.setState(
      (prevState) => ({
        filters: {
          ...prevState.filters,
          [name]: value === 'All' ? '' : value,
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

    if (filters.kategorija && filters.kategorija !== 'All') {
      filteredProductsCopy = filteredProductsCopy.filter(
        (info) => info.kategorija.naziv.toLowerCase() === filters.kategorija.toLowerCase()
      );
    }

    if (filters.cena) {
      const [minPrice, maxPrice] = filters.cena.split('-');
      filteredProductsCopy = filteredProductsCopy.filter(
        (info) => info.cena*(1-info.popust) >= Number(minPrice) && info.cena*(1-info.popust) <= Number(maxPrice)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProductsCopy = filteredProductsCopy.filter(
        (info) =>
          info.naziv.toLowerCase().includes(query) || info.opis.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'price-low-to-high') {
      filteredProductsCopy.sort((a, b) => a.cena - b.cena);
    } else if (sortBy === 'price-high-to-low') {
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
    this.setState({ isFormOpen: true });
  };

  closeForm = () => {
    this.setState({ isFormOpen: false });
  };

  handleFormInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
  
    this.setState((prevState) => ({
      formValues: {
        ...prevState.formValues,
        [name]: newValue,
      },
    }));
  };

  handleSaveProduct = async () => {
    const { formValues } = this.state;
    const token = localStorage.getItem('token');

    console.log('Form Values:', formValues);
  
    try {
      const response = await fetch(Variables.API_URL + 'infoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save product');
      }
  
      this.fetchProducts();
      this.closeForm();

      toast.success(<span style={{ color: 'black' }}>Product added!</span>);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };
  

  render() {
    const {isAdmin} = this.props;
    const { filteredProducts, filters, sortBy, currentPage, productsPerPage, categories, searchQuery, isFormOpen, formValues,
    kategorije, kolekcije, manu } =
      this.state;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
      <div>
        <div className="filter-sort-container">
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
              style={{ color: 'black' }}
            >
              <option value="" style={{ color: 'black' }}>All</option>
              {categories.map((category) => (
                <option key={category} value={category} style={{ color: 'black' }}>
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
              style={{ color: 'black' }}
              className="sort-select"
            >
              <option value="" style={{ color: 'black' }}>All</option>
              <option value="0-5000" style={{ color: 'black' }}>0 - 5000</option>
              <option value="5001-10000" style={{ color: 'black' }}>5001 - 10000</option>
              <option value="10001-20000" style={{ color: 'black' }}>10001 - 20000</option>
            </select>
          </div>

          <div className="filter-container">
            <label>Sort By:</label>
            <select value={sortBy} onChange={this.handleSortChange} style={{ color: 'black' }} className="sort-select">
              <option value="" style={{ color: 'black' }}>None</option>
              <option value="price-low-to-high" style={{ color: 'black' }}>Price: Low to High</option>
              <option value="price-high-to-low" style={{ color: 'black' }}>Price: High to Low</option>
            </select>
          </div>
        </div>

        {isAdmin && (
        <button onClick={this.handleAddProduct} className="add-product-button" style={{color: 'black', marginBottom:'10px'}}>
          Add Product
        </button>
      )}

{isFormOpen && (
  <div className="add-product-form">
    {/* Naziv */}
    <label>Naziv:</label>
    <input
      type="text"
      name="Naziv"
      value={formValues.Naziv}
      onChange={this.handleFormInputChange}
    />

    {/* Opis */}
    <label>Opis:</label>
    <input
      type="text"
      name="Opis"
      value={formValues.Opis}
      onChange={this.handleFormInputChange}
    />

    {/* Stanje */}
    <label>Stanje:</label>
    <input
      type="checkbox"
      name="Stanje"
      checked={formValues.Stanje}
      onChange={this.handleFormInputChange}
    />

    {/* Popust */}
    <label>Popust:</label>
    <input
      type="number"
      name="Popust"
      value={formValues.Popust}
      onChange={this.handleFormInputChange}
    />

    {/* Cena */}
    <label>Cena:</label>
    <input
      type="number"
      name="Cena"
      value={formValues.Cena}
      onChange={this.handleFormInputChange}
    />

    {/* IDKategorija */}
    <label>ID Kategorija:</label>
  <select
  name="idKategorija"
  value={formValues.idKategorija}
  onChange={this.handleFormInputChange}
  style={{color: 'black'}}
  >
  <option value="" style={{color: 'black'}}>Select a category</option>
  {kategorije.map((kategorije) => (
    <option key={kategorije.idKategorija} value={kategorije.idKategorija} style={{color: 'black'}}>
      {kategorije.naziv}
    </option>
    ))}
  </select>

    {/* IDKolekcija */}
    <label>ID Kolekcija:</label>
    <select
  name="idKolekcija"
  value={formValues.idKolekcija}
  onChange={this.handleFormInputChange}
  style={{color: 'black'}}
  >
  <option value="" style={{color: 'black'}}>Select a collection</option>
  {kolekcije.map((kolekcije) => (
    <option key={kolekcije.idKolekcija} value={kolekcije.idKolekcija} style={{color: 'black'}}>
      {kolekcije.naziv}
    </option>
    ))}
  </select>

    {/* IDProizvodjac */}
    <label>ID Proizvodjac:</label>
    <select
  name="idProizvodjac"
  value={formValues.idProizvodjac}
  onChange={this.handleFormInputChange}
  style={{color: 'black'}}
  >
  <option value="" style={{color: 'black'}}>Select a manufacturer</option>
  {manu.map((manu) => (
    <option key={manu.idProizvodjac} value={manu.idProizvodjac} style={{color: 'black'}}>
      {manu.naziv}
    </option>
    ))}
  </select>

  <button onClick={this.handleSaveProduct} className="save-product-button">
      Save Product
    </button>

    <button onClick={this.closeForm} className="close-form-button">
      Close
    </button>
  </div>
)}

        <div className="product-list">
          {currentProducts.map((product) => (
            <ProductCard key={product.idInfo} info={product} isAdmin={isAdmin} />
          ))}
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`btn ${currentPage === pageNumber ? 'btn-primary' : 'btn-light'} mr-1`}
              onClick={() => this.handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    );
  }
}
