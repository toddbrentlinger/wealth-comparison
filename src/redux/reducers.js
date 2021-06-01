
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
            type: 'wealth',
        },
        filter: {
            search: "",
            gender: "all",
            wealth: {
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

function personDataReducer(state = initialState, action) {
    let newState;
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
        case 'CHANGE_FILTER_MIN_AGE':
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    filter: {
                        ...state.popupSelector.filter,
                        age: {
                            ...state.popupSelector.filter.age,
                            min: action.value
                        }
                    }
                }
            };
        case 'CHANGE_FILTER_MAX_AGE':
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    filter: {
                        ...state.popupSelector.filter,
                        age: {
                            ...state.popupSelector.filter.age,
                            max: action.value
                        }
                    }
                }
            };
        case 'CHANGE_FILTER_MIN_WEALTH':
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    filter: {
                        ...state.popupSelector.filter,
                        wealth: {
                            ...state.popupSelector.filter.wealth,
                            min: action.amount
                        }
                    }
                }
            };
        case 'CHANGE_FILTER_MAX_WEALTH':
            return {
                ...state,
                popupSelector: {
                    ...state.popupSelector,
                    filter: {
                        ...state.popupSelector.filter,
                        wealth: {
                            ...state.popupSelector.filter.wealth,
                            max: action.amount
                        }
                    }
                }
            };
        case 'CHANGE_SORT_TYPE':
            let newDisplayedPeople = state.displayedPeople.slice();
            let newSortObj = { ...state.popupSelector.sort, 'type': action.type };

        case 'CHANGE_SORT_DIRECTION':
        case 'CHANGE_SEARCH':
        case 'CHANGE_FILTER':
        default:
            return state;
    }
}

export default personDataReducer;