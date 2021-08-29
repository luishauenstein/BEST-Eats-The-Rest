// preload all images
const snakeTileFolder = 'snakeTiles'; //name of folder
const snakeTileTypes = ['snakeHead', 'snakeStraight', 'snakeLeft', 'snakeRight', 'snakeTail']; //types of snake tiles (must match file names)
const shitcoinTileFolder = 'shitcoinTiles'; //name of folder
const shitcoinSrc = ['bnb.png', 'cro.png', 'ftt.png', 'ht.png']; //src's of shitcoin images, path from inside shitcoinTiles folder
const imagesToLoad = [];
snakeTileTypes.forEach((_src) => {
  for (let i = 0; i < 4; i++) {
    imagesToLoad.push('./' + snakeTileFolder + '/' + _src + i + '.png');
  }
});
shitcoinSrc.forEach((_src) => imagesToLoad.push('./' + shitcoinTileFolder + '/' + _src));
const preload = imagesToLoad.map((_src) => {
  let img = new Image();
  img.src = _src;
  return img;
});

// get game canvas and context
const canvas = document.getElementById('game');
const c = canvas.getContext('2d');

// set world properties
const tileSize = 18; //size of single tile in pixels
const aspectRatio = 2; // width/height
const xTicks = 26; // number of ticks of axes
const yTicks = xTicks / 2;
canvas.width = tileSize * xTicks; //set pixel w and h of canvas accordingly
canvas.height = tileSize * yTicks;

const drawTile = (_object) => {
  //draw tile at position x y
  const xPixel = (_object.x - 1) * tileSize; // x and y start at 1
  const yPixel = canvas.height - _object.y * tileSize; // cavas origin upper left --> invert so x y zero is at the bottom left
  c.drawImage(_object.image, xPixel, yPixel);
};

//constructor for creating new tile objects (snake tiles and shitcoin tiles)
function tile(_x, _y, _src, _direction = 0) {
  this.image = new Image();
  this.image.src = _src;
  this.x = _x;
  this.y = _y;
  this.direction = _direction; //0: up; 1: right; 2: down; 3: left
}

// SNAKE
let snake = []; //array of snake tiles (snake[0] ist end, snake[snake.length - 1] is head)

// SHITCOIN
let shitcoin; //var saves current shitcoin object
const randomNewShitcoin = () => {
  //generate new shitcoin in random position while making sure that there are no collision
  let x, y, collision;
  do {
    collision = false;
    x = Math.floor(Math.random() * xTicks) + 1; //select random position for shitcoin
    y = Math.floor(Math.random() * yTicks) + 1;
    snake.forEach((obj) => {
      //check if there's a collision
      if (obj.x === x && obj.y === y) {
        collision = true;
      }
    });
  } while (collision); //reroll if collision
  const src =
    './' + shitcoinTileFolder + '/' + shitcoinSrc[Math.floor(Math.random() * shitcoinSrc.length)]; //get random src image for shitcoin
  return new tile(x, y, src);
};

//set ticks per second (speed of game)
let tickInterval, tps;
const setTPS = (tps) => {
  tickInterval = 1000 / tps; //set delay in ms between each tick
  return tps;
};

const resetGame = () => {
  scene = 1;
  shitcoin = randomNewShitcoin();
  tps = setTPS(7);
  snake = [
    new tile(1, 3, './snakeTiles/snakeTail1.png', 1),
    new tile(2, 3, './snakeTiles/snakeStraight1.png', 1),
    new tile(3, 3, './snakeTiles/snakeStraight1.png', 1),
    new tile(4, 3, './snakeTiles/snakeHead1.png', 1),
  ];
  upcomingDirection = 1;
};

// SCENES
let scene = 0;

// main menu (scene 0)
let username;

//select input
let nameInput = document.getElementById('nameInput');
nameInput.focus();
nameInput.select();

//click play button
const mainmenu = document.getElementById('mainmenu');
const scoreCounter = document.getElementById('inGameScore');
const menuScoreCounter = document.getElementById('scoreNum');
const playButtonClick = () => {
  //undisplay main menu and score counter in menu
  mainmenu.style.display = 'none';
  menuScoreCounter.style.display = 'none';
  score = 0;
  scene = 1;
  time = Date.now();
  //save username if it's first time, removes input then
  if (nameInput) {
    username = nameInput.value;
    if (username != '') {
      document.getElementById('nameSpan').innerHTML = username;
    } else {
      document.getElementById('nameSpan').innerHTML = 'Nameless Champ <3';
    }
    nameInput.remove();
    nameInput = null;
    document.getElementById('enterYourName').remove();
  }

  //reset score counter
  scoreCounter.innerHTML = '0';
  scoreCounter.style.display = 'block';
  //reset game
  resetGame();
  drawFrame();
};

