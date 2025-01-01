document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  const gameContainer = document.getElementById("game-container");
  const scoreDisplay = document.getElementById("score");
  const jumpVelocity = 10;
  const moveSpeed = 5;
  let startTime = Date.now();
  let collectedCoins = new Set();
  let gravity = -0.5;
  let isJumping = false;
  let isFalling = false;
  let velocity = 0;
  let keys = {};
  let currentLevel = 0;
  let hearts = 3;
  let score = 0;

  const levels = [
    {
      // Level 1
      platforms: [
        { bottom: "70%", left: "0", width: "100%", height: "30vh" },
        { bottom: "0%", right: "0", width: "43vw", height: "45vh" },
        { bottom: "0%", left: "0", width: "43vw", height: "45vh" },
        {
          bottom: "0%",
          left: "43vw",
          width: "35vh",
          height: "45vh",
          id: "trick",
          border: "1px solid transparent",
          borderTop: "1px solid darkred",
        },
      ],
      spikes: [],
      coins: [
        { bottom: "50vh", left: "30vw" },
        { bottom: "50vh", left: "40vw" },
        { bottom: "50vh", left: "50vw" },
        { bottom: "50vh", left: "60vw" },
        { bottom: "50vh", left: "70vw" },
      ],
      endDoor: [{ bottom: "45vh", left: "80vw" }],
    },
    {
      // Level 2
      platforms: [
        { bottom: "2vh", left: "2vh", width: "10vw", height: "5vh" },
        { bottom: "12vh", left: "20vw", width: "10vw", height: "5vh" },
        { bottom: "22vh", left: "40vw", width: "10vw", height: "5vh" },
        { bottom: "32vh", left: "60vw", width: "10vw", height: "5vh" },
        // now there's a few hidden platforms that will appear
        // when the player gets close to the endDoor(which will be a trick)
        {
          bottom: "12vh",
          left: "75vw",
          width: "10vw",
          height: "5vh",
          visibility: "hidden",
          id: "movingPlatform",
        },
        {
          bottom: "42vh",
          left: "40vw",
          width: "10vw",
          height: "5vh",
          visibility: "hidden",
          id: "movingPlatform",
        },
        {
          bottom: "62vh",
          left: "60vw",
          width: "10vw",
          height: "5vh",
          visibility: "hidden",
        },
        {
          bottom: "72vh",
          left: "80vw",
          width: "10vw",
          height: "5vh",
          visibility: "hidden",
        },
      ],
      spikes: [],
      coins: [
        { bottom: "12vh", left: "20vw" },
        { bottom: "22vh", left: "50vw" },
        { bottom: "32vh", left: "15vw" },
        { bottom: "42vh", left: "65vw" },
      ],
      endDoor: [
        { bottom: "47vh", left: "81.8vw", id: "trick" },
        { bottom: "77vh", left: "81.8vw", visibility: "hidden" },
      ],
    },
    // level 3 (
    {
      platforms: [
        { bottom: "20vh", left: "2vh", width: "10vw", height: "5vh" },
        { bottom: "50vh", left: "2vh", width: "10vw", height: "5vh" },

        { bottom: "20vh", left: "20vw", width: "10vw", height: "5vh" },
        { bottom: "50vh", left: "20vw", width: "10vw", height: "5vh" },

        { bottom: "20vh", left: "40vw", width: "10vw", height: "5vh" },
        { bottom: "50vh", left: "40vw", width: "10vw", height: "5vh" },

        { bottom: "20vh", left: "60vw", width: "10vw", height: "5vh" },
        { bottom: "50vh", left: "60vw", width: "10vw", height: "5vh" },

        { bottom: "20vh", left: "80vw", width: "10vw", height: "5vh" },
        { bottom: "50vh", left: "80vw", width: "10vw", height: "5vh" },
      ],
      spikes: [],
      coins: [
        { bottom: "25vh", left: "2vh" },
        { bottom: "45vh", left: "2vh" },

        { bottom: "25vh", left: "20vw" },
        { bottom: "45vh", left: "20vw" },

        { bottom: "25vh", left: "40vw" },
        { bottom: "45vh", left: "40vw" },

        { bottom: "25vh", left: "60vw" },
        { bottom: "45vh", left: "60vw" },

        { bottom: "25vh", left: "80vw" },
        { bottom: "45vh", left: "80vw" },
      ],
      endDoor: [{ bottom: "50vh", left: "90vw" }],
    },
  ];

  gravityMap = {
    0: -0.5,
    1: 0.5,
    2: -0.5,
    3: 0.5,
    4: -0.5,
    5: 0.5,
  };

