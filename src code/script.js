//global variables
let sceneNum = 1;
let paddleX = 340;
let circleX = 390;
let circleY = 569;
let circleXDirection = 1;
let circleYDirection = 1;
let extraLives = 4;
let lifeLost = false;
let directionChanged = false;
let brickColors = ["pink", "red", "orange", "yellow", "green", "blue", "purple", "teal"];
let blocks = [];
let score = 0;
let paddleSize = 250;
let ballSpeedMultiplier = 3.5;
let timer = 0;
let fade = 0;
let isdevMode = false;
let devModeMouseX;
let devModeMouseY;


function preload() {

  startText = loadFont('PAC-FONT.TTF');
  numbersText = loadFont('Akira Expanded Demo.otf');

  soundFormats('mp3', 'wav');
  brickSound = loadSound('brickSound.mp3');
  paddleSound = loadSound('paddleSound.mp3');
  wallSound = loadSound('wallSound.mp3');
  liveDown = loadSound('liveDown.wav');
  gameOver = loadSound('gameover.mp3');
  devMode = loadSound('showscore.wav');


}


function setup() {
  let sketch = createCanvas(780, 600);
  sketch.parent("mycanvas");

  block(8);



}//end setup



function draw() {

  if (sceneNum == 1) {

    scene1();
  } else if (sceneNum == 2) {

    mainScene();

    //collision checking as soon as scene 2 is loaded
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].collision(i);
    }
    
    
    //initial paddle movement logic

    if(keyIsDown(RIGHT_ARROW)){

      movePaddle(12);

    } 

    if(keyIsDown(LEFT_ARROW)){

      movePaddle(-12);

    }


    
  } else if (sceneNum == 3){

    endScene();
  }

}

//starting screen
function scene1() {


  background(24, 24, 24);
  fill(0, 255, 255);
  noStroke();
  textSize(50);
  textFont(startText);
  text("breakout", 200, 90);
  textSize(35);
  text("start game", 223, 360);
  stroke(0, 255, 255);
  strokeWeight(7);
  noFill();
  rect(210, 275, 350, 150, 20);

}


//main scene
function mainScene() {
  
  background(0, 0, 0);
  noStroke();
  fill(156);
  circle(circleX,circleY,7);
  fill(0, 103, 165);
  rect(paddleX, 577, paddleSize, 15, 7);
  fill(0, 255, 255);
  textSize(40);
  textFont(numbersText);
  text((extraLives + 1), 20, 40);
  textSize(30);
  text((score), 650, 40);

  //call blocks function
  makeBlocks();
  if(blocks.length == 0){
    block(8);
    circleX = 390;
    circleY = 569;
    circleXDirection = 1;
    circleYDirection = 1;
  }
  //call ball function for ball logic
  ball();
  stroke(0,255,255, fade);
  strokeWeight(7);
  line(0,75,780,75);
  fade -= 2;

  //dev mode
  if(isdevMode){
    fill(255,0,0);
    noStroke();
    circle(420,35,22);
  }
  //change scene
  if(extraLives == -1){
    gameOver.play();
    sceneNum = 3;
  }

}


//end scene
function endScene(){
  background(0);
  textSize(60);
  textAlign(LEFT);
  text("FINAL SCORE:", 125, 270);
  textAlign(CENTER);
  text(score, 390, 350);


}


function mousePressed() {

  if (sceneNum == 1 && mouseX > 210 && mouseX < 560 && mouseY > 275 && mouseY < 425) {

    sceneNum++;
  }

  if (isdevMode){

    devModeMouseX = mouseX;
    devModeMouseY = mouseY;
   
  }

}


function keyPressed(){

//reset game while you have lives
  if(key === 'r' && sceneNum == 2 && extraLives >= 0 && circleY > 580){
    circleX = 390;
    circleY = 569;
    circleXDirection = 1;
    circleYDirection = 1;
    lifeLost = false;
  }
  
//press d to toggle dev mode
  if(key === 'd' && sceneNum == 2){
    
    if(isdevMode == false){
      isdevMode = true;
      extraLives = 1000;

    } else {
      isdevMode = false;
      extraLives = 4;
      score = 0;
      paddleSize = 250;
      ballSpeedMultiplier = 3.5;

    }
    devMode.play();
  }

  //if you want to clear all blocks as a dev
  if(key === 'c' && isdevMode && sceneNum == 2){

    blocks.length = 0;
    score += 432;
    
  }

  
}



function movePaddle(paddleMove){
    //move paddle by specified amount
    paddleX += paddleMove;
    //keep paddle on screen
    paddleX = constrain(paddleX,2, width - (paddleSize + 2));


}


