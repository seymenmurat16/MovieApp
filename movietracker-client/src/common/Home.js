import React, { Component } from 'react';
import {
  Link
} from "react-router-dom";
import { Row } from 'antd';
import GoLogin from './Login';
import { ACCESS_TOKEN } from '../constants';


class MainPage extends Component {
  constructor() {
    super();
  }

  render() {
    if(localStorage.getItem(ACCESS_TOKEN)) {
        
    }else{
        return <GoLogin />;
    }
    return (
        <div>
            <Row>
                <Link to={`/movies`}><button type="button" class ="btn btn-success m-3">Movies</button></Link>
                <Link to={`/users`}><button type="button" class ="btn btn-success m-3">Users</button></Link>
                <Link to={`/directors`}><button type="button" class ="btn btn-success m-3">Directors</button></Link>
                <Link to={`/movieLists`}><button type="button" class ="btn btn-success m-3">MovieLists</button></Link>
                <Link to={`/places`}><button type="button" class ="btn btn-success m-3">Places</button></Link>
                <Link to={`/Roles`}><button type="button" class ="btn btn-success m-3">Roles</button></Link>
                
            </Row>
            <Row>
                
                {this.props.currentUser ? this.props.currentUser.role === "Admin" ? <div>
                <Link to={`/userAdd`}><button type="button" class ="btn btn-primary  m-3">Add User</button></Link>
                <Link to={`/directorAdd`}><button type="button" class ="btn btn-primary  m-3">Add Director</button></Link>
                <Link to={`/movieListAdd`}><button type="button" class ="btn btn-primary  m-3">Add Movie List</button></Link>
                <Link to={`/placeAdd`}><button type="button" class ="btn btn-primary  m-3">Add Place</button></Link>
                <Link to={`/roleAdd`}><button type="button" class ="btn btn-primary  m-3">Add Role</button></Link></div> : "" : ""}
                <Link to={`/addImdbMovie`}><button type="button" class ="btn btn-primary  m-3">Add Movie</button></Link>
            </Row>
        </div>
    );
  }
}

export default MainPage;