import React from 'react';
import PersonSelectComponent from './PersonSelectComponent.js';
import { useSelector, useDispatch } from 'react-redux';
import { changeAmount } from '../redux/actions.js';
import './WealthSelector.css';

/**
 * 
 * @param {Object} props
 * @param {Boolean} props.isFirst
 */
function WealthSelector(props) {
    const selector = useSelector(state => props.isFirst ? state.first : state.second);
    const dispatch = useDispatch();

    return (
        <div className="wealth-selector">
            <label htmlFor="currency-amount"></label>
            <input
                name="currency-amount"
                type="text"
                value={selector.amount ? selector.amount : ""}
                placeholder="Enter amount"
                onChange={(e) => dispatch(changeAmount(e.target.value, props.isFirst))}
            />
            <PersonSelectComponent isFirst={props.isFirst} />
        </div>
    );
}

export default WealthSelector;