import { filter } from "minimatch";

// TODO: Create base Person class to be extended 
// for similar functionality with RichPerson
class RichPerson {
    constructor(jsonObj) {
        this.jsonObj = jsonObj;

        // Properties that are copied by reference.
        // Use getters for primitive type properties that are copied by value
        this.bio = jsonObj.bios;
        this.about = jsonObj.abouts;
        this.employment = jsonObj.employment;

        // Add to static cache
        RichPerson.cache.push(this);
    }

    // -----------------------------
    // ---------- Getters ----------
    // -----------------------------

    // Use getters to reference JSON obj properties that are primitive
    // types and would normally be copied by value, NOT reference
    get name() { return this.jsonObj.personName; }
    get age() { return this.jsonObj.age; }
    get country() { return this.jsonObj.country; }
    get state() { return this.jsonObj.state; }
    get city() { return this.jsonObj.city; }
    get source() { return this.jsonObj.source; }
    get thumbnail() {
        if (!this.jsonObj.squareImage)
            return null;
        if (this.jsonObj.squareImage.startsWith('http'))
            return this.jsonObj.squareImage;
        else
            return `https:${this.jsonObj.squareImage}`;
    }
    get id() { return this.jsonObj.naturalId; }
    get worth() { return this.jsonObj.finalWorth; }
    get gender() {
        switch (this.jsonObj.gender) {
            case 'M':
                return 'male';
            case 'F':
                return 'female';
            default:
                return 'other';
        }
    }

    // ------------------------------------
    // ---------- Public Methods ----------
    // ------------------------------------

    /**
     * Recursive function to search each property of class instance.
     * @param {String} searchTerm
     * @param {any} obj
     * @returns {Boolean}
     */
    containsSearchTerm(searchTerm, obj = this) {
        // String
        if (typeof obj === 'string') {
            return obj.toLowerCase().includes(searchTerm.toLowerCase());
        }
        // Number
        if (typeof obj === 'number') {
            return obj.toString().includes(searchTerm.toLowerCase());
        }
        // Array
        if (Array.isArray(obj)) {
            return obj.some(element => this.containsSearchTerm(searchTerm, element));
        }
        // Object
        if (typeof obj === 'object' && obj !== null) {
            return Array.from(Object.values(obj))
                .some(value => this.containsSearchTerm(searchTerm, value));
        }
        // Other
        return false;
    }

    // ---------------------------------------
    // ---------- Static Properties ----------
    // ---------------------------------------

    static cache = [];

    // ------------------------------------
    // ---------- Static Methods ----------
    // ------------------------------------

    static checkForUniqueIds() {
        let idSet = new Set();

        this.cache.forEach(person => {
            // If ID already in set, display error in console
            if (idSet.has(person.id))
                console.log(`ID: ${person.id} appears multiple times!`);
            // Else add person to set
            else
                idSet.add(person.id);
        });
    }

    /**
     * 
     * @param {String} id
     */
    static getRichPersonById(id) {
        for (let i = 0; i < this.cache.length; i++) {
            if (this.cache[i].id === id)
                return this.cache[i];
        }
    }

    /**
     * Returns equivalent amount of convertedPerson compared to basePerson
     * @param {Number} amount
     * @param {RichPerson} basePerson
     * @param {RichPerson} convertedPerson
     */
    static convertAmount(amount, basePerson, convertedPerson) {
        if (!amount) return 0;

        // Convert to number
        amount = Number(amount);
        if (isNaN(amount)) return 0;

        return (amount * convertedPerson.worth / basePerson.worth).toFixed(2);
    }

    /**
     * 
     * @param {Object} filterObj
     * @param {String} filterObj.search
     * @param {Object} filterObj.wealth
     * @param {Number} filterObj.wealth.min
     * @param {Number} filterObj.wealth.max - Use infinite max if negative number
     * @param {Object} filterObj.sex
     * @param {Boolean} filterObj.sex.male
     * @param {Boolean} filterObj.sex.female
     * @param {Object} filterObj.age
     * @param {Number} filterObj.age.min
     * @param {Number} filterObj.age.max - Use infinite max if negative number
     * @param {String[]} filterObj.countries - Array of countries to include, empty array includes all
     *
     */
    static getfilteredPeople(filterObj) {
        return this.cache.filter(person => {
            // Wealth
            if (filterObj.wealth && filterObj.wealth.min > 0 && filterObj.wealth.max >= 0) {
                if (person.worth >= filterObj.wealth.min && person.worth <= filterObj.wealth.max)
                    return true;
            }

            // Sex
            if (filterObj.gender) {
                if (filterObj.gender.male && filterObj.gender.female)
                    return true;
                if (filterObj.gender.male && person.gender === 'male')
                    return true;
                else if (filterObj.gender.female && person.gender === 'female')
                    return true;
            }

            // Age
            // Countries

            // Search
            if (filterObj.search && person.containsSearchTerm(filterObj.search))
                return true;

            return false;
        });
    }
}

export default RichPerson;