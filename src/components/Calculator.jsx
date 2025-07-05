import { useEffect, useReducer, useRef, useState } from 'react';
import Display from './Display';
import Button from './Button';
import styles from './Calculator.module.css';

const initialState = {
    saisie: null,
    secondValue: null,
    operator: null,
    result: null,
    errorMessage: ''
};

function calculatorReducer(state, action) {
    switch (action.type) {
        case 'ADD_DIGIT':
            if (!state.operator) {
                if (state.saisie?.length >= 10) return state;
                return { ...state, saisie: (state.saisie || '') + action.payload };
            } else {
                if (state.secondValue?.length >= 10) return state;
                return { ...state, secondValue: (state.secondValue || '') + action.payload };
            }
        case 'SET_OPERATOR':
            return { ...state, operator: action.payload };
        case 'CLEAR':
            return initialState;
        case 'SET_RESULT':
            return { ...state, result: action.payload };
        case 'SET_ERROR':
            return { ...state, errorMessage: action.payload };
        default:
            return state;
    }
}

export default function Calculator() {
    const [state, dispatch] = useReducer(calculatorReducer, initialState);
    const [inputControleValue, setInputControleValue] = useState('');
    const [manualInput, setManualInput] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [piValue, setPiValue] = useState(null);

    const refInputIncontrole = useRef(null);
    const ref = useRef(null);
    const [testIncrement, setTestIncrement] = useState(0);

   

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        ref.current.focus();
    }, []);

   

    const fetchAdvancedCalculation = async () => {
        dispatch({ type: 'SET_ERROR', payload: '' });
        if (!manualInput) return;

        if (!navigator.onLine) {
            dispatch({ type: 'SET_ERROR', payload: "Pas de connexion internet." });
            return;
        }

        try {
            const encodedExpr = encodeURIComponent(manualInput);
            const response = await fetch(`https://api.mathjs.org/v4/?expr=${encodedExpr}`);
            const result = await response.text();
            dispatch({ type: 'SET_RESULT', payload: result });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: "Erreur lors du calcul scientifique." });
        }
    };

    const fetchPi = async () => {
        dispatch({ type: 'SET_ERROR', payload: '' });

        if (!navigator.onLine) {
            dispatch({ type: 'SET_ERROR', payload: "Pas de connexion. Impossible d'appeler l'API." });
            return;
        }

        try {
            const response = await fetch('https://api.mathjs.org/v4/?expr=pi');
            const data = await response.text();
            dispatch({ type: 'SET_RESULT', payload: data });
            setPiValue(data); 
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: "Erreur lors de la récupération de π." });
        }
    };

   

    const handleNumberClick = (value) => {
        dispatch({ type: 'ADD_DIGIT', payload: value });
    };

    const handleOperatorClick = (value) => {
        dispatch({ type: 'SET_OPERATOR', payload: value });
    };

    const handleClear = () => {
        dispatch({ type: 'CLEAR' });
    };

    const handleEqualClick = () => {
        if (state.saisie && state.secondValue && state.operator) {
            const num1 = parseFloat(state.saisie);
            const num2 = parseFloat(state.secondValue);
            let res;

            switch (state.operator) {
                case '+': res = num1 + num2; break;
                case '-': res = num1 - num2; break;
                case '*': res = num1 * num2; break;
                case '/': res = num2 !== 0 ? num1 / num2 : "Erreur : division par zéro"; break;
                default: res = "Erreur";
            }

            dispatch({ type: 'SET_RESULT', payload: res });
        }
    };

    const handleKeyDown = (event) => {
        const key = event.key;
        const isNumber = !isNaN(Number(key));
        if (event.target.tagName === "INPUT") return;

        if (isNumber) handleNumberClick(key);
        else if (["+", "-", "*", "/"].includes(key)) handleOperatorClick(key);
        else if (key === "Enter") handleEqualClick();
        else if (key.toLowerCase() === "c") handleClear();
    };

    const handleControlledSubmit = () => {
        dispatch({ type: 'SET_ERROR', payload: '' });

        if (inputControleValue) {
            try {
                const result = eval(inputControleValue);
                dispatch({ type: 'SET_RESULT', payload: result });
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message });
            }
        }
    };

    const handleNotControlledSubmit = () => {
        const inputValue = refInputIncontrole.current?.value;
        if (inputValue) {
            try {
                const result = eval(inputValue);
                dispatch({ type: 'SET_RESULT', payload: result });
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message });
            }
        }
    };

   
    const paramsButton = [
        { label: "1", action: handleNumberClick },
        { label: "2", action: handleNumberClick },
        { label: "3", action: handleNumberClick },
        { label: "+", action: handleOperatorClick },
        { label: "4", action: handleNumberClick },
        { label: "5", action: handleNumberClick },
        { label: "6", action: handleNumberClick },
        { label: "-", action: handleOperatorClick },
        { label: "7", action: handleNumberClick },
        { label: "8", action: handleNumberClick },
        { label: "9", action: handleNumberClick },
        { label: "*", action: handleOperatorClick },
        { label: "0", action: handleNumberClick },
        { label: "C", action: handleClear },
        { label: "=", action: handleEqualClick },
        { label: "/", action: handleOperatorClick },
    ];

  

    return (
        <>
          
            <div style={{
                backgroundColor: isOnline ? '#d4edda' : '#f8d7da',
                color: isOnline ? '#155724' : '#721c24',
                padding: '8px',
                borderRadius: '4px',
                textAlign: 'center',
                marginBottom: '10px',
                fontSize: '14px'
            }}>
                {isOnline ? 'Vous êtes en ligne ✅' : 'Vous êtes hors ligne ❌'}
            </div>

            <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Ex: sqrt(16) + log(100)"
                style={{ width: '100%', padding: '6px', marginBottom: '10px' }}
            />

     
            <div
                ref={ref}
                className="calculator"
                onKeyDown={handleKeyDown}
                tabIndex="0"
                style={{ outline: 'none' }}
            >
                <div className={styles.error}>{state.errorMessage}</div>

                <div style={{ fontSize: '12px', color: 'gray', textAlign: 'center' }}>
                    Largeur de l’écran : {windowWidth}px
                </div>

                <div className={styles.flexElement}>
                    <div>{testIncrement}</div>
                    <input
                        value={inputControleValue}
                        type="text"
                        onChange={(e) => setInputControleValue(e.target.value)}
                    />
                </div>

                <Display
                    firstNumber={state.saisie}
                    operator={state.operator}
                    secondNumber={state.secondValue}
                    result={state.result}
                />

                <input
                    type="text"
                    className={styles.inputNottControlled}
                    ref={refInputIncontrole}
                    placeholder="Input rapide (pas suivi par React)"
                />

                {/* Boutons numériques */}
                <div>
                    {paramsButton.map((param, index) => (
                        <Button key={index} label={param.label} onClick={param.action} />
                    ))}
                </div>

              
                <div style={{ marginTop: '10px', textAlign: 'center', marginBottom: '5px' }}>
                    <button onClick={fetchPi}>📡 Charger π depuis API</button>
                    {piValue && (
                        <p style={{ fontSize: '14px', marginTop: '5px' }}>
                            Valeur de π : <strong>{Number(piValue).toPrecision(3)}</strong>
                        </p>
                    )}
                    <button onClick={fetchAdvancedCalculation}>Calculer via Math.js API 🧠</button>
                </div>

                
                <div className={styles.flexElement}>
                    <button onClick={handleControlledSubmit}>Control</button>
                    <button onClick={handleNotControlledSubmit}>Not-Control</button>
                </div>
            </div>
        </>
    );
}
