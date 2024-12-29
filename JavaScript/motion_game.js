document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  const gameContainer = document.getElementById("game-container");
  const gravity = -0.5;
  const jumpVelocity = 10;
  const moveSpeed = 5;
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
      endDoor: { bottom: "45vh", left: "80vw" },
    },
    {
      // Level 2
      platforms: [
        { bottom: "0", left: "0", width: "100%", height: "5vh" },
        { bottom: "10vh", left: "25vw", width: "20vw", height: "5vh" },
        { bottom: "20vh", left: "65vw", width: "20vw", height: "5vh" },
        { bottom: "30vh", left: "25vw", width: "20vw", height: "5vh" },
        { bottom: "40vh", left: "65vw", width: "20vw", height: "5vh" },
      ],
      spikes: [{ bottom: "12vh", left: "30vw" }],
      coins: [
        { bottom: "12vh", left: "20vw" },
        { bottom: "22vh", left: "50vw" },
        { bottom: "32vh", left: "15vw" },
        { bottom: "42vh", left: "65vw" },
      ],
      endDoor: { bottom: "50vh", left: "80vw" },
    },
    // Add more levels here
  ];

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

    level.coins.forEach((coin) => {
      const coinElement = document.createElement("div");
      coinElement.className = "coin";
      Object.assign(coinElement.style, coin);
      gameContainer.appendChild(coinElement);
    });

    const endDoorElement = document.createElement("div");
    endDoorElement.className = "end_door";
    Object.assign(endDoorElement.style, level.endDoor);
    gameContainer.appendChild(endDoorElement);
  }

  function die(cause) {
    hearts--;
    if (hearts > 0) {
      loadLevel(currentLevel);
      resetPlayer(cause);
    } else {
      alert("Game Over!");
      resetPlayer(cause);
      hearts = 3;
      currentLevel = 0;
      loadLevel(currentLevel);
    }
  }

  function trick() {
    const trick = document.getElementById("trick");
    if (trick) {
      const playerRect = player.getBoundingClientRect();
      const trickRect = trick.getBoundingClientRect();
      const proximityX = 4; // Horizontal proximity
      const proximityY = 100; // Vertical proximity
      if (
        (Math.abs(playerRect.right - trickRect.left) < proximityX ||
        Math.abs(playerRect.left - trickRect.right) < proximityX) &&
        Math.abs(playerRect.bottom - trickRect.top) < proximityY
      ) {
          trick.style.visibility = "hidden";
          trick.style.width = "0";
      }
    }
  }

  function nextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
      loadLevel(currentLevel);
      resetPlayer();
    } else {
      alert("You have completed all levels!");
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
        if (
          playerRect.right > platformRect.left &&
          playerRect.left < platformRect.left
        ) {
          player.style.left = `${platformRect.left - playerRect.width}px`;
        } else if (
          playerRect.left < platformRect.right &&
          playerRect.right > platformRect.right
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
    keys = {};
  }

  function pickCoin(coinElement) {
    coinElement.style.animation = "coinPickup 0.5s forwards";
    const audio = new Audio("/Media/mixkit-coins-sound-2003.wav");
    audio.play();
    setTimeout(() => {
      coinElement.remove();
    }, 500);
    score++;
    console.log("Score: ", score);
  }

  function checkCoinProximity() {
    const playerRect = player.getBoundingClientRect();
    const coins = document.querySelectorAll(".coin");

    coins.forEach((coin) => {
      const coinRect = coin.getBoundingClientRect();
      const proximity = 40;

      if (
        playerRect.left < coinRect.right &&
        playerRect.right > coinRect.left &&
        playerRect.top < coinRect.bottom &&
        playerRect.bottom > coinRect.top
      ) {
        pickCoin(coin);
      }
    });
  }

  function gameLoop() {
    if (keys["ArrowLeft"]) {
      let newLeft = parseInt(player.style.left) - moveSpeed;
      if (newLeft >= 0) {
        player.style.left = `${newLeft}px`;
        checkSideCollisions();
      }
    }
    if (keys["ArrowRight"]) {
      let newLeft = parseInt(player.style.left) + moveSpeed;
      if (newLeft <= gameContainer.clientWidth - player.clientWidth) {
        player.style.left = `${newLeft}px`;
        checkSideCollisions();
      }
    }

    if ((keys["ArrowUp"] || keys["Space"]) && !isJumping && !isFalling) {
      isJumping = true;
      velocity = jumpVelocity;
    }

    velocity += gravity;

    let newBottom = parseInt(player.style.bottom) + velocity;

    const { platform: platformBelow, distance: distanceBelow } =
      getPlatformBelow();
    const { platform: platformAbove, distance: distanceAbove } =
      getPlatformAbove();

    if (velocity < 0) {
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
      if (platformAbove && distanceAbove <= Math.abs(velocity)) {
        const platformRect = platformAbove.getBoundingClientRect();
        newBottom =
          gameContainer.clientHeight -
          platformRect.bottom -
          player.clientHeight;
        velocity = 0;
      }
    }

    player.style.bottom = `${newBottom}px`;

    if (!isJumping && platformBelow && distanceBelow <= 0) {
      const platformRect = platformBelow.getBoundingClientRect();
      player.style.bottom = `${
        gameContainer.clientHeight - platformRect.top
      }px`;
      velocity = 0;
    }

    checkSpikeProximity();
    checkCoinProximity();

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

    trick();

    if (playerRect.top > gameContainer.clientHeight) {
      die("fall");
    }

    requestAnimationFrame(gameLoop);
  }

  loadLevel(currentLevel);
  resetPlayer();
  gameLoop();
});