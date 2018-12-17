import React, { PureComponent } from 'react';

import './Snake.css';

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right'
}

interface ICell {
  x: number,
  y: number,
}

interface ISnakeProps {
  cellSize: number,
}

interface ISnakeState {
  snakeSize: number,
  snakeCoordinates: Array<ICell>,
  direction: Direction,
  foodCoordinates: ICell,
}

const GRAY_COLOR = '#949494';
const WHITE_COLOR = '#ffffff';
const FIELD_LENGTH = 20;

const getRandomCoordinate = (cellSize: number): number => Math.floor(Math.random() * FIELD_LENGTH) * cellSize;

const isSameCoordinates = (a: ICell, b: ICell) => a.x === b.x && a.y === b.y;

class Snake extends PureComponent<ISnakeProps, ISnakeState> {

  canvas = React.createRef() as React.RefObject<HTMLCanvasElement>;
  frameId: any;

  state = {
    direction: Direction.Right,
    snakeSize: 5,
    snakeCoordinates: [],
    foodCoordinates: {
      x: -100,
      y: -100,
    },
  };

  public componentDidMount() {
    this.startGame();
    this.loop();
  }

  public focusCanvas() {
    const { canvas } = this;

    if (canvas && canvas.current) {
      canvas.current.focus();
    }
  }

  public getCanvasContext(): CanvasRenderingContext2D | null {
    const { canvas } = this;

    if (canvas && canvas.current) {
      return canvas.current.getContext('2d');
    }

    return null;
  };

  public setCanvasSize() {
    const { canvas } = this;
    const { cellSize } = this.props;

    if (canvas && canvas.current) {
      canvas.current.width = cellSize * FIELD_LENGTH;
      canvas.current.height = cellSize * FIELD_LENGTH;
    }
  };

  public getCanvasSize() {
    const { canvas } = this;

    if (canvas && canvas.current) {
      const { width: canvasSize } = canvas.current.getBoundingClientRect();

      return canvasSize;
    }

    return null;
  }

  public renderSquare(x: number, y: number, color: string) {
    const ctx = this.getCanvasContext();
    const { cellSize } = this.props;

    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }

  public renderGrid() {
    const ctx = this.getCanvasContext();
    const canvasSize = this.getCanvasSize();
    const { cellSize } = this.props;

    if (ctx && canvasSize) {
      ctx.fillStyle = GRAY_COLOR;
      ctx.strokeStyle = WHITE_COLOR;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      for (let x = cellSize; x < canvasSize; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize);
      }

      for (let y = 0; y < canvasSize; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize, y);
      }

      ctx.stroke();
    }
  }

  public setInitialSnake() {
    const { snakeSize } = this.state;
    const { cellSize } = this.props;
    const snakeCoordinates = [];

    for (let i = snakeSize; i > 0; i--) {
      const part = (i - 1) * cellSize;

      snakeCoordinates.push({ x: part, y: 0 })
    }

    this.setState({ snakeCoordinates }, () => this.renderSnake());
  }

  public renderSnake() {
    const { snakeCoordinates } = this.state;

    this.renderGrid();
    this.renderFood();
    snakeCoordinates.forEach((coordinate: ICell) => this.renderSquare(coordinate.x, coordinate.y, WHITE_COLOR));
  }

  public moveSnake = () => {
    const { cellSize } = this.props;
    const { direction, foodCoordinates, snakeCoordinates } = this.state;
    let snakeSize = this.state.snakeSize;
    let { x, y } = snakeCoordinates[0] as ICell;
    let newSnakeCoordinates = [];

    switch (direction) {
      case 'right':
        x += cellSize;
        break;
      case 'left':
        x -= cellSize;
        break;
      case 'up':
        y -= cellSize;
        break;
      case 'down':
        y += cellSize;
        break;
      default:
        return;
    }

    if (isSameCoordinates({ x, y }, foodCoordinates)) {
      snakeSize++;
      newSnakeCoordinates = [ { x, y }, ...snakeCoordinates ];
      this.setFood();
    } else {
      newSnakeCoordinates = [ { x, y }, ...snakeCoordinates.slice(0, -1) ]
    }

    this.setState({
      snakeCoordinates: newSnakeCoordinates,
      direction,
      snakeSize
    }, () => this.renderSnake());
  };

  public handleKeyDown = (e: any) => {
    const { direction } = this.state;
    let newDirection = null;

    switch (e.keyCode) {
      case 37:
        if (direction !== 'left' && direction !== 'right') newDirection = Direction.Left;
        break;
      case 38:
        if (direction !== 'up' && direction !== 'down') newDirection = Direction.Up;
        break;
      case 39:
        if (direction !== 'left' && direction !== 'right') newDirection = Direction.Right;
        break;
      case 40:
        if (direction !== 'up' && direction !== 'down') newDirection = Direction.Down;
        break;
      default:
        return;
    }

    if (newDirection) {
      this.setState({
        direction: newDirection,
      }, () => this.moveSnake());
    }
  };

  public setFood() {
    const { cellSize } = this.props;
    const { snakeCoordinates } = this.state;
    const [ x, y ] = [ getRandomCoordinate(cellSize), getRandomCoordinate(cellSize) ];

    if (snakeCoordinates.some(part => isSameCoordinates({ x, y }, part))) {
      this.setFood();

    } else {
      this.setState({
        foodCoordinates: { x, y }
      });
    }
  }

  public renderFood() {
    const foodCoordinates = this.state.foodCoordinates;

    if (foodCoordinates) {
      const { x, y } = foodCoordinates;

      this.renderSquare(x, y, WHITE_COLOR);
    }
  }

  public startGame() {
    this.focusCanvas();
    this.setCanvasSize();
    this.renderGrid();
    this.setInitialSnake();
    this.setFood();
  }

  public loop = () => {
    setTimeout(() => {
      this.moveSnake();
      this.renderFood();
      this.frameId = window.requestAnimationFrame(this.loop);
    }, 100);
  };

  public render() {
    return (
      <div className="wrapper">
        <canvas onKeyDown={this.handleKeyDown} className="canvas" ref={this.canvas} tabIndex={0} />
      </div>
    );
  }
}

export default Snake;
