import React, { useState, useRef, useEffect } from 'react';
import './WealthDisplayCanvas.css';
import { useSelector } from 'react-redux';

/**
 * 
 * @param {RenderingContext} ctx - Canvas context object
 * @param {Number} x - starting x-coords
 * @param {Number} y - starting y-coords
 * @param {Number} dx1 - change in x-coords to top corner, long side
 * @param {Number} dy1 - change in y-corrds to top corner, long side
 * @param {Number} dx2 - change in x-coords to bottom corner, short side
 * @param {Number} dy2 - change in y-coords to bottom corner, short side
 * @param {Number} t - thickness
 */
function drawBillStackOld(ctx, x, y, dx1, dy1, dx2, dy2, t) {
    ctx.fillStyle = 'rgb(0, 200, 0)';
    ctx.beginPath();
    // Top
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx1, y - dy1);
    ctx.lineTo(x + dx1 + dx2, y - dy1 + dy2);
    ctx.lineTo(x + dx2, y + dy2);
    ctx.lineTo(x, y);
    // Short Side
    ctx.lineTo(x, y + t);
    ctx.lineTo(x + dx2, y + t + dy2);
    //ctx.lineTo(x + dx2, y + dy2);
    // Long Side
    //ctx.moveTo(x + dx2, y + t + dy2);
    ctx.lineTo(x + dx2 + dx1, y + t + dy2 - dy1);
    ctx.lineTo(x + dx1 + dx2, y - dy1 + dy2);
    // Fill
    ctx.fill();
    // Stroke
    ctx.stroke();
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x starting x-coords
 * @param {Number} y starting y-coords
 * @param {Object} dl change in coords on long side of bill
 * @param {Number} dl.x
 * @param {Number} dl.y
 * @param {Object} ds change in coords on short side of bill
 * @param {Number} ds.x
 * @param {Number} ds.y
 * @param {Number} tBill thickness of bill
 * @param {Number} tWrap thickness of bill wrap
 * @param {Number} nBills number of lines to represent bills in stack
 */
function drawBillStack(ctx, x, y, dl, ds, tBill, tWrap, nBills = 10) {
    let posX = x, posY = y;

    // Properties
    ctx.fillStyle = 'rgb(0, 200, 0)';

    // Draw full green brick
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dl.x, y - dl.y);
    ctx.lineTo(x + dl.x + ds.x, y - dl.y + ds.y);
    ctx.lineTo(x + dl.x + ds.x, y - dl.y + ds.y + tBill);
    ctx.lineTo(x + ds.x, y + ds.y + tBill);
    ctx.lineTo(x, y + tBill);
    ctx.fill();

    // Outline
    ctx.beginPath();
    // Outline - Top
    posX = x;
    posY = y;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX += dl.x, posY -= dl.y);
    ctx.lineTo(posX += ds.x, posY += ds.y);
    ctx.lineTo(posX -= dl.x, posY += dl.y);
    posX = x;
    posY = y;
    ctx.lineTo(posX, posY);
    // Outline - Short Side
    ctx.lineTo(posX, posY += tBill);
    ctx.lineTo(posX += ds.x, posY += ds.y);
    ctx.lineTo(posX, posY -= tBill);
    // Outline - Long Side
    ctx.moveTo(posX, posY += tBill);
    ctx.lineTo(posX += dl.x, posY -= dl.y);
    ctx.lineTo(posX, posY -= tBill);
    ctx.stroke();

    // Bill Lines
    ctx.beginPath();
    posX = x + ds.x;
    posY = y + ds.y;
    const verticalLimit = posY + tBill;
    const step = tBill / nBills;
    ctx.moveTo(posX, posY += step);
    while (posY < verticalLimit) {
        ctx.lineTo(posX -= ds.x, posY -= ds.y);
        ctx.moveTo(posX += ds.x, posY += ds.y);
        ctx.lineTo(posX += dl.x, posY -= dl.y);
        ctx.moveTo(posX -= dl.x, posY += dl.y + step);
    }
    ctx.stroke();

    // Wrap
    const angle = Math.atan(dl.y / dl.x);
    const dWrap = { x: tWrap * Math.cos(angle), y: tWrap * Math.sin(angle) };
    ctx.beginPath();
    posX = x + dl.x / 2 - dWrap.x / 2;
    posY = y - dl.y / 2 + dWrap.y / 2;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX += dWrap.x, posY -= dWrap.y);
    ctx.lineTo(posX += ds.x, posY += ds.y);
    ctx.lineTo(posX, posY += tBill);
    ctx.lineTo(posX -= dWrap.x, posY += dWrap.y);
    ctx.lineTo(posX, posY -= tBill);
    ctx.closePath();
    ctx.fillStyle = 'rgb(240,240,240)';
    ctx.fill();
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX += dWrap.x, posY -= dWrap.y);
    ctx.stroke();
}

