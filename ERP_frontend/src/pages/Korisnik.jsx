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
  }

  componentDidMount() {
    this.fetchKorisnici();
  }

  fetchKorisnici() {
    const token = localStorage.getItem('token');

    if (!token) {
      // No token found, handle unauthorized access
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
    const selectedKorisnik = this.state.korisnici.find(
      (kor) => kor.idKorisnik === idKorisnik
    );

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
    const selectedIndex = korisnici.findIndex(
      (kor) => kor.idKorisnik === selectedKorisnik.idKorisnik
    );

    // Create a new array with the updated korisnik at the selected index
    const updatedKorisnici = [...korisnici];
    updatedKorisnici[selectedIndex] = selectedKorisnik;

    // Update the state with the new array of korisnici
    this.setState({
      korisnici: updatedKorisnici,
      showModal: false,
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
          if (!response.ok) {
            throw new Error('Korisnik deleted');
          }
          return response.json();
        })
        .then(() => {
          // Remove the deleted korisnik from state
          this.setState((prevState) => ({
            korisnici: prevState.korisnici.filter((kor) => kor.idKorisnik !== korId),
            error: null,
          }));
        })
        .catch((error) => {
          console.log('Error:', error);
          this.setState({ error: 'Failed to delete korisnik' });
        });
    }
  }

  render() {
    
    const { korisnici, error, selectedKorisnik, showModal } = this.state;

    return (
      <div>
        {error ? (
          <div>{error}</div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>IDKorisnik</th>
                <th>Ime</th>
                <th>Prezime</th>
                <th>TipKorisnika</th>
                <th>Username</th>
                <th>Email</th>
                <th>Adresa</th>
                <th>Grad</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {korisnici.map((kor) => (
                <tr key={kor.idKorisnik}>
                  <td>{kor.idKorisnik}</td>
                  <td>{kor.ime}</td>
                  <td>{kor.prezime}</td>
                  <td>{kor.tipKorisnika}</td>
                  <td>{kor.username}</td>
                  <td>{kor.email}</td>
                  <td>{kor.adresa}</td>
                  <td>{kor.grad}</td>
                  <td>
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
                        fill="currentColor"
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
                        fill="currentColor"
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

        <Modal show={showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Korisnik</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Render the form fields for editing the selected korisnik */}
            {selectedKorisnik && (
    <div>
      <div>Selected Korisnik ID: {selectedKorisnik.idKorisnik}</div>
      {/* Replace with your own form fields */}
      <div>
        <label htmlFor="ime">Ime:</label>
        <input
          type="text"
          id="ime"
          value={selectedKorisnik.ime}
          onChange={(e) =>
            this.setState({
              selectedKorisnik: {
                ...selectedKorisnik,
                ime: e.target.value,
              },
            })
          }
        />
      </div>
      <div>
        <label htmlFor="prezime">Prezime:</label>
        <input
          type="text"
          id="prezime"
          value={selectedKorisnik.prezime}
          onChange={(e) =>
            this.setState({
              selectedKorisnik: {
                ...selectedKorisnik,
                prezime: e.target.value,
              },
            })
          }
        />
      </div>
      {/* Add more form fields for other properties of the selected korisnik */}
    </div>
  )}
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
      </div>
    );
  }
}
