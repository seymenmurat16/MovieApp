import React, { Component } from 'react';
import { login, getPlaces, getRoles, addUser ,getUserProfile, updateUser} from '../../util/APIUtils';
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



  function onChange(value) {
    console.log(`selected ${value}`);
  }

class UserAdd extends Component {
    render() {
        if(localStorage.getItem(ACCESS_TOKEN)) {
        
        }else{
            return <GoLogin />;
        }
        if(this.props.currentUser ? this.props.currentUser.role !== "Admin" : true) {
            return <UnAuthorized />;
        }
        const AntWrappedLoginForm = Form.create()(UserAddForm)
        return (
            <div className="login-container">
                <h1 className="page-title">{this.props.match.params.id ? "User Update" : "User Add"}</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onSubmit={this.props.onSubmit} id={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}



class UserAddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {places : [],user:null} 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCreate = this.renderCreate.bind(this);
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
      
    
    componentDidMount(){
        getPlaces()
        .then(response => {
            console.log(response,37)
            this.setState({places:response});
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
        if(this.props.id){
            this.loadUserProfile(this.props.id);
        }
        
        
    }



    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formRequest = {
                    ...values,
                    'birthDate': values['birthDate'].format('YYYY-MM-DD')};
                if(this.state.user){
                    updateUser(formRequest,this.state.user.id)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully updated User.",
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
                }else{
                    addUser(formRequest)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully added User.",
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
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
          };
          const dateFormat = 'YYYY/MM/DD';
          if(this.state.user){
            
            var date = new Date(this.state.user.birthDate); 
            console.log(date,"date")
          }
          
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', { initialValue: this.state.user ? this.state.user.username : "",
                        rules: [{ required: true, message: 'Please input your username' }],
                    })(
                    <Input 
                        size="large"
                        name="username" 
                        placeholder="Username" />    
                    )}
                </FormItem>
                <FormItem>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input 
                        size="large"
                        name="password" 
                        type="password" 
                        placeholder="Password"  />                        
                )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('name', { initialValue: this.state.user ? this.state.user.name : "",
                        rules: [{ required: true, message: 'Please input your name' }],
                    })(
                    <Input 
                        size="large"
                        name="name" 
                        placeholder="Name" />    
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('lastName', { initialValue: this.state.user ? this.state.user.lastName : "",
                        rules: [{ required: true, message: 'Please input your lastname' }],
                    })(
                    <Input 
                        size="large"
                        name="lastname" 
                        placeholder="Last Name" />    
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('email', { initialValue: this.state.user ? this.state.user.email : "",
                        rules: [{ required: true, message: 'Please input your E-mail' }],
                    })(
                    <Input 
                        size="large"
                        name="email" 
                        type="email" 
                        placeholder="E-mail" />    
                    )}
                </FormItem>

                {
                    this.state.user ? <Form.Item >
                        {getFieldDecorator('birthDate', {rules: [{ type: 'object', required: true, message: 'Please select time!' }], initialValue:moment(date)})( <DatePicker />)}   
                    </Form.Item> : <Form.Item >
                    {getFieldDecorator('birthDate', config)(<DatePicker />)}
                    </Form.Item> 
                }
                
                
                <Form.Item  hasFeedback>
                {getFieldDecorator('place.name', { initialValue: this.state.user ? this.state.user.place.name : "",
                    rules: [{ required: true, message: 'Please select your country!' }],
                })(
                    <Select
                    showSearch
                    placeholder="Select a Place"
                    filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {this.state.places.map((element)=> <Option key ={element.id} value={element.name}>{element.name}</Option>)}
                </Select>,
                )}
                </Form.Item>
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


export default UserAdd;