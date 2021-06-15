
//import { ADD_USER } from './actions.js';

//function userDataReducer(state = { 'users': ['Test'] }, action) {
//    switch (action.type) {
//        case 'ADD_USER':
//            return Object.assign({}, state, {
//                'users': [...state.users, action.user]
//            });
//        default:
//            return state;
//    }
//}

//export default userDataReducer;

import RichPerson from '../classes/RichPerson.js';
import { sortTwoStringsAlphabetically } from '../utilities.js';

const initialState = {
    first: {
        person: null,
        amount: null,
    },
    second: {
        person: null,
        amount: null,
    },
    popupSelector: {
        isDisplayed: false,
        displayedPeople: RichPerson.cache,
        sort: {
            isAscending: false,
            type: 'worth',
        },
        filter: {
            search: "",
            gender: "all",
            worth: { // 10^n - use Math.pow(10,n) to get value
                min: 0,
                max: -1, // Use infinite max if negative number
            },
            age: {
                min: 0,
                max: -1, // Use infinite max if negative number
            },
            countries: [], // show all countries if empty
        },
    },
};

/**
 * 
 * @param {Object} filterObj
 * @param {String} filterObj.search
 * @param {String} filterObj.gender
 * @param {Object} filterObj.worth
 * @param {Number} filterObj.worth.min
 * @param {Number} filterObj.worth.max
 * @param {Object} filterObj.age
 * @param {Number} filterObj.age.min
 * @param {Number} filterObj.age.max
 * @param {String[]} filterObj.countries
 * @returns {RichPerson[]} - Filtered array of Person objects
 */
function filterDisplayedPeople(filterObj) {
    return RichPerson.cache.filter(person => {
        // Worth - Min
        if (person.worth < Math.pow(10, filterObj.worth.min - 6))
            return false;

        // Worth - Max (account for negative values representing infinite max)
        if (filterObj.worth.max > 0 && person.worth > Math.pow(10, filterObj.worth.max - 6))
            return false;

        // Age - Min
        if (person.age < filterObj.age.min)
            return false;

        // Age - Max (account for negative values representing infinite max)
        if (filterObj.age.max > 0 && person.age > filterObj.age.max)
            return false;

        return true;
    });
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

function personDataReducer(state = initialState, action) {
    let newState, newDisplayedPeople;
    switch (action.type) {
        case 'CHANGE_FIRST_PERSON':
            newState = Object.assign({}, state, {
                first: {
                    ...state.first,
                    person: action.person
                }
            });
            if (action.person && state.second.person)
                newState.first.amount = RichPerson.convertAmount(state.second.amount, state.second.person, action.person);
            return newState;
        case 'CHANGE_FIRST_AMOUNT':
            newState = {
                ...state,
                first: {
                    ...state.first,
                    amount: action.amount
                }
            };
            if (state.first.person && state.second.person)
                newState.second.amount = RichPerson.convertAmount(action.amount, state.first.person, state.second.person);
            return newState;
        case 'CHANGE_SECOND_PERSON':
            newState = Object.assign({}, state, {
                second: {
                    ...state.second,
                    person: action.person
                }
            });
            if (action.person && state.first.person)
                newState.second.amount = RichPerson.convertAmount(state.first.amount, state.first.person, action.person);
            return newState;
        case 'CHANGE_SECOND_AMOUNT':
            newState = {
                ...state,
                second: {
                    ...state.second,
                    amount: action.amount
                }
            };
            if (state.first.person && state.second.person) {
                newState.first.amount = RichPerson.convertAmount(action.amount, state.second.person, state.first.person);
            }
            return newState;
        case 'CHANGE_POPUP_SELECTOR_IS_DISPLAYED':
            newState = {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    isDisplayed: action.value
                }
            };
            return newState;
        case 'CHANGE_FILTER_MIN_AGE':
            newState = {
                ...state.popupSelector.filter,
                age: {
                    ...state.popupSelector.filter.age,
                    min: action.value
                }
            };
            newDisplayedPeople = filterDisplayedPeople(newState);
            sortDisplayedPeople(newDisplayedPeople, state.popupSelector.sort);
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    displayedPeople: newDisplayedPeople,
                    filter: newState
                }
            };
        case 'CHANGE_FILTER_MAX_AGE':
            newState = {
                ...state.popupSelector.filter,
                age: {
                    ...state.popupSelector.filter.age,
                    max: action.value
                }
            };
            newDisplayedPeople = filterDisplayedPeople(newState);
            sortDisplayedPeople(newDisplayedPeople, state.popupSelector.sort);
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    displayedPeople: newDisplayedPeople,
                    filter: newState
                }
            };
        case 'CHANGE_FILTER_MIN_WORTH':
            newState = {
                ...state.popupSelector.filter,
                worth: {
                    ...state.popupSelector.filter.worth,
                    min: action.amount
                }
            };
            newDisplayedPeople = filterDisplayedPeople(newState);
            sortDisplayedPeople(newDisplayedPeople, state.popupSelector.sort);
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    displayedPeople: newDisplayedPeople,
                    filter: newState
                }
            };
        case 'CHANGE_FILTER_MAX_WORTH':
            newState = {
                ...state.popupSelector.filter,
                worth: {
                    ...state.popupSelector.filter.worth,
                    max: action.amount
                }
            };
            newDisplayedPeople = filterDisplayedPeople(newState);
            sortDisplayedPeople(newDisplayedPeople, state.popupSelector.sort);
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    displayedPeople: newDisplayedPeople,
                    filter: newState
                }
            };
        case 'CHANGE_SORT_TYPE':
            newState = {
                ...state.popupSelector.sort,
                type: action.value
            };
            newDisplayedPeople = state.popupSelector.displayedPeople.slice();
            sortDisplayedPeople(newDisplayedPeople, newState);
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    displayedPeople: newDisplayedPeople,
                    sort: newState
                }
            };
        case 'CHANGE_SORT_DIRECTION':
            if (state.popupSelector.sort.isAscending === action.value)
                return state;
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    displayedPeople: state.popupSelector.displayedPeople.slice().reverse(),
                    sort: {
                        ...state.popupSelector.sort,
                        isAscending: !state.popupSelector.sort.isAscending
                    }
                }
            };
        case 'CHANGE_SEARCH':
        case 'CHANGE_FILTER':
        default:
            return state;
    }
}

export default personDataReducer;