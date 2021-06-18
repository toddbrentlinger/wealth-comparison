import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './App.css';
import RichPerson from './classes/RichPerson.js';
import WealthSelector from './components/WealthSelector.js';
import PersonNotesContainer from './components/PersonNotesContainer.js';
import PersonSelectorPopup from './components/PersonSelectorPopup.js';
import WealthDisplayCanvas from './components/WealthDisplayCanvas.js';
import FooterCustom from './components/FooterCustom.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { changePerson, changeAmount, openPopupSelector } from './redux/actions.js';
import { addCommasToNumber, convertNumToSimplifiedString } from './utilities.js';

import ReduxStateDisplay from './components/ReduxStateDisplay.js';

// TEMP
window.convertNumToSimplifiedString = convertNumToSimplifiedString;

// Global variable to reference RichPerson cache
window.RichPerson = RichPerson;

function App() {
    // States

    //const [firstPerson, setFirstPerson] = useState(null);
    //const [firstAmount, setFirstAmount] = useState("");
    //const [secondPerson, setSecondPerson] = useState(null);
    //const [secondAmount, setSecondAmount] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    //const [isPersonSelectorPopupOpen, setIsPersonSelectorPopupOpen] = useState(false);

    // Variables

    //const users = useSelector(state => state.users);
    const first = useSelector(state => state.first);
    const second = useSelector(state => state.second);
    const selectorModal = useSelector(state => state.popupSelector);
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

    /**
     * 
     * @param {Boolean} isFirst
     */
    function handlePersonSelectButtonClick(isFirst = true) {
        //setIsPersonSelectorPopupOpen(true);
        //dispatch(changePopupSelectorIsDisplayed(true, isFirst));
        dispatch(openPopupSelector(isFirst));
    }

    // Variables

    const wealthComparisonContainer = (
        <div id="wealth-comparison-container">
            <div className="person-container">
                <div>{`$${getDisplayedAmount(first.amount)}`}</div>
                <WealthSelector isFirst={true} />
                <button onClick={() => handlePersonSelectButtonClick(true)}>Change Person</button>
            </div>
            <div className="exchange-icon">
                <FontAwesomeIcon icon={faExchangeAlt} />
            </div>
            <div className="person-container">
                <div>{`$${getDisplayedAmount(second.amount)}`}</div>
                <WealthSelector isFirst={false} />
                <button onClick={() => handlePersonSelectButtonClick(false)}>Change Person</button>
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
            {selectorModal.isDisplayed
                ? <PersonSelectorPopup
                    //setIsPersonSelectorPopupOpen={setIsPersonSelectorPopupOpen}
                    //setIsPersonSelectorPopupOpen={(val) => dispatch(changePopupSelectorIsDisplayed(val))}
                />
                : null}
            <WealthDisplayCanvas />
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
            {buttons}
            <FooterCustom />
            <ReduxStateDisplay/>
        </div>
    );
}

export default App;
