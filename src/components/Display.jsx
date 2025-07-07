import React from 'react'

const Display = React.memo(function Display({firstNumber, operator, secondNumber, result}) {
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
})

export default Display
