import React from 'react';
import { useSelector } from 'react-redux';
import WealthSelector from './WealthSelector.js';

/**
 * 
 * @param {Object} props
 * @param {Boolean} isFirst
 */
function PersonContainer(props) {
    const person = useSelector(state => props.isFirst ? state.first : state.second);

    return (
        <div className="wealth-selector-container">
            <input type="text" value={amount} />
            <select>
            </select>
        </div>
    );
}

export default PersonContainer;