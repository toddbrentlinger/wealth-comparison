import React, { useRef, useState, useEffect } from 'react';
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
    // States
    const [values, setValues] = useState([]);
    const [minValue, setMinValue] = useState(props.startingMin || 0);
    const [maxValue, setMaxValue] = useState(props.startingMax || 100);

    // Refs
    const slider = useRef(null);
    const sliderBar = useRef(null);
    const sliderBarStart = useRef(null);
    const sliderBarEnd = useRef(null);

    const minControlElement = useRef(null);
    const maxControlElement = useRef(null);
    const sliderTarget = useRef(null);

    const resultsElement = useRef(null);

    // Effects

    useEffect(() => {
        extractValues();
        updateSliderValues();
    }, []);

    // Functions

    function onStart(e) {
        console.log(`onStart runs`);
        if (!e.target.classList.contains('slider-ball')) return;

        e.preventDefault();
    }

    function onMove(e) {
        console.log(`onMove runs`);
    }

    function onEnd(e) {
        console.log(`onEnd runs`);
    }

    function extractValues() {

    }

    function updateSliderValues() {
        let tempMinValue = Math.round(minValue);
        let tempMaxValue = Math.round(maxValue);

        sliderBar.current.style.left = `${tempMinValue}%`;
        sliderBar.current.style.right = `${100 - tempMaxValue}%`;
    }

    return (
        <div className="min-max-range-slider">
            <select name="slider-min" className="slider-min-control hidden" ref={minControlElement}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <select name="slider-max" className="slider-max-control hidden" ref={maxControlElement}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <div className="slider-target" ref={sliderTarget}>
                <div className="slider" ref={slider} data-min="" data-max="">
                    <div className="slider-bar" ref={sliderBar}>
                        <span
                            className="slider-ball-min"
                            ref={sliderBarStart}
                            onMouseDown={onStart}
                            onMouseMove={onMove}
                            onMouseUp={onEnd}
                            onTouchStart={onStart}
                            onTouchMove={onMove}
                            onTouchEnd={onEnd}
                        ></span>
                        <span
                            className="slider-ball-max"
                            ref={sliderBarEnd}
                            onMouseDown={onStart}
                            onMouseMove={onMove}
                            onMouseUp={onEnd}
                            onTouchStart={onStart}
                            onTouchMove={onMove}
                            onTouchEnd={onEnd}
                        ></span>
                    </div>
                </div>
            </div>
            <div className="results" ref={resultsElement}>
                <h5 className="results-title">Results</h5>
                <p>Min: <span className="min-result"></span></p>
                <p>Max: <span className="max-result"></span></p>
            </div>
        </div>
    );
}

export default MinMaxRangeSlider;