function loadLevel(levelIndex) {
  // Clear the game container
  gameContainer.innerHTML = "";

  // Add the hearts
  for (let i = 0; i < hearts; i++) {
    const heart = document.createElement("img");
    heart.src = "https://www.playhearts-online.com/images/heart.png";
    heart.className = "heart";
    heart.style.width = "30px";
    heart.style.left = `${i * 30}px`;
    heart.style.position = "absolute";
    heart.style.zIndex = "2";
    gameContainer.appendChild(heart);
  }

  gameContainer.appendChild(player);
  scoreDisplay.textContent = `Score: ${score}`;
  gameContainer.appendChild(scoreDisplay);

  const level = levels[levelIndex];

  level.platforms.forEach((platform) => {
    const platformElement = document.createElement("div");
    platformElement.className = "platform";
    if (platform.id) {
      platformElement.id = platform.id;
      platformElement.style.visibility = "visible"; // Reset visibility
    }
    Object.assign(platformElement.style, platform);
    gameContainer.appendChild(platformElement);
  });

  level.spikes.forEach((spike) => {
    const spikeElement = document.createElement("div");
    spikeElement.className = "spike";
    Object.assign(spikeElement.style, spike);
    gameContainer.appendChild(spikeElement);
  });

  level.coins.forEach((coin, index) => {
    if (!collectedCoins.has(`${levelIndex}-${index}`)) {
      const coinElement = document.createElement("div");
      coinElement.className = "coin";
      Object.assign(coinElement.style, coin);
      gameContainer.appendChild(coinElement);
    }
  });

  level.endDoor.forEach((endDoor) => {
    const endDoorElement = document.createElement("div");
    endDoorElement.id = endDoor.id;
    endDoorElement.className = "end_door";
    Object.assign(endDoorElement.style, endDoor);
    gameContainer.appendChild(endDoorElement);
  });
}

function pickCoin(coinElement, levelIndex, coinIndex) {
  coinElement.style.animation = "coinPickup 0.5s forwards";
  const audio = new Audio("/Media/mixkit-coins-sound-2003.wav");
  audio.play();
  setTimeout(() => {
    coinElement.remove();
    score++;
    collectedCoins.add(`${levelIndex}-${coinIndex}`);
    scoreDisplay.textContent = `Score: ${score}`; // Update score display
  }, 500);
}

function checkCoinProximity() {
  const playerRect = player.getBoundingClientRect();
  const coins = document.querySelectorAll(".coin");

  coins.forEach((coin, index) => {
    const coinRect = coin.getBoundingClientRect();
    if (
      playerRect.left < coinRect.right &&
      playerRect.right > coinRect.left &&
      playerRect.top < coinRect.bottom &&
      playerRect.bottom > coinRect.top
    ) {
      if (!coin.classList.contains("collected")) {
        coin.classList.add("collected");
        pickCoin(coin, currentLevel, index);
      }
    }
  });
}

