import React, { useState } from 'react';
import './DataArrayScroller.css';

/**
 * 
 * @param {Object} props
 * @param {String[]} props.strArr
 */
function DataArrayScroller(props) {
    // States

    const [indexDisplayed, setIndexDisplayed] = useState(0);

    // Functions

    /**
     * Sets the index displayed by limiting number between 0-length of props.strArr
     * @param {Number} num
     */
    function changeIndexDisplayed(num) {
        debugger
        // Return if NOT a number
        if (isNaN(num)) return;

        // limit num with modulo operator
        num %= props.strArr.length;

        // Adjust if negative
        if (num < 0)
            num += props.strArr.length;

        // Set num between 0 and length of array
        setIndexDisplayed(num);
    }

    // Variables

    //const componentArr = (
    //    <div>
    //        {props.strArr.map((str, i) => <p>{`${i+1}. ${str}`}</p>)}
    //    </div>
    //);

    const displayedDataComponent = (
        <p className="displayed-data">{`${indexDisplayed + 1}. ${props.strArr[indexDisplayed]}`}</p>
    );

    const buttons = (
        <div className="scroll-button-container">
            <button onClick={() => changeIndexDisplayed(indexDisplayed-1)}>UP</button>
            <button onClick={() => changeIndexDisplayed(indexDisplayed+1)}>Down</button>
        </div>
    );

    return (
        <div className="data-array-scroller-container">
            {displayedDataComponent}
            {buttons}
        </div>
    );
}

export default DataArrayScroller;