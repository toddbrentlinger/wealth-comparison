
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
    switch (action.type) {
        case 'CHANGE_FIRST_PERSON':
            return Object.assign({}, state, {
                first: {
                    ...state.first,
                    person: action.person
                }
            });
        case 'CHANGE_FIRST_AMOUNT':
            return {
                ...state,
                first: {
                    ...state.first,
                    amount: action.amount
                }
            };
        case 'CHANGE_SECOND_PERSON':
            return {
                ...state,
                second: {
                    ...state.second,
                    person: action.person
                }
            };
        case 'CHANGE_SECOND_AMOUNT':
            return {
                ...state,
                second: {
                    ...state.second,
                    amount: action.amount
                }
            };
        default:
            return state;
    }
}

export default personDataReducer;