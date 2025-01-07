const platforms = []; // Define the platforms array
const coins = []; // Define the coins array
const levelStack = []; // this will be used to keep track of the levels state when the player goes to the next level
let indexlevel = 1; // this will be used to keep track of the current level
let startTime;
let currentScore = 0;

// Function to create a dynamic matrix based on the game container's dimensions
function createDynamicMatrix(containerWidth, containerHeight) {
  const tileSize = Math.min(containerWidth, containerHeight) / 15; // Adjust the divisor to fit your needs
  const rows = Math.floor(containerHeight / tileSize);
  const cols = Math.floor(containerWidth / tileSize);
  const matrix = [];

  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      rowArray.push(0); // Initialize with 0
    }
    matrix.push(rowArray);
  }

  return { matrix, tileSize, rows, cols };
}

// Function to add tiles based on a matrix
function addTiles(matrix, tileSize) {
  const gameContainer = document.getElementById("game-container");

  matrix.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (tile !== 0) {
        const tileElement = document.createElement("img");
        tileElement.src =
          `/Media/free-swamp-game-tileset-pixel-art/1 Tiles/Tile_` +
          String(tile).padStart(2, "0") +
          ".png";
        tileElement.className = "tile";
        tileElement.style.position = "absolute";
        tileElement.style.width = `${tileSize}px`;
        tileElement.style.height = `${tileSize}px`;
        tileElement.style.left = `${colIndex * tileSize}px`;
        tileElement.style.top = `${rowIndex * tileSize}px`;
        gameContainer.appendChild(tileElement);

        // Add the platform to the platforms array for collision detection
        platforms.push({
          top: rowIndex * tileSize,
          left: colIndex * tileSize,
          bottom: rowIndex * tileSize + tileSize,
          right: colIndex * tileSize + tileSize,
          width: tileSize,
          height: tileSize,
        });
      }
    });
  });
}

function addCoins(matrix, tileSize) {
  const gameContainer = document.getElementById("game-container");

  matrix.forEach((row, rowIndex) => {
    row.forEach((coin, colIndex) => {
      if (coin !== 0 && coin === -1) {
        const coinElement = document.createElement("img");
        coinElement.className = "coin";
        coinElement.style.left = `${colIndex * tileSize}px`;
        coinElement.style.top = `${rowIndex * tileSize}px`;
        gameContainer.appendChild(coinElement);

        coins.push({
          top: rowIndex * tileSize,
          left: colIndex * tileSize,
          bottom: rowIndex * tileSize + tileSize,
          right: colIndex * tileSize + tileSize,
          width: 15,
          height: 15,
          element: coinElement,
        });
      }
    });
  });
}

function removeCoin(coinElement) {
  coinElement.remove();
  const scoreElement = document.getElementById("score");
  let scoreNumber = parseInt(scoreElement.textContent.split(" ")[1]) + 1;
  scoreUpdate(scoreNumber, scoreElement);
}

function scoreUpdate(score, scoreElement) {
  scoreElement.textContent = "Score: " + score;
  currentScore = score;
}

function InitializeHearts() {
  const hearts = document.getElementById("hearts");
  // clean all the hearts if there are any
  while (hearts.firstChild) {
    hearts.removeChild(hearts.firstChild);
  }
  // add 3 hearts
  for (let i = 0; i < 3; i++) {
    const heartElement = document.createElement("img");
    heartElement.src = "/Media/Animation 128 x 128.gif";
    heartElement.style.width = "30px";
    heartElement.style.height = "30px";
    heartElement.style.position = "absolute";
    heartElement.style.right = `${i * 30}px`;
    heartElement.style.top = `0px`;
    hearts.appendChild(heartElement);
  }
}

function removeHeart() {
  const hearts = document.getElementById("hearts");
  hearts.removeChild(hearts.lastElementChild);
  if (hearts.childElementCount === 0) {
    const score = document.getElementById("score");
    const scoreElement = document.getElementById("score");
    scoreUpdate(0, scoreElement);
    return false;
  }
  return true;
}

