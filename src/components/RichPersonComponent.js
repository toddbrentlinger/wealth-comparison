import React, { useState } from 'react';

function RichPersonComponent(props) {
    const [amount, setAmount] = useState(0);

    return (
        <div className="wealth-selector-container">
            <input type="text" value={amount} />
            <select>
            </select>
        </div>
    );
}

export default RichPersonComponent;