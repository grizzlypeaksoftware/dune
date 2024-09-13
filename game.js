const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');

const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Player Object
const player = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    size: 30,
    speed: 5,
    dx: 0,
    dy: 0,
    color: 'blue'
};

// Spice Object
const spice = {
    x: Math.random() * (canvasWidth - 20) + 10,
    y: Math.random() * (canvasHeight - 20) + 10,
    size: 20,
    color: 'gold'
};

// Sandworm Object
const sandworms = [];
const sandwormCount = 3;

// Initialize Sandworms
for (let i = 0; i < sandwormCount; i++) {
    sandworms.push({
        x: Math.random() * (canvasWidth - 30) + 15,
        y: Math.random() * (canvasHeight - 30) + 15,
        size: 30,
        speed: 2,
        dx: Math.random() < 0.5 ? 2 : -2,
        dy: Math.random() < 0.5 ? 2 : -2,
        color: 'brown'
    });
}

let score = 0;
let timeLeft = 60; // seconds
let gameOver = false;

// Movement variables for keyboard
let keyboardMovement = { dx: 0, dy: 0 };

// Movement variables for mobile
let mobileMovement = { dx: 0, dy: 0 };

// Handle Keyboard Input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            keyboardMovement.dy = -player.speed;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            keyboardMovement.dy = player.speed;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            keyboardMovement.dx = -player.speed;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            keyboardMovement.dx = player.speed;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (keyboardMovement.dy < 0) keyboardMovement.dy = 0;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (keyboardMovement.dy > 0) keyboardMovement.dy = 0;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (keyboardMovement.dx < 0) keyboardMovement.dx = 0;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (keyboardMovement.dx > 0) keyboardMovement.dx = 0;
            break;
    }
});

// Handle Mobile Input
upBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mobileMovement.dy = -player.speed;
});

upBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    mobileMovement.dy = 0;
});

downBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mobileMovement.dy = player.speed;
});

downBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    mobileMovement.dy = 0;
});

leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mobileMovement.dx = -player.speed;
});

leftBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    mobileMovement.dx = 0;
});

rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mobileMovement.dx = player.speed;
});

rightBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    mobileMovement.dx = 0;
});

// Update Player Position
function updatePlayer() {
    // Combine keyboard and mobile movements
    player.dx = keyboardMovement.dx + mobileMovement.dx;
    player.dy = keyboardMovement.dy + mobileMovement.dy;

    player.x += player.dx;
    player.y += player.dy;

    // Boundary Check
    if (player.x < player.size / 2) player.x = player.size / 2;
    if (player.x > canvasWidth - player.size / 2) player.x = canvasWidth - player.size / 2;
    if (player.y < player.size / 2) player.y = player.size / 2;
    if (player.y > canvasHeight - player.size / 2) player.y = canvasHeight - player.size / 2;
}

// Update Sandworms Position
function updateSandworms() {
    sandworms.forEach(worm => {
        worm.x += worm.dx;
        worm.y += worm.dy;

        // Bounce off walls
        if (worm.x < worm.size / 2 || worm.x > canvasWidth - worm.size / 2) {
            worm.dx *= -1;
        }
        if (worm.y < worm.size / 2 || worm.y > canvasHeight - worm.size / 2) {
            worm.dy *= -1;
        }
    });
}

// Check Collision between two circles
function isColliding(obj1, obj2) {
    const dist = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
    return dist < (obj1.size / 2 + obj2.size / 2);
}

// Update Game State
function update() {
    if (gameOver) return;

    updatePlayer();
    updateSandworms();

    // Check collision with spice
    if (isColliding(player, spice)) {
        score += 10;
        scoreElement.textContent = score;
        // Reposition spice
        spice.x = Math.random() * (canvasWidth - 20) + 10;
        spice.y = Math.random() * (canvasHeight - 20) + 10;
    }

    // Check collision with sandworms
    for (let worm of sandworms) {
        if (isColliding(player, worm)) {
            endGame();
            break;
        }
    }
}

// Draw Objects
function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw Player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();

    // Draw Spice
    ctx.beginPath();
    ctx.arc(spice.x, spice.y, spice.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = spice.color;
    ctx.fill();
    ctx.closePath();

    // Draw Sandworms
    sandworms.forEach(worm => {
        ctx.beginPath();
        ctx.arc(worm.x, worm.y, worm.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = worm.color;
        ctx.fill();
        ctx.closePath();
    });
}

// Game Loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Timer Countdown
function startTimer() {
    const timer = setInterval(() => {
        if (gameOver) {
            clearInterval(timer);
            return;
        }
        timeLeft--;
        timeElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
            clearInterval(timer);
        }
    }, 1000);
}

// End Game
function endGame() {
    gameOver = true;
    alert(`Game Over! Your score: ${score}`);
}

// Start the Game
gameLoop();
startTimer();
