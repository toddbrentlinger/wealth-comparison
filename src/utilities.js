
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