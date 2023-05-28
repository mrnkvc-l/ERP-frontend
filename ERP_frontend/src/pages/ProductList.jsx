import React, { Component } from 'react';
import ProductCard from './ProductCard';
import { Variables } from '../Variables';
import '../style/Product.css';

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

    // Apply existing filters
    if (filters.kategorija && filters.kategorija !== 'All') {
      filteredProductsCopy = filteredProductsCopy.filter(
        (info) => info.kategorija.naziv.toLowerCase() === filters.kategorija.toLowerCase()
      );
    }

    if (filters.cena) {
      const [minPrice, maxPrice] = filters.cena.split('-');
      filteredProductsCopy = filteredProductsCopy.filter(
        (info) => info.cena >= Number(minPrice) && info.cena <= Number(maxPrice)
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProductsCopy = filteredProductsCopy.filter(
        (info) =>
          info.naziv.toLowerCase().includes(query) || info.opis.toLowerCase().includes(query)
      );
    }

    // Apply sorting
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

  render() {
    const { filteredProducts, filters, sortBy, currentPage, productsPerPage, categories, searchQuery } =
      this.state;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
      <div>
        <div className="filter-sort-container">
          <div className="filter-container search-container">
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
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
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
              className="sort-select"
            >
              <option value="">All</option>
              <option value="0-5000">0 - 5000</option>
              <option value="5001-10000">5001 - 10000</option>
              <option value="10001-20000">10001 - 20000</option>
            </select>
          </div>

          <div className="filter-container">
            <label>Sort By:</label>
            <select value={sortBy} onChange={this.handleSortChange} className="sort-select">
              <option value="">None</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="product-list">
          {currentProducts.map((product) => (
            <ProductCard key={product.idInfo} info={product} />
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
