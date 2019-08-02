import React, { Component } from 'react';
import { addMovieToList,getLists, addMovieList, updateMovieList, getListFromId} from '../../util/APIUtils';
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



class AddMovieList extends Component {
    render() {
        if(localStorage.getItem(ACCESS_TOKEN)) {
        
        }else{
            return <GoLogin />;
        }
        const AntWrappedLoginForm = Form.create()(AddMovieListForm)
        return (
            <div className="login-container">
                <h1 className="page-title">{this.props.match.params.id ? "Update MovieList" : "Add Movie List"}</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onSubmit={this.props.onSubmit} username={this.props.currentUser.username} id={this.props.match.params.id}/>
                </div>
            </div>
        );
    }
}



class AddMovieListForm extends Component {
    constructor(props) {
        super(props);
        this.state = {list:null} 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCreate = this.renderCreate.bind(this);
        this.loadListProfile = this.loadListProfile.bind(this);
    }

    loadListProfile(id) {
        this.setState({
            isLoading: true
        });

        getListFromId(id)
        .then(response => {
            console.log(response)
            this.setState({
                list: response
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
            this.loadListProfile(this.props.id);
        }
    }
      
    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formRequest = {
                    ...values,"username":this.props.username}
                if(this.state.list){
                    updateMovieList(formRequest,this.state.list.id)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully updated Movie List.",
                      });
                    }).catch(error => {
                        if(error.status === 409) {
                            notification.error({
                                message: 'MovieApp',
                                description: 'There is a username with this username!'
                            });                    
                        } else {
                            notification.error({
                                message: 'MovieApp',
                                description: error.message || 'Sorry! Something went wrong. Please try again!'
                            });                                            
                        }
                    });
                }else{
                    addMovieList(formRequest)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully added Movie List.",
                      });
                      this.props.form.resetFields();
                    }).catch(error => {
                        if(error.status === 409) {
                            notification.error({
                                message: 'MovieApp',
                                description: 'There is a username with this username!'
                            });                    
                        } else {
                            notification.error({
                                message: 'MovieApp',
                                description: error.message || 'Sorry! Something went wrong. Please try again!'
                            });                                            
                        }
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
                    {getFieldDecorator('name', { initialValue: this.state.list ? this.state.list.name : "",
                        rules: [{ required: true, message: 'Please input your List Information' }],
                    })(
                    <Input 
                        size="large"
                        name="name" 
                        placeholder="List Name" />    
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


export default AddMovieList;