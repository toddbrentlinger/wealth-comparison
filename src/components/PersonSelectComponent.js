import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changePerson } from '../redux/actions.js';
import RichPerson from '../classes/RichPerson.js';

/**
 * 
 * @param {Object} props
 * @param {Boolean} props.isFirst
 */
function PersonSelectComponent(props) {
    const selectedPerson = useSelector(state => props.isFirst ? state.first.person : state.second.person);
    const dispatch = useDispatch();

    const personSelectOptions = window.RichPerson.cache
        .map((person, index) =>
            <option
                key={index}
                value={person.id}
            >
                {person.name}
            </option>
        );

    return (
        <select
            value={selectedPerson ? selectedPerson.id : ""}
            onChange={(e) => dispatch(changePerson(RichPerson.getRichPersonById(e.target.value), props.isFirst))}
        >
            <option
                name="person-select"
                value=""
            >
                -- Select --
            </option>
            {personSelectOptions}
        </select>
    );
}

export default PersonSelectComponent;