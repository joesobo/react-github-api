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
        this.getData(`https://api.github.com/users/${this.state.name}/repos?sort=updated`)
         .then(data => self.setState({repoItems: data, showRepoList: true}));
        this.getData(`https://api.github.com/users/${this.state.name}/followers`)
         .then(data => self.setState({followers: data}));
        this.getData(`https://api.github.com/users/${this.state.name}/following`)
         .then(data => self.setState({following: data}));
    }

    async getData(url = '') {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.json();
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
                     onClick={() => this.findUserInfo(self)}
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