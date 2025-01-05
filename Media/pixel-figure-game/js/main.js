let idleTimeout;

document.addEventListener('DOMContentLoaded', () => {
    const figureElement = document.getElementById('figure');
    const figure = new Figure(figureElement);

    function updateFigure(timestamp) {
        figure.update();
        requestAnimationFrame(updateFigure); // Correct usage of requestAnimationFrame
    }

    function handleKeyPress(event) {
        clearTimeout(idleTimeout); // Clear any existing idle timeout

        if (event.code === 'ArrowRight') {
            direction = 'right';
            isRunning = true; // Set running state to true
            figure.velocity.x = figure.movementSpeed;
            if (currentAction !== 'jump') {
                currentAction = 'run';
            }
        } else if (event.code === 'ArrowLeft') {
            direction = 'left';
            isRunning = true; // Set running state to true
            figure.velocity.x = -figure.movementSpeed;
            if (currentAction !== 'jump') {
                currentAction = 'run';
            }
        } else if (event.code === 'Space' && !isJumping) {
            isJumping = true;
            figure.velocity.y = -figure.jumpStrength; // Apply jump strength
            currentAction = 'jump';
        }
    }

    function handleKeyRelease(event) {
        if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
            isRunning = false; // Stop running
            figure.velocity.x = 0;
            if (currentAction !== 'jump') {
                // Set a timeout to switch to idle after a short delay
                idleTimeout = setTimeout(() => {
                    currentAction = 'idle';
                }, 100); // Adjust the delay as needed
            }
        }
    }

    // Event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyRelease);

    // Start the animation loop
    requestAnimationFrame(updateFigure);

    const gameContainer = document.getElementById('game-container');
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    // Create a dynamic matrix based on the game container's dimensions
    const { matrix, tileSize, rows, cols } = createDynamicMatrix(containerWidth, containerHeight);

    // Make a line of tiles at the bottom
    for (let i = 0; i < cols; i++) {
        matrix[rows - 1][i] = 1;
        matrix[rows - 2][i] = 1;
        for(let i = 5 ;i < rows; i++){
            matrix[i][cols - 1] = 1;
        }


         for(let i = 5 ;i < rows; i++){
             matrix[rows- 6][i] = 1;
         }
    }

    // Add tiles based on the matrix
    addTiles(matrix, tileSize);
});