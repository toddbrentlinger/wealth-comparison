
/**
 * 
 * @param {Number|String} num
 * @returns {String}
 */
export function addCommasToNumber(num) {
    // If num is number, convert to string
    if (!isNaN(parseInt(num, 10)))
        num = num.toString();
    // If num is string and more than 3 digits
    if (typeof num === 'string' && num.length > 3
    ) {
        // Add comma after every 3rd index from end
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else // Else return the num as is
        return num;
}

/**
 * 
 * @param {String[]} arr
 * @returns {String}
 */
export function listArrayAsString(stringArray) {
    if (!stringArray) return null;

    // Check if argument is an array
    if (Array.isArray(stringArray)) {
        let arrayItemText = '';
        // Loop through each value of array
        for (let index = 0, arrLength = stringArray.length; index < arrLength; index++) {
            arrayItemText += stringArray[index];
            // If array length is more than 1 and index is NOT the last element
            // If array length is 2, only add ' and '
            // Else: If index is second to last element, add ', and ' Else add ', '
            if (arrLength > 1 && index !== arrLength - 1) {
                arrayItemText += (arrLength === 2) ? ' and '
                    : (index === arrLength - 2) ? ', and ' : ', ';
            }
        }
        // Return created string
        return arrayItemText;
    }

    // If argument is string, return the same string
    if (typeof stringArray === 'string')
        return stringArray;
}

/**
 * Sort callback function for Array sort method to sort alphabetically.
 * @param {String} firstStr
 * @param {String} secondStr
 * @returns {Number}
 */
export function sortTwoStringsAlphabetically(firstStr, secondStr) {
    if (firstStr < secondStr) return -1;
    if (firstStr > secondStr) return 1;
    return 0; // strings must be equal
}

/**
 * Converts number to simplified string of number with letter at the end.
 * @param {Number} num
 * @returns {String}
 */
export function convertNumToSimplifiedString(num) {
    if (Number.isNaN(num)) { // if num is Not A Number
        num = Number(num); // try to convert parameter to Number
        if (Number.isNaN(num)) { // if num is still Not A Number
            console.error(`Parameter is NOT a number.`);
            return;
        }
    }

    if (num < 1000)
        return num.toString();

    // If reach here, num is more than or equal to 1,000

    let pow = 0;
    while (num >= 1000 && pow < 15) {
        pow += 3;
        num /= 1000;
    }

    // Remove any fractional part of num
    num = num.toFixed(0);

    /*
    switch (pow) {
        case 0: return num.toString(); // Case should be unreachable
        case 3: return num + 'K';
        case 6: return num + 'M';
        case 9: return num + 'B';
        case 12: return num + 'T';
        case 15: return num + 'Q';
        default: return num.toString();
    }
    */
    // Alternate to switch to consider all possible pow values
    if (pow < 3) return num.toString();
    if (pow < 6) return num + 'K';
    if (pow < 9) return num + 'M';
    if (pow < 12) return num + 'B';
    if (pow < 15) return num + 'T';
    // If reach here, pow is 15 or more
    return num + 'Q';
}