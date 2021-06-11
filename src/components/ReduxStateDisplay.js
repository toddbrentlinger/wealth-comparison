import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// TODO: Send state as property so can re-use component for any Redux state/store
function ReduxStateDisplay() {
    const reduxState = useSelector(state => state);

    const displayStyle = {
        position: "fixed",
        zIndex: "100",
        left: "0",
        top: "0",
        border: "1px solid black",
        background: "white"
    };

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
                            'Object'
                            //Object.entries(value).map(entry => createPropertyDisplay(entry[0], entry[1]))
                        }
                    </div>
                    <button
                        className="show-property-btn"
                        //onClick={() => console.log(value)}
                        onClick={(e) => e.target.append(<div>FOO</div>)}
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
        <div className="redux-state-display-container" style={displayStyle}>
            {
                Object.entries(reduxState).map(entry =>
                    <React.Fragment key={entry[0]}>
                        <PropertyDisplay title={entry[0]} value={entry[1]} />
                    </React.Fragment>    
                )
            }
        </div>
    );
    /*
    return (
        <div className="redux-state-display-container" style={displayStyle}>
            {Object.entries(reduxState).map(entry => createPropertyDisplay(entry[0], entry[1]))}
        </div>
    );
    */
}

/**
 * 
 * @param {Object} props
 * @param {String} props.title
 * @param {any} props.value
 */
function PropertyDisplay(props) {
    // State
    const [isValueShowing, setIsValueShowing] = useState(false);

    // Variables
    const propertyStyle = {
        display: "flex"
    };

    // Boolean
    if (typeof props.value === 'boolean') {
        return (
            <div className="property" style={propertyStyle}>
                <div className="key">{props.title}</div>
                <div className="value">{props.value ? 'TRUE' : 'FALSE'}</div>
            </div>
        );
    }
    // String or Number
    if (typeof props.value === 'string' || typeof props.value === 'number') {
        return (
            <div className="property" style={propertyStyle}>
                <div className="key">{props.title}</div>
                <div className="value">{props.value}</div>
            </div>
        );
    }
    // Array
    if (Array.isArray(props.value)) {
        if (!isValueShowing) {
            return (
                <div className="property" style={propertyStyle}>
                    <div className="key">{props.title}</div>
                    <div className="value">{`Array(length: ${props.value.length})`}</div>
                    <button onClick={() => setIsValueShowing(true)}>+</button>
                </div>
            );
        }
        return (
            <div className="property" style={propertyStyle}>
                <div className="key">{props.title}</div>
                <div className="value">
                    {
                        props.value.map((val, index) =>
                            <React.Fragment key={index}>
                                <PropertyDisplay title={index} value={val} />
                            </React.Fragment>)
                    }
                </div>
                <button onClick={() => setIsValueShowing(false)}>-</button>
            </div>
        );
    }
    // Object
    if (typeof props.value === 'object' && props.value !== null) {
        if (!isValueShowing) {
            return (
                <div className="property" style={propertyStyle}>
                    <div className="key">{props.title}</div>
                    <div className="value">{`Object[${Object.keys(props.value).length} keys]`}</div>
                    <button onClick={() => setIsValueShowing(true)}>+</button>
                </div>
            );
        }
        return (
            <div className="property" style={propertyStyle}>
                <div className="key">{props.title}</div>
                <div className="value">
                    {
                        Object.entries(props.value).map((entry) =>
                            <React.Fragment key={entry[0]}>
                                <PropertyDisplay title={entry[0]} value={entry[1]} />
                            </React.Fragment>)
                    }
                </div>
                <button onClick={() => setIsValueShowing(false)}>-</button>
            </div>
        );
    }

    // Other
    return (
        <div className="property" style={propertyStyle}>
            <div className="key">{props.title}</div>
            <div className="value">{`Other [${typeof props.value}]`}</div>
        </div>
    );
}

export default ReduxStateDisplay;