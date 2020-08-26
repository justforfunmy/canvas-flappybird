/* eslint-disable no-restricted-globals */
import bird from './assets/bird.png';

const root = document.getElementById('root');

// constants

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;

const BAMBOO_WIDTH = 40;
const BAMBOO_GAP = 120;
const BAMBOO_SPEED = 256;

const X_GAP = 160;

// create the canvas

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.background = '#fff';
canvas.style.border = '1px solid grey';
root.appendChild(canvas);

let started = false;

// game objects

const hero = {
  speed: 256,
  x: 0,
  y: canvas.height / 2
};

const heroImage = new Image();
let heroReady = false;
heroImage.onload = () => {
  heroReady = true;
};

heroImage.src = bird;

const bambooArray = [];
function Bamboo(x) {
  this.x = x;
  this.width = BAMBOO_WIDTH;
  this.upHeight = parseInt(Math.random() * 200 + 50, 10);
  this.downHeight = canvas.height - this.upHeight - BAMBOO_GAP;
}

// player input

const keysDown = {};

addEventListener(
  'keydown',
  (e) => {
    keysDown[e.keyCode] = true;
  },
  false
);

addEventListener(
  'keyup',
  (e) => {
    if (e.keyCode === 32) {
      started = !started;
    }
    delete keysDown[e.keyCode];
  },
  false
);

// update projects

const updateHero = (modifier) => {
  if (38 in keysDown) {
    // Player holding up
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) {
    // Player holding down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) {
    // Player holding left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) {
    // Player holding right
    hero.x += hero.speed * modifier;
  }
};

const updateBamboo = (modifier) => {
  const head = bambooArray[0].x;
  const tail = bambooArray[bambooArray.length - 1].x;
  if (head + BAMBOO_WIDTH < 0) {
    bambooArray.shift();
    const bamboo = new Bamboo(tail + X_GAP);
    bambooArray.push(bamboo);
  }

  bambooArray.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.x -= BAMBOO_SPEED * modifier;
  });
};

// draw bamboo

const drawBamboo = (item) => {
  // eslint-disable-next-line object-curly-newline
  const { x, width, upHeight, downHeight } = item;
  ctx.fillStyle = 'green';
  ctx.fillRect(x, 0, width, upHeight);
  ctx.fillRect(x, upHeight + BAMBOO_GAP, width, downHeight);
};

// render

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  bambooArray.forEach((item) => {
    drawBamboo(item);
  });
};

// The main game loop
let then = Date.now();

const main = () => {
  const now = Date.now();
  const delta = now - then;

  updateHero(delta / 1000);
  if (started) {
    updateBamboo(delta / 1000);
  }

  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

let startX = 50;
const init = () => {
  while (startX < canvas.width) {
    const bamboo = new Bamboo(startX);
    bambooArray.push(bamboo);
    startX += X_GAP;
  }
};

init();

main();

// start button
