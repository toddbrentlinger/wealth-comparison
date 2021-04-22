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

    // ------------------------------------
    // ---------- Public Methods ----------
    // ------------------------------------

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
}

export default RichPerson;