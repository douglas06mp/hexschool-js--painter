// CANVAS SETUP
const canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#E8E8E8';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

// TOOLBAR TOP
const save = document.querySelector('.save')
const clear = document.querySelector('.clear');
const undobtn = document.querySelector('.undo');
const redobtn = document.querySelector('.redo');

// UNDO REDO
const STACK_MAX_SIZE = 20;
let undoDataStack = [];
let redoDataStack = [];

// TOOLBAR BOTTOM
const widthInput = document.querySelector('input[type="number"]');
const colorSpan = document.querySelectorAll('span');

const colorPicker = document.querySelector('span:last-child')
const inputColor = document.querySelector('input[type="color"]')

const eraser = document.querySelector('.erase');
const painter = document.querySelector('.paint');

//HIDE BTN
const hidebtn = document.querySelectorAll('.hide-btn');
const toolbarTop = document.querySelector('.toolbar-top');
const toolbarBottom = document.querySelector('.toolbar-bottom')

// CURSOR
const cursor = document.querySelector('.cursor');

// variable
var colors = ['#fff','#000000','#9BFFCD','#00CC99','#01936F'];
var color = '#000000';
var lastColor = 'rgb(0,0,0)';

var width = 5;
var mousePressed = false;
var lastX, lastY;




// FUCTION

function paint(x,y, isMove){  // PAINT
  if(isMove){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.moveTo(lastX,lastY);
    ctx.lineTo(x,y);
    ctx.stroke();
  }
  lastX = x;
  lastY = y;
}


// UNDO REDO
function saveDraw(){       //When mouse click save the draw
  redoDataStack = [];
  redobtn.classList.add('disable');
  if (undoDataStack.length >= STACK_MAX_SIZE) {
    undoDataStack.pop();
  }
  undoDataStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
  undobtn.classList.remove('disable');
}

function undo(){
  if (undoDataStack.length <= 0) return;
  redoDataStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
  redobtn.classList.remove('disable');
  const imageData = undoDataStack.shift();
  ctx.putImageData(imageData, 0, 0);
  if (undoDataStack.length <= 0) {
    undobtn.classList.add('disable');
  }
}

function redo(){
  if (redoDataStack.length <= 0) return;
  undoDataStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
  undobtn.classList.remove('disable');
  const imageData = redoDataStack.shift();
  ctx.putImageData(imageData, 0, 0);
  if (redoDataStack.length <= 0) {
    redobtn.classList.add('disable');
  }
}

// HIDE TOOLBAR
function hideToolbar(e){
  toolbarTop.classList.toggle('toolbar-top-hide');
  toolbarBottom.classList.toggle('toolbar-bottom-hide');
  let up = '<i class="fas fa-chevron-up"></i>'
  let down = '<i class="fas fa-chevron-down"></i>'
  hidebtn[0].innerHTML === up ? hidebtn[0].innerHTML = down : hidebtn[0].innerHTML = up;
  hidebtn[1].innerHTML === up ? hidebtn[1].innerHTML = down : hidebtn[1].innerHTML = up;
}

// CURSOR
function cursorMove(e){
  cursor.style.width = width + 'px';
  cursor.style.height = width + 'px';
  cursor.style.backgroundColor = color;
  cursor.style.top = e.offsetY - width/2 + 'px';
  cursor.style.left = e.offsetX - width/2 + 'px';
}






// CANVAS DRAW FUNCTION
canvas.addEventListener('mousedown', e => {
  saveDraw();
  mousePressed = true;
  paint(e.offsetX, e.offsetY, false)
});

canvas.addEventListener('mousemove', e => {
  if(mousePressed) paint(e.offsetX, e.offsetY, true);
});

canvas.addEventListener('mousemove', e => {
  cursorMove(e);
});

['mouseup','mouseleave'].forEach(evt => {
  canvas.addEventListener(evt, () => {
    mousePressed = false;
  });
});



// ERASER AND PAINTER
eraser.addEventListener('click', () => {
  lastColor = color;
  Array.from(colorSpan).forEach(s => {
    s.classList.remove('selected');
  });
  eraser.classList.add('animated','heartBeat');
  eraser.style.color = '#000000';
  painter.classList.remove('animated','heartBeat');
  painter.style.color = '#E8E8E8';
  color = '#E8E8E8';
});

painter.addEventListener('click', () => {
  painter.classList.add('animated','heartBeat');
  painter.style.color = '#000000';
  eraser.classList.remove('animated','heartBeat');
  eraser.style.color = '#E8E8E8';
  Array.from(colorSpan).forEach(s => {
    if(s.style.backgroundColor == lastColor){
      s.classList.add('selected');
    }
  });
  color = lastColor;
});


// Change Width
widthInput.addEventListener('change', e => {
  width = e.target.value;
});

// SET COLOR and CHANGE COLOR
for(let i=0; i<colors.length; i++){
  colorSpan[i].style.backgroundColor = colors[i];
}

colorSpan.forEach(span => span.addEventListener('click', function(e){
  color = this.style.backgroundColor;
  painter.style.color = '#000';
  eraser.style.color = '#E8E8E8';
  Array.from(colorSpan).forEach(s => {
    s.classList.remove('selected');
  });
  this.classList.add('selected');
}));

//COLOR PICKER
inputColor.addEventListener('change', () => {
  color = inputColor.value;
});


// SAVE
save.addEventListener('click', (e) => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL();
  link.download = 'canvas.png';
  link.click();
});

// CLEAR ALL
clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#E8E8E8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
})

// UNDO REDO
undobtn.addEventListener('click', undo);
redobtn.addEventListener('click', redo);

// HIDE BTN
hidebtn.forEach(btn => btn.addEventListener('click',hideToolbar));
