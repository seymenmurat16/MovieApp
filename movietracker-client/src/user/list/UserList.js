import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { getUserProfile, getListFromUser,getMoviesFromList, getListFromId, deleteMovieFromList } from '../../util/APIUtils';
import { Avatar, Tabs, Row, Col, Descriptions, Card } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './UserList.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import { get } from 'http';
import {
    Route,
    Redirect,
    Link
  } from "react-router-dom";
import { ACCESS_TOKEN } from '../../constants';
import GoLogin from '../../common/Login';

const TabPane = Tabs.TabPane;

class Button extends React.Component{
    render(){
        return (
            <button type="button" class ="btn btn-danger" onClick= {()=> {this.props.clickHandler(this.props.id)}} >
            Delete
            </button>
        )
    }
}


class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: null,
            list:null, 
            isLoading: false
        }
        this.loadUserList = this.loadUserList.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    loadUserList(id,lid){
        getMoviesFromList(id,lid)
        .then(response => {
            console.log(response)
            this.setState({
                movies: response,
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
        const id = this.props.match.params.id;
        const lid = this.props.match.params.lid;
        this.loadUserList(id,lid);
        getListFromId(lid)
        .then(response => {
            console.log(response)
            this.setState({
                list: response,
                isLoading: false
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


    clickHandler(mid){
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteMovieFromList(this.props.match.params.id,this.props.match.params.lid,mid).then((result) => {
                    const id = this.props.match.params.id;
                    const lid = this.props.match.params.lid;
                    this.loadUserList(id,lid);
                })
              },
              {
                label: 'No'
              }
            ]
          });
        
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.id !== nextProps.match.params.id) {
            this.loadUserList(nextProps.match.params.id);
        }    
    }

    render() {
        if(localStorage.getItem(ACCESS_TOKEN)) {
        
        }else{
            return <GoLogin />;
        }
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };


        return (
            <div className="profle">
                { 
                    this.state.movies ? (
                        <div className="">
                { 
                        <Row >
                                <Col span={4}>         
                                        
                                </Col>
                                    <Col span={16}>
                                    <div className="p-5">

                                    <h2>{this.props.currentUser.username + "'s " + this.state.list.name + " List"}</h2>
                                    <div>
                                        <table class="table">
                                            <thead class="thead-light">
                                                <tr>
                                                <th >Movie Name</th>
                                                <th >Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.movies.map((element)=>
                                            <tr>
                                                <Link to={"/movies/" + element.id}><td>{element.name}</td></Link>
                                                {
                                                    this.props.currentUser.id == this.props.match.params.id ? 
                                                    <td><Button id = {element.id} clickHandler = {this.clickHandler}/></td> 
                                                : 
                                                    "" 
                                                } 
                                            </tr>)}
                                            </tbody>
                                        </table>
                                    </div>
                                    </div>
                                      
                                </Col>

                        </Row>
                                         
                }
            </div>
                    ): null               
                }
            </div>
        );
    }
}

export default UserList;