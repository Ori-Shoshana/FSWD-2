class Figure {
  constructor(element) {
    this.element = element;

    // Percentage margins for the collision box
    this.margins = {
      top: 0.26, // 1% from top
      bottom: 0.12, // 1% from bottom
      left: 0.01, // 1% from left
      right: 0.55, // 1% from right
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
    this.movementSpeed = 4;
    this.gravity = 0.5;
    this.jumpStrength = 10;
    this.friction = 0.9;
    this.velocity = { x: 0, y: 0 };
  }

  calculateBox() {
    // Calculate margins
    const marginLeft = this.width * this.margins.left;
    const marginRight = this.width * this.margins.right;
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

    // Check for collisions with platforms
    let onPlatform = false;
    platforms.forEach((platform) => {
      const platformBox = {
        left: platform.left,
        right: platform.right,
        top: platform.top,
        bottom: platform.bottom,
      };

      // Check if the figure is within the platform's horizontal bounds
      if (
        figureBox.right > platformBox.left &&
        figureBox.left < platformBox.right
      ) {
        // Collision from below
        if (
          figureBox.bottom > platformBox.top &&
          figureBox.top < platformBox.top &&
          this.velocity.y > 0
        ) {
          this.setPosition(
            this.position.left,
            platformBox.top - this.height + this.height * this.margins.bottom
          );
          this.velocity.y = 0;
          isJumping = false;
          onPlatform = true;
        }

        // Collision from above
        if (
          figureBox.top < platformBox.bottom &&
          figureBox.bottom > platformBox.bottom &&
          this.velocity.y < 0
        ) {
          this.setPosition(
            this.position.left,
            platformBox.bottom - this.height * this.margins.top
          );
          this.velocity.y = 0;
        }

        // Side collisions only if we're not likely to be walking over the platform
        const walkingTolerance = this.height * 0.5;
        const jumoingTolerance = this.height * 0.5;
        if (figureBox.bottom - platformBox.top > walkingTolerance) {
          // Collision from the right
          if (
            figureBox.left < platformBox.right &&
            figureBox.right > platformBox.right &&
            figureBox.bottom > platformBox.top &&
            figureBox.top < platformBox.bottom
          ) {
            // Simply push the figure out of the wall
            this.setPosition(
              platformBox.right + this.width * this.margins.left,
              this.position.top
            );
          }

          // Collision from the left
          if (
            figureBox.right > platformBox.left &&
            figureBox.left < platformBox.left &&
            figureBox.bottom > platformBox.top &&
            figureBox.top < platformBox.bottom
          ) {
            // Simply push the figure out of the wall
            this.setPosition(
              platformBox.left - this.width + this.width * this.margins.right,
              this.position.top
            );
          }
        }
      }
    });

    // If not on any platform, apply gravity
    if (!onPlatform) {
      isJumping = true;
    }

    // Keep the figure within the game container bounds
    const gameContainer = document.getElementById("game-container");
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    const boundedLeft = Math.max(
      0,
      Math.min(containerWidth - this.width + this.width*this.margins.right , this.position.left)
    );
    const boundedTop = Math.max(
      0,
      Math.min(containerHeight - this.height* this.margins.top, this.position.top)
    );

    if (
      boundedLeft !== this.position.left ||
      boundedTop !== this.position.top
    ) {
      this.setPosition(boundedLeft, boundedTop);
    }
  }

  debugDrawBox() {
    let debugBox =
      document.getElementById("debug-box") || document.createElement("div");
    debugBox.id = "debug-box";
    debugBox.style.position = "absolute";
    const box = this.calculateBox();
    debugBox.style.left = `${box.left}px`;
    debugBox.style.top = `${box.top}px`;
    debugBox.style.width = `${box.right - box.left}px`;
    debugBox.style.height = `${box.bottom - box.top}px`;
    debugBox.style.border = "1px solid red";
    debugBox.style.pointerEvents = "none";
    debugBox.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
    document.getElementById("game-container").appendChild(debugBox);
  }
}
