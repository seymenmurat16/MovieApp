import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import Login from '../user/login/Login';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';
import Profile from '../user/profile/Profile'

import { Layout, notification } from 'antd';
import UserList from '../user/list/UserList';
import UserAdd from '../user/add/UserAdd';
import ImdbMovieAdd from '../movie/add/MovieAdd';
import MovieProfile from '../movie/profile/MovieProfile';
import MovieList from '../movie/list/MovieList';
import Users from '../user/list/Users';
import DirectorList from '../director/list/DirectorList';
import DirectorProfile from '../director/profile/DirectorProfile';
import MovieAddList from '../list/addMovie/addMovie';
import DirectorAdd from '../director/add/AddDirector';
import AddMovieList from '../movieLists/add/AddMovieList';
import AddPlace from '../place/add/AddPlace';
import AddRole from '../role/add/AddRole';
import List from '../movieLists/list/list';
import RoleList from '../role/list/RoleList';
import Main from '../common/Home';
import MainPage from '../common/Home';
import PlaceList from '../place/list/PlaceList';
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null || localStorage.getItem("user"),
      isAuthenticated: false || localStorage.getItem("isAuth"),
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });    
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      console.log(response)
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
      localStorage.setItem("user",response);
      localStorage.setItem("isAuth",true);
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    localStorage.clear();
    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'MovieApp',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'MovieApp',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
        <Layout className="app-container">
          <AppHeader isAuthenticated={this.state.isAuthenticated} 
            currentUser={this.state.currentUser} 
            onLogout={this.handleLogout} />

          <Content className="app-content">
            <div className="container">
              <Switch>      
                <Route path="/login" 
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                  <Route exact path="/users/:id" 
                  render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/users/:id/lists/:lid" 
                  render={(props) => <UserList isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/userAdd" 
                  render={(props) => <UserAdd isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/userAdd/:id" 
                  render={(props) => <UserAdd isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/addImdbMovie" 
                  render={(props) => <ImdbMovieAdd isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/movies/:id" 
                  render={(props) => <MovieProfile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/movies" 
                  render={(props) => <MovieList isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/users" 
                  render={(props) => <Users isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/directors" 
                  render={(props) => <DirectorList isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/directors/:id" 
                  render={(props) => <DirectorProfile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/movies/:id/addList" 
                  render={(props) => <MovieAddList isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/directorAdd" 
                  render={(props) => <DirectorAdd isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/directorAdd/:id" 
                  render={(props) => <DirectorAdd isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/movieListAdd/:id" 
                  render={(props) => <AddMovieList isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/movieListAdd" 
                  render={(props) => <AddMovieList isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/placeAdd/:id" 
                  render={(props) => <AddPlace isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/placeAdd" 
                  render={(props) => <AddPlace isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/roleAdd/:id" 
                  render={(props) => <AddRole isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/roleAdd" 
                  render={(props) => <AddRole isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/movieLists" 
                  render={(props) => <List isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/roles" 
                  render={(props) => <RoleList isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/places" 
                  render={(props) => <PlaceList isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route exact path="/" 
                  render={(props) => <MainPage isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
          </Content>
        </Layout>
    );
  }
}

export default withRouter(App);
