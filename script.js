"use strict";

// Dom declartion
const game = document.getElementById("snake-game");
const applesCount = document.getElementById("apples");
const restarBtn = document.getElementById("restart");
const ctx = game.getContext("2d");
const highScoreApples = document.getElementById("apples-highscore");

// Keys handling
let keyPressed;
let facing = "d";

// Sizes
const snakeSize = 20;
const appleSize = 20;

// Speed
const snakeSpeed = snakeSize;
const gameSpeed = 75;

// Timers and counters
let apples = 0;
let appleTimer = 0;
let highScore = 0;
let gamePaused = false;
let snakeMove = true;

setInterval(function () {
  if (gamePaused) return;
  appleTimer++;
}, 1000);

// Canvas Setup
game.width = 500;
game.height = 500;

class Snake {
  constructor(snakeArr) {
    this.structure = snakeArr;
    this.dx = snakeSpeed;
    this.dy = 0;
  }

  increment() {
    const newPart = {};
    const lastPart = this.structure[this.structure.length - 1];
    if (facing === "a") {
      newPart.x = lastPart.x + snakeSize;
      newPart.y = lastPart.y;
    } else if (facing === "d") {
      newPart.x = lastPart.x - snakeSize;
      newPart.y = lastPart.y;
    } else if (facing === "w") {
      newPart.x = lastPart.x;
      newPart.y = lastPart.y + snakeSize;
    } else if (facing === "s") {
      newPart.x = lastPart.x;
      newPart.y = lastPart.y - snakeSize;
    }

    this.structure.push(newPart);
    apples++;
  }
}

class Apple {
  constructor() {
    this.x = Math.trunc(Math.random() * (game.width - appleSize));
    this.y = Math.trunc(Math.random() * (game.height - appleSize));
  }

  generateRandom() {
    this.x = Math.trunc(Math.random() * (game.width - appleSize));
    this.y = Math.trunc(Math.random() * (game.height - appleSize));
    this.generate();
    appleTimer = 0;
  }

  generate() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, appleSize, appleSize);
  }
}

function backgroundInit() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, game.width, game.height);
}

function draw() {
  backgroundInit();
  drawSnakeSeg();
  apple.generate();
  const snakeHead = { x: snake.structure[0].x, y: snake.structure[0].y };
  let headRangeX = snakeHead.x + snakeSize / 2;
  let headRangeY = snakeHead.y + snakeSize / 2;

  // if (snakeHead.x < apple.x) headRangeX = snakeHead.x + snakeSize;
  // if (snakeHead.x > apple.x) headRangeX = snakeHead.x;
  // if (snakeHead.y < apple.y) headRangeY = snakeHead.y + snakeSize;
  // if (snakeHead.y < apple.y) headRangeY = snakeHead.y;

  // console.log("x:", headRangeX, apple.x);
  // console.log("y:", headRangeY, apple.y);

  if (appleTimer === 5) {
    apple.generateRandom();
  }

  //   Adding boundaries
  if (
    snakeHead.x <= 0 ||
    snakeHead.x >= game.width ||
    snakeHead.y <= 0 ||
    snakeHead.y >= game.height
  ) {
    endGame();
  }
  if (gamePaused) return;

  // Checking if i bite my tail
  for (let i = 1; i < snake.structure.length; i++) {
    const checkX = snake.structure[i].x;
    const checkY = snake.structure[i].y;
    if (snakeHead.x === checkX && snakeHead.y === checkY) {
      endGame();
    }
  }
  if (gamePaused) return;

  // Collissions for apple
  if (
    headRangeX >= apple.x &&
    headRangeX <= apple.x + appleSize &&
    headRangeY >= apple.y &&
    headRangeY <= apple.y + appleSize
  ) {
    apple.generateRandom();
    snake.increment();
  }

  update();
  updateApple();
}

function update() {
  if (gamePaused) return;
  const head = {
    x: snake.structure[0].x + snake.dx,
    y: snake.structure[0].y + snake.dy,
  };
  snake.structure.unshift(head);
  snake.structure.pop();
}

function updateApple() {
  applesCount.textContent = `${apples} 🍏`;
  highScoreApples.textContent = `${highScore} 🍎`;
}

function drawSnakeSeg() {
  ctx.fillStyle = "green";
  ctx.strokeStyle = "darkgreen";
  snake.structure.forEach((seg) =>
    ctx.fillRect(seg.x, seg.y, snakeSize, snakeSize)
  );
  snake.structure.forEach((seg) =>
    ctx.strokeRect(seg.x, seg.y, snakeSize, snakeSize)
  );
}

function movement(e) {
  let faceSide = e.key;
  if (gamePaused) {
    faceSide = "d";
  }

  switch (faceSide) {
    case "a":
      if (facing === "d") break;
      keyPressed = "a";
      snake.dx = -snakeSpeed;
      snake.dy = 0;
      facing = "a";
      break;
    case "s":
      if (facing === "w") break;
      keyPressed = "s";
      snake.dx = 0;
      snake.dy = snakeSpeed;
      facing = "s";
      break;
    case "d":
      if (facing === "a") break;
      keyPressed = "d";
      snake.dx = snakeSpeed;
      snake.dy = 0;
      facing = "d";
      break;
    case "w":
      if (facing === "s") break;
      keyPressed = "w";
      snake.dx = 0;
      snake.dy = -snakeSpeed;
      facing = "w";
      break;
  }
}

function endGame() {
  clearInterval(gameInterval);
  if (highScore < apples) highScore = apples;
  gamePaused = true;
  facing = "d";
  movement("d");
}

function init() {
  if (!gamePaused) return;
  snake.structure = [
    { x: game.width / 2, y: game.height / 2 },
    { x: game.width / 2 - snakeSize, y: game.height / 2 },
    { x: game.width / 2 - 2 * snakeSize, y: game.height / 2 },
    { x: game.width / 2 - 3 * snakeSize, y: game.height / 2 },
    { x: game.width / 2 - 4 * snakeSize, y: game.height / 2 },
    { x: game.width / 2 - 5 * snakeSize, y: game.height / 2 },
  ];
  apples = 0;
  updateApple();
  apple.generateRandom();
  gameInterval = setInterval(draw, gameSpeed);
  gamePaused = false;
}

const snakeArr = [
  { x: game.width / 2, y: game.height / 2 },
  { x: game.width / 2 - snakeSize, y: game.height / 2 },
  { x: game.width / 2 - 2 * snakeSize, y: game.height / 2 },
  { x: game.width / 2 - 3 * snakeSize, y: game.height / 2 },
  { x: game.width / 2 - 4 * snakeSize, y: game.height / 2 },
  { x: game.width / 2 - 5 * snakeSize, y: game.height / 2 },
];
const snake = new Snake(snakeArr);
const apple = new Apple();

// Starting the game
backgroundInit();
apple.generate();
let gameInterval = setInterval(draw, gameSpeed);

// Adding movability
window.addEventListener("keypress", movement);

restarBtn.addEventListener("click", init);
