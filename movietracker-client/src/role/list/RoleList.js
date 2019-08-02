import React, { Component } from 'react';
import { render } from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getMovies, deleteMovie, getLists, deleteMovieList, deleteRole, getRoles } from "../../util/APIUtils";
import {
  Route,
  Redirect,
  Link
} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import { notification } from 'antd';
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


class RoleList extends Component {
  constructor() {
    super();
    this.state = {
      data: this.loadRoleList()
    };
    this.loadRoleList = this.loadRoleList.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  loadRoleList(){
    getRoles()
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
        this.loadRoleList();
    }


    clickHandler(mid){
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteRole(mid).then((result) => {
                    this.loadRoleList();
                }).catch(error => {
                  if(error.status === 404) {
                      this.setState({
                          notFound: true,
                          isLoading: false
                      });
                  } else {
                    notification.error({
                      message: 'MovieApp',
                      description: "You can not delete a role which is have users."
                  });  
                  }
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
        <h2 className="pb-2">Role List</h2>
        <ReactTable
          data={data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          columns={[
                {
                  Header: "Role Name",
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
                           <Link to={`/roleAdd/` + row.original.id}><button type="button" class ="btn btn-primary btn-sm mr-2 ">Update</button></Link>
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

export default RoleList;