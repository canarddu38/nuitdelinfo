import React, {  useState, useEffect } from 'react'
import './Snake.css'
let grid: number[][];
let flag: boolean = true;
const WIDTH: number = 15;
const HEIGHT: number = 10;
const START_X: number = 2;
const START_Y: number = 2;
const GAME_SPEED = 250 // ms

type Direction = 'top' | 'bot' | 'left' | 'right';

const TOP: Direction = 'top';
const BOT: Direction = 'bot';
const LEFT: Direction = 'left';
const RIGHT: Direction = 'right';

const TOP_OFFSET: number = -1;
const BOT_OFFSET: number = 1;
const LEFT_OFFSET: number = -1;
const RIGHT_OFFSET: number = 1;

let headDir: Direction = RIGHT;
let headRotate: boolean = false;
let score: number = 0;
let level: number = 1;
let gameWon: boolean = false;

let touchStartX: number | null = null;
let touchStartY: number | null = null;
const TOUCH_THRESHOLD = 20;
type GameState = {
  dir: Direction
  x: number
  y: number
  x_last: number
  y_last: number
  x_bonus: number
  y_bonus: number
  player_length: number
};

function setup_listener(state: GameState) {
  document.addEventListener('keydown', function (event: KeyboardEvent) {
    if (!flag)
      return;
    switch (event.key) {
      case 'ArrowUp':
        if (state.dir !== BOT) {
          state.dir = TOP;
          headDir = TOP;
          headRotate = true;
          setTimeout(() => { headRotate = false }, 80);
        }
        event.preventDefault();
        flag = false;
        break;
      case 'ArrowDown':
        if (state.dir !== TOP) {
          state.dir = BOT;
          headDir = BOT;
          headRotate = true;
          setTimeout(() => { headRotate = false }, 80);
        }
        event.preventDefault();
        flag = false;
        break;
      case 'ArrowLeft':
        if (state.dir !== RIGHT) {
          state.dir = LEFT;
          headDir = LEFT;
          headRotate = true;
          setTimeout(() => { headRotate = false }, 80);
        }
        event.preventDefault();
        flag = false;
        break;
      case 'ArrowRight':
        if (state.dir !== LEFT) {
          state.dir = RIGHT;
          headDir = RIGHT;
          headRotate = true;
          setTimeout(() => { headRotate = false }, 80);
        }
        event.preventDefault();
        flag = false;
        break;
    }
    console.log("direction : " + state.dir);
  });

  document.addEventListener('touchstart', function (e: TouchEvent) {
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener('touchend', function (e: TouchEvent) {
    if (touchStartX === null || touchStartY === null) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    touchStartX = null;
    touchStartY = null;

    if (Math.abs(dx) < TOUCH_THRESHOLD && Math.abs(dy) < TOUCH_THRESHOLD) {
      return;
    }

    if (!flag)
      return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && state.dir !== LEFT) {
        state.dir = RIGHT;
        headDir = RIGHT;
        headRotate = true;
        setTimeout(() => { headRotate = false }, 80);
      } else if (dx < 0 && state.dir !== RIGHT) {
        state.dir = LEFT;
        headDir = LEFT;
        headRotate = true;
        setTimeout(() => { headRotate = false }, 80);
      } else {
        return;
      }
    } else {
      // vertical
      if (dy > 0 && state.dir !== TOP) {
        state.dir = BOT;
        headDir = BOT;
        headRotate = true;
        setTimeout(() => { headRotate = false }, 80);
      } else if (dy < 0 && state.dir !== BOT) {
        state.dir = TOP;
        headDir = TOP;
        headRotate = true;
        setTimeout(() => { headRotate = false }, 80);
      } else {
        return;
      }
    }

    flag = false;
    console.log("touch direction : " + state.dir);
  }, { passive: true });
}

function move(state: GameState) {
  state.x_last = state.x;
  state.y_last = state.y;

  switch (state.dir) {
    case TOP:
      state.y += TOP_OFFSET;
      break;
    case BOT:
      state.y += BOT_OFFSET;
      break;
    case LEFT:
      state.x += LEFT_OFFSET;
      break;
    case RIGHT:
      state.x += RIGHT_OFFSET;
      break;
  }
}

