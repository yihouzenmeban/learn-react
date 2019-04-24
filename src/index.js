import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.handleClick}
        >
            {
                props.isRed
                    ? <span style={{ color: 'red' }}>{ props.value }</span>
                    : props.value
            }
        </button>
    );
}


function Step(props) {
    const step = props.step;

    return (
        <li>
            <button onClick={() => props.jumpTo(step.stepNumber)}>
                {
                    (step.stepNumber === props.stepNumber)
                        ? <strong>{ step.desc }</strong>
                        : step.desc
                }
            </button>
        </li>
    );
}


function GameInfo(props) {
    const result = props.result;
    const stepNumber = props.stepNumber;
    const current = props.history[stepNumber];

    let history = props.history.slice();

    if (props.sort) {
        history.reverse();
    }

    const moves = history.map((step, move) => {
        return (
            <Step
                key={ move }
                stepNumber={ stepNumber }
                step={ step }
                jumpTo={ props.jumpTo }
            />
        );
    })

    const status = result.winner
        ? `Winner: ${ result.winner }`
        : (
            current.squares.indexOf(null) > -1
                ? `Next player: ${ props.xIsNext ? 'X' : 'O' }`
                : `A dead heat`
        );

    return (
        <div className="game-info">
            <div>{ status }</div>
            <button onClick={ props.toggleSort }>Sort</button>
            <ol>{ moves }</ol>
        </div>
    )
}


function BoardRow(props) {
    const item = [];

    for (let i = 3 * props.i; i < 3 * props.i + 3; i++) {
        item.push(<Square
            key={ i }
            value={ props.squares[i] }
            isRed={ props.line.indexOf(i) > -1 }
            handleClick={ () => props.handleClick(i) }
        />)
    }

    return (
        <div className="board-row">
            { item }
        </div>
    );
}


function Board(props) {
    return (
        <div className="game-board">
            { Array(3).fill(null).reduce(boardRow, []) }
        </div>
    );

    function boardRow(result, current, currentIndex) {
        result.push(
            <BoardRow
                key={ currentIndex }
                i={ currentIndex }
                line={ props.line }
                squares={ props.squares }
                handleClick={ props.handleClick }
            />
        );

        return result;
    }
}


function Game() {
    const [history, setHistory] = useState([{
        squares: Array(9).fill(null),
        desc: 'Game start',
        stepNumber: 0
    }]);
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);
    const [sort, setSort] = useState(false);

    const squares = history[stepNumber].squares;
    const result = calculateWinner(squares);

    return (
        <div className="game">
            <Board
                squares={ squares }
                line={ result.line }

                handleClick={ handleClick }
            />
            <GameInfo
                history={ history }
                xIsNext={ xIsNext }
                stepNumber={ stepNumber }
                result={ result }
                sort={ sort }

                toggleSort={ () => setSort(!sort) }
                jumpTo={ jumpTo }
            />
        </div>
    );

    function handleClick(i) {
        if (result.winner || squares[i]) return false;

        const newSquares = squares.slice();
        newSquares[i] = xIsNext ? 'X' : 'O';
        const location = `(${ Math.floor(i / 3) + 1 }, ${ i % 3 + 1 })`;
        const desc = `${ newSquares[i] } move to ${ location }`;

        setHistory(history.concat([{
            desc,
            squares: newSquares,
            stepNumber: history.length
        }]));
        setStepNumber(history.length);
        setXIsNext(!xIsNext);
    }

    function jumpTo(step) {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: [a, b, c]
            };
        }
    }
    return {
        winner: null,
        line: []
    };
}
