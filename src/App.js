import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './App.css';
import RichPerson from './classes/RichPerson.js';
import WealthSelector from './components/WealthSelector.js';
import PersonNotesContainer from './components/PersonNotesContainer.js';
import { useSelector, useDispatch } from 'react-redux';
import { changePerson, changeAmount } from './redux/actions.js';
import { addCommasToNumber } from './utilities.js';

// Global variable to reference RichPerson cache
window.RichPerson = RichPerson;

function App() {
    // States

    //const [firstPerson, setFirstPerson] = useState(null);
    //const [firstAmount, setFirstAmount] = useState("");
    //const [secondPerson, setSecondPerson] = useState(null);
    //const [secondAmount, setSecondAmount] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Variables

    //const users = useSelector(state => state.users);
    const first = useSelector(state => state.first);
    const second = useSelector(state => state.second);
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
    //useEffect(() => {
    //    console.log(`First:\nPerson: ${first.person ? first.person.name : null}\nAmount: ${first.amount}`);
    //    console.log(`Second:\nPerson: ${second.person ? second.person.name: null}\nAmount: ${second.amount}`);
    //}, [first, second]);

    // Functions

    function getDisplayedAmount(amount) {
        if (!amount) return 0;

        amount = Number(amount);

        if (amount <= 0) return 0;

        return amount < 1000 ? amount : addCommasToNumber(amount.toFixed(0));
    }

    // Variables

    const wealthComparisonContainer = (
        <div id="wealth-comparison-container">
            <div className="person-container">
                <div>{`$${getDisplayedAmount(first.amount)}`}</div>
                <WealthSelector isFirst={true} />
            </div>
            <div className="person-container">
                <div>{`$${getDisplayedAmount(second.amount)}`}</div>
                <WealthSelector isFirst={false} />
            </div>
        </div>
    );

    //const wealthSelectors = (
    //    <div id="wealth-selector-container">
    //        <WealthSelector isFirst={true} />
    //        <WealthSelector isFirst={false} />
    //    </div>
    //);

    // TEMP:
    const buttons = (
        <div id="random-buttons">
            <button
                onClick={
                    () => dispatch(changePerson(getRandomPerson(), true))
                }
            >
                Random First Person
                </button>
            <button
                onClick={() => dispatch(changeAmount(getRandomAmount(), true))}
            >
                Random First Amount
                </button>
            <button
                onClick={
                    () => dispatch(changePerson(getRandomPerson(), false))
                }
            >
                Random Second Person
                </button>
            <button
                onClick={() => dispatch(changeAmount(getRandomAmount(), false))}
            >
                Random Second Amount
                </button>
        </div>
    );

    const mainApp = (
        <main>
            {wealthComparisonContainer}
            {first || second ? <PersonNotesContainer /> : null}
        </main>
    );

    // Functions

    function getRandomPerson() {
        const index = Math.floor(Math.random() * RichPerson.cache.length);
        return RichPerson.cache[index];
    }

    function getRandomAmount() {
        return (Math.random() * 1000000).toFixed(2);
    }

    return (
        <div className="App">
            <h1>Wealth Comparison</h1>
            {buttons}
            {isLoading ? null : mainApp}
        </div>
    );
}

export default App;
