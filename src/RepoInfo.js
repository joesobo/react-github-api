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
                <ListGroup className="mx-auto mb-5 list">{array}</ListGroup>
            </div>
        );
    }
}

class RepoInfoItem extends React.Component {
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        var message = this.capitalizeFirstLetter(this.props.commit.commit.message);
        //TODO: add pictures
        var author = this.props.commit.commit.author.name;
        var date = new Date(this.props.commit.commit.author.date);

        return (
            <ListGroupItem>
                <p><strong>Message:</strong> {message}</p>
                <p><strong>Author:</strong> {author}</p>
                <p><strong>Date:</strong> {date.toDateString()}</p>
            </ListGroupItem>
        );
    }
}