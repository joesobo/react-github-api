import React from 'react';
import ReactDOM from 'react-dom';
import { Button, FormControl, Row, Col } from 'react-bootstrap';
import RepoList from './RepoList';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
           name: '',
           repoItems: [],
           showRepoList: false,
           followers: [],
           following: []
        }
    }

    handleChange = (e) => {
        this.setState({name: e.target.value});
    }

    formValid() {
        return this.state.name.length;
    }

    findUserInfo(self) {
        this.requestUserRepos(this.state.name, self)
        this.requestUserFollowers(this.state.name, self)
        this.requestUserFollowing(this.state.name, self)
    }

    //TODO: REFACTOR
    requestUserRepos(userName, self) {
        const xhr = new XMLHttpRequest();
        const url = `https://api.github.com/users/${userName}/repos`;
    
        // Providing 3 arguments (GET/POST, The URL, Async True/False)
        xhr.open('GET', url, true);
    
        xhr.onload = function() {
            const data = JSON.parse(this.response);
            self.setState({repoItems: data, showRepoList: true});
        }
    
        xhr.send();
    }

    requestUserFollowers(userName, self) {
        const xhr = new XMLHttpRequest();
        const url = `https://api.github.com/users/${userName}/followers`;
    
        // Providing 3 arguments (GET/POST, The URL, Async True/False)
        xhr.open('GET', url, true);
    
        xhr.onload = function() {
            const data = JSON.parse(this.response);
            self.setState({followers: data});
        }
    
        xhr.send();
    }

    requestUserFollowing(userName, self) {
        const xhr = new XMLHttpRequest();
        const url = `https://api.github.com/users/${userName}/following`;
    
        // Providing 3 arguments (GET/POST, The URL, Async True/False)
        xhr.open('GET', url, true);
    
        xhr.onload = function() {
            const data = JSON.parse(this.response);
            self.setState({following: data});
        }
    
        xhr.send();
    }

    render() {
        var self = this;

        return(
            <div className='home'>
                <h3 className="text-center mt-5">React Github API</h3>
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
                     onClick={() => this.requestUserRepos(this.state.name, self)}
                     disabled={!this.formValid()}>
                        Submit
                    </Button>
               </div>

                {
                    this.state.showRepoList ?
                    <div>
                        <h4>{this.state.name}</h4>

                        <Row className="mb-3 mx-auto">
                            <Col>Followers: {this.state.followers.length}</Col>
                            <Col>Following: {this.state.following.length}</Col>
                        </Row>
                        
                        <RepoList 
                         items={this.state.repoItems}/>
                    </div> :
                    ''
                }
            </div>
        );
    }
}

ReactDOM.render(<Home/>, document.getElementById('root'))