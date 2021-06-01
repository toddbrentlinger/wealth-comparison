import React, { useReducer, useEffect } from 'react';
import MinMaxRangeSlider from './MinMaxRangeSlider.js';
import RichPerson from '../classes/RichPerson.js';
import { convertNumToSimplifiedString } from '../utilities.js';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { changeFilterAge, changeFilterWealth } from '../redux/actions.js';
// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faSearch } from '@fortawesome/free-solid-svg-icons';
// Stylesheets
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

    const [state, dispatchReducer] = useReducer(reducer, initialState);

    // Redux
    const wealthFilter = useSelector(state => state.popupSelector.filter.wealth);
    //const genderFilter = useSelector(state => state.popupSelector.filter.search);
    const ageFilter = useSelector(state => state.popupSelector.filter.age);
    const dispatch = useDispatch();

    // Hooks

    useEffect(() => {

    }, []);

    // Variables

    const displayedPeopleElementsOld = state.displayedPeople
        .map(person =>
            <div className="displayed-person" key={`${person.lastName}-${person.id}`}>
                <span>{person.name}</span>
                <span>{convertNumToSimplifiedString(person.worth * 1000000)}</span>
                <span>{person.age}</span>
            </div>
        );

    const displayedPeopleElements = state.displayedPeople
        .map(person => createPersonElement(person)); 

    function createPersonElement(person) {
        switch (state.sort.type) {
            case 'worth':
                return (
                    <div className="displayed-person" key={`${person.lastName}-${person.id}`}>
                        <span>{`$${convertNumToSimplifiedString(person.worth * 1000000)}`}</span>
                        <span>{person.name}</span>
                    </div>
                );
            case 'age':
                return (
                    <div className="displayed-person" key={`${person.lastName}-${person.id}`}>
                        <span>{person.age}</span>
                        <span>{person.name}</span>
                    </div>
                );
            case 'first-name':
                return (
                    <div className="displayed-person" key={`${person.lastName}-${person.id}`}>
                        <span>{person.name}</span>
                        <span>{`$${convertNumToSimplifiedString(person.worth * 1000000)}`}</span>
                    </div>
                );
            case 'last-name':
                return (
                    <div className="displayed-person" key={`${person.lastName}-${person.id}`}>
                        <span>{`${person.lastName}, ${person.firstName}`}</span>
                        <span>{`$${convertNumToSimplifiedString(person.worth * 1000000)}`}</span>
                    </div>
                );
            default:
                return (
                    <div className="displayed-person" key={`${person.lastName}-${person.id}`}>
                        <span>{person.name}</span>
                        <span>{`$${convertNumToSimplifiedString(person.worth * 1000000)}`}</span>
                        <span>{person.age}</span>
                    </div>
                );
        }
    }

    const peopleListTable = (
        <table>
            <caption></caption>
            <tbody>
                <tr>
                    <th></th>
                </tr>
                {
                    state.displayedPeople.map(person => (
                        <tr className="displayed-person" key={`${person.lastName}-${person.id}`}>
                            
                        </tr>
                    ))
                }
            </tbody>
        </table>
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
                        <MinMaxRangeSlider
                            minLimit={0}
                            maxLimit={120}
                            step={1}
                            startingMin={18}
                            startingMax={100}
                            onMinChange={ val => dispatch(changeFilterAge(val, true)) }
                            onMaxChange={ val => dispatch(changeFilterAge(val, false)) }
                        />
                        <p>State Age Min: <span>{ageFilter.min}</span></p>
                        <p>State Age Max: <span>{ageFilter.max}</span></p>
                        <MinMaxRangeSlider
                            minLimit={0}
                            maxLimit={1000000000000}
                            step={1000000}
                            startingMin={1000000}
                            startingMax={1000000000000}
                            onMinChange={val => dispatch(changeFilterWealth(val, true))}
                            onMaxChange={val => dispatch(changeFilterWealth(val, false))}
                        />
                        <p>State Wealth Min: <span>{wealthFilter.min}</span></p>
                        <p>State Wealth Max: <span>{wealthFilter.max}</span></p>
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
                                        dispatchReducer({ 'type': 'sortByType', 'value': e.target.value, });
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
                                        dispatchReducer({ 'type': 'sortByDirection', 'value': (e.target.value === "ascending") });
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