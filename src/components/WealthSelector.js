import React from 'react';
import PersonSelectComponent from './PersonSelectComponent.js';
import PersonNotes from './PersonNotes.js';

/**
 * 
 * @param {Object} props
 * @param {Person} props.person
 */
function WealthSelector(props) {
    return (
        <div className="wealth-selector-container">
            <label htmlFor="currency-amount"></label>
            <input
                name="currency-amount"
                type="text"
                value={props.amount}
                placeholder="Enter amount"
                onChange={(e) => props.setAmount(e.target.value)}
            />
            <PersonSelectComponent setSelectedPerson={props.setPerson} />
            <PersonNotes person={props.person} />
        </div>
    );
}

export default WealthSelector;