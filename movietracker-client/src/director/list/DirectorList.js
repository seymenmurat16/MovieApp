import React, { Component } from 'react';
import { render } from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getUsers, deleteUser, getDirectors, deleteDirector } from "../../util/APIUtils";
import {
  Route,
  Redirect,
  Link
} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import { notification } from 'antd';
import UnAuthorized from '../../common/UnAuthorized';
import GoLogin from '../../common/Login';
import { ACCESS_TOKEN } from '../../constants';


class ButtonDanger extends React.Component{
    render(){
        return (
            <button type="button" class ="btn btn-danger btn-sm" onClick= {()=> {this.props.clickHandler(this.props.id)}} >
            Delete
            </button>
        )
    }
}


class DirectorList extends Component {
  constructor() {
    super();
    this.state = {
      data: this.loadDirectorList()
    };
    this.loadDirectorList = this.loadDirectorList.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  loadDirectorList(){
    getDirectors()
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
        this.loadDirectorList();
    }


    clickHandler(mid){
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteDirector(mid).then((result) => {
                    this.loadDirectorList();
                }).catch(error => {
                  if(error.status === 404) {
                      this.setState({
                          notFound: true,
                          isLoading: false
                      });
                  } else {
                    notification.error({
                      message: 'MovieApp',
                      description: "You can not delete a director who is have a movie in database."
                  });  
                  }
              }) 
              },
              {
                label: 'No'
              }
            ]
          });
          if(this.props.currentUser.role === "Admin"){
            this.setState({unAuthorized:false});
        }else{
            this.setState({unAuthorized:true})
        }
        
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
        <h2 className="pb-2">Director List</h2>
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
                },
                {
                  Header: "Surname",
                  id: "surname",
                  accessor: d => d.surname,
                  filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
                }
              ,
            {
              
                  Header: "Place",
                  accessor: "place.name",
                  id:"place",
                  filterMethod: (filter, row) =>
                  row[filter.id].startsWith(filter.value)
                },
                {
                    Header: "Birty Date",
                    id: "birthDate",
                    accessor: d => d.birthDate.split('T')[0],
                    filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                }
                ,
                this.props.currentUser.role == "Admin" ?
                {
                  Header: 'Actions',
                    Cell: row => (
                        <div style={{textAlign:"center"}}>
                           <Link to={`/directors/` + row.original.id}><button type="button" class ="btn btn-success btn-sm">Profile</button></Link>
                           <Link to={`/directorAdd/` + row.original.id}><button type="button" class ="btn btn-primary btn-sm">Update</button></Link>
                            <ButtonDanger id={row.original.id} clickHandler = {this.clickHandler}/>
                        </div>
                )}: {Header: 'Action',
                    Cell: row => (
                    <div style={{textAlign:"center"}}>
                        <Link to={`/directors/` + row.original.id}><button type="button" class ="btn btn-success btn-sm">Profile</button></Link>
                    </div>
            )}
                
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

export default DirectorList;