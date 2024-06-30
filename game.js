const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;
const initialPlayerPosition = { x: 100, y: 100 };
let score = 0;
let gameState = 'playing'; 

class Player {
    constructor() {
        this.position = { ...initialPlayerPosition };
        this.velocity = { x: 0, y: 1 };
        this.width = 30;
        this.height = 30;
        this.isOnGround = false;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        if (gameState === 'playing') {
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;

            if (this.position.y + this.height + this.velocity.y <= canvas.height) {
                this.velocity.y += gravity;
            } else {
                this.gameOver();
            }

            
            if (this.position.y > canvas.height) {
                this.gameOver();
            }
        }
    }

    gameOver() {
        gameState = 'gameOver';
        this.velocity = { x: 0, y: 0 };
        showRestartButton();
    }
}

class Platform {
    constructor({ x, y, width = 200 }) {
        this.position = { x, y };
        this.width = width;
        this.height = 20;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();
let platforms = [
    new Platform({ x: 50, y: 500, width: 400 }),
    new Platform({ x: 500, y: 400 }),
    new Platform({ x: 800, y: 300 }),
    new Platform({ x: 1100, y: 200 }),
    new Platform({ x: 1400, y: 300 }),
    new Platform({ x: 1700, y: 400 }),
    new Platform({ x: 2000, y: 500 }),
    new Platform({ x: 2300, y: 600 }),
    new Platform({ x: 2600, y: 500, width: 300 })
];

const keys = {
    right: { pressed: false },
    left: { pressed: false }
};

function generatePlatform() {
    const lastPlatform = platforms[platforms.length - 1];
    const minXGap = 100;
    const maxXGap = 200;
    const minYGap = -50;
    const maxYGap = 50;

    const newX = lastPlatform.position.x + lastPlatform.width + minXGap + Math.random() * (maxXGap - minXGap);
    let newY = lastPlatform.position.y + minYGap + Math.random() * (maxYGap - minYGap);

   
    if (newY > canvas.height - 50) {
        newY = canvas.height - 50;
    }
    if (newY < 50) {
        newY = 50;
    }

    const newWidth = 200 + Math.random() * 100;
    platforms.push(new Platform({ x: newX, y: newY, width: newWidth }));
}

function resetGame() {
    player.position = { ...initialPlayerPosition };
    player.velocity = { x: 0, y: 1 };
    score = 0;
    gameState = 'playing';


    platforms = [
        new Platform({ x: 50, y: 500, width: 400 }),
        new Platform({ x: 500, y: 400 }),
        new Platform({ x: 800, y: 300 }),
        new Platform({ x: 1100, y: 200 }),
        new Platform({ x: 1400, y: 300 }),
        new Platform({ x: 1700, y: 400 }),
        new Platform({ x: 2000, y: 500 }),
        new Platform({ x: 2300, y: 600 }),
        new Platform({ x: 2600, y: 500, width: 300 })
    ];

    hideRestartButton();
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.isOnGround = false;
    platforms.forEach(platform => platform.draw());

    if (gameState === 'playing') {
        if (keys.right.pressed && player.position.x < 400) {
            player.velocity.x = 5;
            score += 1;
        } else if (keys.left.pressed && player.position.x > 100) {
            player.velocity.x = -5;
        } else {
            player.velocity.x = 0;

            if (keys.right.pressed) {
                platforms.forEach(platform => platform.position.x -= 5);
                score += 1; 
            } else if (keys.left.pressed) {
                platforms.forEach(platform => platform.position.x += 5);
            }
        }

        
        platforms.forEach(platform => {
            if (
                player.position.y + player.height <= platform.position.y &&
                player.position.y + player.height + player.velocity.y >= platform.position.y &&
                player.position.x + player.width >= platform.position.x &&
                player.position.x <= platform.position.x + platform.width
            ) {
                player.velocity.y = 0;
                player.isOnGround = true;
            }
        });

       
        platforms = platforms.filter(platform => platform.position.x + platform.width > 0);

        
        if (platforms[platforms.length - 1].position.x < canvas.width) {
            generatePlatform();
        }
    }

    
    ctx.fillStyle = 'White';
    ctx.font = '25px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameState === 'gameOver') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 130, canvas.height / 2 - 20);
        ctx.font = '30px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 20);
        ctx.fillText('Press to restart', canvas.width / 2 - 100, canvas.height / 2 + 50);
    }
}

function showRestartButton() {
    restartButton.style.display = 'block';
    restartButton.style.position = 'absolute';
    restartButton.style.left = `${canvas.width / 2 - restartButton.offsetWidth / 2}px`;
    restartButton.style.top = `${canvas.height / 2 + 70}px`;
}

function hideRestartButton() {
    restartButton.style.display = 'none';
}

restartButton.addEventListener('click', resetGame);

animate();

addEventListener('keydown', ({ keyCode }) => {
    if (gameState === 'playing') {
        switch (keyCode) {
            case 65: 
                keys.left.pressed = true;
                break;

            case 68:
                keys.right.pressed = true;
                break;

            case 87: 
                if (player.isOnGround) {
                    player.velocity.y -= 10;
                    player.isOnGround = false;
                }
                break;
        }
    }
});

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            keys.left.pressed = false;
            break;

        case 68:
            keys.right.pressed = false;
            break;
    }
});