function drawBillStackAtScale(ctx, scale, x, y) {
    const ratio = {
        long: { x: 20, y: 10 }, short: { x: 10, y: 3 }
    };

    drawBillStack(
        ctx, x, y,
        { x: scale * ratio.long.x, y: scale * ratio.long.y },
        { x: scale * ratio.short.x, y: scale * ratio.short.y },
        scale * ratio.short.x / 2, scale * ratio.short.x / 2, scale
    );
}

function WealthDisplayCanvas() {
    // Redux
    const first = useSelector(state => state.first);
    const second = useSelector(state => state.second);

    // States
    const [canvasSize, setCanvasSize] = useState({ width: 600, height: 300 });

    // Refs
    const canvasContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const ctx = useRef(null);

    // Effects

    useEffect(() => {
        if (!canvasRef.current.getContext) {
            // Fallback code here if canvas NOT supported
            return;
        }

        //canvasRef.current.width = canvasRef.current.offsetWidth;
        //canvasRef.current.height = canvasRef.current.offsetHeight;
        //setCanvasSize({ width: canvasRef.current.offsetWidth, height: canvasRef.current.offsetHeight });
        ctx.current = canvasRef.current.getContext('2d');

        draw();
    }, []);

    useEffect(() => {
        draw();
    }, [first.amount, second.amount]);

    // Functions

    function draw() {
        // TEMP - Clears canvas
        ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        //ctx.current.fillStyle = 'rgb(200, 0, 0)';
        //ctx.current.fillRect(10, 10, 50, 50);

        //ctx.current.fillStyle = 'rgba(0, 0, 200, 0.5)';
        //ctx.current.fillRect(30, 30, 50, 50);

        // Custom Bill Stack
        //drawBillStack(ctx.current, 10, 150, 200, 100, 100, 30, 50);
        //drawBillStack(ctx.current, 10, 150, { x: 200, y: 100 }, { x: 100, y: 30 }, 50, 50);
        //drawBillStackAtScale(ctx.current, 5, 300, 150);

        //let sep = 27;
        //for (let counter = 0, pos = { x: 150, y: 300 }; counter < 10; counter++ , pos.y -= sep) {
        //    drawBillStackAtScale(ctx.current, 5, pos.x, pos.y);
        //}
        //sep = 12;
        //for (let counter = 0, pos = { x: 500, y: 270 }; counter < 20; counter++ , pos.y -= sep) {
        //    drawBillStackAtScale(ctx.current, 2, pos.x, pos.y);
        //}

        let counter = 1;
        let pos = { x: canvasSize.height - 50, y: 270 };
        let xDist = [Math.floor(canvasSize.width / 3), Math.floor(2 * canvasSize.width / 3)];
        const n = 10; // max number of bill stacks in column
        let firstStackAmount = Math.ceil(first.amount / 10000);
        let secondstackAmount = Math.ceil(second.amount / 10000);
        if (first.amount > second.amount) {
            firstStackAmount = n;
            secondstackAmount = Math.round(n * second.amount / first.amount);
        } else {
            secondstackAmount = n;
            firstStackAmount = Math.round(n * first.amount / second.amount);
        }
        let sep = 12; // Distance between stacks of bills
        setTimeout(() => {
            let interval = setInterval(() => {
                if (counter > firstStackAmount && counter > secondstackAmount)
                    clearInterval(interval);
                // First stack
                if (counter <= firstStackAmount)
                    drawBillStackAtScale(ctx.current, 2, xDist[0], pos.y);
                // Second stack
                if (counter <= secondstackAmount)
                    drawBillStackAtScale(ctx.current, 2, xDist[1], pos.y);
                counter++;
                pos.y -= sep;
            }, 100);
        }, 300);
    }

    function handleClickShowAnimation() {
        draw();
    }

    return (
        <div className="canvas-container" ref={canvasContainerRef}>
            <canvas
                ref={canvasRef}
                id="wealth-comparison-canvas"
                width={canvasSize.width} // Default: 300 - 600
                height={canvasSize.height} // Default: 150 - 300
                onResize={() => {
                    if (!canvasRef.current) return;
                    canvasRef.current.width = canvasRef.current.offsetWidth;
                    canvasRef.current.height = canvasRef.current.offsetHeight;
                }}
            >
            </canvas>
            <button onClick={handleClickShowAnimation}>Show Animation</button>
        </div>
    );
}

export default WealthDisplayCanvas;