/* eslint-disable no-restricted-globals */
import bird from './assets/bird.png';

const root = document.getElementById('root');

// constants

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;

const BAMBOO_WIDTH = 40;
const BAMBOO_GAP = 120;
const BAMBOO_SPEED = 150;

const X_GAP = 160;

// create the canvas

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.background = '#fff';
canvas.style.border = '1px solid grey';
root.appendChild(canvas);

// variables
let started = false;
let startNumber = 4;

// game objects

const hero = {
  speed: 100,
  x: 80,
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
let jump = false;
let timer = null;

addEventListener(
  'keydown',
  (e) => {
    if (e.keyCode === 38) {
      if (jump) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          jump = false;
        }, 250);
      } else {
        jump = true;
        timer = setTimeout(() => {
          jump = false;
        }, 250);
      }
    }
  },
  false
);

addEventListener(
  'keyup',
  (e) => {
    if (e.keyCode === 32) {
      started = true;
    }
    delete keysDown[e.keyCode];
  },
  false
);

// update projects

const updateHero = (modifier) => {
  if (!started || startNumber > 0) {
    return;
  }
  if (jump) {
    hero.y -= hero.speed * 2 * modifier;
  } else {
    hero.y += hero.speed * modifier;
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

let current = Date.now();
const updateNumber = () => {
  const now = Date.now();
  if (now - current > 500) {
    startNumber -= 1;
    current = now;
  }
};

// draw bamboo

const drawBamboo = (item) => {
  // eslint-disable-next-line object-curly-newline
  const { x, width, upHeight, downHeight } = item;
  ctx.fillStyle = 'green';
  ctx.fillRect(x, 0, width, upHeight);
  ctx.fillRect(x, upHeight + BAMBOO_GAP, width, downHeight);
};

// draw text

const drawText = () => {
  if (startNumber > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = '#111';
  ctx.strokeStyle = '#111'; // 设置笔触的颜色
  ctx.font = "bold 40px '字体','字体','微软雅黑','宋体'"; // 设置字体
  ctx.textBaseline = 'hanging'; // 在绘制文本时使用的当前文本基线
  ctx.textAlign = 'center';
  if (startNumber > 0 && startNumber < 4) {
    ctx.fillText(startNumber, canvas.width / 2, canvas.height / 2 - 30);
  } else if (startNumber === 4) {
    ctx.fillText('空格键开始', canvas.width / 2, canvas.height / 2 - 30);
  }
};

// draw hero

const drawHero = () => {
  ctx.save();
  if (heroReady) {
    if (jump) {
      ctx.rotate(-45);
    }
    ctx.drawImage(heroImage, hero.x, hero.y);
  }
  ctx.restore();
};

// render

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHero();

  bambooArray.forEach((item) => {
    drawBamboo(item);
  });

  drawText();
};

// The main game loop
let then = Date.now();

const main = () => {
  const now = Date.now();
  const delta = now - then;

  updateHero(delta / 1000);
  if (started) {
    updateNumber();
  }

  if (startNumber < 0) {
    updateBamboo(delta / 1000);
  }

  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

let startX = 400;
const init = () => {
  while (startX < canvas.width + 400) {
    const bamboo = new Bamboo(startX);
    bambooArray.push(bamboo);
    startX += X_GAP;
  }
};

init();

main();

// start button
