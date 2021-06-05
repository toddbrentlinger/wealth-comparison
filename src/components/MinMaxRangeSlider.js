import React, { useRef, useState, useEffect } from 'react';
import './MinMaxRangeSlider.css';

function getPercentageOfValueBetweenTwoValues(val, min, max) {
    return (val - min) / (max - min);
}

/**
 * 
 * @param {Object} props
 * @param {Number} props.minLimit
 * @param {Number} props.maxLimit
 * @param {Number} props.step - change in value with each tick (determines number of ticks)
 * @param {Number} props.startingMin - starting min value (checked value is between min/max limits)
 * @param {Number} props.startingMax - starting max value (checked value is between min/max limits)
 * @param {Function} props.onMinChange - function to run when min is changed (ex. action function for Redux to send through dispatch)
 * @param {Function} props.onMaxChange - function to run when max is changed (ex. action function for Redux to send through dispatch)
 * 
 * TODO:
 * - 
 */
function MinMaxRangeSlider(props) {
    // States
    //const [values, setValues] = useState([]);
    const [minValue, setMinValue] = useState(
        getPercentageOfValueBetweenTwoValues(
            props.startingMin, props.minLimit, props.maxLimit
        ) * 100 || 0
    );
    const [maxValue, setMaxValue] = useState(
        getPercentageOfValueBetweenTwoValues(
            props.startingMax, props.minLimit, props.maxLimit
        ) * 100 || 100
    );

    // Refs
    const slider = useRef(null); // element reference
    const sliderBar = useRef(null); // element reference
    const sliderBarStart = useRef(null); // min ball element reference
    const sliderBarEnd = useRef(null); // max ball element reference

    const minControlElement = useRef(null); // NOT NEEDED
    const maxControlElement = useRef(null); // NOT NEEDED
    const sliderTarget = useRef(null); // NOT NEEDED

    const resultsElement = useRef(null); // NOT NEEDED

    //const minValue = useRef(props.startingMin || 0);
    //const maxValue = useRef(props.startingMax || 100);
    const startX = useRef(0); // starting x-position when first click ball
    const currentX = useRef(0); // curretn x-position when dragging ball
    const target = useRef(null); // element reference to min/max ball that is moving
    const targetBCR = useRef(null); // moving slider ball bounding client rect (DOMRect object)
    const sliderBCR = useRef(null); // slider bar bounding client rect (DOMRect object)
    const sliderStartX = useRef(null); // sliderBCR.left
    const sliderEndX = useRef(null); // sliderBCR.right
    const isDraggingBall = useRef(false);

    // Effects

    useEffect(() => {
        extractValues();
        //updateSliderValues();
        requestAnimationFrame(updateSliderValues);
    }, []);

    useEffect(() => {
        updateSliderValues();
    });

    function onStart(e) {
        //console.log(`onStart runs`);

        target.current = e.target;
        sliderBCR.current = slider.current.getBoundingClientRect();
        targetBCR.current = target.current.getBoundingClientRect();

        sliderStartX.current = sliderBCR.current.left;
        sliderEndX.current = sliderBCR.current.right;

        startX.current = e.pageX || e.touches[0].pageX;
        currentX.current = startX.current;

        isDraggingBall.current = true;

        e.preventDefault();
    }

    function onMove(e) {
        if (!isDraggingBall.current || !target.current) return;

        currentX.current = e.pageX || e.touches[0].pageX;

        if (currentX.current < sliderStartX.current || currentX.current > sliderEndX.current)
            return;

        if (target.current === sliderBarStart.current) {
            props.onMinChange(calculateValue(currentX.current - sliderStartX.current));
            setMinValue(calculatePercentage(currentX.current - sliderStartX.current));
        }
        if (target.current === sliderBarEnd.current) {
            props.onMaxChange(calculateValue(currentX.current - sliderStartX.current));
            setMaxValue(calculatePercentage(currentX.current - sliderStartX.current));
        }

        //console.log(`onMove completes`);
    }

    function onEnd(e) {
        //console.log(`onEnd starts`);

        if (!isDraggingBall.current || !target.current) return;

        isDraggingBall.current = false;

        //console.log(`onEnd completes`);
    }

    function extractValues() {

    }

    function updateSliderValues() {
        //console.log(`updateSliderValues starts`);
        let tempMinValue = Math.round(minValue);
        let tempMaxValue = Math.round(maxValue);

        sliderBar.current.style.left = `${tempMinValue}%`;
        sliderBar.current.style.right = `${100 - tempMaxValue}%`;
    }

    /**
     * Calculates percentage (0-100%) of position along slider
     * @param {Number} positionInSlider
     */
    function calculatePercentage(positionInSlider) {
        return positionInSlider / sliderBCR.current.width * 100;
    }

    /**
     * Calculates value using position along slider and min/max limits
     * @param {Number} positionInSlider
     */
    function calculateValue(positionInSlider) {
        const percentage = positionInSlider / sliderBCR.current.width;
        const value = convertPercentageToValueInRange(percentage);
        return props.step * Math.round(value / props.step);
    }

    /**
     * Calculates value from percentage and min/max limits.
     * @param {Number} percentage
     */
    function convertPercentageToValueInRange(percentage) {
        return props.minLimit + percentage * (props.maxLimit - props.minLimit);
    }

    /**
     * Converts percentage to value for display that accounts for step and min/max
     * @param {Number} percentage
     * @returns {Number}
     */
    function getDisplayValue(percentage) {
        const value = convertPercentageToValueInRange(percentage);
        return props.step * Math.round(value / props.step);
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
            <div className="slider-title">{props.title}</div>
            <div className="slider-target" ref={sliderTarget}>
                <div
                    className="slider"
                    ref={slider}
                    onMouseMove={onMove}
                    onMouseLeave={onEnd}
                    onTouchMove={onMove}
                    data-min=""
                    data-max=""
                >
                    <div className="slider-bar" ref={sliderBar}>
                        <span
                            className="slider-ball-min"
                            ref={sliderBarStart}
                            onMouseDown={onStart}
                            onMouseUp={onEnd}
                            onTouchStart={onStart}
                            onTouchEnd={onEnd}
                        ></span>
                        <span
                            className="slider-ball-max"
                            ref={sliderBarEnd}
                            onMouseDown={onStart}
                            onMouseUp={onEnd}
                            onTouchStart={onStart}
                            onTouchEnd={onEnd}
                        ></span>
                    </div>
                </div>
            </div>
            <div className="results" ref={resultsElement}>
                <p>Min:
                    <span className="min-result">
                        {
                            props.convertValueToDisplay
                                ? props.convertValueToDisplay(convertPercentageToValueInRange(minValue / 100))
                                : getDisplayValue(minValue/100)
                        }
                    </span>
                </p>
                <p>Max:
                    <span className="max-result">
                        {
                            props.convertValueToDisplay
                                ? props.convertValueToDisplay(convertPercentageToValueInRange(maxValue / 100))
                                : getDisplayValue(maxValue/100)
                        }
                    </span>
                </p>
            </div>
        </div>
    );
}

export default MinMaxRangeSlider;