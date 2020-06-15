import React from 'react';
import { ListGroupItem, ListGroup } from 'react-bootstrap';

export default class RepoList extends React.Component {
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
            <div>
                <h4 className="">{this.props.name}</h4>

                <ListGroup className="mx-auto mb-5 repo-list">{array}</ListGroup>
            </div>
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