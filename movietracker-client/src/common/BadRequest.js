import React, { Component } from 'react';
import './BadRequest.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

class BadRequest extends Component {
    render() {
        return (
            <div className="page-not-found">
                <h1 className="title">
                    400
                </h1>
                <div className="desc">
                    Bad Request.
                </div>
                <Link to="/"><Button className="go-back-btn" type="primary" size="large">Go Back</Button></Link>
            </div>
        );
    }
}

export default BadRequest;