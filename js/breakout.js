// breakout.js
// Atari's Breakout with HTML5 Canvas and Javascript
// Shrikant Giridhar

'use strict';

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height - 30;
var paddleHeight = 10, paddleWidth = 75;

// Refresh period (s)
const REFRESH = 10;

// Game attributes
const BALL_RADIUS = 10;
var dx = 2, dy = 2;

function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(canvas.width/2, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fill();
    ctx.closePath();
}

function drawBall()
{
    const RADIUS = BALL_RADIUS,
          START_ANGLE = 0,
          END_ANGLE = Math.PI*2;

    ctx.beginPath();
    ctx.arc(x, y, RADIUS, START_ANGLE, END_ANGLE);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    // Detect wall collisions.
    if (y > canvas.height - BALL_RADIUS || y < BALL_RADIUS) {
        dy = -dy;
    }

    if (x > canvas.width - BALL_RADIUS || x < BALL_RADIUS) {
        dx = -dx;
    }

    x += dx;
    y += dy;
}

setInterval(draw, REFRESH);
