import React, { Component } from 'react';
import { login, getPlaces, getRoles, addUser ,getUserProfile, updateUser, getDirectorProfile, addDirector, updateDirector} from '../../util/APIUtils';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';
import moment from 'moment';
import {
    Route,
    Redirect
  } from "react-router-dom";
import { Form, Input, Button, Icon, notification, AutoComplete, Select, DatePicker } from 'antd';
import UnAuthorized from '../../common/UnAuthorized';
import GoLogin from '../../common/Login';
const FormItem = Form.Item;
const { Option } = Select;

  function onChange(value) {
    console.log(`selected ${value}`);
  }

class DirectorAdd extends Component {
    render() {
        if(localStorage.getItem(ACCESS_TOKEN)) {
        
        }else{
            return <GoLogin />;
        }
        if(this.props.currentUser ? this.props.currentUser.role !== "Admin" : true) {
            return <UnAuthorized />;
        }
       
        const AntWrappedLoginForm = Form.create()(DirectorAddForm)
        return (
            <div className="login-container">
                <h1 className="page-title">{this.props.match.params.id ? "Director Update" : "Director Add"}</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onSubmit={this.props.onSubmit} currentUser={this.props.currentUser} id={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}



class DirectorAddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {places : [],director:null} 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCreate = this.renderCreate.bind(this);
        this.loadDirectorProfile = this.loadDirectorProfile.bind(this);
    }

    loadDirectorProfile(id) {
        this.setState({
            isLoading: true
        });

        getDirectorProfile(id)
        .then(response => {
            console.log(response)
            this.setState({
                director: response
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
            this.loadDirectorProfile(this.props.id);
        }
        if(this.props.currentUser.role === "Admin"){
            this.setState({unAuthorized:false});
        }else{
            this.setState({unAuthorized:true})
        }
        
        
    }



    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formRequest = {
                    ...values,
                    'birthDate': values['birthDate'].format('YYYY-MM-DD')};
                if(this.state.director){
                    updateDirector(formRequest,this.state.director.id)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully updated Director.",
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
                    addDirector(formRequest)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully added Director.",
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
        console.log(this.state.director,149)
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
          };
          const dateFormat = 'YYYY/MM/DD';
          if(this.state.director){
            
            var date = new Date(this.state.director.birthDate); 
            console.log(date,"date")
          }
          
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('name', { initialValue: this.state.director ? this.state.director.name : "",
                        rules: [{ required: true, message: 'Please input your username' }],
                    })(
                    <Input 
                        size="large"
                        name="name" 
                        placeholder="Name" />    
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('surname', { initialValue: this.state.director ? this.state.director.surname : "",
                        rules: [{ required: true, message: 'Please input your name' }],
                    })(
                    <Input 
                        size="large"
                        name="surname" 
                        placeholder="Surname" />    
                    )}
                </FormItem>

                {
                    this.state.director ? <Form.Item >
                        {getFieldDecorator('birthDate', {rules: [{ type: 'object', required: true, message: 'Please select time!' }], initialValue:moment(date)})( <DatePicker />)}   
                    </Form.Item> : <Form.Item >
                    {getFieldDecorator('birthDate', config)(<DatePicker />)}
                    </Form.Item> 
                }
                
                
                <Form.Item  hasFeedback>
                {getFieldDecorator('place.name', { initialValue: this.state.director ? this.state.director.place ? this.state.director.place: "" : "",
                    rules: [{ required: true, message: 'Please select your place!' }],
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


export default DirectorAdd;