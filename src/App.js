import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './App.css';
import RichPerson from './classes/RichPerson.js';
import WealthSelector from './components/WealthSelector.js';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from './redux/actions.js';

// Global variable to reference RichPerson cache
window.RichPerson = RichPerson;

function App() {
    // States

    const [firstPerson, setFirstPerson] = useState(null);
    const [firstAmount, setFirstAmount] = useState("");
    const [secondPerson, setSecondPerson] = useState(null);
    const [secondAmount, setSecondAmount] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Variables

    const users = useSelector(state => state.users);
    const dispatch = useDispatch();

    // Effects

    useEffect(() => {
        setIsLoading(true);
        fetch("forbesData.json",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then((response) => response.json()
        ).then((data) => {
            data.personList.personsLists
                .forEach(personData => new RichPerson(personData));
            setIsLoading(false);
        });
    }, []);

    // TEMP
    useEffect(() => {
        console.log(`First:\nPerson: ${firstPerson}\nAmount: ${firstAmount}`);
        console.log(`Second:\nPerson: ${secondPerson}\nAmount: ${secondAmount}`);
    }, [firstPerson, firstAmount, secondPerson, secondAmount]);

    // Variables

    const wealthSelectors = (
        <React.Fragment>
            <WealthSelector
                person={firstPerson}
                amount={firstAmount}
                setPerson={setFirstPerson}
                setAmount={setFirstAmount}
            />
            <WealthSelector
                person={secondPerson}
                amount={secondAmount}
                setPerson={setSecondPerson}
                setAmount={setSecondAmount}
            />
        </React.Fragment>
    );

    return (
        <div className="App">
            <h1>Wealth Comparison</h1>
            {isLoading ? null : wealthSelectors}
            <div>
                <div>{users}</div>
                <button
                    onClick={() => dispatch(addUser("User" + Math.random()))}
                >
                    Add User
                </button>
            </div>
        </div>
    );
}

export default App;
