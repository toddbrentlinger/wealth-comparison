import React from 'react';
import { useSelector } from 'react-redux';
import PersonNotes from './PersonNotes.js';
import './PersonNotesContainer.css';

function PersonNotesContainer() {
    const firstPerson = useSelector(state => state.first.person);
    const secondPerson = useSelector(state => state.second.person);

    const labels = (
        <ul id="labels-container">
            <li>Name</li>
            <li>Worth</li>
            <li>Age</li>
            <li>City</li>
            <li>State</li>
            <li>Country</li>
        </ul>
    );

    return (
        <div id="person-notes-container">
            {firstPerson ? <PersonNotes person={firstPerson} /> : null}
            {firstPerson || secondPerson ? labels : null}
            {secondPerson ? <PersonNotes person={secondPerson} /> : null}
        </div>
    );
}

export default PersonNotesContainer;