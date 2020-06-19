import React from 'react';
import { ListGroupItem, ListGroup } from 'react-bootstrap';

export default class RepoPunchCard extends React.Component {
    render() {
        var array = [];
        for(let i = 0; i < this.props.items.length; i++) {
            array.push(
                <PunchItem 
                 key={i}/>
            );
        }

        return (
            <div>
                <ListGroup className="mx-auto mb-5 list">{array}</ListGroup>
            </div>
        );
    }
}

//TODO: actually make the punch card items display
class PunchItem extends React.Component {
    render() {
        return (
            <ListGroupItem>
                
            </ListGroupItem>
        );
    }
}