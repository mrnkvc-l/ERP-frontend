import React, { Component } from 'react';
import { Variables } from '../Variables';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Korisnik extends Component {
  constructor(props) {
    super(props);

    this.state = {
      korisnici: [],
      error: null,
      selectedKorisnik: null, // Track the selected korisnik for editing
      showModal: false,
    };

    this.editClick = this.editClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.deleteClick = this.deleteClick.bind(this); // Add this line
  }

  componentDidMount() {
    this.fetchKorisnici();
  }

  fetchKorisnici() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Unauthorized access');
      return;
    }

    fetch(Variables.API_URL + 'korisnici', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch korisnici');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ korisnici: data, error: null });
      })
      .catch((error) => {
        console.log('Error:', error);
        this.setState({ korisnici: [], error: 'Failed to fetch korisnici' });
      });
  }

  editClick(idKorisnik) {
    // Find the selected korisnik based on idKorisnik
    const selectedKorisnik = this.state.korisnici.find((kor) => kor.idKorisnik === idKorisnik);
  
    this.setState({
      selectedKorisnik,
      showModal: true,
    });
  }
  

  closeModal() {
    // Close the modal and reset the selected korisnik
    this.setState({
      selectedKorisnik: null,
      showModal: false,
    });
  }

  saveChanges() {
    // Save the changes made to the selected korisnik
    const { selectedKorisnik, korisnici } = this.state;
  
    // Find the index of the selected korisnik in the korisnici array
    const selectedIndex = korisnici.findIndex((kor) => kor.idKorisnik === selectedKorisnik.idKorisnik);
  
    // Create a new array with the updated korisnik at the selected index
    const updatedKorisnici = [...korisnici];
    updatedKorisnici[selectedIndex] = selectedKorisnik;
  
    // Make an HTTP PUT request to update the korisnik on the backend
    const token = localStorage.getItem('token');
  
    if (!token) {
      // No token found, handle unauthorized access
      console.log('Unauthorized access');
      return;
    }
  
    fetch(Variables.API_URL + `korisnici/${selectedKorisnik.idKorisnik}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selectedKorisnik),
    })
      .then((response) => {
        if (response.ok) {
          // Update the state with the new array of korisnici
          this.setState({
            korisnici: updatedKorisnici,
            showModal: false,
          });
        } else {
          throw new Error('Failed to update korisnik');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
        this.setState({ error: error.message || 'Failed to update korisnik' });
      });
  }
  

  deleteClick(korId) {
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this korisnik?')) {
      // Perform deletion logic
      const token = localStorage.getItem('token');
  
      if (!token) {
        // No token found, handle unauthorized access
        console.log('Unauthorized access');
        return;
      }
  
      fetch(Variables.API_URL + `korisnici/${korId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            // Remove the deleted korisnik from state
            this.setState((prevState) => ({
              korisnici: prevState.korisnici.filter((kor) => kor.idKorisnik !== korId),
              error: null,
            }));
          } else {
            throw new Error('Failed to delete korisnik');
          }
        })
        .catch((error) => {
          console.log('Error:', error);
          this.setState({ error: error.message || 'Failed to delete korisnik' });
        });
    }
  }
  
  renderModal() {
    const { selectedKorisnik } = this.state;
  
    if (selectedKorisnik) {
      return (
      <Modal show={this.state.showModal} onHide={this.closeModal} style={{color: 'black'}}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Korisnik</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{color: 'black'}}>
            {/* Render the form fields for editing the selected korisnik */}
            <div>
              <div style={{color: 'black'}}>Selected Korisnik ID: {selectedKorisnik.idKorisnik}</div>
              {/* Replace with your own form fields */}
              <div>
                <label htmlFor="ime" style={{color: 'black'}}>Ime:</label>
                <input
                style={{color: 'black'}}
                  type="text"
                  id="ime"
                  value={selectedKorisnik.ime}
                  onChange={(e) =>
                    this.setState((prevState) => ({
                      selectedKorisnik: {
                        ...prevState.selectedKorisnik,
                        ime: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div style={{color: 'black'}}>
                <label htmlFor="prezime" style={{color: 'black'}}>Prezime:</label>
                <input
                style={{color: 'black'}}
                  type="text"
                  id="prezime"
                  value={selectedKorisnik.prezime}
                  onChange={(e) =>
                    this.setState((prevState) => ({
                      selectedKorisnik: {
                        ...prevState.selectedKorisnik,
                        prezime: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                
                <label htmlFor="prezime" style={{color: 'black'}}>Prezime:</label>
                <input
                style={{color: 'black'}}
                  type="text"
                  id="prezime"
                  value={selectedKorisnik.prezime}
                  onChange={(e) =>
                    this.setState((prevState) => ({
                      selectedKorisnik: {
                        ...prevState.selectedKorisnik,
                        prezime: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={this.saveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  
    return null; // Render nothing if selectedKorisnik is null or undefined
  }
  

  render() {
    
    const { korisnici, error, selectedKorisnik, showModal } = this.state;

    return (
      <div style={{ minHeight: '80vh' }}>
        {error ? (
          <div>{error}</div>
        ) : (
          <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th className="text-center">Ime</th>
              <th className="text-center">Prezime</th>
              <th className="text-center">TipKorisnika</th>
              <th className="text-center">Username</th>
              <th className="text-center">Email</th>
              <th className="text-center">Adresa</th>
              <th className="text-center">Grad</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
            <tbody>
              {korisnici.map((kor) => (
                <tr key={kor.idKorisnik}>
                  <td className="text-center">{kor.ime}</td>
                  <td className="text-center">{kor.prezime}</td>
                  <td className="text-center">{kor.tipKorisnika}</td>
                  <td className="text-center"> {kor.username}</td>
                  <td className="text-center">{kor.email}</td>
                  <td className="text-center">{kor.adresa}</td>
                  <td className="text-center">{kor.grad}</td>
                  <td style={{ color: 'black', alignItems: 'center', justifyContent: 'center'}}>
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => this.editClick(kor.idKorisnik)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="black"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      onClick={() => this.deleteClick(kor.idKorisnik)}
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
          </table>
        )}

{this.renderModal()}
      </div>
    );
  }
}
