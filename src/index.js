import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={this.props.handleClick}
            >
                {
                    this.props.isRed
                        ? <span style={{ color: 'red' }}>{this.props.value}</span>
                        : this.props.value
                }
            </button>
        );
    }
}

class Step extends React.Component {
    render() {
        const step = this.props.step;
        const stepNumber = this.props.stepNumber;
        const desc = step.desc;

        return (
            <li>
                <button onClick={() => this.props.jumpTo(step.stepNumber)}>
                    {
                        (step.stepNumber === stepNumber)
                            ? <strong>{desc}</strong>
                            : desc
                    }
                </button>
            </li>
        );
    }
}

class GameInfo extends React.Component {
    render() {
        const result = this.props.result;
        const stepNumber = this.props.stepNumber;
        const current = this.props.history[stepNumber];

        let history = this.props.history.slice();

        if (this.props.sort) {
            history.reverse();
        }

        const moves = history.map((step, move) => {
            return (
                <Step
                    key={move}
                    stepNumber={stepNumber}
                    step={step}
                    jumpTo={this.props.jumpTo}
                />
            );
        })

        const status = result.winner
            ? `Winner: ${result.winner}`
            : (
                current.squares.indexOf(null) > -1
                    ? `Next player: ${this.props.xIsNext ? 'X' : 'O'}`
                    : `A dead heat`
            );

        return (
            <div className="game-info">
                <div>{status}</div>
                <button onClick={this.props.toggleSort}>Sort</button>
                <ol>{moves}</ol>
            </div>
        )
    }
}

class BoardRow extends React.Component {
    render() {
        const item = [];
        const line = this.props.line;

        for (let i = 3 * this.props.i; i < 3 * this.props.i + 3; i++) {
            item.push(<Square
                key={i}
                value={this.props.squares[i]}
                isRed={line.indexOf(i) > -1}
                handleClick={() => this.props.handleClick(i)}
            />)
        }

        return (
            <div className="board-row">
                {item}
            </div>
        );
    }
}

class Board extends React.Component {
    render() {
        const item = [];

        for (let i = 0; i < 3; i++) {
            item.push(
                <BoardRow
                    key={i}
                    i={i}
                    line={this.props.line}
                    squares={this.props.squares}
                    handleClick={this.props.handleClick}
                />
            );
        }

        return (
            <div className="game-board">
                {item}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
                desc: 'Game start',
                stepNumber: 0
            }],
            xIsNext: true,
            stepNumber: 0,
            sort: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.jumpTo = this.jumpTo.bind(this);
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();

        if (calculateWinner(squares).winner || squares[i]) return false;

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const location = `(${Math.floor(i / 3) + 1}, ${i % 3 + 1})`;
        const desc = `${squares[i]} move to ${location}`;

        this.setState({
            history: history.concat([{
                squares,
                desc,
                stepNumber: history.length
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    toggleSort() {
        this.setState({
            sort: !this.state.sort
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const result = calculateWinner(current.squares);
        const stepNumber = this.state.stepNumber;

        return (
            <div className="game">
                <Board
                    squares={current.squares}
                    line={result.line}

                    handleClick={this.handleClick}
                />
                <GameInfo
                    history={history}
                    xIsNext={this.state.xIsNext}
                    stepNumber={stepNumber}
                    result={result}
                    sort={this.state.sort}

                    toggleSort={this.toggleSort}
                    jumpTo={this.jumpTo}
                />
            </div>
        );
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
