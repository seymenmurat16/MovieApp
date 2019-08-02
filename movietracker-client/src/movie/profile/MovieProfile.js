import React, { Component } from 'react';
import { getUserProfile, getListFromUser, getMovieProfile } from '../../util/APIUtils';
import { Avatar, Tabs, Row, Col, Descriptions, Card,Collapse } from 'antd';
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
import { ACCESS_TOKEN } from '../../constants';
import GoLogin from '../../common/Login';
const { Panel } = Collapse;



class MovieProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: null,            
            isLoading: false
        }
        this.loadMovieProfile = this.loadMovieProfile.bind(this);
    }

    loadMovieProfile(id) {
        this.setState({
            isLoading: true
        });

        getMovieProfile(id)
        .then(response => {
            console.log(response)
            this.setState({
                movie: response,
                isLoading:false
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
        this.loadMovieProfile(id);
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
            <div className="profile">
                { 
                    this.state.movie ? (
                        <Row >
                               <div className="user-profile">
                                                    <div className="movie-details">
                            <h2 className="full-name">{this.state.movie.name} <Link to={`/movies/` + this.state.movie.id + `/addList`}><button type="button" class ="btn btn-success btn-sm ml-3">Add List</button></Link></h2>
                            </div>
                            </div>
                                <Col span={8}>
                                            <Col span={24}>
                                                <div className="user-profile">
                                                    
                                                    <img src={this.state.movie.image}/>
                                                        
                                                    
                                                </div>
                                            </Col>
                                </Col>
                                    <Col span={16}>
                                    <div >
                                        
                                            <Descriptions title="Movie Info" bordered>                                         
                                                <Descriptions.Item label="Director" span={6}>{this.state.movie.directors.map((element)=>
                                                        <Link to={"/directors/" + element.id}>{element.name} {element.surname} </Link>
                                                    )}</Descriptions.Item>
                                                <Descriptions.Item label="Rating" span={6}>{this.state.movie.rating}</Descriptions.Item>
                                                <Descriptions.Item label="Duration" span={6}>{this.state.movie.duration}</Descriptions.Item>
                                                <Descriptions.Item label="Release Date" span={6}>{this.state.movie.releaseDate.split('T')[0]}</Descriptions.Item>
                                                <Descriptions.Item label="Genres" span={6}>{this.state.movie.genres.map((element)=>
                                                        <a>{element.name} </a>
                                                    )}</Descriptions.Item>
                                            </Descriptions>
                                        </div>  
                                        
                                </Col>
                                <Col span={8}>
                                    <div className="p-5">
                                    
                                            </div>
                                    </Col> 
                        </Row>
                    ): null               
                }
            </div>
        );
    }
}

export default MovieProfile;