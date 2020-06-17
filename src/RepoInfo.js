import React from 'react';
import { ListGroupItem, ListGroup } from 'react-bootstrap';

export default class RepoInfo extends React.Component {
    render() {
        var array = [];
        console.log(this.props.commits);
        if (this.props.commits) {
            for(let i = 0; i < this.props.commits.length; i++) {
                array.push(
                    <RepoInfoItem 
                     key={i}
                     commit={this.props.commits[i]}/>
                );
            }
        }

        return(
            <div>
                <ListGroup className="mx-auto mb-5">{array}</ListGroup>
            </div>
        );
    }
}

class RepoInfoItem extends React.Component {
    render() {
        var message = this.props.commit.commit.message;
        //TODO: add pictures
        var author = this.props.commit.commit.author.name;
        var date = this.props.commit.commit.author.date;

        return (
            <ListGroupItem>
                <p><strong>MESSAGE:</strong> {message}</p>
                <p><strong>AUTHOR:</strong> {author}</p>
                <p><strong>DATE:</strong> {date}</p>
            </ListGroupItem>
        );
    }
}