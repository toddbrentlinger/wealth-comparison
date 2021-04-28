import React, { useReducer } from 'react';
import RichPerson from '../classes/RichPerson.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import './PersonSelectorPopup.css';

const initialState = {
    'displayedPeople': RichPerson.cache,
    'sort': {
        'isAscending': false,
        'type': 'wealth',
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
            break;
        case 'sortByDirection':
            break;
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
                <div className="filter-container">
                    Filter
                </div>
                <div className="sort-and-displayed-container">
                    <div className="sort-container">
                        <label htmlFor="sort-type-select">
                            Sort:
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
                                <option value="alphabetical">Alphabetical</option>
                            </select>
                        </label>

                        <label htmlFor="sort-direction-select">
                            Direction:
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
                        Displayed
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonSelectorPopup;