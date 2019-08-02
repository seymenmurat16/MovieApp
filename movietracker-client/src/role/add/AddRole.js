import React, { Component } from 'react';
import { getRoleProfile, updateRole, addRole} from '../../util/APIUtils';
import { ACCESS_TOKEN } from '../../constants';
import moment from 'moment';
import {
    Route,
    Redirect,
    Link
  } from "react-router-dom";
import UnAuthorized from '../../common/UnAuthorized';
import { Form, Input, Button, Icon, notification, AutoComplete, Select, DatePicker } from 'antd';
import GoLogin from '../../common/Login';
const FormItem = Form.Item;
const { Option } = Select;



class AddRole extends Component {
    render() {
        if(localStorage.getItem(ACCESS_TOKEN)) {
        
        }else{
            return <GoLogin />;
        }
        if(this.props.currentUser ? this.props.currentUser.role !== "Admin" : true) {
            return <UnAuthorized />;
        }
        const AntWrappedLoginForm = Form.create()(AddRoleForm)
        return (
            <div className="login-container">
                <h1 className="page-title">{this.props.match.params.id ? "Role Update" : "Add Role"}</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onSubmit={this.props.onSubmit} username={this.props.currentUser.username} id={this.props.match.params.id}/>
                </div>
            </div>
        );
    }
}



class AddRoleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {role:null} 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCreate = this.renderCreate.bind(this);
        this.loadRoleProfile = this.loadRoleProfile.bind(this);
    }

    loadRoleProfile(id) {
        this.setState({
            isLoading: true
        });

        getRoleProfile(id)
        .then(response => {
            console.log(response)
            this.setState({
                role: response
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
            this.loadRoleProfile(this.props.id);
        }
        
    }
      
    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formRequest = {
                    ...values,"username":this.props.username}
                if(this.state.role){
                    updateRole(formRequest,this.state.role.id)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully updated Role.",
                      });
                    }).catch(error => {
                        
                            notification.error({
                                message: 'MovieApp',
                                description: error.message || 'Sorry! Something went wrong. Please try again!'
                            });                                            
                        
                    });
                }else{
                    addRole(formRequest)
                .then(response => {
                    notification.success({
                        message: 'MovieApp',
                        description: "You're successfully added Role.",
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
                    {getFieldDecorator('name', { initialValue: this.state.role ? this.state.role.name : "",
                        rules: [{ required: true, message: 'Please input your Role Information' }],
                    })(
                    <Input 
                        size="large"
                        name="name" 
                        placeholder="Role Name" />    
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


export default AddRole;