function setupBonus(state: GameState, grid: number[][]) {
  while (true) {
    let x_bonus = Math.floor(Math.random() * WIDTH);
    let y_bonus = Math.floor(Math.random() * HEIGHT);
    if (grid[y_bonus][x_bonus] == 0) {
      state.x_bonus = x_bonus;
      state.y_bonus = y_bonus;
      grid[y_bonus][x_bonus] = -1;
      break;
    }
  }
}

function snake_shift(state: GameState, grid: number[][]) {
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      if (grid[i][j] > 0) {
        grid[i][j] -= 1;
      }
    }
  }
  console.log('tete x:' + state.x + 'queue x:' + state.x_last);
  grid[state.y][state.x] = state.player_length;
}
function check_pos(pos: GameState, grid: number[][]): number {
  if (pos.x < 0 || pos.x > WIDTH - 1)
    return 0;
  if (pos.y < 0 || pos.y > HEIGHT - 1)
    return 0;
  if (grid[pos.y][pos.x] > 0)
    return 0;
  return 1;
}

function snake(): void {
  let state: GameState = {
    dir: RIGHT,
    x: START_X,
    y: START_Y,
    x_last: START_X - 1,
    y_last: START_Y,
    x_bonus: -1,
    y_bonus: -1,
    player_length: 2
  };
  headDir = state.dir;

  score = 0;
  level = 1;
  gameWon = false;

  grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));

  for (let i = 0; i < state.player_length; i++) {
    grid[START_Y][START_X - i] = state.player_length - i;
  }
  setupBonus(state, grid);

  setup_listener(state);

  const gameLoop = setInterval(() => {
    move(state);
    if (!check_pos(state, grid)) {
      console.log("💀 GAME OVER !");
      clearInterval(gameLoop);
      return;
    }
    if (grid[state.y][state.x] < 0) {
      score += 1;

      let levelUp = false;
      if (level === 1 && score >= 10) {
        level = 2;
        levelUp = true;
      } else if (level === 2 && score >= 15) {
        level = 3;
        levelUp = true;
      } else if (level === 3 && score >= 20)   {
        gameWon = true;
        clearInterval(gameLoop);
        return;
      }

      if (levelUp) {
        score = 0;
        state.x = START_X;
        state.y = START_Y;
        state.dir = RIGHT;
        headDir = RIGHT;
        state.player_length = 2;
        grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
        for (let i = 0; i < state.player_length; i++) {
          grid[START_Y][START_X - i] = state.player_length - i;
        }
        setupBonus(state, grid);
        flag = true;
        return;
      }

      state.player_length += 1;
      setupBonus(state, grid);
      for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH; j++) {
          if (grid[i][j] > 0) {
            grid[i][j] += 1;
          }
        }
      }
    }

    snake_shift(state, grid)
    headDir = state.dir;
    flag = true;
  }, GAME_SPEED);
}

function Snake() {
  const initialGrid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0))
  const [renderGrid, setRenderGrid] = useState<number[][]>(initialGrid)
  const [scoreState, setScoreState] = useState<number>(0)
  const [levelState, setLevelState] = useState<number>(1)
  const [won, setWon] = useState<boolean>(false)

  useEffect(() => {
    snake()

    const id = window.setInterval(() => {
      if (!grid) return
      const copy = grid.map(row => row.slice())
      setRenderGrid(copy)
      setScoreState(score)
      setLevelState(level)
      setWon(gameWon)
    }, 80)

    return () => {
      clearInterval(id)
    }
  }, [])

  return (
    <>
      <h2>Snake Game</h2>
      <div>Level: {levelState} | Score: {scoreState}</div>
      {won && <div className="win-message">BRAVO</div>}
      <div className={`game-board level-${levelState}`}>
        {renderGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => {
              const maxVal = Math.max(0, ...renderGrid.flat())
              const isHead = cell > 0 && cell === maxVal
              const headDirClass = isHead ? `head-${headDir}` : ''
              const rotatingClass = isHead && headRotate ? 'rotating' : ''
              return (
                <div
                  key={colIndex}
                  className={`cell ${cell > 0
                    ? (isHead ? `snake-head ${headDirClass} ${rotatingClass}` : 'snake')
                    : cell < 0
                      ? 'snake-bonus'
                      : ''
                    }`}
                ></div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}

export default Snake;