function ball(){

  //moving ball
  circleX += ballSpeedMultiplier*circleXDirection;
  circleY -= ballSpeedMultiplier*circleYDirection;

  //constrain ball 
  circleX = constrain(circleX,7, width - 7);
  circleY = constrain(circleY, 87, height + 7);



  //reverse direction if ball hits wall 
  if(circleY < 580 && (circleX == width - 7 || circleX == 7)){

    circleXDirection *= -1;
    wallSound.play();
    
  }
  if(circleY == 87){
   
    circleYDirection *= -1;
    fade = 255;
    wallSound.play();
  
  }

  
  // lose life if ball goes out of bounds
  if(circleY > 580 && !lifeLost){
    extraLives--;
    lifeLost = true;
    if(extraLives != -1){
    liveDown.play();
      }
  }

  //realistic ball padddle collision physics - if ball hits the left side of the paddle it'll go back left and vice versa instead of just flipping direction.

  //check for whether the direction has been changed yet to prevent the paddle moving during ball collision count as two separate hits causing the ball to go in the opposite direction twice.
  if(circleY < 570){
    directionChanged = false;
  }
  
  //left side of paddle
  if(circleY >= 570 && circleY <= 580 && circleX >= paddleX && circleX <= paddleX + (0.3*paddleSize) && !directionChanged){
    circleXDirection = -1;
    circleYDirection *= -1;
    directionChanged = true;
    paddleSound.play();

  }
  //right side of paddle
  else if(circleY >= 570 && circleY <= 580 && circleX >= paddleX + (0.7*paddleSize) && circleX <= paddleX + paddleSize && !directionChanged){
    circleXDirection = 1;
    circleYDirection *= -1;
    directionChanged = true;
    paddleSound.play();

  }
  //any other part of the paddle
  else if(circleX >= paddleX && circleX <= (paddleX + paddleSize) && circleY >= 570 && circleY <= 580 && !directionChanged){

    circleYDirection *= -1;
    directionChanged = true;
    paddleSound.play();

  }

  
}



function block(blocksY){

  for(i = 0; i < 12; i++){
    for(j = 0; j < blocksY; j++){
      newBlock = new Brick(brickColors[j], i*64.25+7, j*27+80);
      
      blocks.push(newBlock);
    }
  }
}


function makeBlocks(){

  for(i = 0; i < blocks.length; i++){
    blocks[i].printBlocks();
  }
}




class Brick {

  constructor(color, x, y){

    this.color = color;
    this.x = x;
    this.y = y;
    
  }


  printBlocks(){
    if(this.color == "red"){
      fill(255, 50, 61);
    } else if(this.color == "orange"){
      fill(232, 132, 65);
    } else if(this.color == "yellow"){
      fill(237, 187, 1);
    } else if(this.color == "green"){
      fill(75, 177, 69);
    } else if(this.color == "blue"){
      fill(55, 59, 216);
    } else if(this.color == "purple"){
      fill(110, 61, 197);
    } else if(this.color == "pink"){
      fill(204, 86, 130);
    } else if(this.color == "teal"){
      fill(2, 200, 200);
    } 


    rect(this.x, this.y, 60, 23, 4);
    
  }


  collision(i){
    //dev mode
    if (devModeMouseX >= this.x && devModeMouseX <= this.x + 60 && devModeMouseY >= this.y && devModeMouseY <= this.y + 23){
      brickSound.play();

      let index = i;
        if (index != -1) {
          blocks.splice(index, 1);
        }

      // each row gives more points
        if(this.color == "teal"){
          score += 1;
          timer+=1;
        } else if(this.color == "purple"){
          score += 2;
          timer+=2
        } else if(this.color == "blue"){
          score += 3;
          timer+=3
        } else if(this.color == "green"){
          score += 4;
          timer+=4
        } else if(this.color == "yellow"){
          score += 5;
          timer+=5
        } else if(this.color == "orange"){
          score += 6;
          timer+=6
        } else if(this.color == "red"){
          score += 7;
          timer+=7
        } else if(this.color == "pink"){
          score += 8;
          timer+=8
        } 
    }

    //ball collision
    if (circleX >= this.x && circleX <= this.x + 60 && circleY >= this.y && circleY <= this.y + 23) {
      brickSound.play();
      circleYDirection *= -1;
      
      // Find the index of the block in the array and remove it
      let index = i;
      if (index != -1) {
        blocks.splice(index, 1);
      }

    // each row gives more points
      if(this.color == "teal"){
        score += 1;
        timer+=1;
      } else if(this.color == "purple"){
        score += 2;
        timer+=2
      } else if(this.color == "blue"){
        score += 3;
        timer+=3
      } else if(this.color == "green"){
        score += 4;
        timer+=4
      } else if(this.color == "yellow"){
        score += 5;
        timer+=5
      } else if(this.color == "orange"){
        score += 6;
        timer+=6
      } else if(this.color == "red"){
        score += 7;
        timer+=7
      } else if(this.color == "pink"){
        score += 8;
        timer+=8
      } 
    }

    //score speed paddle changes
    if(timer > 30 && paddleSize > 75 && ballSpeedMultiplier < 7.0){
      timer=0;
      paddleSize -= 5;
      ballSpeedMultiplier += 0.1;
    }

    
  }

}
