import React,{Component} from 'react';
import { Variables } from '../Variables';
import '../style/Admin.css';

export class Admin extends Component{

    constructor(props){
        super(props);

        this.state={
            proizvodjaci:[],
            kategorije:[],
            kolekcije:[],
            proizvodi:[],
        }
    }

    refreshList(){
        fetch(Variables.API_URL + 'proizvodjaci')
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            this.setState({proizvodjaci:data});
        });

        fetch(Variables.API_URL + 'kolekcije')
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            this.setState({kolekcije:data});
        });

        fetch(Variables.API_URL + 'kategorije')
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            this.setState({kategorije:data});
        });

        fetch(Variables.API_URL + 'proizvodi')
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            this.setState({proizvodi:data});
        });
    }

    componentDidMount(){
        this.refreshList();
    }

    handleProizvodjacAdd = () => {
        // Function to handle the "Add" button for Proizvodjaci table
        console.log('Add button clicked for Proizvodjaci');
        // Implement your logic here
      };
    
      handleProizvodjacEdit = (id) => {
        // Function to handle the "Edit" button for a specific Proizvodjac
        console.log('Edit button clicked for Proizvodjac', id);
        // Implement your logic here
      };
    
      handleProizvodjacDelete = (id) => {
        // Function to handle the "Delete" button for a specific Proizvodjac
        console.log('Delete button clicked for Proizvodjac', id);
        // Implement your logic here
      };
    
      handleKolekcijaAdd = () => {
        // Function to handle the "Add" button for Kolekcije table
        console.log('Add button clicked for Kolekcije');
        // Implement your logic here
      };
    
      handleKolekcijaEdit = (id) => {
        // Function to handle the "Edit" button for a specific Kolekcija
        console.log('Edit button clicked for Kolekcija', id);
        // Implement your logic here
      };
    
      handleKolekcijaDelete = (id) => {
        // Function to handle the "Delete" button for a specific Kolekcija
        console.log('Delete button clicked for Kolekcija', id);
        // Implement your logic here
      };
    
      handleKategorijaAdd = () => {
        // Function to handle the "Add" button for Kategorije table
        console.log('Add button clicked for Kategorije');
        // Implement your logic here
      };
    
      handleKategorijaEdit = (id) => {
        // Function to handle the "Edit" button for a specific Kategorija
        console.log('Edit button clicked for Kategorija', id);
        // Implement your logic here
      };
    
      handleKategorijaDelete = (id) => {
        // Function to handle the "Delete" button for a specific Kategorija
        console.log('Delete button clicked for Kategorija', id);
        // Implement your logic here
      };

    render(){
        const {
            proizvodjaci, kolekcije, kategorije, proizvodi
        }=this.state;
        
        return(
            <div>
                <table className='table table-striped'>
                <thead>
                    <tr>
                    <th>
                        IDProizvodjac
                    </th>
                    <th>
                        Naziv
                    </th>
                    <th>
                        Adresa
                    </th>
                    <th>
                    <button type='button' className='btn btn-light btn-sm float-right' onClick={this.handleProizvodjacAdd}>
                  Add
                </button>
                </th>
                    </tr>
                </thead>
                <tbody>
                     {proizvodjaci.map(pdj=>
                        <tr key={pdj.idProizvodjac}>
                            <td>{pdj.idProizvodjac}</td>
                            <td>{pdj.naziv}</td>
                            <td>{pdj.adresa}</td>
                            <td>
                                <button type='button' className='btn mr-1' onClick={this.handleProizvodjacEdit}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg></button>

                                <button type='button' className='btn mr-1' onClick={this.handleProizvodjacDelete(pdj.idProizvodjac)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg></button>
                            </td>
                        </tr>)}  
                </tbody>
                </table>

                <table className='table table-striped'>
                <thead>
                    <tr>
                    <th>
                        IDKolekcija
                    </th>
                    <th>
                        Naziv
                    </th>
                    <th>
                        Opis
                    </th>
                    <th>
                    <button type='button' className='btn btn-light btn-sm float-right' onClick={this.handleKolekcijaAdd}>
                  Add
                </button>
                </th>
                    </tr>
                </thead>
                <tbody>
                     {kolekcije.map(klk=>
                        <tr key={klk.idKolekcija}>
                            <td>{klk.idKolekcija}</td>
                            <td>{klk.naziv}</td>
                            <td>{klk.opis}</td>
                            <td>
                                <button type='button' className='btn mr-1' onClick={this.handleKolekcijaEdit}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg></button>

                                <button type='button' className='btn mr-1' onClick={this.handleKolekcijaDelete}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg></button>
                            </td>
                        </tr>)}  
                </tbody>
                </table>

                <table className='table table-striped'>
                <thead>
                    <tr>
                    <th>
                        IDKategorija
                    </th>
                    <th>
                        Naziv
                    </th>
                    <th>
                        Opis
                    </th>
                    <th>
                    <button type='button' className='btn btn-light btn-sm float-right' onClick={this.handleKategorijaAdd}>
                  Add
                </button>
                </th>
                    </tr>
                </thead>
                <tbody>
                     {kategorije.map(kat=>
                        <tr key={kat.idKategorija}>
                            <td>{kat.idKategorija}</td>
                            <td>{kat.naziv}</td>
                            <td>{kat.opis}</td>
                            <td>
                                <button type='button' className='btn mr-1' onClick={this.handleKategorijaEdit}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg></button>

                                <button type='button' className='btn mr-1' onClick={this.handleKategorijaDelete}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" color='black' fill="black" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg></button>
                            </td>
                        </tr>)}  
                </tbody>
                </table>

                <table className='table table-striped'>
                <thead>
                    <tr>
                    <th>
                        IDProizvod
                    </th>
                    <th>
                        Kolicina
                    </th>
                    <th>
                        Naziv
                    </th>
                    <th>
                        Velicina
                    </th>
                    </tr>
                </thead>
                <tbody>
                     {proizvodi.map(pro=>
                        <tr key={pro.idProizvod}>
                            <td>{pro.idProizvod}</td>
                            <td>{pro.ukupnaKolicina}</td>
                            <td>{pro.proizvodInfo.naziv}</td>
                            <td>{pro.velicina.oznaka}</td>
                            <td>
                                <button type='button' className='btn mr-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg></button>
                            </td>
                        </tr>)}  
                </tbody>
                </table>
            </div>
        )
    }
}