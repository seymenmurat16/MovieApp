import React, { Component } from 'react';
import { login, getPlaces, getRoles, addUser ,getUserProfile, updateUser, addImdbMovie} from '../../util/APIUtils';
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


class ImdbMovieAdd extends Component {
    
    render() {
        if(localStorage.getItem(ACCESS_TOKEN)) {
        
        }else{
            return <GoLogin />;
        }
        
        const AntWrappedLoginForm = Form.create()(ImdbMovieAddForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Add Movie From IMDB</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onSubmit={this.props.onSubmit} username={this.props.currentUser.username}/>
                </div>
            </div>
        );
    }
}



class ImdbMovieAddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {} 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCreate = this.renderCreate.bind(this);
    }
      
    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {     
                const formRequest = {
                    ...values,"username":this.props.username}
                    console.log(formRequest)
                addImdbMovie(formRequest)
                .then(response => {
                    if(response.success==false){
                        notification.error({
                            message: 'MovieApp',
                            description: response.message
                        });  
                    }else{
                        notification.success({
                            message: 'MovieApp',
                            description: "You're successfully added Movie.",
                          });
                          this.props.form.resetFields();
                    }
                    }).catch(error => {
                        if(error.status === 400) {
                            notification.error({
                                message: 'MovieApp',
                                description: 'There is a no movie with this information.'
                            });                    
                        } else {
                            notification.error({
                                message: 'MovieApp',
                                description: error.message || 'Sorry! Something went wrong. Please try again!'
                            });                                            
                        }
                    });
                }
            });
    }

    renderCreate(){
        const { getFieldDecorator } = this.props.form;          
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('name', { 
                        rules: [{ required: true, message: 'Please input your Movie Information' }],
                    })(
                    <Input 
                        size="large"
                        name="name" 
                        placeholder="Movie Name or Movie ID" />    
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


export default ImdbMovieAdd;