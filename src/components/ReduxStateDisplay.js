import React from 'react';
import { useSelector } from 'react-redux';

// TODO: Send state as property so can re-use component for any Redux state/store
function ReduxStateDisplay() {
    const reduxState = useSelector(state => state);

    const propertyStyle = {
        display: "flex"
    };

    /**
     * Recursive function to display each property in Redux state store
     * TODO: Include button to display state in console for arrays, objects, etc.
     * @param {String} key
     * @param {any} value
     */
    function createPropertyDisplay(key, value) {
        // String
        if (typeof value === 'string') {

        }
        // Number
        if (typeof value === 'number') {

        }
        // Array
        if (Array.isArray(value)) {

        }
        // Object
        if (typeof value === 'object' && value !== null) {
            return (
                <div className="property" style={propertyStyle}>
                    <div className="key">{key}</div>
                    <div className="value">
                        {
                            Object.entries(value).map(entry => createPropertyDisplay(entry[0], entry[1]))
                        }
                    </div>
                    <button
                        className="show-property-btn"
                        onClick={() => console.log(value)}
                    >
                        Show
                    </button>
                </div>
            );
        }
        // Other
        return (
            <div className="property" style={propertyStyle}>
                <div className="key">{key}</div>
                <div className="value">{value}</div>
                <button
                    className="show-property-btn"
                    onClick={() => console.log(value)}
                >
                    Show
                    </button>
            </div>
        );
    }

    return (
        <div className="redux-state-display-container">
            {createPropertyDisplay("state", reduxState)}
        </div>
    );
}

export default ReduxStateDisplay;