const actions = {
  idle: Array.from({ length: 9 }, (_, i) => `idle0${i + 1}.png`),
  run: Array.from({ length: 8 }, (_, i) => `run0${i + 1}.png`),
  jump: [
    ...Array.from({ length: 2 }, (_, i) => `jump_start0${i + 1}.png`),
    ...Array.from({ length: 4 }, (_, i) => `jump_mid0${i + 1}.png`),
    ...Array.from({ length: 4 }, (_, i) => `jump_mid0${i + 1}.png`),
    "jump_landing.png",
  ],
  slide: [
    ...Array.from({ length: 2 }, (_, i) => `slide_start0${i + 1}.png`),
    ...Array.from({ length: 8 }, (_, i) => `slide.png`),
    ...Array.from({ length: 2 }, (_, i) => `slide_end0${i + 1}.png`),
  ],
};

let frameIndex = 0;
let currentAction = "idle";
let direction = "right"; // 'right' or 'left'
let isRunning = false; // Tracks if the user is running
let isJumping = false; // Tracks if the user is jumping

function updateFigureAnimation() {
  const figure = document.getElementById("figure");

  // Update the frame index
  frameIndex = (frameIndex + 1) % actions[currentAction].length;

  if (currentAction === "slide") {
    figure.src = `/Media/Sprites/Gino Character/PNG/Slide/${actions[currentAction][frameIndex]}`;
  } else {
    // Update the source of the image
    figure.src = `/Media/Sprites/Gino Character/PNG/Idle, run, jump/${actions[currentAction][frameIndex]}`;
  }

  // Flip the image based on the direction
  figure.style.transform = direction === "right" ? "scaleX(1)" : "scaleX(-1)";

  // If the action is "jump" and we reach the end, switch back to "idle" or "run"
  if (
    (currentAction === "jump" || currentAction === "slide") &&
    frameIndex === 0
  ) {
    currentAction = isRunning ? "run" : "idle";
  }
}

// Smoothly handle updates with a shorter interval for responsive animation
// setInterval(updateFigureAnimation, 100);
requestAnimationFrame(updateFigureAnimation);



// Enemy Animation

const enemyActions = {
  fly: Array.from({ length: 7 }, (_, i) => `fly0${i + 1}.png`),
}

let enemyFrameIndex = 0;
let enemyCurrentAction = "fly";
let enemyDirection = "right"; // 'right' or 'left'

function updateEnemyAnimation() {
  const enemy = document.getElementById("enemy");

  // Update the frame index
  enemyFrameIndex = (enemyFrameIndex + 1) % enemyActions[enemyCurrentAction].length;

  // Update the source of the image
  enemy.src = `/Media/Sprites/Enemy01/${enemyActions[enemyCurrentAction][enemyFrameIndex]}`;

  // Flip the image based on the direction
  enemy.style.transform = enemyDirection === "right" ? "scaleX(1)" : "scaleX(-1)";
}

//setInterval(updateEnemyAnimation, 100);
requestAnimationFrame(updateEnemyAnimation);


// Coin Animation

const coinActions = {
  spin: Array.from({ length: 4 }, (_, i) => `Coin0${i + 1}.png`),
}


let coinFrameIndex = 0;
let coinCurrentAction = "spin";

function updateCoinAnimation() {

  const coins = document.getElementsByClassName("coin");

  // Update the frame index
  coinFrameIndex = (coinFrameIndex + 1) % coinActions[coinCurrentAction].length;

  for (let coin of coins) {
  // Update the source of the image
  coin.src = `/Media/free-swamp-game-tileset-pixel-art/4 Animated objects/${coinActions[coinCurrentAction][coinFrameIndex]}`;
  }
}

// setInterval(updateCoinAnimation, 100);
requestAnimationFrame(updateCoinAnimation);