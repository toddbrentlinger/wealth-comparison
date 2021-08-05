import React, { useState, useRef, useEffect, useCallback } from 'react';
import './WealthDisplayCanvas.css';
import { useSelector } from 'react-redux';
import billStackImage from '../images/bill_stack_alpha_800w.png';

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
//function drawBillStackOld(ctx, x, y, dx1, dy1, dx2, dy2, t) {
//    ctx.fillStyle = 'rgb(0, 200, 0)';
//    ctx.beginPath();
//    // Top
//    ctx.moveTo(x, y);
//    ctx.lineTo(x + dx1, y - dy1);
//    ctx.lineTo(x + dx1 + dx2, y - dy1 + dy2);
//    ctx.lineTo(x + dx2, y + dy2);
//    ctx.lineTo(x, y);
//    // Short Side
//    ctx.lineTo(x, y + t);
//    ctx.lineTo(x + dx2, y + t + dy2);
//    //ctx.lineTo(x + dx2, y + dy2);
//    // Long Side
//    //ctx.moveTo(x + dx2, y + t + dy2);
//    ctx.lineTo(x + dx2 + dx1, y + t + dy2 - dy1);
//    ctx.lineTo(x + dx1 + dx2, y - dy1 + dy2);
//    // Fill
//    ctx.fill();
//    // Stroke
//    ctx.stroke();
//}

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
// Used in drawBillStackAtScale function
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

    // Currency Symbol
    ctx.font = `${tWrap / 2}px arial,sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    //ctx.setTransform(1, -0.3, 0, 1, 0, 0); // skew transform
    // TEMP Start
    let pos = {
        x: x + dl.x / 2 + ds.x / 2,
        y: y - dl.y / 2 + ds.y / 2
    };
    ctx.translate(pos.x, pos.y); // move canvas origin
    ctx.rotate(Math.atan(ds.y / ds.x)); // rotate canvas
    ctx.transform(1, 0, -1.1, 1, 0, 0); // skew transform
    ctx.beginPath();
    //ctx.arc(0, 0, 3, 0, 2 * Math.PI); // debug circle at origin
    ctx.stroke();
    // TEMP End
    ctx.fillText('US\u0024', 0, tWrap / 5);
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
}

// Used in drawManual callback
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

// Used in drawManual callback
function drawBillStackImage(ctx, x, y, scale = 1) {
    const img = new Image();
    img.addEventListener('load', function () {
        // Change x,y to correlate with center of scaled image
        x -= scale * img.width / 2;
        y -= scale * img.height / 2;

        for (let i = 0; i < 10; i++) {
            ctx.drawImage(img, x, y, scale * img.width, scale * img.height);
            // Increment height for next bill stack
            y -= scale * img.height * 0.21;
        }
    });
    img.src = billStackImage;
}

/**
 * 
 * @param {Image} image Image of bill stack with height and width cropped to bill stack edges
 * @param {Number} scale Scale applied to default image size
 * @param {Number} deltaHeightPercentage Vertical distance between individual bill stacks as a percentage of image height where 1.0 is 100%
 * @param {Number} n Number of single bill stacks in total stack
 */
function getHeightOfStack(image, scale, deltaHeightPercentage, n) {
    /*
     * image: w x h
     * next stack at 21% height
     * Stacked		Height
     * 1		    h
     * 2		    1h + .21h = 1.21h
     * 3		    1h + .21h + .21h = 1.42h
     * n		    1h + (n-1)*.21h
     * 
     * if height of next stack as ratio of height = d:
     * 1h + dh(n - 1)
     * 1h + dhn - dh
     * h(1 + dn - d)
     * h[1 + d(n - 1)]
     */
    return Math.ceil(scale * image.height * (1 + deltaHeightPercentage * (n - 1)));
}

function getHeightOfColumnSet(nBillStacks, billStackImg, scale, canvasWidth) {
    // Values to position next bill stack along all three axes
    // x-axis: short side, y-axis: long side, z-axis: height
    const nextStackShifts = {
        dx: { x: 0.30, y: 0.24 },
        dy: { x: 0.72, y: 0.57 },
        dz: { x: 0, y: 0.21 }
    };

    // Find how many columns fit in canvas width
    const nColumns = Math.min(
        getNumberOfColumns(billStackImg, scale, nextStackShifts.dx.x, canvasWidth),
        nBillStacks
    );

    // Distribute total number of bills to each column stack
    let stackCountsArr = new Array(nColumns);
    distributeStacks(stackCountsArr.fill(0), nBillStacks);

    //return stackCountsArr.reduce((a, b) => Math.max(a, b)) * nextStackShifts.dz.y * scale * billStackImg.height
    //    + nColumns * nextStackShifts.dx.y * scale * billStackImg.height;
    //console.log(`Max Height: ${stackCountsArr.reduce((a, b) => Math.max(a, b))}`);
    const maxColumnSize = stackCountsArr.reduce((a, b) => Math.max(a, b));
    console.log(`Max Column Height: ${maxColumnSize}`);
    return Math.ceil(
        scale * billStackImg.height * (1 + nextStackShifts.dz.y * (maxColumnSize - 2))
        + scale * billStackImg.height * (1 + nextStackShifts.dx.y * (nColumns - 2))
    );
}

function getNumberOfColumns(image, scale, deltaXRatio, canvasWidth) {
    /*
     * image: w x h
     * s: scale applied to base image
     * n: total number of columns (left-to-right)
     * d: adjacent stack shifted to the side as ratio of image width
     * C: width of canvas to fit set of columns in
     * 
     * N    Width
     * 1    sw
     * 2    sw + sdw
     * 3    sw + sdw + sdw
     * n    sw + (n-1)sdw
     * 
     * Solve for n:
     * sw + (n-1)sdw <= C
     * sdw(n-1) <= C-sw
     * (n-1) <= (C-sw)/sdw
     * n <= [(C-sw)/sdw] + 1
     */
    return Math.floor(((canvasWidth - scale * image.width) / (scale * deltaXRatio * image.width)) + 1);
}

/**
 * Create array of x-positions on canvas for each column stack centered
 * @param {any} n
 * @param {any} scaledImageWidth
 * @param {any} deltaXRatio
 * @param {any} centerX
 */
function getStackXPositions(n, scaledImageWidth, deltaXRatio, centerX) {
    const columnSetWidth = scaledImageWidth * (1 + deltaXRatio * (n - 1));
    let stackXPositionArr = new Array(n);

    for (let i = 0, x = centerX - columnSetWidth / 2;
        i < stackXPositionArr.length;
        i++, x += deltaXRatio * scaledImageWidth) {
        stackXPositionArr[i] = x;
    }
    return stackXPositionArr;
}

function distributeStacks(arr, n, start = 0, end = arr.length - 1) {
    const addPerStack = Math.floor(n / (end - start + 1));
    // Check if n is less than the number of column stacks to add it to (addPerStack = 0)
    if (!addPerStack && n) {
        distributeStacks(arr, n, start, --end);
        return arr;
    }
    // Check that start is less than end
    if (start >= end) {
        arr[end] += n;
        return arr;
    }

    let newTotal = n;
    for (let i = start; i <= end; i++) {
        arr[i] += addPerStack;
        newTotal -= addPerStack;
    }
    if (newTotal > 0) {
        distributeStacks(arr, newTotal, ++start, --end);
    }
    return arr;
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
    const billStackImg = useRef(new Image());
    const intervalRef = useRef(null); // intervalID

    // Callbacks

    /**
     * 
     * @param {Number} nBillStacks Total number of individual bill stacks to put into columns
     * @param {Number} startX Canvas x-position of origin of stack. Bottom-middle of set of columns
     * @param {Number} width Width of canvas to fit set of columns
     * @param {Number} scale Scale applied to base image
     * 
     * Next stack to the side, long edges touching - dx:0.30 dy:0.24
     * Next stack to the side, short edges touching - dx:0.72 dy:0.57
     * Next stack on top - dy:0.21
     */
    function drawNStacks(nBillStacks, startX, width, scale) {
        // Values to position next bill stack along all three axes
        // x-axis: short side, y-axis: long side, z-axis: height
        const nextStackShifts = {
            dx: { x: 0.30, y: 0.24},
            dy: { x: 0.72, y: 0.57},
            dz: { x: 0, y: 0.21}
        };

        // Find how many columns fit in canvas width
        const nColumns = Math.min(
            getNumberOfColumns(billStackImg.current, scale, nextStackShifts.dx.x, width),
            nBillStacks
        );

        // Distribute total number of bills to each column stack
        let stackCountsArr = new Array(nColumns);
        distributeStacks(stackCountsArr.fill(0), nBillStacks);

        let stackXPositionArr = getStackXPositions(nColumns, scale * billStackImg.current.width, nextStackShifts.dx.x, startX);

        let currentLevelInitialHeight = ctx.current.canvas.height - scale * billStackImg.current.height * (1 + nextStackShifts.dx.y * (nColumns - 1));
        for (let i = 0, currY = currentLevelInitialHeight;
            i < stackXPositionArr.length;
            i++, currY += nextStackShifts.dx.y * scale * billStackImg.current.height) {
            ctx.current.drawImage(
                billStackImg.current,
                stackXPositionArr[i],
                currY,
                scale * billStackImg.current.width,
                scale * billStackImg.current.height
            );
        }
        
        const maxLevel = stackCountsArr.reduce((a, b) => Math.max(a, b));
        let currentLevel = 0;
        let currY = ctx.current.canvas.height - scale * billStackImg.current.height * (1 + nextStackShifts.dx.y * (nColumns - 1));
        while (currentLevel < maxLevel) {
            stackCountsArr.forEach((stackCount, columnIndex) => {
                if (stackCount > currentLevel) {
                    ctx.current.drawImage(
                        billStackImg.current,
                        stackXPositionArr[columnIndex],
                        currY,
                        scale * billStackImg.current.width,
                        scale * billStackImg.current.height
                    );
                }
                currY += nextStackShifts.dx.y * scale * billStackImg.current.height;
            });
            ++currentLevel;
            currY -= nColumns * nextStackShifts.dx.y * scale * billStackImg.current.height + nextStackShifts.dz.y * scale * billStackImg.current.height;
        }
        /*
        ctx.current.strokeRect(
            startX - width / 2, 0,
            width, ctx.current.canvas.height
        );
        return;

        let x = ctx.current.canvas.width / 3;
        let y = ctx.current.canvas.height / 2;
        // First bill stack
        ctx.current.drawImage(
            billStackImg.current,
            x,
            y,
            scale * billStackImg.current.width,
            scale * billStackImg.current.height
        );
        // Next bill stack to the side, long edges touching
        ctx.current.drawImage(
            billStackImg.current,
            x + nextStackShifts.dx.x * scale * billStackImg.current.width,
            y + nextStackShifts.dx.y * scale * billStackImg.current.height,
            scale * billStackImg.current.width,
            scale * billStackImg.current.height
        );
        // Next bill stack to the side, short edges touching
        ctx.current.drawImage(
            billStackImg.current,
            x - nextStackShifts.dy.x * scale * billStackImg.current.width,
            y + nextStackShifts.dy.y * scale * billStackImg.current.height,
            scale * billStackImg.current.width,
            scale * billStackImg.current.height
        );
        */
    }

    const draw = useCallback(() => {
        //debugger
        console.log(`draw callback starts`);

        // Clear previous interval in case it's still running
        if (intervalRef.current) {
            console.log(`draw callback clears previous interval`);
            clearInterval(intervalRef.current);
        }

        // Clears canvas
        ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height);

        // Check for zero amounts
        if (!first.amount && !second.amount) {
            if (!ctx.current.hidden) {
                ctx.current.hidden = true;
            }
            return;
        }

        // Check if canvas is still hidden
        if (ctx.current.hidden) {
            ctx.current.hidden = false;
        }

        let firstStackAmount = Math.ceil(first.amount / 10000);
        let secondstackAmount = Math.ceil(second.amount / 10000);

        const scale = 0.1;
        //const xStack = [
        //    Math.floor(ctx.current.canvas.width / 3) - scale * billStackImg.current.width / 2,
        //    Math.floor(2 * ctx.current.canvas.width / 3) - scale * billStackImg.current.width / 2
        //];
        //let yStack = ctx.current.canvas.height - scale * billStackImg.current.height;
        //let counter = 1;

        // TEMP START

        //const fullHeight = getHeightOfStack(
        //    billStackImg.current, scale, .21,
        //    Math.max(firstStackAmount, secondstackAmount)
        //);
        //if (canvasSize.height !== fullHeight) {
        //    setCanvasSize({ width: canvasContainerRef.current.offsetWidth, height: fullHeight });
        //    return;
        //}

        const fullHeight = getHeightOfColumnSet(Math.max(firstStackAmount, secondstackAmount), billStackImg.current, scale, ctx.current.canvas.width / 2);
        if (canvasSize.height !== fullHeight) {
            setCanvasSize({ width: canvasContainerRef.current.offsetWidth, height: fullHeight });
            return;
        }

        drawNStacks(firstStackAmount, ctx.current.canvas.width * .25, ctx.current.canvas.width / 2, scale);
        drawNStacks(secondstackAmount, ctx.current.canvas.width * .75, ctx.current.canvas.width / 2, scale);
        /*return;
        
        ctx.current.strokeRect(
            xStack[0], ctx.current.canvas.height - fullHeight,
            billStackImg.current.width / 2, fullHeight
        );

        // TEMP END

        intervalRef.current = setInterval(() => {
            if (counter > firstStackAmount && counter > secondstackAmount) {
                console.log(`draw callback clears interval`);
                clearInterval(intervalRef.current);
            }

            // First stack
            if (counter <= firstStackAmount) {
                ctx.current.drawImage(
                    billStackImg.current,
                    xStack[0],
                    yStack,
                    scale * billStackImg.current.width,
                    scale * billStackImg.current.height
                );
            }
            // Second stack
            if (counter <= secondstackAmount) {
                ctx.current.drawImage(
                    billStackImg.current,
                    xStack[1],
                    yStack,
                    scale * billStackImg.current.width,
                    scale * billStackImg.current.height
                );
            }

            // Increment height for next bill stack (% of height)
            yStack -= scale * billStackImg.current.height * 0.21;
            counter++;
        }, 100);
        */
        console.log(`draw callback ends`);
    }, [first.amount, second.amount, canvasSize]);

    const drawManual = useCallback(() => {
        console.log(`draw useCallback runs`);
        // Clears canvas
        //ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height);

        // Check for zero amounts
        if (!first.amount && !second.amount) {
            if (!ctx.current.hidden) {
                ctx.current.hidden = true;
                console.log('Canvas Hidden');
            }
            return;
        }
        if (ctx.current.hidden) {
            ctx.current.hidden = false;
            console.log('Canvas Visible');
            setCanvasSize({ width: canvasContainerRef.current.offsetWidth, height: canvasContainerRef.current.offsetHeight });
        }

        // TEMP
        drawBillStackImage(
            ctx.current,
            ctx.current.canvas.width / 2,
            ctx.current.canvas.height * 0.8,
            0.2);

        drawBillStackAtScale(ctx.current, 10, canvasSize.width / 3, canvasSize.height / 2);

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
        let pos = { x: canvasSize.height - 50, y: canvasSize.height - 50 };
        let xDist = [Math.floor(canvasSize.width / 3), Math.floor(2 * canvasSize.width / 3)];
        const n = 20; // max number of bill stacks in column
        let firstStackAmount = Math.ceil(first.amount / 10000);
        let secondstackAmount = Math.ceil(second.amount / 10000);
        if (firstStackAmount > secondstackAmount) {
            firstStackAmount = n;
            secondstackAmount = Math.round(n * second.amount / first.amount);
        } else {
            secondstackAmount = n;
            firstStackAmount = Math.round(n * first.amount / second.amount);
        }
        let sep = 12; // Distance between stacks of bills
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
    }, [canvasSize, first.amount, second.amount]);

    // Effects

    // TODO - make function that returns new canvas size to run as parameter as 
    // initial state when creating the useState above
    useEffect(() => {
        if (!canvasRef.current.getContext) {
            // Fallback code here if canvas NOT supported
            return;
        }

        //canvasRef.current.width = canvasRef.current.offsetWidth;
        //canvasRef.current.height = canvasRef.current.offsetHeight;
        //setCanvasSize({ width: canvasRef.current.offsetWidth, height: canvasRef.current.offsetHeight });
        ctx.current = canvasRef.current.getContext('2d');
        setCanvasSize({ width: canvasContainerRef.current.offsetWidth, height: canvasContainerRef.current.offsetHeight });
        billStackImg.current.src = billStackImage;
    }, []);

    useEffect(() => {
        function handleResize() {
            console.log(`handleResize runs\nW: ${canvasContainerRef.current.offsetWidth} - H: ${canvasContainerRef.current.offsetHeight}`);
            setCanvasSize({ width: canvasContainerRef.current.offsetWidth, height: canvasContainerRef.current.offsetHeight });
        }

        console.log('Component mounts');
        window.addEventListener('resize', handleResize);
         
        // Cleanup (returned function runs when component unmounts)
        return (() => {
            console.log('Component unmounts');
            window.removeEventListener('resize', handleResize);
        });
    }, []);

    useEffect(() => {
        draw();
    }, [first.amount, second.amount, draw]);

    // Functions

    function handleClickShowAnimation() {
        draw();
    }

    return (
        <React.Fragment>
            <div
                className={"canvas-container" + (!first.amount && !second.amount ? " hide" : "")}
                ref={canvasContainerRef}
            >
                <canvas
                    ref={canvasRef}
                    id="wealth-comparison-canvas"
                    width={canvasSize.width} // Default: 300 - 600
                    height={canvasSize.height} // Default: 150 - 300
                >
                </canvas>
            </div>
            <button onClick={handleClickShowAnimation}>Show Animation</button>
            <div>{`W:${canvasSize.width}\nH:${canvasSize.height}`}</div>
        </React.Fragment>
    );
}

export default WealthDisplayCanvas;