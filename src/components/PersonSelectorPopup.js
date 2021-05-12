import React, { useReducer, useEffect } from 'react';
import MinMaxRangeSlider from './MinMaxRangeSlider.js';
import RichPerson from '../classes/RichPerson.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import './PersonSelectorPopup.css';

/**
 * Returns new RichPerson[] after filtering with filterObj parameter.
 * @param {Object} filterObj
 * @param {String} filterObj.search
 * @param {String} filterObj.search
 * @returns {RichPerson[]}
 */
function filterDisplayedPeople(filterObj) {
    let newDisplayedPeople = RichPerson.cache.slice();
    // 
}

/**
 * Sorts RichPerson array in-place with sortObj parameter
 * @param {RichPerson[]} displayedPeople
 * @param {Object} sortObj
 */
function sortDisplayedPeople(displayedPeople, sortObj) {
    // If sort type is 'none', return
    if (sortObj.type === 'none') return;

    // Sort in ascending order
    displayedPeople.sort((first, second) => {
        switch (sortObj.type) {
            // Age
            case 'age':
                return first.age - second.age;

            // Alphabetical
            case 'first-name':
                return sortTwoStringsAlphabetically(
                    first.firstName.toUpperCase(), second.firstName.toUpperCase()
                );

            case 'last-name':
                return sortTwoStringsAlphabetically(
                    first.lastName.toUpperCase(), second.lastName.toUpperCase()
                );

            // Worth
            case 'worth':
                return first.worth - second.worth;

            default:
                return 0;
        }
    });

    // Reverse array if isAscending is false
    if (!sortObj.isAscending)
        displayedPeople.reverse();
}

/**
 * Sort callback function for Array sort method to sort alphabetically.
 * @param {String} firstStr
 * @param {String} secondStr
 * @returns {Number}
 */
function sortTwoStringsAlphabetically(firstStr, secondStr) {
    if (firstStr < secondStr) return -1;
    if (firstStr > secondStr) return 1;
    return 0; // strings must be equal
}

const initialState = {
    'displayedPeople': RichPerson.cache,
    'sort': {
        'isAscending': false,
        'type': 'worth',
    },
    'filter': {
        'search': "",
        'sex': "both",
        'wealth': {
            'min': 0,
            'max': 1000000000000, // one trillion dollars
        },
        'age': {
            'min': 0,
            'max': 100,
        },
        'countries': 'all',
    },
};

function reducer(prevState, action) {
    switch (action.type) {
        case 'sortByType':
            let newDisplayedPeople = prevState.displayedPeople.slice();
            let newSortObj = { ...prevState.sort, 'type': action.value };
            sortDisplayedPeople(newDisplayedPeople, newSortObj);
            return {
                ...prevState,
                'displayedPeople': newDisplayedPeople,
                'sort': newSortObj
            };
        case 'sortByDirection':
            if (prevState.sort.isAscending === action.value)
                return prevState;
            return {
                ...prevState,
                'displayedPeople': prevState.displayedPeople.slice().reverse(),
                'sort': {
                    ...prevState.sort,
                    'isAscending': !prevState.sort.isAscending
                }
            };
        case 'search':
        case 'filter':
            break;
        case 'reset':
            break;
        default:
            return prevState;
    }
}

/**
 * React component popup box to sort/filter/search list of people before selecting one
 * @param {Object} props
 * @param {Function} props.setSelectedPerson - Function to set selected person
 * @param {Function} props.setIsPersonSelectorPopupOpen - Function to set bool whether to display popup box
 */
function PersonSelectorPopup(props) {
    // Reducer

    const [state, dispatch] = useReducer(reducer, initialState);

    // Functions

    useEffect(() => {

    }, []);

    // Variables

    const displayedPeopleElements = state.displayedPeople
        .map(person =>
            <div className="displayed-person" key={`${person.lastName}-${person.id}`}>
                <span>{person.name}</span>
            </div>
        );

    return (
        <div id="person-selector-popup">
            <div className="person-selector-popup-content">
                <div className="person-selector-popup-top-bar">
                    <div className="top-bar-title">Select Person To Compare</div>
                    <span
                        className="close"
                        onClick={() => props.setIsPersonSelectorPopupOpen(false)}
                    >
                        <FontAwesomeIcon icon={faWindowClose} />
                    </span>
                </div>
                <div className="search-container">
                    <form>
                        <input
                            type="text"
                            placeholder="Search..."
                            name="search"
                        />
                        <button type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                </div>
                <div className="filter-sort-displayed-container">
                    <div className="filter-container">
                        Filter
                        <MinMaxRangeSlider startingMin={15} startingMax={75} />
                    </div>
                    <div className="sort-and-displayed-container">
                        <div className="sort-container">
                            <label htmlFor="sort-type-select">
                                {"Sort: "}
                                <select
                                    name="sort-type"
                                    id="sort-type-select"
                                    value={state.sort.type}
                                    onChange={(e) => {
                                        dispatch({ 'type': 'sortByType', 'value': e.target.value, });
                                    }}
                                >
                                    <option value="none">-- Sort By --</option>
                                    <option value="worth">Worth</option>
                                    <option value="age">Age</option>
                                    <option value="first-name">First Name</option>
                                    <option value="last-name">Last Name</option>
                                </select>
                            </label>

                            <label htmlFor="sort-direction-select">
                                {"Direction: "}
                                <select
                                    name="sort-direction"
                                    id="sort-direction-select"
                                    value={state.sort.isAscending ? "ascending" : "descending"}
                                    onChange={(e) => {
                                        dispatch({ 'type': 'sortByDirection', 'value': (e.target.value === "ascending") });
                                    }}
                                >
                                    <option value="descending">Descending</option>
                                    <option value="ascending">Ascending</option>
                                </select>
                            </label>
                        </div>
                        <div className="displayed-people-container">
                            <div className="displayed-people-list">
                                {displayedPeopleElements}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonSelectorPopup;