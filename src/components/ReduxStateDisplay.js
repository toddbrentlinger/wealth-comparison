import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { clampValue, checkMouseCoords } from '../utilities.js';
import './ReduxStateDisplay.css';

function ReduxStateDisplay() {
    // Redux

    const reduxState = useSelector(state => state);

    // States

    const [isOpen, setIsOpen] = useState(false);

    // Refs

    const draggableNodeRef = useRef(null);
    const mouseRelativePosition = useRef({ x: 0, y: 0 });

    // Functions

    function handleMouseMove(event) {
        checkMouseCoords(event);
        draggableNodeRef.current.style.top = `${event.pageY - mouseRelativePosition.current.y}px`;
        draggableNodeRef.current.style.left = `${event.pageX - mouseRelativePosition.current.x}px`;
    }

    function handleMouseUp() {
        // Remove event listener that moves element with the mouse
        document.removeEventListener('mousemove', handleMouseMove);
    }

    function handleMouseDown(event) {
        checkMouseCoords(event);
        const clickDragRect = draggableNodeRef.current.getBoundingClientRect();
        mouseRelativePosition.current = {
            x: event.pageX - clickDragRect.left,
            y: event.pageY - clickDragRect.top
        };
        // Add event listener that moves element with the mouse position
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    function createTable() {
        return (
            <table className={isOpen ? null : 'hide'}>
                <tbody>
                    {
                        Object.entries(reduxState).map(entry =>
                            <React.Fragment key={entry[0]}>
                                <PropertyDisplay title={entry[0]} value={entry[1]} />
                            </React.Fragment>
                        )
                    }
                </tbody>
            </table>
        );
    }

    return (
        <div
            className="redux-state-display-container"
            ref={draggableNodeRef}
        >
            <div
                className="title-bar"
                onMouseDown={handleMouseDown}
            >
                Redux
                <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? '-' : '+'}</button>
            </div>
            {createTable()}
        </div>
    );
}
/*
// TODO: Send state as property so can re-use component for any Redux state/store
function ReduxStateDisplayOld() {
    // Redux
    const reduxState = useSelector(state => state);

    // State

    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // Refs

    const draggableNodeRef = useRef(null);
    const cornerDiff = useRef(null);
    const rect = useRef(null);

    // Drag

    function handleDragStart(e) {
        console.log(`Drag Starts`);
        e.dataTransfer.dropEffect = "copy";
    }

    function handleDragMove(e) {

    }

    function handleDragEnd(e) {

    }

    // Mouse

    function handleMouseDown(e) {
        setIsDragging(true);
        rect.current = draggableNodeRef.current.getBoundingClientRect();
        cornerDiff.current = {
            x: e.clientX - rect.current.left,
            y: e.clientY - rect.current.top
        };
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        //console.log(`X: ${e.clientX}\nY: ${e.clientY}`);
        draggableNodeRef.current.style.left = e.clientX - cornerDiff.current.x;
        draggableNodeRef.current.style.top = e.clientY - cornerDiff.current.y;
        //console.log(`Mouse Move:\nTop: ${e.clientY - cornerDiff.current.y}\nLeft: ${e.clientX - cornerDiff.current.x}`);

        // Check that values are within limits
        let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let newPosition = {
            top: clampValue(e.clientY - cornerDiff.current.y, 0, windowHeight - rect.current.top),
            left: clampValue(e.clientX - cornerDiff.current.x, 0, windowWidth - rect.current.left)
        };

        setPosition(newPosition);
        //return;

        //setPosition({
        //    top: e.clientY - cornerDiff.current.y,
        //    left: e.clientX - cornerDiff.current.x
        //});
    }

    function handleMouseUp(e) {
        setIsDragging(false);
        cornerDiff.current = null;
        console.log(`Mouse Up`);
    }

    function createTable() {
        return (
            <table className={isOpen ? null : 'hide'}>
                <tbody>
                    {
                        Object.entries(reduxState).map(entry =>
                            <React.Fragment key={entry[0]}>
                                <PropertyDisplay title={entry[0]} value={entry[1]} />
                            </React.Fragment>
                        )
                    }
                </tbody>
            </table>
        );
    }

    return (
        <div
            className="redux-state-display-container"
            style={{ top: position.top, left: position.left }}
            //draggable={true}
            ref={draggableNodeRef}
            onMouseMove={handleMouseMove}
        >
            <div
                className="title-bar"
                onDragStart={handleDragStart}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                Redux
                <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? '-' : '+'}</button>
            </div>
            {createTable()}
        </div>
    );
    
    //return (
    //    <div className="redux-state-display-container" style={displayStyle}>
    //        {Object.entries(reduxState).map(entry => createPropertyDisplay(entry[0], entry[1]))}
    //    </div>
    //);
}
*/
/**
 * 
 * @param {Object} props
 * @param {String} props.title
 * @param {any} props.value
 */
function PropertyDisplay(props) {
    // State

    const [isValueShowing, setIsValueShowing] = useState(false);

    // Functions

    /**
     * 
     * @param {any} value
     * @returns {Element}
     */
    function createPropertyNode(value) {
        let valueNode;
        // Boolean
        if (typeof value === 'boolean') {
            valueNode = (<td className="value">{value ? 'TRUE' : 'FALSE'}</td>);
        }
        // String or Number
        else if (typeof value === 'string' || typeof value === 'number') {
            valueNode = (<td className="value">{value}</td>);
        }
        // Array
        else if (Array.isArray(value)) {
            if (!isValueShowing) {
                valueNode = (
                    <React.Fragment>
                        <td className="value">{`Array(length: ${value.length})`}</td>
                        <td>
                            <button onClick={() => setIsValueShowing(true)}>+</button>
                        </td>
                    </React.Fragment>
                );
            } else {
                valueNode = (
                    <React.Fragment>
                        <td className="value">
                            {
                                value.map((val, index) =>
                                    <React.Fragment key={index}>
                                        <PropertyDisplay title={index} value={val} />
                                    </React.Fragment>)
                            }
                        </td>
                        <td>
                            <button onClick={() => setIsValueShowing(false)}>-</button>
                        </td>
                    </React.Fragment>
                );
            }
        }
        // Object
        else if (typeof value === 'object' && value !== null) {
            if (!isValueShowing) {
                valueNode = (
                    <React.Fragment>
                        <td className="value">{`Object[${Object.keys(value).length} keys]`}</td>
                        <td>
                            <button onClick={() => setIsValueShowing(true)}>+</button>
                        </td>
                    </React.Fragment>
                );
            } else {
                valueNode = (
                    <React.Fragment>
                        <td className="value">
                            <table>
                                <tbody>
                                    {
                                        Object.entries(value).map((entry) =>
                                            <React.Fragment key={entry[0]}>
                                                <PropertyDisplay title={entry[0]} value={entry[1]} />
                                            </React.Fragment>)
                                    }
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <button onClick={() => setIsValueShowing(false)}>-</button>
                        </td>
                    </React.Fragment>
                );
            }
        }
        // Other
        else {
            valueNode = (<td className="value">{`Other [${typeof value}]`}</td>);
        }

        return (
            <tr className="property">
                <td className="key">
                    {props.title}
                </td>
                {valueNode}
            </tr>
        );
    }

    return createPropertyNode(props.value);

    // -----------------------------------------------------------
    /*
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
    */
}

export default ReduxStateDisplay;