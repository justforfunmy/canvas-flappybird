# 使用 canvas 开发 flappy bird

- [准备工作](#准备工作)
  1. [常量定义](#常量定义)
  2. [创建画布](#创建画布)
  3. [全局变量](#全局变量)
- [游戏元素](#游戏元素)
  1. [小鸟](#小鸟)
  2. [管道](#管道)
- [初始化](#初始化)

## 准备工作

- ### 常量定义

定义一些常量

```js
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
```

- ### 创建画布

```js
const root = document.getElementById('root');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.background = '#fff';
canvas.style.border = '1px solid grey';
root.appendChild(canvas);
```

- ### 全局变量

```js
let started = false; // 游戏是否开始
let startNumber = 4; // 游戏倒计时数字
let count = 0; // 通过的管道数量
let pipeArray = []; // 管道数组
```

## 游戏元素

- ### 小鸟

引入小鸟的图片并绘制到画布上

```js
import img from './assets/bird.png';
const bird = {
  speed: BIRD_SPEED,
  x: 80, //原始x坐标
  y: canvas.height / 2 //原始y坐标
};

const birdImage = new Image();
let birdReady = false; //判断图片是否加载完，以确定是否能绘制小鸟
birdImage.onload = () => {
  birdReady = true;
};

birdImage.src = img;
```

- ### 管道

```js
let id = 0; //管道自增id，主要用于显示通过的管道个数
function PIPE(x) {
  // eslint-disable-next-line no-plusplus
  this.id = id++;
  this.x = x; // 管道的x坐标位置
  this.width = PIPE_WIDTH;
  this.upHeight = parseInt(Math.random() * 200 + 50, 10); // 管道的上部分高度
  this.downHeight = canvas.height - this.upHeight - PIPE_GAP; // 管道的下部分高度
}
```

## 初始化

```js
const init = () => {
  pipeArray = [];
  bird.x = 80;
  bird.y = canvas.height / 2;
  started = false;
  startNumber = 4;
  count = 0;
  // 按照一定的间距生成管道数组
  let startX = 400;
  while (startX < canvas.width + 400) {
    const pipe = new PIPE(startX);
    pipeArray.push(pipe);
    startX += PIPE_SPACE;
  }
};
```
