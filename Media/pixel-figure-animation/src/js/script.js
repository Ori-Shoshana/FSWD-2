const actions = {
    idle: Array.from({ length: 9 }, (_, i) => `idle0${i + 1}.png`),
    run: Array.from({ length: 8 }, (_, i) => `run0${i + 1}.png`),
    jump: [
        ...Array.from({ length: 2 }, (_, i) => `jump_start0${i + 1}.png`),
        ...Array.from({ length: 4 }, (_, i) => `jump_mid0${i + 1}.png`),
        ...Array.from({ length: 3  }, (_, i) => `jump_mid0${i + 1}.png`),
        'jump_landing.png'
    ]
};

let frameIndex = 0;
let currentAction = 'idle';
let direction = 'right'; // 'right' or 'left'
let isRunning = false; // Tracks if the user is running
let isJumping = false; // Tracks if the user is jumping

function updateFigureAnimation() {
    const figure = document.getElementById('figure');

    // Update the frame index
    frameIndex = (frameIndex + 1) % actions[currentAction].length;

    // Update the source of the image
    figure.src = `/Media/Sprites/Gino Character/PNG/Idle, run, jump/${actions[currentAction][frameIndex]}`;

    // Flip the image based on the direction
    figure.style.transform = direction === 'right' ? 'scaleX(1)' : 'scaleX(-1)';

    // If the action is "jump" and we reach the end, switch back to "idle" or "run"
    if (currentAction === 'jump' && frameIndex === 0) {
        currentAction = isRunning ? 'run' : 'idle';
    }
}

// Smoothly handle updates with a shorter interval for responsive animation
setInterval(updateFigureAnimation, 100);