import React, { Component } from 'react';
import { render } from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getMovies, deleteMovie, getLists, deleteMovieList } from "../../util/APIUtils";
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


class List extends Component {
  constructor() {
    super();
    this.state = {
      data: this.loadMovieList()
    };
    this.loadMovieList = this.loadMovieList.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  loadMovieList(){
    getLists()
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
                onClick: () => deleteMovieList(mid).then((result) => {
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
        <h2 className="pb-2">MovieList List</h2>
        <ReactTable
          data={data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          columns={[
               
                {
                  Header: "List Name",
                  id: "name",
                  accessor: d => d.name,
                  filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
                }
                ,
                this.props.currentUser.role == "Admin" ?
                {
                  Header: 'Actions',
                    Cell: row => (
                        <div style={{textAlign:"center"}}>
                           <Link to={`/movieListAdd/` + row.original.id}><button type="button" class ="btn btn-primary btn-sm mr-2 ">Update</button></Link>
                            <ButtonDanger id={row.original.id} clickHandler = {this.clickHandler}/>
                        </div>
                )}: ""
                
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

export default List;