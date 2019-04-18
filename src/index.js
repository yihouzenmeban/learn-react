import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {
                    this.props.isRed
                        ? <span style={{ color: 'red' }}>{ this.props.value }</span>
                        : this.props.value
                }
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i, isRed) {
        return (
            <Square
                key={ i }
                value={ this.props.squares[i] }
                isRed={ isRed }
                onClick={ () => this.props.onClick(i) }
            />
        );
    }

    render() {
        const line = this.props.line;
        const rows = [];

        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 3 * i; j < i * 3 + 3; j++) {
                row.push(this.renderSquare(j, line.indexOf(j) > -1))
            }
            rows.push(
                <div className="board-row" key={i}>
                    {row}
                </div>
            )
        }

        return (
            <div>
                { rows }
            </div>
        );
    }
}

class Step extends React.Component {
    render() {
        const step = this.props.step;
        const move = this.props.move;
        const stepNumber = this.props.stepNumber;
        const desc = step.desc;

        return (
            <li>
                <button onClick={ () => this.props.jumpTo(move) }>
                    {
                        (move === stepNumber)
                        ? <strong>{desc}</strong>
                        : desc
                    }
                </button>
            </li>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
                desc: 'Game start'
            }],
            xIsNext: true,
            stepNumber: 0,
            sort: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();

        if (calculateWinner(squares).winner || squares[i]) return false;

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const location = `(${ Math.floor(i / 3) + 1 }, ${ i % 3 + 1 })`;
        const desc = `${ squares[i] } move to ${ location }`;

        this.setState({
            history: history.concat([{
                squares,
                desc
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
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const result = calculateWinner(current.squares);
        const stepNumber = this.state.stepNumber;

        if (this.state.sort) {
            history = history.slice();
            history.reverse();
        }

        const moves = history.map((step, move) => {
            return (
                <Step
                    key={ move }
                    move={ move }
                    stepNumber={ stepNumber }
                    step={ step }
                    jumpTo={ (step) => this.jumpTo(step) }
                />
            );
        })

        const status = result.winner
            ? `Winner: ${ result.winner }`
            :  (
                current.squares.indexOf(null) > -1
                    ? `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
                    : `A dead heat`
            );

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={ current.squares }
                        onClick={ this.handleClick }
                        line={ result.line }
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <button onClick={this.toggleSort}>Sort</button>
                    <ol>{ moves }</ol>
                </div>
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
        [2, 4, 6],
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
