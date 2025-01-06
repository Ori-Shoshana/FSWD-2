const platforms = []; // Define the platforms array

// Function to create a dynamic matrix based on the game container's dimensions
function createDynamicMatrix(containerWidth, containerHeight) {
    const tileSize = Math.min(containerWidth, containerHeight) / 15 ; // Adjust the divisor to fit your needs
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
    const gameContainer = document.getElementById('game-container');

    matrix.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile !== 0) {
                const tileElement = document.createElement('img');
                tileElement.src = `/Media/free-swamp-game-tileset-pixel-art/1 Tiles/Tile_0${tile}.png`;
                tileElement.className = 'tile';
                tileElement.style.position = 'absolute';
                tileElement.style.width = `${tileSize}px`;
                tileElement.style.height = `${tileSize}px`;
                tileElement.style.left = `${colIndex * tileSize}px`;
                tileElement.style.top = `${rowIndex * tileSize}px`;
                gameContainer.appendChild(tileElement);

                // Add the platform to the platforms array for collision detection
                platforms.push({
                    top: rowIndex * tileSize ,
                    left: colIndex * tileSize,
                    bottom: rowIndex * tileSize+ tileSize,
                    right: colIndex * tileSize + tileSize,
                    width: tileSize,
                    height: tileSize,
                });
            }
        });
    });
}

