import React,{Component} from 'react';
import { Variables } from '../Variables';
import { FaCheck, FaTimes } from 'react-icons/fa';

export class Proizvod extends Component{

    constructor(props){
        super(props);

        this.state={
            proizvodi:[]
        }
    }

    refreshList(){
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

    render(){
        const {
            proizvodi
        }=this.state;
        
        return(
            <div>
                <table className='table table-striped'>
                <thead>
                    <tr>
                    <th>
                        IDProizvod
                    </th>
                    <th>
                        Stanje
                    </th>
                    <th>
                        Kolicina
                    </th>
                    <th>
                        Naziv
                    </th>
                    <th>
                        Cena
                    </th>
                    <th>
                        Kategorija
                    </th>
                    <th>
                        Kolekcija
                    </th>
                    <th>
                        Proizvodjac
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
                            <td>
                                {pro.stanje  ? <FaCheck /> : <FaTimes />}
                            </td>
                            <td>{pro.ukupnaKolicina}</td>
                            <td>{pro.proizvodInfo.naziv}</td>
                            <td>{pro.proizvodInfo.cena}</td>
                            <td>{pro.proizvodInfo.kategorija.naziv}</td>
                            <td>{pro.proizvodInfo.kolekcija.naziv}</td>
                            <td>{pro.proizvodInfo.proizvodjac.naziv}</td>
                            <td>{pro.velicina.oznaka}</td>
                            <td>
                                <button type='button' className='btn btn-light mr-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg></button>

                                <button type='button' className='btn btn-light mr-1'>
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