
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

// --------------------------------------------------
// ---------- Popup Selector - isDisplayed ----------
// --------------------------------------------------

export function changePopupSelectorIsDisplayed(value, willChangeFirstPerson = true) {
    return {
        type: 'CHANGE_POPUP_SELECTOR_IS_DISPLAYED',
        value: {isDisplayed: value, willChangeFirstPerson}
    };
}

export function openPopupSelector(willChangeFirstPerson = true) {
    return {
        type: 'OPEN_POPUP_SELECTOR',
        willChangeFirstPerson
    };
}

export function closePopupSelector(personToSelect = null) {
    return {
        type: 'CLOSE_POPUP_SELECTOR',
        personToSelect
    };
}

// --------------------------
// ---------- SORT ----------
// --------------------------

/**
 * 
 * @param {String} value
 */
export function changeSortType(value) {
    return {
        type: `CHANGE_SORT_TYPE`,
        value
    };
}

/**
 * 
 * @param {Boolean} isAscending
 */
export function changeSortIsAscending(isAscending = false) {
    return {
        type: `CHANGE_SORT_DIRECTION`,
        value: isAscending
    };
}

// ----------------------------
// ---------- FILTER ----------
// ----------------------------

/**
 * 
 * @param {Number} value
 * @param {Boolean} isMin
 */
export function changeFilterAge(value, isMin) {
    return {
        type: `CHANGE_FILTER_${isMin ? 'MIN' : 'MAX'}_AGE`,
        value
    };
}

/**
 * 
 * @param {Number} amount
 * @param {Boolean} isMin
 */
export function changeFilterWorth(amount, isMin) {
    return {
        type: `CHANGE_FILTER_${isMin ? 'MIN' : 'MAX'}_WORTH`,
        amount
    };
}