
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
    }
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
        default:
            return state;
    }
}

export default personDataReducer;