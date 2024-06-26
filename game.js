const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;
const initialPlayerPosition = { x: 100, y: 100 };

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
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
            this.isOnGround = true;
        }

        // Check if player falls off the screen
        if (this.position.y > canvas.height) {
            this.respawn();
        }
    }

    respawn() {
        this.position = { ...initialPlayerPosition };
        this.velocity = { x: 0, y: 1 };
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
const platforms = [
    new Platform({ x: 50, y: 500, width: 300 }),
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

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.isOnGround = false; // Reset on ground status
    platforms.forEach(platform => platform.draw());

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            platforms.forEach(platform => platform.position.x -= 5);
        } else if (keys.left.pressed) {
            platforms.forEach(platform => platform.position.x += 5);
        }
    }

    // Platform collision detection
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
}

animate();

addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65: // A key (left)
            keys.left.pressed = true;
            break;

        case 68: // D key (right)
            keys.right.pressed = true;
            break;

        case 87: // W key (jump)
            if (player.isOnGround) {
                player.velocity.y -= 10;
                player.isOnGround = false;
            }
            break;
    }
});

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65: // A key (left)
            keys.left.pressed = false;
            break;

        case 68: // D key (right)
            keys.right.pressed = false;
            break;
    }
});