//game over handler
const gameOver = () => {
  scene = 0;
  document.getElementById('inGameScore').style.display = 'none';
  mainmenu.style.display = 'block';
  document.getElementById('yourScore').style.display = 'block';
  menuScoreCounter.innerHTML = score;
  menuScoreCounter.style.display = 'block';

  //get time games has laster in seconds
  time = Math.round((Date.now() - time) / 1000);

  //post score to leaderboard
  const data =  JSON.stringify({
    passwordPost: "C2p%z1e3",
    namePost: username,
    scorePost: score,
    timePost: time,
  })
  console.log(data);
  fetch('./leaderboard/post_score.php', {
    method: 'POST',
    body: data,
  })
};

// game loop (scene 1)
let score = 0;
let time;
let then = 0;
let now;
const gameLoop = () => {
  //only execute if enough time has passed for next tick
  now = Date.now();
  const elapsed = now - then;
  if (elapsed >= tickInterval) {
    then = Date.now(); //reset timer

    // MOVEMENT HANDLER
    // add head in correct position
    const oldX = snake[snake.length - 1].x; //x of old head
    const oldY = snake[snake.length - 1].y; //y of old head
    let newHead;
    pastDirection = upcomingDirection; //lock in direction
    const headImgSrc = './snakeTiles/snakeHead' + pastDirection + '.png';
    switch (pastDirection) {
      case 0: //up
        // add 1 to y; if outside of boundary set y=0
        newHead = new tile(oldX, oldY < yTicks ? oldY + 1 : 1, headImgSrc, pastDirection);
        break;
      case 1: //right
        newHead = new tile(oldX < xTicks ? oldX + 1 : 1, oldY, headImgSrc, pastDirection);
        break;
      case 2: //down
        // subtract 1 from y; if outside of boundary set y to max
        newHead = new tile(oldX, oldY > 1 ? oldY - 1 : yTicks, headImgSrc, pastDirection);
        break;
      case 3: //left
        newHead = new tile(oldX > 1 ? oldX - 1 : xTicks, oldY, headImgSrc, pastDirection);
        break;
      default:
        console.log('Error: No movement input');
    }
    snake.push(newHead);

    //set correct 2nd IMG
    const n = snake.length - 1;
    if (snake[n].x === snake[n - 2].x || snake[n].y === snake[n - 2].y) {
      //if going straight
      snake[n - 1].image.src = './snakeTiles/snakeStraight' + pastDirection + '.png';
    } else if (
      //turn right
      snake[n].direction === snake[n - 1].direction + 1 ||
      (snake[n - 1].direction === 3 && snake[n].direction === 0)
    ) {
      snake[n - 1].image.src = './snakeTiles/snakeRight' + pastDirection + '.png';
    } else {
      snake[n - 1].image.src = './snakeTiles/snakeLeft' + pastDirection + '.png';
    }

    // keep tail & increase TPS is shitcoin hasn't been eaten, otherwise delete tail
    if (newHead.x === shitcoin.x && newHead.y === shitcoin.y) {
      tps = setTPS(tps + 0.25);
      shitcoin = randomNewShitcoin();

      score++;
      scoreCounter.innerHTML = score;
    } else {
      snake.shift();
      snake[0].image.src = './snakeTiles/snakeTail' + snake[1].direction + '.png';
    }

    //check if collision and end game if that's the case
    //snake can't collide with itself in the first four tiles
    for (let i = 0; i < snake.length - 4; i++) {
      if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
        gameOver();
      }
    }

    // redraw
    c.clearRect(0, 0, canvas.width, canvas.height); //clear old stuff from canvas
    snake.forEach((obj) => drawTile(obj)); // draw each snake tile
    shitcoin && drawTile(shitcoin); //draw shitcoin if there is one
  }
};

// CONTROLS
let upcomingDirection = 1; //0: up; 1: right; 2: down; 3: left
let pastDirection = 1; //last tick direction
window.addEventListener('keydown', (event) => {
  if (scene == 1) {
    event.preventDefault();
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        if (pastDirection != 2) {
          upcomingDirection = 0;
        }
        break;
      case 'KeyD':
      case 'ArrowRight':
        if (pastDirection != 3) {
          upcomingDirection = 1;
        }
        break;
      case 'KeyS':
      case 'ArrowDown':
        if (pastDirection != 0) {
          upcomingDirection = 2;
        }
        break;
      case 'KeyA':
      case 'ArrowLeft':
        if (pastDirection != 1) {
          upcomingDirection = 3;
        }
    }
  }
});

function drawFrame() {
  scene == 1 && requestAnimationFrame(drawFrame); //drawing loop
  gameLoop();
}
