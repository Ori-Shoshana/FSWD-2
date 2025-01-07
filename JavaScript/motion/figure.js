class Figure {
  constructor(element) {
    this.element = element;
    this.hearts = 3;
    this.direction = "right";
    // Percentage margins for the collision box
    this.margins = {
      top: 0.26,
      bottom: 0.12,
      left: 0.15,
      right: 0.57,
    };

    // Get initial dimensions
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;

    // Initial position (relative to game container)
    this.position = {
      left: 50,
      top: 130,
    };

    // Set initial element position
    this.element.style.position = "absolute";
    this.element.style.left = `${this.position.left}px`;
    this.element.style.top = `${this.position.top}px`;

    // Movement properties
    this.movementSpeed = 3;
    this.gravity = 0.5;
    this.jumpStrength = 10;
    this.friction = 0.9;
    this.velocity = { x: 0, y: 0 };
  }

  calculateBox() {
    // Calculate margins
    const marginLeft =
      direction === "left"
        ? this.width * (this.margins.right - 0.09)
        : this.width * this.margins.left;
    const marginRight =
      direction === "left"
        ? this.width * (this.margins.left + 0.09)
        : this.width * this.margins.right;
    const marginTop = this.height * this.margins.top;
    const marginBottom = this.height * this.margins.bottom;

    return {
      left: this.position.left + marginLeft,
      right: this.position.left + this.width - marginRight,
      top: this.position.top + marginTop,
      bottom: this.position.top + this.height - marginBottom,
    };
  }

  getBox() {
    const box = this.calculateBox();
    return {
      ...box,
      width: box.right - box.left,
      height: box.bottom - box.top,
    };
  }

  setPosition(left, top) {
    this.position.left = left;
    this.position.top = top;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  update() {
    // Apply gravity
    this.velocity.y += this.gravity;

    // when there is a change in direction move the figure a bit to avoid collision
    if (direction !== this.direction) {
      this.position.left += this.direction === "right" ? -30 : 30;
      this.direction = direction;
    }

    // Apply friction when not running
    if (!isRunning) {
      this.velocity.x *= this.friction;
    }

    // Update position based on velocity
    this.position.left += this.velocity.x;
    this.position.top += this.velocity.y;

    // Update element position
    this.setPosition(this.position.left, this.position.top);

    const figureBox = this.calculateBox();

    let figureMid = {
      x: figureBox.left + (figureBox.right - figureBox.left) / 2,
      y: figureBox.top + (figureBox.bottom - figureBox.top) / 2,
    };

    // // for debugging
    // const container = document.getElementById("game-container");

    // Check for collisions with platforms
    let onPlatform = false;
    platforms.forEach((platform) => {
      const platformBox = {
        left: platform.left,
        right: platform.right,
        top: platform.top,
        bottom: platform.bottom,
      };

      const platformMidBox = {
        top: {
          x: platformBox.left + (platformBox.right - platformBox.left) / 2,
          y: platformBox.top,
        },
        bottom: {
          x: platformBox.left + (platformBox.right - platformBox.left) / 2,
          y: platformBox.bottom,
        },
        left: {
          x: platformBox.left,
          y: platformBox.top + (platformBox.bottom - platformBox.top) / 2,
        },
        right: {
          x: platformBox.right,
          y: platformBox.top + (platformBox.bottom - platformBox.top) / 2,
        },
      };

      if (
        figureBox.right > platformBox.left &&
        figureBox.left < platformBox.right &&
        figureBox.bottom > platformBox.top &&
        figureBox.top < platformBox.bottom
      ) {
        // //Create and append points for platformMidBox for debugging
        // container.appendChild(
        //   createPointElement(platformMidBox.top.x, platformMidBox.top.y, "red")
        // );
        // container.appendChild(
        //   createPointElement(
        //     platformMidBox.bottom.x,
        //     platformMidBox.bottom.y,
        //     "blue"
        //   )
        // );
        // container.appendChild(
        //   createPointElement(
        //     platformMidBox.left.x,
        //     platformMidBox.left.y,
        //     "green"
        //   )
        // );
        // container.appendChild(
        //   createPointElement(
        //     platformMidBox.right.x,
        //     platformMidBox.right.y,
        //     "yellow"
        //   )
        // );

        let closestPoint = { distance: Infinity, collisionType: "none" };
        for (const [key, value] of Object.entries(platformMidBox)) {
          let distance = Math.sqrt(
            (figureMid.x - value.x) ** 2 + (figureMid.y - value.y) ** 2
          );
          if (distance < closestPoint.distance) {
            closestPoint.collisionType = key;
            closestPoint.distance = distance;
          }
        }

        // switch cases
        switch (closestPoint.collisionType) {
          case "top":
            if (figureBox.bottom - platformBox.top > 0) {
              this.setPosition(
                this.position.left,
                platformBox.top -
                  this.height +
                  this.height * this.margins.bottom
              );
              this.velocity.y = 0;
              isJumping = false;
              onPlatform = true;
            }
            break;
          case "bottom":
            if (figureBox.top - platformBox.bottom < 0) {
              this.setPosition(
                this.position.left,
                platformBox.bottom - this.height * this.margins.top
              );
              this.velocity.y = 0;
            }
            break;
          case "left":
            if (figureBox.right - platformBox.left > 0) {
              this.setPosition(
                platformBox.left - this.width + this.width * this.margins.right,
                this.position.top
              );
              this.velocity.x = 0;
            }
            break;
          case "right":
            if (figureBox.left - platformBox.right < 0) {
              this.setPosition(
                platformBox.right - this.width * (this.margins.right - 0.09),
                this.position.top
              );
              this.velocity.x = 0;
            }
            break;
          default:
            break;
        }
      }
    });

    coins.forEach((coin, index) => {
      const coinBox = {
        left: coin.left,
        right: coin.left + coin.width,
        top: coin.top,
        bottom: coin.top + coin.height,
      };

      if (
        figureBox.right > coinBox.left &&
        figureBox.left < coinBox.right &&
        figureBox.bottom > coinBox.top &&
        figureBox.top < coinBox.bottom
      ) {
        coins.splice(index, 1);
        removeCoin(coin.element);
      }
    });

    // If not on any platform, apply gravity
    if (!onPlatform) {
      isJumping = true;
    }

    this.isFigureInBounds();
  }

  isFigureInBounds() {
    const gameContainer = document.getElementById("game-container");
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    if (
      !(
        this.position.top + this.height >= 0 &&
        this.position.top <= containerHeight + this.height &&
        this.position.left + this.width >= 0
      )
    ) {
      if (!removeHeart()) {
        indexlevel = 1;
        initializeGame(indexlevel);
      }
      this.resetFigurePosition();
      return false;
    }
    // Check if the figure is out of the right side of the container
    // meaning he has reached the end of the level
    if (!(this.position.left <= containerWidth)) {
      initializeGame(++indexlevel);
      this.resetFigurePosition();
    }
  }

  resetFigurePosition({ left = 50, top = 130 } = {}) {
    // Reset the figure's position to a default location within the game container
    this.setPosition(left, top); // Example default position
    this.velocity = { x: 0, y: 0 }; // Reset velocity
  }
}

// Function to create a point element
function createPointElement(x, y, color) {
  const point = document.createElement("div");
  point.className = "collision-point";
  point.style.left = `${x}px`;
  point.style.top = `${y}px`;
  point.style.backgroundColor = color;
  return point;
}
