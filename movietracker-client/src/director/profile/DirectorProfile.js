import React, { Component } from 'react';
import { getUserProfile, getListFromUser, getDirectorProfile ,getDirectorsMovies} from '../../util/APIUtils';
import { Avatar, Tabs, Row, Col, Descriptions, Card, List } from 'antd';
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

class DirectorProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            director: this.loadDirectorProfile(this.props.match.params.id),
            movies:this.loadDirectorsMovies(this.props.match.params.id), 
            isLoading: false
        }
        this.loadDirectorProfile = this.loadDirectorProfile.bind(this);
        this.loadDirectorsMovies = this.loadDirectorsMovies.bind(this);
    }

    loadDirectorProfile(id) {
        this.setState({
            isLoading: true
        });

        getDirectorProfile(id)
        .then(response => {
            console.log(response)
            this.setState({
                director: response,
                isLoading:false
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

    loadDirectorsMovies(id) {
        this.setState({
            isLoading: true
        });

        getDirectorsMovies(id)
        .then(response => {
            console.log(response)
            this.setState({
                movies: response,
                isLoading:false
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
        this.loadDirectorProfile(id);
        this.loadDirectorsMovies(id);
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

        const data = this.state.movies;

        return (
            <div className="profile">
                { 
                    this.state.director ? (
                        <Row >
                                <Col span={6}>
                                        
                                            <Col span={24}>
                                                <div className="user-profile">
                                                    <div className="user-details">
                                                        <div className="user-avatar">
                                                            <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.director.name)}}>
                                                                {this.state.director.name[0].toUpperCase()}
                                                            </Avatar>
                                                        </div>
                                                        <div className="user-summary">
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                             
                                        
                                </Col>
                                    <Col span={10}>
                                    <div className="p-5">
                                        
                                            <Descriptions title="Director Info" bordered>
                                                <Descriptions.Item label="Name" span={6}>{this.state.director.name}</Descriptions.Item>
                                                <Descriptions.Item label="LastName" span={6}>{this.state.director.surname}</Descriptions.Item>
                                                <Descriptions.Item label="Birth Date" span={6}>{this.state.director.birthDate.split('T')[0]}</Descriptions.Item>
                                                <Descriptions.Item label="Place" span={6}>{this.state.director.place ? this.state.director.place.name:"N/A"}</Descriptions.Item>
                                            </Descriptions>, 
                                        </div>
                                      
                                </Col>
                                <Col span={8}>
                                    <div className="p-5">
                                    <Descriptions title="Director Info"></Descriptions>
                                    <List
                                        size="small"
                                        header={<div>{this.state.director.name} {this.state.director.surname}'s Movies</div>}
                                        bordered
                                        dataSource={data}
                                        renderItem={item => <Link to={`/movies/` + item.id}><List.Item>{item.name}</List.Item></Link>}
                                        />
                                            </div>
                                            </Col> 
                        </Row>
                           
                    ): null               
                }
            </div>
        );
    }
}

export default DirectorProfile;