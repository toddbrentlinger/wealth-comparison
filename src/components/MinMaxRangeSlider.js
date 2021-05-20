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
    //const [values, setValues] = useState([]);
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

    //const minValue = useRef(props.startingMin || 0);
    //const maxValue = useRef(props.startingMax || 100);
    const startX = useRef(0);
    const currentX = useRef(0);
    const target = useRef(null);
    const targetBCR = useRef(null);
    const sliderBCR = useRef(null);
    const sliderStartX = useRef(null);
    const sliderEndX = useRef(null);
    const draggingBall = useRef(false);

    // Effects

    useEffect(() => {
        extractValues();
        //updateSliderValues();
        requestAnimationFrame(updateSliderValues);
    }, []);

    useEffect(() => {
        updateSliderValues();
    });

    // Functions

    function onStart(e) {
        console.log(`onStart runs`);

        target.current = e.target;
        sliderBCR.current = slider.current.getBoundingClientRect();
        targetBCR.current = target.current.getBoundingClientRect();

        sliderStartX.current = sliderBCR.current.left;
        sliderEndX.current = sliderBCR.current.right;

        startX.current = e.pageX || e.touches[0].pageX;
        currentX.current = startX.current;

        draggingBall.current = true;

        document.addEventListener('onMouseMove', onMove);

        e.preventDefault();
    }

    function onMove(e) {
        if (!draggingBall.current || !target.current) return;

        console.log(`onMove starts`);

        currentX.current = e.pageX || e.touches[0].pageX;

        if (currentX.current < sliderStartX.current || currentX.current > sliderEndX.current)
            return;

        if (target.current === sliderBarStart.current)
            setMinValue(calculatePercentage(currentX.current - sliderStartX.current));

        if (target.current === sliderBarEnd.current)
            setMaxValue(calculatePercentage(currentX.current - sliderStartX.current));

        console.log(`onMove completes`);
    }

    function onEnd(e) {
        console.log(`onEnd starts`);

        if (!draggingBall.current || !target.current) return;

        draggingBall.current = false;

        document.removeEventListener('onMouseMove', onMove);

        console.log(`onEnd completes`);
    }

    function extractValues() {

    }

    function updateSliderValues() {
        console.log(`updateSliderValues starts`);
        let tempMinValue = Math.round(minValue);
        let tempMaxValue = Math.round(maxValue);

        sliderBar.current.style.left = `${tempMinValue}%`;
        sliderBar.current.style.right = `${100 - tempMaxValue}%`;
    }

    function calculatePercentage(positionInSlider) {
        return positionInSlider / sliderBCR.current.width * 100;
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
                            onMouseLeave={onEnd}
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
                            onMouseLeave={onEnd}
                            onTouchStart={onStart}
                            onTouchMove={onMove}
                            onTouchEnd={onEnd}
                        ></span>
                    </div>
                </div>
            </div>
            <div className="results" ref={resultsElement}>
                <p>Min: <span className="min-result">{minValue.toFixed(0)}</span></p>
                <p>Max: <span className="max-result">{maxValue.toFixed(0)}</span></p>
            </div>
        </div>
    );
}

export default MinMaxRangeSlider;