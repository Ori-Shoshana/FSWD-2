document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  const gameContainer = document.getElementById("game-container");
  const gravity = -0.5;
  const jumpVelocity = 10;
  const moveSpeed = 5;
  let isJumping = false;
  let velocity = 0;
  let keys = {};
  
  document.addEventListener("keydown", (event) => {
    keys[event.code] = true;
  });

  document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
  });

  const platforms = document.querySelectorAll(".platform");
  const spikes = document.querySelectorAll(".spike");

  function getPlatformBelow() {
    const playerRect = player.getBoundingClientRect();
    const playerBottom = playerRect.bottom;
    const playerLeft = playerRect.left;
    const playerRight = playerRect.right;
    
    let closestPlatform = null;
    let closestDistance = Infinity;

    platforms.forEach(platform => {
      const platformRect = platform.getBoundingClientRect();
      
      // Check if player is within horizontal bounds of platform
      if (playerRight > platformRect.left && playerLeft < platformRect.right) {
        // Check if platform is below player
        const distance = platformRect.top - playerBottom;
        if (distance >= -5 && distance < closestDistance) { // Small negative value for more reliable landing
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

    platforms.forEach(platform => {
      const platformRect = platform.getBoundingClientRect();
      
      // Check if player is within horizontal bounds of platform
      if (playerRight > platformRect.left && playerLeft < platformRect.right) {
        // Check if platform is above player
        const distance = playerTop - platformRect.bottom;
        if (distance >= -5 && distance < closestDistance) { // Small negative value for more reliable collision detection
          closestPlatform = platform;
          closestDistance = distance;
        }
      }
    });

    return { platform: closestPlatform, distance: closestDistance };
  }

  function checkSideCollisions() {
    const playerRect = player.getBoundingClientRect();
    
    platforms.forEach(platform => {
      const platformRect = platform.getBoundingClientRect();
      
      // Only check side collisions if player is within vertical range of platform
      if (playerRect.bottom > platformRect.top && playerRect.top < platformRect.bottom) {
        // Left collision
        if (playerRect.right > platformRect.left && playerRect.left < platformRect.left) {
          player.style.left = `${platformRect.left - playerRect.width}px`;
        }
        // Right collision
        else if (playerRect.left < platformRect.right && playerRect.right > platformRect.right) {
          player.style.left = `${platformRect.right}px`;
        }
      }
    });
  }

  function checkSpikeProximity() {
    const playerRect = player.getBoundingClientRect();
    
    spikes.forEach(spike => {
      const spikeRect = spike.getBoundingClientRect();
      const proximity = 50; // Distance within which the spike will pop up
      const spikespeed = 5; // Speed at which the spike moves
      
      // Move the spike down
      spike.style.bottom = `${parseInt(spike.style.bottom) + spikespeed}px`;
      if (parseInt(spike.style.bottom) > gameContainer.clientHeight) {
        spike.style.bottom = `${-spikeRect.height}px`;
        spike.style.left = `${Math.random() * (gameContainer.clientWidth - spikeRect.width)}px`;
      }

      // Check if player is within proximity of the spike
      if (Math.abs(playerRect.left - spikeRect.left) < proximity && Math.abs(playerRect.bottom - spikeRect.bottom) < proximity) {
        spike.style.visibility = 'visible'; // Show the spike
        // Check if player is colliding with the spike
        if (playerRect.left < spikeRect.right && playerRect.right > spikeRect.left &&
            playerRect.top < spikeRect.bottom && playerRect.bottom > spikeRect.top) {
          resetPlayer(); // Reset player position
        }
      } else {
        //spike.style.visibility = 'hidden'; // Hide the spike
      }
    });
  }

  function resetPlayer() {
    player.style.bottom = `${gameContainer.clientHeight / 2}px`;
    player.style.left = "50px";
    isJumping = false;
    velocity = 0;
  }

  function gameLoop() {
    // Handle horizontal movement
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

    // Handle jumping
    if ((keys["ArrowUp"] || keys["Space"]) && !isJumping) {
      isJumping = true;
      velocity = jumpVelocity;
    }

    // Apply gravity
    velocity += gravity;

    // Update vertical position
    let newBottom = parseInt(player.style.bottom) + velocity;
    
    // Check for platform below
    const { platform: platformBelow, distance: distanceBelow } = getPlatformBelow();
    const { platform: platformAbove, distance: distanceAbove } = getPlatformAbove();

    // If falling
    if (velocity < 0) {
      if (platformBelow && distanceBelow <= Math.abs(velocity)) {
        // Land on platform
        const platformRect = platformBelow.getBoundingClientRect();
        newBottom = gameContainer.clientHeight - platformRect.top;
        isJumping = false;
        velocity = 0;
      }
    } else if (velocity > 0) { // If jumping
      if (platformAbove && distanceAbove <= Math.abs(velocity)) {
        // Hit the platform above
        const platformRect = platformAbove.getBoundingClientRect();
        newBottom = gameContainer.clientHeight - platformRect.bottom - player.clientHeight;
        velocity = 0;
      }
    }
    
    // Apply new position
    player.style.bottom = `${newBottom}px`;

    // Handle landing/standing on platform
    if (!isJumping && platformBelow && distanceBelow <= 0) {
      const platformRect = platformBelow.getBoundingClientRect();
      player.style.bottom = `${gameContainer.clientHeight - platformRect.top}px`;
      velocity = 0;
    }

    // Check for spike proximity
    checkSpikeProximity();

    requestAnimationFrame(gameLoop);
  }

  resetPlayer();
  gameLoop();
});