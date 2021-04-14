import React from 'react';

/**
 * 
 * @param {Object} props
 * @param {Function} props.setSelectedPerson - Function to set state of selected Person in parent
 */
function PersonSelectComponent(props) {
    const personSelectOptions = window.RichPerson.cache
        .map((person, index) =>
            <option
                key={index}
                value={person.id}
                onChange={() => props.setSelectedPerson(person)}
            >
                {person.name}
            </option>
        );

    return (
        <select htmlFor="person-select">
            <option name="person-select" value="">-- Select --</option>
            {personSelectOptions}
        </select>
    );
}

export default PersonSelectComponent;