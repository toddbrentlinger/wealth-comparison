import React from 'react';
import { useSelector } from 'react-redux';
import DataArrayScroller from './DataArrayScroller.js';
import { addCommasToNumber } from '../utilities.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { /*faUser,*/ faUserCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import './PersonNotesContainer.css';

/**
 * 
 * @param {RichPerson} person
 */
function createUserImage(person) {
    if (!person || !person.thumbnail)
        return <FontAwesomeIcon icon={faUserCircle} className="thumbnail-image" />

    return <img src={person.thumbnail} alt={person.name} className="thumbnail-image" />
}

function PersonNotesContainer() {
    const firstPerson = useSelector(state => state.first.person);
    const secondPerson = useSelector(state => state.second.person);

    //const labels = (
    //    <ul id="labels-container">
    //        <li>Name</li>
    //        <li>Worth</li>
    //        <li>Age</li>
    //        <li>City</li>
    //        <li>State</li>
    //        <li>Country</li>
    //    </ul>
    //);

    //const temp = (
    //    <div id="person-notes-container">
    //        {firstPerson ? <PersonNotes person={firstPerson} /> : null}
    //        {firstPerson || secondPerson ? labels : null}
    //        {secondPerson ? <PersonNotes person={secondPerson} /> : null}
    //    </div>
    //);

    function createPersonNotesTableRow(title, property) {
        return (
            <tr>
                <td>{firstPerson && firstPerson[property]
                    ? firstPerson[property]
                    : "---"}
                </td>
                <th scope="row">{title}</th>
                <td>{secondPerson && secondPerson[property]
                    ? secondPerson[property]
                    : "---"}
                </td>
            </tr>
        );
    }

    const newTable = (
        <table id="person-notes-table">
            <caption>Information about each selected person or group.</caption>
            <tbody>
                {createPersonNotesTableRow("Name", "name")}
                <tr>
                    <td>{firstPerson ? `$${addCommasToNumber(firstPerson.worth * 1000000)}` : "---"}</td>
                    <th scope="row">Worth</th>
                    <td>{secondPerson ? `$${addCommasToNumber(secondPerson.worth * 1000000)}` : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.source : "---"}</td>
                    <th scope="row">Source</th>
                    <td>{secondPerson ? secondPerson.source : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.age : "---"}</td>
                    <th scope="row">Age</th>
                    <td>{secondPerson ? secondPerson.age : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.gender : "---"}</td>
                    <th scope="row">Gender</th>
                    <td>{secondPerson ? secondPerson.gender : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.city : "---"}</td>
                    <th scope="row">City</th>
                    <td>{secondPerson ? secondPerson.city : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.state : "---"}</td>
                    <th scope="row">State</th>
                    <td>{secondPerson ? secondPerson.state : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.country : "---"}</td>
                    <th scope="row">Country</th>
                    <td>{secondPerson ? secondPerson.country : "---"}</td>
                </tr>
                <tr>
                    <td>
                        {firstPerson && firstPerson.bio
                            ? <DataArrayScroller strArr={firstPerson.bio} buttonEdge="right" />
                            : "---"}
                    </td>
                    <th scope="row">Bio</th>
                    <td>
                        {secondPerson && secondPerson.bio
                            ? <DataArrayScroller strArr={secondPerson.bio} buttonEdge="left" />
                            : "---"}
                    </td>
                </tr>
                <tr>
                    <td>
                        {firstPerson && firstPerson.about
                            ? <DataArrayScroller strArr={firstPerson.about} buttonEdge="right" />
                            : "---"}
                    </td>
                    <th scope="row">About</th>
                    <td>
                        {secondPerson && secondPerson.about
                            ? <DataArrayScroller strArr={secondPerson.about} buttonEdge="left" />
                            : "---"}
                    </td>
                </tr>
                <tr>
                    <td>{firstPerson && firstPerson.industries
                        ? firstPerson.industries
                        : "---"}
                    </td>
                    <th scope="row">Industries</th>
                    <td>{secondPerson && secondPerson.industries
                        ? secondPerson.industries
                        : "---"}
                    </td>
                </tr>
                <tr>
                    <td>{firstPerson
                        ? (firstPerson.isSelfMade ? <FontAwesomeIcon icon={faCheck} /> : null)
                        : "---"}
                    </td>
                    <th scope="row">Self Made</th>
                    <td>{secondPerson
                        ? (secondPerson.isSelfMade ? <FontAwesomeIcon icon={faCheck} /> : null)
                        : "---"}
                    </td>
                </tr>
                <tr>
                    <td>{firstPerson && firstPerson.selfMadeRank
                        ? firstPerson.selfMadeRank
                        : "---"}
                    </td>
                    <th scope="row">Self Made Rank</th>
                    <td>{secondPerson && secondPerson.selfMadeRank
                        ? secondPerson.selfMadeRank
                        : "---"}
                    </td>
                </tr>
                <tr>
                    <td>{firstPerson && firstPerson.philanthropyScore
                        ? firstPerson.philanthropyScore
                        : "---"}
                    </td>
                    <th scope="row">Philanthropy Score</th>
                    <td>{secondPerson && secondPerson.philanthropyScore
                        ? secondPerson.philanthropyScore
                        : "---"}
                    </td>
                </tr>
            </tbody>
        </table>
    );

    const table = (
        <table id="person-notes-table">
            <caption>Information about each selected person or group.</caption>
            <tbody>
                <tr>
                    <td>{firstPerson ? firstPerson.name : "---"}</td>
                    <th scope="row">Name</th>
                    <td>{secondPerson ? secondPerson.name : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? `$${addCommasToNumber(firstPerson.worth * 1000000)}` : "---"}</td>
                    <th scope="row">Worth</th>
                    <td>{secondPerson ? `$${addCommasToNumber(secondPerson.worth * 1000000)}` : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.source : "---"}</td>
                    <th scope="row">Source</th>
                    <td>{secondPerson ? secondPerson.source : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.age : "---"}</td>
                    <th scope="row">Age</th>
                    <td>{secondPerson ? secondPerson.age : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.gender : "---"}</td>
                    <th scope="row">Gender</th>
                    <td>{secondPerson ? secondPerson.gender : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.city : "---"}</td>
                    <th scope="row">City</th>
                    <td>{secondPerson ? secondPerson.city : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.state : "---"}</td>
                    <th scope="row">State</th>
                    <td>{secondPerson ? secondPerson.state : "---"}</td>
                </tr>
                <tr>
                    <td>{firstPerson ? firstPerson.country : "---"}</td>
                    <th scope="row">Country</th>
                    <td>{secondPerson ? secondPerson.country : "---"}</td>
                </tr>
                <tr>
                    <td>
                        {firstPerson && firstPerson.bio
                            ? <DataArrayScroller strArr={firstPerson.bio} buttonEdge="right" />
                            : "---"}
                    </td>
                    <th scope="row">Bio</th>
                    <td>
                        {secondPerson && secondPerson.bio
                            ? <DataArrayScroller strArr={secondPerson.bio} buttonEdge="left" />
                            : "---"}
                    </td>
                </tr>
                <tr>
                    <td>
                        {firstPerson && firstPerson.about
                            ? <DataArrayScroller strArr={firstPerson.about} buttonEdge="right" />
                            : "---"}
                    </td>
                    <th scope="row">About</th>
                    <td>
                        {secondPerson && secondPerson.about
                            ? <DataArrayScroller strArr={secondPerson.about} buttonEdge="left" />
                            : "---"}
                    </td>
                </tr>
                <tr>
                    <td>{firstPerson && firstPerson.industries
                        ? firstPerson.industries
                        : "---"}
                    </td>
                    <th scope="row">Industries</th>
                    <td>{secondPerson && secondPerson.industries
                        ? secondPerson.industries
                        : "---"}
                    </td>
                </tr>
                <tr>
                    <td>{firstPerson
                        ? (firstPerson.isSelfMade ? <FontAwesomeIcon icon={faCheck} /> : null)
                        : "---"}
                    </td>
                    <th scope="row">Self Made</th>
                    <td>{secondPerson
                        ? (secondPerson.isSelfMade ? <FontAwesomeIcon icon={faCheck} /> : null)
                        : "---"}
                    </td>
                </tr>
                <tr>
                    <td>{firstPerson && firstPerson.selfMadeRank
                        ? firstPerson.selfMadeRank
                        : "---"}
                    </td>
                    <th scope="row">Self Made Rank</th>
                    <td>{secondPerson && secondPerson.selfMadeRank
                        ? secondPerson.selfMadeRank
                        : "---"}
                    </td>
                </tr>
                <tr>
                    <td>{firstPerson && firstPerson.philanthropyScore
                        ? firstPerson.philanthropyScore
                        : "---"}
                    </td>
                    <th scope="row">Philanthropy Score</th>
                    <td>{secondPerson && secondPerson.philanthropyScore
                        ? secondPerson.philanthropyScore
                        : "---"}
                    </td>
                </tr>
            </tbody>
        </table>
    );

    return (
        <React.Fragment>
            <div className="thumbnail-container">
                {createUserImage(firstPerson)}
                {createUserImage(secondPerson)}
            </div>
            {table}
        </React.Fragment>    
        );
    }
    
export default PersonNotesContainer;