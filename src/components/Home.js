import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../App";
import { Button, FormControl, Row, Col } from 'react-bootstrap';
import RepoList from './RepoList';
import RepoInfo from './RepoInfo';
import RepoPunchCard from './RepoPunchCard';
import 'bootstrap/dist/css/bootstrap.css';

export default function Home() {
    const { state, dispatch } = useContext(AuthContext);

    const [getRate, setNewRate] = useState({
        rate_limit: 0,
        rate_remaining: 0,
    });

    const getData = (path = '') => {
        return fetch("http://localhost:5000/" + path, {
            method: "GET"
        });
    }

    const findUserRateInfo = () => {
        getData('rate_limit')
        //TODO: add data.rate.reset for Date
        .then(response => response.json())
        .then(data => setNewRate({ rate_limit: data.rate.limit, rate_remaining: data.rate.remaining }));
    }

    useEffect(() => {
        findUserRateInfo();
    });

    if (!state.isLoggedIn) {
        return <Redirect to="/login" />
    }

    const { avatar_url, name, public_repos, followers, following } = state.user;     

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT"
        });
    }

    const handleChange = (e) => {
        this.setState({name: e.target.value});
    }

    const formValid = () => {
        return this.state.name.length;
    }

    

    return (
        <div className='home'>
            <Row>
                <Col md={{ span: 3, offset: 4 }}>
                    <h3 className="text-center mt-2 left-pad">React Github API</h3>
                </Col>
                {/* TODO: add time at which it will reset */}
                <Col md={{ span: 1, offset: 4 }}>
                    <p className="text-center mt-2">Rate Limit: {getRate.rate_remaining}/{getRate.rate_limit}</p>
                </Col>
            </Row>
            
            <div className="form-inline mx-auto search-form"
                onKeyPress={(e) => /*e.key === "Enter" ? this.findUserInfo(self) :*/ ''}>
                <FormControl
                    className="form-control"
                    type="text"
                    value={state.name}
                    placeholder="GitHub Username"
                    //onChange={handleChange}
                />
                <Button 
                    className="btn btn-primary ml-2"
                    //onClick={() => this.findUserInfo(self)}
                    //disabled={!formValid()}
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}