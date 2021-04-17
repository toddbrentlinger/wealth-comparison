
//export const ADD_USER = 'ADD_USER';

//export function addUser(user) {
//    return {
//        type: 'ADD_USER',
//        user // action payload
//    };
//}

/**
 * 
 * @param {RichPerson} person - RichPerson object reference
 * @param {Boolean} isFirst - If true, change first person, else change second
 */
export function changePerson(person, isFirst) {
    console.log(`Change person to: ${person.name}`);
    return {
        type: `CHANGE_${isFirst ? 'FIRST' : 'SECOND'}_PERSON`,
        person
    };
}

/**
 * 
 * @param {Number} amount - Amount to change to
 * @param {Boolean} isFirst - If true, change first person amount, else change second amount
 */
export function changeAmount(amount, isFirst) {
    return {
        type: `CHANGE_${isFirst ? 'FIRST' : 'SECOND'}_AMOUNT`,
        amount
    };
}