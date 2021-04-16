
import { ADD_USER } from './actions.js';

function userDataReducer(state = { 'users': ['Test'] }, action) {
    switch (action.type) {
        case ADD_USER:
            return Object.assign({}, state, {
                'users': [...state.users, action.user]
            });
        default:
            return state;
    }
}

export default userDataReducer;