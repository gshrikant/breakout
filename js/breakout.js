// breakout.js
// Atari's Breakout with HTML5 Canvas and Javascript

'use strict';

var canvas = document.getElementById("game");
var gameStatus = document.getElementById("status");
var ctx = canvas.getContext("2d");
var rightPressed = false;
var leftPressed = false;
var lost = false;
var won = false;
var lives = 3;

// Game attributes
const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;
const MAX_HITS = 2;

var comboMode = false;
var consecutiveHits = 0;
var score = 0;

// Ball attributes
const MULTIPLIER = 2;
const BALL_RADIUS = 10;
var dx = 2, dy = -2;
var bricks = [];
var bricksDown = 0;

// Brick attributes
const BRICK_ROWS = 3;
const BRICK_COLUMNS = 10;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 2;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 15;

// Paddle attributes
const PADDLE_HEIGHT = 10, PADDLE_WIDTH = 75;
var px = Math.random()*(canvas.width - PADDLE_WIDTH);
var py = canvas.height - PADDLE_HEIGHT;
var x = px + PADDLE_WIDTH/2;
var y = canvas.height - 30;

function reset() {
    x = canvas.width/2;
    y = canvas.height - 30;
    dx = 2, dy = -2;
    px = canvas.width/3;
}

function createBricks() {
    for (var c = 0; c < BRICK_COLUMNS; ++c) {
        bricks[c] = [];
        for (var r = 0; r < BRICK_ROWS; ++r) {
            bricks[c][r] = { x: 0, y: 0, value: 0, status: true };
        }
    }
}

function checkCollisions() {
    // Loop over all bricks to see if ball touched any of them.
    for (var c = 0; c < BRICK_COLUMNS; ++c) {
        for (var r = 0; r < BRICK_ROWS; ++r) {
            var b = bricks[c][r];

            // Only collide with existing bricks.
            if (b.status) {
                if (x > b.x && x < b.x + BRICK_WIDTH) {
                    if (y > b.y && y < b.y + BRICK_HEIGHT) {
                        dy = -dy;

                        // Combo mode: 2x points!
                        consecutiveHits++;
                        if (consecutiveHits >= 2) {
                            comboMode = true;
                        }

                        score = comboMode ? (score + MULTIPLIER*2) : (score+1);
                        b.value--;

                        if (!b.value) {
                            b.status = false;
                            ++bricksDown;
                        }

                        if (bricksDown == BRICK_ROWS*BRICK_COLUMNS) {
                            won = true;
                        }
                    }
                }
            }
        }
    }
}

function drawBricks() {
    const brickColor = [ "#c96457", "green", "yellow" ];
    for (var c = 0; c < BRICK_COLUMNS; ++c) {
        for (var r = 0; r < BRICK_ROWS; ++r) {
            // Draw live bricks.
            if (bricks[c][r].status) {
                // Compute brick position.
                var bx = c*(BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                var by = r*(BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
                if (!bricks[c][r].value) {
                    var hits = 1 + Math.round(MAX_HITS*Math.random());
                    bricks[c][r].value = hits;
                }

                bricks[c][r].x = bx;
                bricks[c][r].y = by;

                // Draw brick
                ctx.beginPath();
                ctx.rect(bx, by, BRICK_WIDTH, BRICK_HEIGHT);
                // ctx.fillStyle = "#c96457";
                ctx.fillStyle = brickColor[bricks[c][r].value - 1];
                ctx.fill();

                // Draw borders
                ctx.moveTo(bx, by);
                ctx.lineTo(bx + BRICK_WIDTH, by);
                ctx.lineTo(bx + BRICK_WIDTH, by + BRICK_HEIGHT);
                ctx.lineTo(bx, by + BRICK_HEIGHT);
                ctx.lineTo(bx, by);
                ctx.strokeStyle = "black";
                ctx.stroke();

                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = comboMode ? "#f00050": "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawPaddle() {
    ctx.beginPath();

    // Draw paddle
    ctx.rect(px, py, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "rgba(255, 255, 0)";
    ctx.fill();

    // Draw borders
    ctx.moveTo(px, py);
    ctx.lineTo(px + PADDLE_WIDTH, py);
    ctx.lineTo(px + PADDLE_WIDTH, py + PADDLE_HEIGHT);
    ctx.lineTo(px, py + PADDLE_HEIGHT);
    ctx.lineTo(px, py);
    ctx.strokeStyle = "blue";
    ctx.stroke();

    ctx.closePath();
}

function drawBall() {
    const RADIUS = BALL_RADIUS,
          START_ANGLE = 0,
          END_ANGLE = Math.PI*2;

    ctx.beginPath();
    ctx.arc(x, y, RADIUS, START_ANGLE, END_ANGLE);
    var color = comboMode ? "#f00500" : "#0095DD" ;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function gameOver() {
    gameStatus.innerHTML = "Game Over!";
}

function victory() {
    gameStatus.innerHTML = "Congratulations!";
}

function draw() {
    // Clear the canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLives();
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();

    // Detect wall collisions.
    if (y < BALL_RADIUS) {
        dy = -dy;
    } else if (y > canvas.height - BALL_RADIUS - PADDLE_HEIGHT) {
        // Include radius to allow ball to bounce off of corners.
        if (x > px - BALL_RADIUS && x < px + PADDLE_WIDTH + BALL_RADIUS) {
            // Advanced mode: speed up a little each time we hit
            // the paddle.
            dy = -1.05*dy;
            comboMode = false;
            consecutiveHits = 0;
        } else {
            lives--;
            lost = !lives;
            if (!lost) {
                reset();
            }
        }
    }

    if (x > canvas.width - BALL_RADIUS || x < BALL_RADIUS) {
        dx = -dx;
    }

    checkCollisions();

    // Move the ball.
    x += dx;
    y += dy;

    // Move the paddle.
    if (rightPressed && px < canvas.width - PADDLE_WIDTH) {
        px += 7;
    } else if (leftPressed && px > 0) {
        px -= 7;
    }

    if (lost) {
        gameOver();
    } else if (won) {
        victory();
    } else {
        requestAnimationFrame(draw);
    }

}

function mouseMoveHandler(e) {
    var relx = e.clientX - canvas.offsetLeft;
    if (relx > 0 && relx < canvas.width) {
        px = relx - PADDLE_WIDTH/2;
    }
}

function keyupHandler(key) {
    if (key.keyCode == RIGHT_ARROW) {
        rightPressed = false;
    } else if (key.keyCode == LEFT_ARROW) {
        leftPressed = false;
    }
}

function keydownHandler(key) {
    if (key.keyCode == RIGHT_ARROW) {
        rightPressed = true;
    } else if (key.keyCode == LEFT_ARROW) {
        leftPressed = true;
    }
}

createBricks();
document.addEventListener("keydown", keydownHandler, false);
document.addEventListener("keyup", keyupHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
draw();
