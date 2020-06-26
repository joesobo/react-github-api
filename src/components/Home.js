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
    const [getRepoName, setRepoName] = useState({ name: '' });
    const [getRepoCommitActivity, setRepoCommitActivity] = useState({ repoCommitActivity: [] });
    const [getFollowers, setFollowers] = useState({ followers: [] });
    const [getFollowing, setFollowing] = useState({ following: [] });
    const [getRepoItems, setRepoItems] = useState({ repoItems: [] });
    const [getRepoSort, setRepoSort] = useState({ sortUpdate: true });
    const [getRepoListDisplay, setRepoListDisplay] = useState({ showRepoList: false });
    const [getDisplayRepo, setDisplayRepo] = useState({
        repoDisplay: [],
        commitsDisplay: [], 
        showRepoInfo: false
    });
    const [getPunchCard, setPunchCard] = useState({
        punchCardDisplay: [],
        showPunchCard: false
    });

    const getData = (path = '') => {
        return fetch("http://localhost:5000/" + path, {
            method: "GET",
            headers: {
                Authorization: state.accessToken
            }
        });
    }

    const findUserRateInfo = () => {
        getData('rate_limit')
        //TODO: add data.rate.reset for Date
        .then(response => response.json())
        .then(data => setNewRate({ rate_limit: data.rate.limit, rate_remaining: data.rate.remaining }));
    }

    useEffect(() => {
        if (state.isLoggedIn) {
            if (getRate.rate_limit === 0) {
                findUserRateInfo();
            }
        }
    });

    if (!state.isLoggedIn) {
        return <Redirect to="/login" />
    }

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT"
        });
    }

    const handleChange = (e) => {
        setRepoName({ name: e.target.value });
    }

    const formValid = () => {
        if (getRepoName.name) {
            return getRepoName.name.length;
        } else {
            return 0;
        }
    }

    const findRepoCommitInfo = (value) => {
        if (value) {
            getData(`repos/${getRepoName.name}/${value.name}/stats/contributors`)
             .then(response => response.json())
             .then(data => setRepoCommitActivity({ repoCommitActivity: data }))
             .then(getData(`repos/${getRepoName.name}/${value.name}/commits`)
              .then(response => response.json())
              .then(data => setDisplayRepo({ repoDisplay: value, commitsDisplay: data, showRepoInfo: true })));
        }
    }

    const findUserRepoInfo = (params) => {
        getData(`users/${getRepoName.name}/repos?${params}`)
         .then(response => response.json())
         .then(data => setRepoItems({ repoItems: data }));
    }

    const findUserInfo = () => {
        findUserRepoInfo("sort=updated");
        
        getData(`users/${getRepoName.name}/followers`)
         .then(response => response.json())
         .then(data => setFollowers({ followers: data }));
        getData(`users/${getRepoName.name}/following`)
         .then(response => response.json())
         .then(data => setFollowing({ following: data }))
        .then(() => setRepoListDisplay({ showRepoList: true }));
    }

    const findUserRepoPunchCard = () => {
        getData(`users/${getRepoName.name}/${getDisplayRepo.displayRepo}/stats/punch_card`)
         .then(response => response.json())
         .then(data => setPunchCard({ punchCardDisplay: data, showPunchCard: true }));
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
                onKeyPress={(e) => e.key === "Enter" ? findUserInfo() : ''}>
                <FormControl
                    className="form-control"
                    type="text"
                    value={ getRepoName.name }
                    placeholder="GitHub Username"
                    onChange={ handleChange }
                />
                <Button 
                    className="btn btn-primary ml-2"
                    onClick={() => findUserInfo()}
                    disabled={ !formValid() }
                >
                    Submit
                </Button>
            </div>

            <Row>
                <Col>
                {
                    getDisplayRepo.showRepoInfo ?
                    <div>
                        <h5 className="base-name"><strong>Repository: </strong>{getDisplayRepo.repoDisplay.name}</h5>

                        <Row className="justify-content-md-center">
                            <Button
                            onClick={() => findUserRepoPunchCard()}
                            >Show Punch Card</Button>
                        </Row>

                        <RepoInfo 
                            repo={getDisplayRepo.repoDisplay}
                            commits={getDisplayRepo.commitsDisplay}
                            repoCommitActivity={getRepoCommitActivity.repoCommitActivity}/>
                    </div> :
                    ''
                }
                </Col>
                <Col>
                {
                    getRepoListDisplay.showRepoList ?
                    <div>
                        <h4>{getRepoName.name}</h4>

                        <Row className="mb-2 mx-auto followers-row">
                            <Col>Followers: {getFollowers.followers.length}</Col>
                            <Col>Following: {getFollowing.following.length}</Col>
                        </Row>

                        <Row className="mb-2 justify-content-md-center">
                            <Col className="mt-1" md="auto">Sort By: </Col>
                            <Col md="auto">
                                <Button
                                disabled={!getRepoSort.sortUpdate}
                                onClick={() => {
                                    findUserRepoInfo("sort=created");
                                    setRepoSort({ sortUpdate: false })}}
                                >Created</Button>
                            </Col>
                            <Col md="auto">
                                <Button
                                disabled={getRepoSort.sortUpdate}
                                onClick={() => {
                                    findUserRepoInfo("sort=updated");
                                    setRepoSort({ sortUpdate: true })}}
                                >Updated</Button>
                            </Col>
                        </Row>
                        
                        <RepoList 
                            items={getRepoItems.repoItems}
                            setDisplayRepo={findRepoCommitInfo}/>
                    </div> :
                    ''
                }
                </Col>
                <Col>
                {
                    getPunchCard.showPunchCard ?
                    <div>
                        <h5 className="base-name"><strong>Punch Card:</strong></h5>

                        <RepoPunchCard
                            items={getPunchCard.punchCardDisplay}
                            />
                    </div> :
                    ''
                }
                </Col>
            </Row>
        </div>
    )
}