function cleanGameBoard(levelIndex) {
  const gameContainer = document.getElementById("game-container");
  // if the levelStack is empty or the levelIndex is greater than the length of the levelStack
  if (!levelStack[levelIndex]) {
    levelStack.push([]); // push an empty array to the levelStack for the new level
  }
  for (let i = 0; i < gameContainer.childElementCount; i++) {
    // insert all the children of the game container into the levelStack
    // remove all the children of the game container except for the hearts , score and the figure
    if (
      gameContainer.children[i].id !== "hearts" &&
      gameContainer.children[i].id !== "enemy" &&
      gameContainer.children[i].id !== "figure"
    ) {
      levelStack[levelIndex].push(gameContainer.children[i]);
      gameContainer.removeChild(gameContainer.children[i]);
      platforms.splice(i, 1); // remove the platform from the platforms array
      i--; // decrement the index to handle the change in the children list
    }
  }
}

function reloadGameBoard(levelIndex) {
  cleanGameBoard(levelIndex + 1);
  const gameContainer = document.getElementById("game-container");
  for (let i = 0; i < levelStack[levelIndex].length; i++) {
    gameContainer.appendChild(levelStack[levelIndex][i]);
    platforms.push({
      top: levelStack[levelIndex][i].offsetTop,
      left: levelStack[levelIndex][i].offsetLeft,
      bottom:
        levelStack[levelIndex][i].offsetTop +
        levelStack[levelIndex][i].offsetHeight,
      right:
        levelStack[levelIndex][i].offsetLeft +
        levelStack[levelIndex][i].offsetWidth,
      width: levelStack[levelIndex][i].offsetWidth,
      height: levelStack[levelIndex][i].offsetHeight,
    });
  }
}

function createLevelOne(matrix, tileSize, rows, cols) {
  for (let i = 0; i < cols; i++) {
    // ground

    for (let i = 0; i < 14; i++) {
      matrix[rows - 1][i] = 12;
    }
    for (let i = 0; i < 5; i++) {
      matrix[rows - 2][i] = 2;
    }

    for (let i = 6; i < 14; i++) {
      matrix[rows - 2][i] = 12;
    }
    matrix[rows - 1][14] = 13;
    matrix[rows - 2][14] = 13;
    matrix[rows - 2][5] = 26;
    matrix[rows - 3][5] = 11;
    matrix[rows - 4][5] = 1;

    for (let i = 6; i < 14; i++) {
      matrix[rows - 4][i] = 25;
      matrix[rows - 3][i] = 12;
    }

    matrix[rows - 3][14] = 13;
    matrix[rows - 4][14] = 3;
    // vertical wall
    for (let i = 11; i < rows; i++) {
      matrix[i][cols - 1] = 12;
      matrix[i][cols - 2] = 11;
    }

    for (let i = 10; i < rows - 4; i++) {
      matrix[i][cols - 1] = 2;
      matrix[i][cols - 2] = 1;
    }
  }

  // Add tiles based on the matrix
  addTiles(matrix, tileSize);

  for (let i = 7; i < cols - 6; i++) {
    matrix[rows - 5][i] = -1;
  }

  addCoins(matrix, tileSize);
  InitializeHearts();
}

function createLevelTwo(matrix, tileSize, rows, cols) {
  for (let i = 0; i < cols; i++) {
    // ground

    for (let i = 0; i < 14; i++) {
      matrix[rows - 1][i] = 12;
    }
    for (let i = 0; i < 5; i++) {
      matrix[rows - 2][i] = 2;
    }

    for (let i = 0; i < 15; i++) {
      matrix[rows - 9][i] = 9;
    }

    for (let i = 6; i < 14; i++) {
      matrix[rows - 2][i] = 12;
    }
    matrix[rows - 1][14] = 13;
    matrix[rows - 2][14] = 13;
    matrix[rows - 2][5] = 26;
    matrix[rows - 3][5] = 11;
    matrix[rows - 4][5] = 1;

    for (let i = 6; i < 14; i++) {
      matrix[rows - 4][i] = 25;
      matrix[rows - 3][i] = 12;
    }

    matrix[rows - 3][14] = 13;
    matrix[rows - 4][14] = 3;
    // vertical wall
    for (let i = 11; i < rows; i++) {
      matrix[i][cols - 1] = 12;
      matrix[i][cols - 2] = 11;
    }

    for (let i = 10; i < rows - 4; i++) {
      matrix[i][cols - 1] = 2;
      matrix[i][cols - 2] = 1;
    }
  }

  // Add tiles based on the matrix
  addTiles(matrix, tileSize);

  // for an arch of coins we need to add the coins in a circular pattern
  matrix[rows - 5][14] = -1;
  matrix[rows - 6][15] = -1;
  matrix[rows - 7][16] = -1;
  matrix[rows - 7][17] = -1;
  matrix[rows - 6][18] = -1;

  matrix[rows - 4][3] = -1;
  matrix[rows - 5][4] = -1;
  matrix[rows - 6][5] = -1;
  matrix[rows - 6][6] = -1;
  matrix[rows - 5][7] = -1;

  addCoins(matrix, tileSize);
}

