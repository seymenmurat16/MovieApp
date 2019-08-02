import React, { Component } from 'react';
import { getUserProfile, getListFromUser } from '../../util/APIUtils';
import { Avatar, Tabs, Row, Col, Descriptions, Card } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import { get } from 'http';
import {
    Route,
    Redirect,
    Link
  } from "react-router-dom";
import BadRequest from '../../common/BadRequest';
import { ACCESS_TOKEN } from '../../constants';
import GoLogin from '../../common/Login';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            lists: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(id) {
        this.setState({
            isLoading: true
        });

        getUserProfile(id)
        .then(response => {
            console.log(response)
            this.setState({
                user: response
            });
        }).catch(error => {
            if(error.status === 400) {
                this.setState({
                    badRequest: true,
                    isLoading: false
                });
            } 
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
        this.loadUserProfile(id);
        getListFromUser(id)
        .then(response => {
            console.log(response)
            this.setState({
                lists: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 400) {
                this.setState({
                    badRequest: true,
                    isLoading: false
                });
            }
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

    componentDidUpdate(nextProps) {
        if(this.props.match.params.id !== nextProps.match.params.id) {
            this.loadUserProfile(nextProps.match.params.username);
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

        if(this.state.badRequest) {
            return <BadRequest />;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div className="profile">
                { 
                    this.state.user ? (
                        <Row >
                                <Col span={6}>
                                        
                                            <Col span={24}>
                                                <div className="pt-5 mr-5" style={{textAlign:"center"}}>
                                                    
                                                    <Descriptions title={this.state.user.name + " | @" + this.state.user.username} ></Descriptions>
                                                        <div className="user-avatar">
                                                            <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                                                {this.state.user.name[0].toUpperCase()}
                                                            </Avatar>
                                                        </div>
                                                    
                                                </div>
                                            </Col>
                                             
                                        
                                </Col>
                                    <Col span={10}>
                                    <div className="p-5">
                                        
                                            <Descriptions title="User Info" bordered>
                                                <Descriptions.Item label="Name" span={6}>{this.state.user.name}</Descriptions.Item>
                                                <Descriptions.Item label="LastName" span={6}>{this.state.user.name}</Descriptions.Item>
                                                <Descriptions.Item label="Email" span={6}>{this.state.user.email}</Descriptions.Item>
                                                <Descriptions.Item label="Birth Date" span={6}>{this.state.user.birthDate.split('T')[0]}</Descriptions.Item>
                                                <Descriptions.Item label="Place" span={6}>{this.state.user.place.name}</Descriptions.Item>
                                            </Descriptions>,

                                            
                                        </div>
                                      
                                </Col>
                                <Col span={8}>
                                    <div className="p-5">
                                            <Descriptions title={this.state.user.username + "'s Lists"}>
                                                    {this.state.lists.map((i) => <div><li key={i.id}><Link to={`/users/${this.state.user.id}/lists/${i.id}`}>{i.name}</Link></li></div> )}
                                                </Descriptions>
                                            </div>
                                            </Col> 
                        </Row>
                           
                    ): null               
                }
            </div>
        );
    }
}

export default Profile;