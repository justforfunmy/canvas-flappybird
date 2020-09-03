/* eslint-disable no-restricted-globals */
import img from './assets/bird.png';

const root = document.getElementById('root');

// constants

// 画布的宽高
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;

const PIPE_WIDTH = 40; // 管道宽度
const PIPE_GAP = 180; // 管道间隙，即中间的安全区域
const PIPE_SPEED = 180; // 管道移动的速度
const PIPE_SPACE = 160; // 两个管道间横向的距离

const BIRD_WIDTH = 32; // 小鸟宽度
const BIRD_HEIGHT = 32; // 小鸟高度
const BIRD_SPEED = 150; // 小鸟移动速度

// create the canvas

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.background = '#fff';
canvas.style.border = '1px solid grey';
root.appendChild(canvas);

// variables
let started = false; // 游戏是否开始
let startNumber = 4; // 游戏倒计时数字
let count = 0; // 通过的管道数量
let pipeArray = []; // 管道数组

// game objects

const bird = {
  speed: BIRD_SPEED,
  x: 80,
  y: canvas.height / 2
};

const birdImage = new Image();
let birdReady = false;
birdImage.onload = () => {
  birdReady = true;
};

birdImage.src = img;

let id = 0;
function PIPE(x) {
  // eslint-disable-next-line no-plusplus
  this.id = id++;
  this.x = x;
  this.width = PIPE_WIDTH;
  this.upHeight = parseInt(Math.random() * 200 + 50, 10);
  this.downHeight = canvas.height - this.upHeight - PIPE_GAP;
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

// init

const init = () => {
  let startX = 400;
  pipeArray = [];
  bird.x = 80;
  bird.y = canvas.height / 2;
  started = false;
  startNumber = 4;
  count = 0;
  while (startX < canvas.width + 400) {
    const pipe = new PIPE(startX);
    pipeArray.push(pipe);
    startX += PIPE_SPACE;
  }
};

// judge

const judgeCrash = (item) => {
  if (bird.y < item.upHeight || bird.y + BIRD_HEIGHT > item.upHeight + PIPE_GAP) {
    alert('dead!');
    init();
  } else {
    count = item.id;
  }
};

// update projects

const updateHero = (modifier) => {
  if (!started || startNumber > 0) {
    return;
  }
  if (jump) {
    bird.y -= bird.speed * 2 * modifier;
  } else {
    bird.y += bird.speed * modifier;
  }
};

const updatePIPE = (modifier) => {
  const head = pipeArray[0].x;
  const tail = pipeArray[pipeArray.length - 1].x;
  if (head + PIPE_WIDTH < 0) {
    pipeArray.shift();
    const pipe = new PIPE(tail + PIPE_SPACE);
    pipeArray.push(pipe);
  }

  pipeArray.forEach((item) => {
    if (item.x < bird.x + BIRD_WIDTH && item.x > bird.x - PIPE_WIDTH) {
      judgeCrash(item);
    }
    // eslint-disable-next-line no-param-reassign
    item.x -= PIPE_SPEED * modifier;
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

// draw PIPE

const drawPipe = (item) => {
  // eslint-disable-next-line object-curly-newline
  const { x, width, upHeight, downHeight } = item;
  ctx.fillStyle = 'green';
  ctx.fillRect(x, 0, width, upHeight);
  ctx.fillRect(x, upHeight + PIPE_GAP, width, downHeight);
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

// draw BIRD

const drawBird = () => {
  if (birdReady) {
    ctx.drawImage(birdImage, bird.x, bird.y);
  }
};

// draw count

const drawCount = () => {
  ctx.fillStyle = '#111';
  ctx.strokeStyle = '#111'; // 设置笔触的颜色
  ctx.font = "bold 40px '字体','字体','微软雅黑','宋体'"; // 设置字体
  ctx.textBaseline = 'hanging'; // 在绘制文本时使用的当前文本基线
  ctx.textAlign = 'center';
  ctx.fillText(count, 30, 30);
};

// render

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();

  pipeArray.forEach((item) => {
    drawPipe(item);
  });

  drawText();

  drawCount();
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
    updatePIPE(delta / 1000);
  }

  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

init();

main();
