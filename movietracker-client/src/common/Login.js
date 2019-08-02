import React, { Component } from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

class GoLogin extends Component {
    render() {
        return (
            <div className="page-not-found">
                <h1 className="title">
                    Please Login
                </h1>
                <div className="desc">
                </div>
                <Link to="/login"><Button className="go-back-btn" type="primary" size="large">Go Login Page</Button></Link>
            </div>
        );
    }
}

export default GoLogin;