import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleUp, faChevronCircleDown, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './DataArrayScroller.css';

/**
 * 
 * @param {Object} props
 * @param {String[]} props.strArr - Array of strings to display in <p> components
 * @param {String} props.buttonEdge - 'top/down/left/right for edge of buttons
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
        (props.strArr.length > 1)
            ? <p className="displayed-data">{`${indexDisplayed + 1}/${props.strArr.length} | ${props.strArr[indexDisplayed]}`}</p>
            : <p className="displayed-data">{props.strArr[indexDisplayed]}</p>
    );

    const buttons = (
        <div className="scroll-button-container">
            <button onClick={() => changeIndexDisplayed(indexDisplayed - 1)}>
                <FontAwesomeIcon icon={faChevronUp} className="scroll-button-icon" />
            </button>
            <button onClick={() => changeIndexDisplayed(indexDisplayed + 1)}>
                <FontAwesomeIcon icon={faChevronDown} className="scroll-button-icon" />
            </button>
        </div>
    );

    return (
        <div className={`data-array-scroller-container ${props.buttonEdge}`}>
            {displayedDataComponent}
            {props.strArr.length > 1 ? buttons : null}
        </div>
    );
}

export default DataArrayScroller;