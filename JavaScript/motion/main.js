let idleTimeout;

document.addEventListener("DOMContentLoaded", () => {
  const figureElement = document.getElementById("figure");
  const figure = new Figure(figureElement);

  function updateFigure(timestamp) {
    figure.update();
    requestAnimationFrame(updateFigure); // Correct usage of requestAnimationFrame
  }

  function handleKeyPress(event) {
    clearTimeout(idleTimeout); // Clear any existing idle timeout

    if (event.code === "ArrowRight") {
      direction = "right";
      isRunning = true; // Set running state to true
      figure.velocity.x = figure.movementSpeed;
      if (currentAction !== "jump") {
        currentAction = "run";
      }
    } else if (event.code === "ArrowLeft") {
      direction = "left";
      isRunning = true; // Set running state to true
      figure.velocity.x = -figure.movementSpeed;
      if (currentAction !== "jump") {
        currentAction = "run";
      }
    } else if (event.code === "Space" && !isJumping) {
      isJumping = true;
      figure.velocity.y = -figure.jumpStrength; // Apply jump strength
      currentAction = "jump";
    } else if (event.code === "ArrowDown") {
      currentAction = "slide";
    }
  }

  function handleKeyRelease(event) {
    if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
      isRunning = false; // Stop running
      figure.velocity.x = 0;
      if (currentAction !== "jump") {
        // Set a timeout to switch to idle after a short delay
        idleTimeout = setTimeout(() => {
          currentAction = "idle";
        }, 100); // Adjust the delay as needed
      }
    }
  }

  // Event listeners
  document.addEventListener("keydown", handleKeyPress);
  document.addEventListener("keyup", handleKeyRelease);

  // Start the animation loop
  requestAnimationFrame(updateFigure);

  initializeGame(indexlevel);
});