function createLevelThree(matrix, tileSize, rows, cols) {
  // ground
  matrix[rows - 2][0] = 2;
  matrix[rows - 1][0] = 12;
  for (let i = 1; i < 3; i++) {
    matrix[rows - 1][i] = 12;
    matrix[rows - 2][i] = 2;
  }
  matrix[rows - 2][3] = 3;
  matrix[rows - 1][3] = 14;

  matrix[rows - 1][6] = 11;
  matrix[rows - 2][6] = 11;
  matrix[rows - 3][6] = 11;
  matrix[rows - 4][6] = 1;

  matrix[rows - 1][7] = 13;
  matrix[rows - 2][7] = 13;
  matrix[rows - 3][7] = 13;
  matrix[rows - 4][7] = 3;

  matrix[rows - 1][10] = 11;
  matrix[rows - 2][10] = 11;
  matrix[rows - 3][10] = 11;
  matrix[rows - 4][10] = 11;
  matrix[rows - 5][10] = 11;
  matrix[rows - 6][10] = 1;

  matrix[rows - 1][11] = 12;
  matrix[rows - 2][11] = 12;
  matrix[rows - 3][11] = 12;
  matrix[rows - 4][11] = 12;
  matrix[rows - 5][11] = 12;
  matrix[rows - 6][11] = 2;

  matrix[rows - 1][12] = 13;
  matrix[rows - 2][12] = 13;
  matrix[rows - 3][12] = 13;
  matrix[rows - 4][12] = 13;
  matrix[rows - 5][12] = 13;
  matrix[rows - 6][12] = 3;

  matrix[rows - 1][15] = 11;
  matrix[rows - 2][15] = 11;
  matrix[rows - 3][15] = 11;
  matrix[rows - 4][15] = 11;
  matrix[rows - 5][15] = 11;
  matrix[rows - 6][15] = 11;
  matrix[rows - 7][15] = 11;
  matrix[rows - 8][15] = 1;

  for (let i = 16; i < 20; i++) {
    matrix[rows - 1][i] = 12;
    matrix[rows - 2][i] = 12;
    matrix[rows - 3][i] = 12;
    matrix[rows - 4][i] = 12;
    matrix[rows - 5][i] = 12;
    matrix[rows - 6][i] = 12;
    matrix[rows - 7][i] = 12;
  }

  for (let i = 1; i < 5; i++) {
    matrix[7][cols - i] = 2;
  }

  addTiles(matrix, tileSize);

  // for an arch of coins we need to add the coins in a circular pattern

  matrix[rows - 4][2] = -1;
  matrix[rows - 5][3] = -1;
  matrix[rows - 6][4] = -1;
  matrix[rows - 6][5] = -1;
  matrix[rows - 5][6] = -1;

  matrix[rows - 8][11] = -1;
  matrix[rows - 9][12] = -1;
  matrix[rows - 10][13] = -1;
  matrix[rows - 10][14] = -1;
  matrix[rows - 9][15] = -1;

  addCoins(matrix, tileSize);
}

function initializeGame(levelIndex) {
  const gameContainer = document.getElementById("game-container");
  const containerWidth = gameContainer.clientWidth;
  const containerHeight = gameContainer.clientHeight;

  // Reset the keys object
  // Create a dynamic matrix based on the game container's dimensions
  const { matrix, tileSize, rows, cols } = createDynamicMatrix(
    containerWidth,
    containerHeight
  );
  currentAction = "idle";

  cleanGameBoard(levelIndex - 1);

  switch (levelIndex) {
    case 1:
      startTime = new Date().getTime();
      createLevelOne(matrix, tileSize, rows, cols);
      break;
    case 2:
      createLevelTwo(matrix, tileSize, rows, cols);
      break;
    case 3:
      createLevelThree(matrix, tileSize, rows, cols);
      break;
    default:
      break;
  }
}
