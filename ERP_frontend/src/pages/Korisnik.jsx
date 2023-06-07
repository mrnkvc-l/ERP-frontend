import React, { Component } from 'react';
import { Variables } from '../Variables';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Korisnik extends Component {
  constructor(props) {
    super(props);

    this.state = {
      korisnici: [],
      error: null,
    };

    this.saveChanges = this.saveChanges.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
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

  saveChanges() {
    const { selectedKorisnik, korisnici } = this.state;
    const selectedIndex = korisnici.findIndex((kor) => kor.idKorisnik === selectedKorisnik.idKorisnik);
    const updatedKorisnici = [...korisnici];
    updatedKorisnici[selectedIndex] = selectedKorisnik;
  
    const token = localStorage.getItem('token');
  
    if (!token) {
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
    if (window.confirm('Are you sure you want to delete this korisnik?')) {
      const token = localStorage.getItem('token');
  
      if (!token) {
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
                      className="btn mr-1"
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
      </div>
    );
  }
}
