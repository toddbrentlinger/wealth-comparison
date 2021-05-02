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
    return (
        <div className="min-max-range-slider">
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