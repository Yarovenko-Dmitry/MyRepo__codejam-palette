let bucket = document.querySelector('.top-first');
let pencil = document.querySelector('.top-third');

let currentColorSelected = document.querySelector('#choose-color');

let currentColorPoint = document.querySelector('.bottom-first');
let prevColorPoint = document.querySelector('.bottom-second');
prevColorPoint.style.backgroundColor = '#41F795';
let constRed = document.querySelector('.bottom-third');
let constBlue = document.querySelector('.bottom-fourth');

const canvas = document.querySelector('canvas'); 
const ctx = canvas.getContext('2d');
const widthCanvas = 512;
const heightCanvas = 512;
canvas.width = widthCanvas;
canvas.height = heightCanvas;

let dataURLCanvas = localStorage.getItem('canvasString');
let imgCanvas = new Image;
imgCanvas.src = dataURLCanvas;
imgCanvas.onload = function () {
    ctx.drawImage(imgCanvas, 0, 0);
};

function fillCanvas(color) {
  
  for(let row = 0; row < heightCanvas; row++) {
    for(let col = 0; col < widthCanvas; col++) { 
      ctx.fillStyle = color.value || color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);                
    }
  }

  localStorage.setItem('canvasString', canvas.toDataURL());
}

bucket.addEventListener('click', fillCanvas.bind(null, currentColorSelected));
pencil.addEventListener('click', drawLineCanvas.bind(null, currentColorSelected));

constRed.addEventListener('click',  changeCurrentColor.bind(null, currentColorSelected, '#F74141'));
constBlue.addEventListener('click',  changeCurrentColor.bind(null, currentColorSelected, '#41B6F7'));
prevColorPoint.addEventListener('click', changeCurrentColor.bind(null, currentColorSelected, prevColorPoint));

window.addEventListener('load', changeColor, false);

function changeColor() {
  currentColorSelected.addEventListener('input', changeColorTool, false);
}

function changeColorTool() {
  prevColorPoint.style.backgroundColor = currentColorPoint.style.backgroundColor;
  currentColorPoint.style.backgroundColor = currentColorSelected.value;
}

function changeCurrentColor(current, color) {
  let newColor = (color.style && color.style.backgroundColor) || color;

  if (newColor.indexOf('rgb') !== -1) {
    const regex = /\d+/g;
    let numbersRGB = newColor.match(regex);

    // magic function rgbToHex from http://qaru.site/questions/20092/rgb-to-hex-and-hex-to-rgb
    function rgbToHex(red, green, blue) {
      let rgb = blue | (green << 8) | (red << 16);
      return '#' + (0x1000000 + rgb).toString(16).slice(1);
    };
    newColor = rgbToHex(numbersRGB[0], numbersRGB[1], numbersRGB[2]);
  } 

  currentColorPoint.style.backgroundColor = newColor;
  current.value = newColor;
};

document.addEventListener( 'keydown', (event) => {
  switch (event.code) {
    case 'KeyB':
      fillCanvas(currentColorSelected);
      break;
    case 'KeyP':
      drawLineCanvas(currentColorSelected);
      break;
  }
});

function drawLineCanvas(colorLine) {

  ctx.strokeStyle = colorLine.value;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5;

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function draw(e) {
    
    if(!isDrawing) {return;}
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;

    localStorage.setItem('canvasString', canvas.toDataURL());
  };

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
  });

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);  
};

