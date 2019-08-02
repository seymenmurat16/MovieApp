import React, { Component } from 'react';
import { render } from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getMovies, deleteMovie } from "../../util/APIUtils";
import {
    Route,
    Redirect,
    Link
  } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import { ACCESS_TOKEN } from '../../constants';
import GoLogin from '../../common/Login';


class ButtonDanger extends React.Component{
    render(){
        return (
            <button type="button" class ="btn btn-danger btn-sm" onClick= {()=> {this.props.clickHandler(this.props.id)}} >
            Delete
            </button>
        )
    }
}


class MovieList extends Component {
  constructor() {
    super();
    this.state = {
      data: this.loadMovieList()
    };
    this.loadMovieList = this.loadMovieList.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  loadMovieList(){
    getMovies()
    .then(response => {
        console.log(response)
        this.setState({
            data: response,
        });
    }).catch(error => {
        if(error.status === 404) {
            this.setState({
                notFound: true,
                isLoading: false
            });
        } else {
            this.setState({
                serverError: true,
                isLoading: false
            });        
        }
    });  
    }

    componentDidMount() {
        this.loadMovieList();
    }


    clickHandler(mid){
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteMovie(mid).then((result) => {
                    this.loadMovieList();
                })
              },
              {
                label: 'No'
              }
            ]
          });
        
    }


  render() {
    if(localStorage.getItem(ACCESS_TOKEN)) {
        
    }else{
        return <GoLogin />;
    }
    const { data } = this.state;
    console.log(data)
    return (
      <div className="pt-3">
        <h2 className="pb-2">Movie List</h2>
        <ReactTable
          data={data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          columns={[
                {
                  Header: "Name",
                  id:"name",
                  accessor: "name",
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value),
                    Cell: e =><Link to={'/movies/'+e.original.id}>{e.value}</Link>
                },
                {
                  Header: "Directors Name",
                  id: "director.name",
                  accessor: d => d.directors[0].name,
                  filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
                }
              ,
              {
                Header: "Directors Surname",
                id: "director.surname",
                accessor: d => d.directors[0].surname,
                filterMethod: (filter, row) =>
                  row[filter.id].startsWith(filter.value)
              }
            ,
            {
              
                  Header: "Rating",
                  id: "rating",
                  accessor: "rating"
                },
                {
                    Header: "Release Date",
                    id: "relaseDate",
                    accessor: d => d.releaseDate.split('T')[0],
                    filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                  }
                ,
                this.props.currentUser ?
                this.props.currentUser.role == "Admin" ?
                {
                  Header: 'Actions',
                    Cell: row => (
                        <div style={{textAlign:"center"}}>
                            <ButtonDanger id={row.original.id} clickHandler = {this.clickHandler}/>
                        </div>
                )}: {Header: 'Actions',
                    Cell: row => (
                    <div style={{textAlign:"center"}}>
                        <Link to={`/movies/` + row.original.id}><button type="button" class ="btn btn-success btn-sm">Profile</button></Link>
                    </div>
            )} : ""
                
              ]
            }
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
        
      </div>
    );
  }
}

export default MovieList;