function die(cause) {
  hearts--;
  if (hearts > 0) {
    loadLevel(currentLevel);
    resetPlayer(cause);
  } else {
    alert("Game Over!");
    endGame();
    resetPlayer(cause);
    hearts = 3;
    currentLevel = 0;
    scoreDisplay.textContent = `Score: ${0}`; // Reset score display
    score = 0;
    collectedCoins.clear(); // Reset collected coins
    loadLevel(currentLevel);
  }
}

  function gravityTransition() {
    const playerRect = player.getBoundingClientRect();
    const gameContainerRect = gameContainer.getBoundingClientRect();

    // Calculate the percentage of the screen the player has traversed horizontally
    const playerX = playerRect.left - gameContainerRect.left;
    const screenWidth = gameContainerRect.width;
    const percentageTraversed = (playerX / screenWidth) * 100;

    // Map percentages to gravity values
    if (percentageTraversed >= 0 && percentageTraversed < 16.6) {
      gravity = gravityMap[0];
    } else if (percentageTraversed >= 16.6 && percentageTraversed < 33.3) {
      gravity = gravityMap[1];
    } else if (percentageTraversed >= 33.3 && percentageTraversed < 50) {
      gravity = gravityMap[2];
    } else if (percentageTraversed >= 50 && percentageTraversed < 66.6) {
      gravity = gravityMap[3];
    } else if (percentageTraversed >= 66.6 && percentageTraversed <= 83) {
      gravity = gravityMap[4];
    } else if (percentageTraversed > 83 && percentageTraversed <= 100) {
      gravity = gravityMap[5];
    }
  }

  function trick() {
    const trick = document.getElementById("trick");
    if (trick) {
      const playerRect = player.getBoundingClientRect();
      const trickRect = trick.getBoundingClientRect();
      const proximityX = trickRect.width / 3; // Horizontal proximity
      const proximityY = trickRect.height / 3; // Vertical proximity
      if (
        ((Math.abs(playerRect.right - trickRect.left) < proximityX ||
          Math.abs(playerRect.left - trickRect.right) < proximityX) &&
          Math.abs(playerRect.bottom - trickRect.top) < proximityY) ||
        Math.abs(playerRect.right - trickRect.left) < proximityX
      ) {
        // remove the trick platform
        gameContainer.removeChild(trick);
        if (currentLevel == 1) {
          ShowHiddenPlatforms();
          movingPlatform();
          ShowHiddenEndDoor();
        }
      }
    }
  }

  function movingPlatform() {
    const movingPlatforms = document
      .querySelectorAll(".platform")
      .forEach((platform) => {
        if (platform.id == "movingPlatform") {
          platform.style.animation = "movingPlatform 4s infinite";
          platform.style.animationTimingFunction = "linear";
        }
      });
  }

  function ShowHiddenPlatforms() {
    const hiddenPlatforms = document
      .querySelectorAll(".platform")
      .forEach((platform) => {
        if (platform.style.visibility == "hidden") {
          platform.style.visibility = "visible";
        }
      });
  }

  function ShowHiddenEndDoor() {
    const hiddenEndDoor = document
      .querySelectorAll(".end_door")
      .forEach((endDoor) => {
        if (endDoor.style.visibility == "hidden") {
          endDoor.style.visibility = "visible";
        }
      });
  }

  function updateScore(newScore, timeTaken) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    let userStats = JSON.parse(localStorage.getItem('userStats')) || {};
  
    if (userStats[loggedInUser]) {
      const currentHighScore = userStats[loggedInUser].motionGame.highScore;
      const currentBestTime = userStats[loggedInUser].motionGame.bestTime;
  
      if (
        newScore > currentHighScore ||
        (newScore === currentHighScore && timeTaken < currentBestTime)
      ) {
        userStats[loggedInUser].motionGame.highScore = newScore;
        userStats[loggedInUser].motionGame.bestTime = timeTaken;
      }
  
      localStorage.setItem('userStats', JSON.stringify(userStats));
    }
  }
  
  function endGame() {
    const currentTime = Date.now();
    const timeTaken = (currentTime - startTime) / 1000; // Time in seconds
    updateScore(score, timeTaken);
    startTime = currentTime;
  }
  
  function nextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
      loadLevel(currentLevel);
      resetPlayer();
    } else {
      alert("You have completed all levels!");
      endGame(); // Insert this line here
      resetPlayer();
    }
  }

  document.addEventListener("keydown", (event) => {
    keys[event.code] = true;
  });

  document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
  });

  function getPlatformBelow() {
    const playerRect = player.getBoundingClientRect();
    const playerBottom = playerRect.bottom;
    const playerLeft = playerRect.left;
    const playerRight = playerRect.right;

    let closestPlatform = null;
    let closestDistance = Infinity;

    const platforms = document.querySelectorAll(".platform");
    platforms.forEach((platform) => {
      const platformRect = platform.getBoundingClientRect();

      if (playerRight > platformRect.left && playerLeft < platformRect.right) {
        const distance = platformRect.top - playerBottom;
        if (distance >= -5 && distance < closestDistance) {
          closestPlatform = platform;
          closestDistance = distance;
        }
      }
    });

    return { platform: closestPlatform, distance: closestDistance };
  }

  function getPlatformAbove() {
    const playerRect = player.getBoundingClientRect();
    const playerTop = playerRect.top;
    const playerLeft = playerRect.left;
    const playerRight = playerRect.right;

    let closestPlatform = null;
    let closestDistance = Infinity;

    const platforms = document.querySelectorAll(".platform");
    platforms.forEach((platform) => {
      const platformRect = platform.getBoundingClientRect();

      if (playerRight > platformRect.left && playerLeft < platformRect.right) {
        const distance = playerTop - platformRect.bottom;
        if (distance >= -5 && distance < closestDistance) {
          closestPlatform = platform;
          closestDistance = distance;
        }
      }
    });

    return { platform: closestPlatform, distance: closestDistance };
  }

  function checkSideCollisions() {
    const playerRect = player.getBoundingClientRect();
    const platforms = document.querySelectorAll(".platform");

    platforms.forEach((platform) => {
      const platformRect = platform.getBoundingClientRect();

      if (
        playerRect.bottom > platformRect.top &&
        playerRect.top < platformRect.bottom
      ) {
        const isOnPlatform = playerRect.bottom <= platformRect.top + 5; // we add for a little tolerance to avoid the player getting glitched

        if (
          playerRect.right > platformRect.left &&
          playerRect.left < platformRect.left &&
          !isOnPlatform
        ) {
          player.style.left = `${platformRect.left - playerRect.width}px`;
        } else if (
          playerRect.left < platformRect.right &&
          playerRect.right > platformRect.right &&
          !isOnPlatform
        ) {
          player.style.left = `${platformRect.right}px`;
        }
      }
    });
  }

  function checkSpikeProximity() {
    const playerRect = player.getBoundingClientRect();
    const spikes = document.querySelectorAll(".spike");

    spikes.forEach((spike) => {
      const spikeRect = spike.getBoundingClientRect();
      const proximity = 40;

      if (
        Math.abs(playerRect.left - spikeRect.left) < proximity &&
        Math.abs(playerRect.bottom - spikeRect.bottom) < proximity
      ) {
        spike.style.visibility = "visible";
        spike.style.animation = "spikeAnimation 4s infinite";
        if (
          playerRect.left < spikeRect.right &&
          playerRect.right > spikeRect.left &&
          playerRect.top < spikeRect.bottom &&
          playerRect.bottom > spikeRect.top
        ) {
          die("spike");
        }
      } else {
        spike.style.visibility = "hidden";
        spike.style.animation = "none";
      }
    });
  }

  function resetPlayer(cause = null) {
    player.style.bottom = `${gameContainer.clientHeight / 2}px`;
    player.style.left = "50px";
    isJumping = false;
    isFalling = false;
    velocity = 0;
    gravity = -0.5;
    keys = {};
  }

  function gameLoop() {
    // Handle left movement
    if (keys["ArrowLeft"]) {
      let newLeft = parseInt(player.style.left) - moveSpeed;
      if (newLeft >= 0) {
        player.style.left = `${newLeft}px`;
        checkSideCollisions();
      }
    }

    // Handle right movement
    if (keys["ArrowRight"]) {
      let newLeft = parseInt(player.style.left) + moveSpeed;
      if (newLeft <= gameContainer.clientWidth - player.clientWidth) {
        player.style.left = `${newLeft}px`;
        checkSideCollisions();
      }
    }

    // Handle upward jump (positive jump)
    if ((keys["ArrowUp"] || keys["Space"]) && !isJumping && !isFalling) {
      isJumping = true;
      velocity = gravity < 0 ? jumpVelocity : -jumpVelocity; // Adjust velocity based on gravity direction
    }

    // Handle downward jump (negative jump)
    if ((keys["ArrowDown"] || keys["Space"]) && !isJumping && !isFalling) {
      isJumping = true;
      velocity = gravity < 0 ? jumpVelocity : -jumpVelocity; // Downward jump for positive gravity
    }

    // Update velocity with gravity
    velocity += gravity;

    // Calculate new position
    let newBottom = parseInt(player.style.bottom) + velocity;

    // Get platforms above and below
    const { platform: platformBelow, distance: distanceBelow } =
      getPlatformBelow();
    const { platform: platformAbove, distance: distanceAbove } =
      getPlatformAbove();

    // Handle collisions and adjust position for gravity < 0 (normal gravity)
    if (gravity < 0) {
      if (velocity < 0) {
        // Falling downward
        if (platformBelow && distanceBelow <= Math.abs(velocity)) {
          const platformRect = platformBelow.getBoundingClientRect();
          newBottom = gameContainer.clientHeight - platformRect.top;
          isJumping = false;
          isFalling = false;
          velocity = 0;
        } else {
          isFalling = true;
        }
      } else if (velocity > 0) {
        // Jumping upward
        if (platformAbove && distanceAbove <= Math.abs(velocity)) {
          const platformRect = platformAbove.getBoundingClientRect();
          newBottom =
            gameContainer.clientHeight -
            platformRect.bottom -
            player.clientHeight;
          velocity = 0;
        }
      }
    }

    // Handle collisions and adjust position for gravity > 0 (inverted gravity)
    else {
      if (velocity > 0) {
        // Falling upward
        if (platformAbove && distanceAbove <= Math.abs(velocity)) {
          const platformRect = platformAbove.getBoundingClientRect();
          newBottom =
            gameContainer.clientHeight -
            platformRect.bottom -
            player.clientHeight;
          isJumping = false;
          isFalling = false;
          velocity = 0;
        } else {
          isFalling = true;
        }
      } else if (velocity < 0) {
        // Jumping downward
        if (platformBelow && distanceBelow <= Math.abs(velocity)) {
          const platformRect = platformBelow.getBoundingClientRect();
          newBottom = gameContainer.clientHeight - platformRect.top;
          isJumping = false;
          isFalling = false;
          velocity = 0;
        }
      }
    }

    // Apply new position
    player.style.bottom = `${newBottom}px`;

    // Handle platform snapping when standing still
    if (!isJumping && platformBelow && distanceBelow <= 0) {
      const platformRect = platformBelow.getBoundingClientRect();
      player.style.bottom = `${
        gameContainer.clientHeight - platformRect.top
      }px`;
      velocity = 0;
    }

    // Check proximity to spikes and coins
    checkSpikeProximity();
    checkCoinProximity();

    // Check if player reaches the end door
    const endDoor = document.querySelector(".end_door");
    const endDoorRect = endDoor.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (
      playerRect.left < endDoorRect.right &&
      playerRect.right > endDoorRect.left &&
      playerRect.top < endDoorRect.bottom &&
      playerRect.bottom > endDoorRect.top
    ) {
      nextLevel();
    }

    // Handle level-specific logic
    trick();
    if (currentLevel == 2) {
      gravityTransition();
    }

    // Check if the player falls out of bounds
    if (playerRect.top > gameContainer.clientHeight || playerRect.bottom < 0) {
      die("fall");
    }

    // Continue game loop
    requestAnimationFrame(gameLoop);
  }

  loadLevel(currentLevel);
  resetPlayer();
  gameLoop();
});
