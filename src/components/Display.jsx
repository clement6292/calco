import React from 'react'

export default function Display({firstNumber, operator, secondNumber, result}) {
    return (
        <div className="display">
            <div>{firstNumber}</div>
            <div className='operator'>{operator}</div>
            <div>{secondNumber}</div>
            <div className='result'>
                <div>=</div>
                <div>{result}</div>
            </div>
        </div>
    )
}
