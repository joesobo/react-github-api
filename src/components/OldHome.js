import React from 'react';
import { Button, FormControl, Row, Col } from 'react-bootstrap';
import RepoList from './RepoList';
import RepoInfo from './RepoInfo';
import RepoPunchCard from './RepoPunchCard';
import 'bootstrap/dist/css/bootstrap.css';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
           name: '',
           repoItems: [],
           showRepoList: false,
           displayRepo: [],
           displayCommits: [],
           repoCommitActivity: [],
           showRepoInfo: false,
           showPunchCard: false,
           displayPunchCard: [],
           followers: [],
           following: [],
           sortUpdate: true,
           rate_limit: 0,
           rate_remaining: 0
        }
    }

    componentDidMount() {
        this.findUserRateInfo();
    }

    handleChange = (e) => {
        this.setState({name: e.target.value});
    }

    formValid() {
        return this.state.name.length;
    }

    async getData(url = '') {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'joesobo:!@#4Ight'
            }
        });

        return response.json();
    }

    findUserRateInfo() {
        this.getData(`https://api.github.com/rate_limit`)
        //TODO: add data.rate.reset for Date
        .then(data => this.setState({rate_limit: data.rate.limit, rate_remaining: data.rate.remaining}));
    }

    findUserRepoPunchCard(self) {
        this.getData(`https://api.github.com/users/${this.state.name}/${this.state.displayRepo}/stats/punch_card`)
         .then(data => self.setState({displayPunchCard: data, showPunchCard: true}));
    }

    findRepoCommitInfo(value) {
        if (value) {
            this.getData(`https://api.github.com/repos/${this.state.name}/${value.name}/stats/contributors`)
             .then(data => this.setState({repoCommitActivity: data}))
             .then(this.getData(`https://api.github.com/repos/${this.state.name}/${value.name}/commits`)
             .then(data => this.setState({displayRepo: value, displayCommits: data, showRepoInfo: true})));
        }
    }

    findUserRepoInfo(self, params) {
        this.getData(`https://api.github.com/users/${this.state.name}/repos?${params}`)
         .then(data => self.setState({repoItems: data, showRepoList: true}));
    }

    findUserInfo(self) {
        this.findUserRepoInfo(self, "sort=updated");
        
        this.getData(`https://api.github.com/users/${this.state.name}/followers`)
         .then(data => self.setState({followers: data}));
        this.getData(`https://api.github.com/users/${this.state.name}/following`)
         .then(data => self.setState({following: data}));
    }

    render() {
        var self = this;

        return(
            <div className='home'>
                <Row>
                    <Col md={{ span: 3, offset: 4 }}>
                        <h3 className="text-center mt-2 left-pad">React Github API</h3>
                    </Col>
                    {/* TODO: add time at which it will reset */}
                    <Col md={{ span: 1, offset: 4 }}>
                        <p className="text-center mt-2">Rate Limit: {this.state.rate_remaining}/{this.state.rate_limit}</p>
                    </Col>
                </Row>
                
                <div className="form-inline mx-auto search-form"
                 onKeyPress={(e) => e.key === "Enter" ? this.findUserInfo(self) : ''}>
                    <FormControl
                        className="form-control"
                        type="text"
                        value={this.state.name}
                        placeholder="GitHub Username"
                        onChange={this.handleChange}/>
                    <Button 
                     className="btn btn-primary ml-2"
                     onClick={() => this.findUserInfo(self)}
                     disabled={!this.formValid()}>
                        Submit
                    </Button>
               </div>

               <Row>
                   <Col>
                    {
                        this.state.showRepoInfo ?
                        <div>
                            <h5 className="base-name"><strong>Repository: </strong>{this.state.displayRepo.name}</h5>

                            <Row className="justify-content-md-center">
                                <Button
                                onClick={() =>
                                    this.findUserRepoPunchCard(self)}
                                >Show Punch Card</Button>
                            </Row>

                            <RepoInfo 
                             repo={this.state.displayRepo}
                             commits={this.state.displayCommits}
                             repoCommitActivity={this.state.repoCommitActivity}/>
                        </div> :
                        ''
                    }
                   </Col>
                   <Col>
                    {
                        this.state.showRepoList ?
                        <div>
                            <h4>{this.state.name}</h4>

                            <Row className="mb-2 mx-auto followers-row">
                                <Col>Followers: {this.state.followers.length}</Col>
                                <Col>Following: {this.state.following.length}</Col>
                            </Row>

                            <Row className="mb-2 justify-content-md-center">
                                <Col className="mt-1" md="auto">Sort By: </Col>
                                <Col md="auto">
                                    <Button
                                    disabled={!this.state.sortUpdate}
                                    onClick={() => {
                                        this.findUserRepoInfo(self, "sort=created");
                                        this.setState({sortUpdate: false})}}
                                    >Created</Button>
                                </Col>
                                <Col md="auto">
                                    <Button
                                    disabled={this.state.sortUpdate}
                                    onClick={() => {
                                        this.findUserRepoInfo(self, "sort=updated");
                                        this.setState({sortUpdate: true})}}
                                    >Updated</Button>
                                </Col>
                            </Row>
                            
                            <RepoList 
                             items={this.state.repoItems}
                             setDisplayRepo={this.findRepoCommitInfo.bind(this)}/>
                        </div> :
                        ''
                    }
                   </Col>
                   <Col>
                   {
                        this.state.showPunchCard ?
                        <div>
                            <h5 className="base-name"><strong>Punch Card:</strong></h5>

                            <RepoPunchCard
                             items={this.state.displayPunchCard}
                             />
                        </div> :
                        ''
                    }
                   </Col>
               </Row>
            </div>
        );
    }
}

export default Home