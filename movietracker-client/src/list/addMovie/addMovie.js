import React, { Component } from 'react';
import { addMovieToList,getLists} from '../../util/APIUtils';
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


class MovieAddList extends Component {
    render() {
        if(localStorage.getItem(ACCESS_TOKEN)) {
        
        }else{
            return <GoLogin />;
        }
        if(this.props.currentUser ? this.props.currentUser.role !== "Admin" : true) {
            return <UnAuthorized />;
        }
        
        const AntWrappedLoginForm = Form.create()(MovieAddListForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Add Movie To List</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onSubmit={this.props.onSubmit} username={this.props.match.params.username} movieid ={this.props.match.params.id} userid={this.props.currentUser.id}/>
                </div>
            </div>
        );
    }
}



class MovieAddListForm extends Component {
    constructor(props) {
        super(props);
        this.state = {lists:this.LoadLists()} 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCreate = this.renderCreate.bind(this);
        this.LoadLists = this.LoadLists.bind(this);
    }

    LoadLists(){
        getLists()
        .then(response => {
            console.log(response,"aaa")
            this.setState({
                lists: response,
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
        this.LoadLists();
    }
      
    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {     
                const formRequest = {
                    ...values,"username":this.props.username}
                    console.log(formRequest,1233)
                    addMovieToList(formRequest,this.props.userid,this.props.movieid)
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
        console.log(this.state,103)        
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">

                <Form.Item  hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please select your list!' }],
                    })(
                        <Select
                        showSearch
                        placeholder="Select a List"
                        filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.state.lists ? this.state.lists.map((element)=> <Option key ={element.id} value={element.id}>{element.name}</Option>):""}
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
        console.log(this.state.lists,"render")
        return (
            <div>
                {this.renderCreate()}
            </div>
        )
    }
}


export default MovieAddList;