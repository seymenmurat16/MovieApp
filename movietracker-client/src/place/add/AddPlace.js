import React, { Component } from 'react';
import { updatePlace, getPlaces, addPlace, getPlaceProfile} from '../../util/APIUtils';
import { ACCESS_TOKEN } from '../../constants';
import moment from 'moment';
import {
    Route,
    Redirect,
    Link
  } from "react-router-dom";
import { Form, Input, Button, Icon, notification, AutoComplete, Select, DatePicker } from 'antd';
import UnAuthorized from '../../common/UnAuthorized';
import GoLogin from '../../common/Login';
const FormItem = Form.Item;
const { Option } = Select;


class AddPlace extends Component {
    render() {
        if(localStorage.getItem(ACCESS_TOKEN)) {
        
        }else{
            return <GoLogin />;
        }
        if(this.props.currentUser ? this.props.currentUser.role !== "Admin" : true) {
            return <UnAuthorized />;
        }
        const AntWrappedLoginForm = Form.create()(AddPlaceForm)
        return (
            <div className="login-container">
                <h1 className="page-title">{this.props.match.params.id ? "Place Update" : "Add Place"}</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onSubmit={this.props.onSubmit} username={this.props.currentUser.username} id={this.props.match.params.id}/>
                </div>
            </div>
        );
    }
}



class AddPlaceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {place:null} 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCreate = this.renderCreate.bind(this);
        this.loadPlaceProfile = this.loadPlaceProfile.bind(this);
    }

    loadPlaceProfile(id) {
        this.setState({
            isLoading: true
        });

        getPlaceProfile(id)
        .then(response => {
            console.log(response)
            this.setState({
                place: response
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
        if(this.props.id){
            this.loadPlaceProfile(this.props.id);
        }
        
    }
      
    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formRequest = {
                    ...values,"username":this.props.username}
                if(this.state.place){
                    updatePlace(formRequest,this.state.place.id)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully updated Place.",
                      });
                    }).catch(error => {
                        
                            notification.error({
                                message: 'MovieApp',
                                description: error.message || 'Sorry! Something went wrong. Please try again!'
                            });                                            
                        
                    });
                }else{
                    addPlace(formRequest)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully added Place.",
                      });
                      this.props.form.resetFields();
                    }).catch(error => {
                    
                            notification.error({
                                message: 'MovieApp',
                                description: error.message || 'Sorry! Something went wrong. Please try again!'
                            });                                            
                    
                    });
                }
            }
        });
    }

    renderCreate(){
        const { getFieldDecorator } = this.props.form;  
        console.log(this.state,103)        
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('name', { initialValue: this.state.place ? this.state.place.name : "",
                        rules: [{ required: true, message: 'Please input your Place Information' }],
                    })(
                    <Input 
                        size="large"
                        name="name" 
                        placeholder="Place Name" />    
                    )}
                </FormItem>
                            <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Submit</Button>
                </FormItem>
            </Form>
        );
    }

    render() { 
        return (
            <div>
                {this.renderCreate()}
            </div>
        )
    }
}


export default AddPlace;