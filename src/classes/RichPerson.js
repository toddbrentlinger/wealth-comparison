// TODO: Create base Person class to be extended 
// for similar functionality with RichPerson
class RichPerson {
    constructor(jsonObj) {
        this.jsonObj = jsonObj;

        // Properties that are copied by reference.
        // Use getters for primitive type properties that are copied by value
        this.bios = jsonObj.bios;
        this.abouts = jsonObj.abouts;
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
    get thumbnail() { return this.jsonObj.thumbnail; }
    get id() { return this.naturalId; }

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
}

export default RichPerson;