import React, { PureComponent } from 'react';

import './Snake.css';

interface ICell {
  x: number,
  y: number,
}

interface ISnakeProps {
  cellSize: number,
}

interface ISnakeState {
  snakeSize: number,
  snakeCoords: Array<ICell>,
  direction: string,
}

const GRAY_COLOR = '#949494';
const WHITE_COLOR = '#ffffff';

class Snake extends PureComponent<ISnakeProps, ISnakeState> {

  canvas = React.createRef() as React.RefObject<HTMLCanvasElement>;
  frameId: any;

  state = {
    snakeSize: 5,
    snakeCoords: [],
    direction: 'right',
  };

  public componentDidMount() {
    this.focusCanvas();
    this.setCanvasSize();
    this.renderGrid();
    this.setInitialSnake();
    this.startGame();
  }

  public focusCanvas() {
    const { canvas } = this;

    if (canvas && canvas.current) {
      canvas.current.focus();
    }
  }

  public getCanvasContext() {
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
      canvas.current.width = cellSize * 20;
      canvas.current.height = cellSize * 20;
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
    const snakeCoords = [];

    for (let i = snakeSize; i > 0; i--) {
      const part = (i - 1) * cellSize;

      snakeCoords.push({ x: part, y: 0 })
    }

    this.setState({ snakeCoords }, () => this.renderSnake());
  }

  public renderSnake() {
    const { snakeCoords } = this.state;

    this.renderGrid();
    snakeCoords.forEach((coord: ICell) => this.renderSquare(coord.x, coord.y, WHITE_COLOR));
  }

  public moveSnake = () => {
    const { cellSize } = this.props;
    const { direction } = this.state;
    const snakeCoordsWithoutTail = this.state.snakeCoords.slice(0, -1);
    let { x, y } = snakeCoordsWithoutTail[0] as ICell;

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

    this.setState({
      snakeCoords: [{ x, y }, ...snakeCoordsWithoutTail],
      direction
    }, () => this.renderSnake());
  };

  handleKeyDown = (e: any) => {
    const { direction } = this.state;
    let newDirection = null;

    if (this.frameId) {
      clearTimeout(this.frameId);
    }

    switch (e.keyCode) {
      case 37:
        if (direction !== 'left' && direction !== 'right') newDirection = 'left';
        break;
      case 38:
        if (direction !== 'up' && direction !== 'down') newDirection = 'up';
        break;
      case 39:
        if (direction !== 'left' && direction !== 'right') newDirection ='right';
        break;
      case 40:
        if (direction !== 'up' && direction !== 'down') newDirection = 'down';
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

  startGame = () => {
    setTimeout(() => {
      this.moveSnake();
      this.frameId = window.requestAnimationFrame(this.startGame);
    }, 100);
  };

  render() {
    return (
      <div className="wrapper">
        <canvas onKeyDown={this.handleKeyDown} className="canvas" ref={this.canvas} tabIndex={0} />
      </div>
    );
  }
}

export default Snake;
