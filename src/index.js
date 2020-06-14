import React from 'react'
import ReactDOM from 'react-dom'
import { Button, FormControl, ListGroupItem, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
           name: '',
           repoItems: []
        }
    }

    handleChange = (e) => {
        this.setState({name: e.target.value});
    }

    formValid() {
        return this.state.name.length;
    }

    requestUserRepos(userName, self) {
        const xhr = new XMLHttpRequest();
        const url = `https://api.github.com/users/${userName}/repos`;
    
        // Providing 3 arguments (GET/POST, The URL, Async True/False)
        xhr.open('GET', url, true);
    
        xhr.onload = function() {
            const data = JSON.parse(this.response);
            self.setState({name: self.state.name, repoItems: data});
        }
    
        xhr.send();
    }

    render() {
        var self = this;

        return(
            <div className='home'>
                <h3 className="text-center mt-5">React Github API</h3>
                <div className="form-inline mx-auto search-form">
                    <FormControl
                        className="form-control mb-5"
                        type="text"
                        value={this.state.name}
                        placeholder="GitHub Username"
                        onChange={this.handleChange}/>
                    <Button 
                     className="btn btn-primary ml-2 mb-5"
                     onClick={() => this.requestUserRepos(this.state.name, self)}
                     disabled={!this.formValid()}>
                        Submit
                    </Button>
               </div>

                <RepoList
                 items={this.state.repoItems}/>
            </div>
        );
    }
}

class RepoList extends React.Component {
    render() {
        var array = [];
        for(let i = 0; i < this.props.items.length; i++) {
            array.push(
                <RepoItem 
                 key={i}
                 item={this.props.items[i]}/>
            );
        }

        return (
            <ListGroup
             className="list-group mx-auto mb-5 repo-list">{array}</ListGroup>
        );
    }
}

class RepoItem extends React.Component {
    render() {
        var url = this.props.item.html_url;

        return (
            <ListGroupItem>
                <p><strong>Repo:</strong> {this.props.item.name}</p>
                <p><strong>Description:</strong> {this.props.item.description}</p>
                <p><strong>URL:</strong> <a href={url}>{this.props.item.html_url}</a></p>
            </ListGroupItem>
        );
    }
}

ReactDOM.render(<Home/>, document.getElementById('root'))