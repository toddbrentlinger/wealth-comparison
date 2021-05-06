import React from 'react';
import './MinMaxRangeSlider.css';

/**
 * 
 * @param {Object} props
 * @param {Number} props.min
 * @param {Number} props.max
 * @param {Number} props.step
 * @param {Number} props.initialLow
 * @param {Number} props.initialHigh
 */
function MinMaxRangeSlider(props) {
    function onStart(e) {
        if (!e.target.classList.contains('slider-ball')) return;

    }

    return (
        <div className="min-max-range-slider">
            <select name="slider-min" className="slider-min-control">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <select name="slider-max" className="slider-max-control">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <div className="slider-target">
                <div className="slider" data-min="" data-max="">
                    <div className="slider-bar">
                        <span className="slider-ball-min"></span>
                        <span className="slider-ball-max"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MinMaxRangeSlider;