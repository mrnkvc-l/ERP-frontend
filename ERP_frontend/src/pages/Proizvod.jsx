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