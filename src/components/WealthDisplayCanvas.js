import React, { useRef, useEffect } from 'react';

function WealthDisplayCanvas(props) {
    // Refs
    const canvasRef = useRef(null);
    const ctx = useRef(null);

    // Effects

    useEffect(() => {
        if (canvasRef.current.getContext) {
            ctx.current = canvasRef.current.getContext('2d');
            // Drawing code here
            ctx.current.fillStyle = 'rgb(200, 0, 0)';
            ctx.current.fillRect(10, 10, 50, 50);
            ctx.current.fillStyle = 'rgba(0, 0, 200, 0.5)';
            ctx.current.fillRect(30, 30, 50, 50);
        } else {
            // Fallback code here if canvas not supported
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="wealth-comparison-canvas"
            width="150" // Default: 300
            height="150" // Default: 150
            style={{border: "1px solid black", margin: "1em"}}
        >
        </canvas>
    );
}

export default WealthDisplayCanvas;