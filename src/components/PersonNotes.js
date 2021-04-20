import React from 'react';
import { addCommasToNumber } from '../utilities.js';

/**
 * 
 * @param {Object} props
 * @param {RichPerson} person
 */
function PersonNotes(props) {
    return (
        <ul className="person-notes-list">
            <li>
                <img src={props.person.thumbnail} alt={props.person.name} />
            </li>
            <li>{props.person.name}</li>
            <li>{`$${addCommasToNumber(props.person.worth * 1000000)}`}</li>
            <li>{props.person.age}</li>
            <li>{props.person.city}</li>
            <li>{props.person.state}</li>
            <li>{props.person.country}</li>
        </ul>
    );
} 

export default PersonNotes;