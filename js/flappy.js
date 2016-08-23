// the scaffolding for Phaser is here (includes global variables)
var score = 0;
var labelScore; // used for score displaying in game
var player;
var pipes = []; // create an empty 'pipes' array to hold the column of pipe blocks
var width = 790; // width of canvas
var height = 400; // height of canvas
var gameSpeed = 200;
var gameGravity = 250;
var jumpPower = 200;
var gapSize = 100;
var gapMargin = 50;
var blockHeight = 50;
var pipeEndHeight = 25;
var pipeEndExtraWidth = 10;
var balloons = []; // balloons variable in an array to do collision detection
var weights = []; // weight variable in an array to do collision detection
var stars = []; // array for star bonuses
var splashDisplay; // global variable to show starting message
var highscoreList = [];
var gameResult = {};
var playerName;
var modes = {
easy: {
    pipeInterval: 3,
    gameSpeed: 150,
    gameGravity: 220,
    gapSize: 130
  },
normal: {
    pipeInterval: 1.75,
    gameSpeed: 200,
    gameGravity: 250,
    gapSize: 100
  }
};
var easybutton; // global variable for the 'easy' setting
var normalbutton; // global variable for the 'normal setting'




// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
  game.load.audio("backgroundmusic","../assets/Batman The Dark Knight Theme - Hans Zimmer.mp3"); // load music
  game.load.image("playerImg", "../assets/flappy_batman.png"); // make image (for player) available to the game
  game.load.image("backgroundImg", "../assets/night city.png"); // make background image available to game
  game.load.image("pipeBlock", "../assets/pipe.png"); // make image for a block of pipe available
  game.load.image("PipeEnd", "../assets/pipe-end.png"); // make image for the end of the pipe available
  game.load.image("balloons", "../assets/balloons.png"); // make image that reduces gravity to appear
  game.load.image("weight", "../assets/batman-md.png"); // make image that increases gravity to appear
  game.load.image("star","../assets/star.png"); // make image for star bonuses to appear
  game.load.image("easybutton","../assets/easy.png"); // make 'easy' setting image available to the game
  game.load.image("normalbutton","../assets/normal.png"); // make 'normal' setting avaiable to the game
  }

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    backgroundmusic = game.sound.play("backgroundmusic"); // play background music
    game.add.sprite(0, 0, "backgroundImg"); // add the background image to the screen
    welcome = game.add.text(100, 350, "Welcome to my fantastic game",{font: "40px Arial", fill: "yellow"}); // welcome message
    game.add.sprite(30, 300, "playerImg");  // add batman sprite to screen
    game.add.sprite(720, 300, "playerImg");  // add batman sprite to screen
    game.add.sprite(720, 30, "playerImg");  // add batman sprite to screen
    game.add.sprite(30, 30, "playerImg");  // add batman sprite to screen
    labelScore = game.add.text(20, 20, "0",{font: "40px Arial", fill: "yellow"});
    player = game.add.sprite(100, 200, "playerImg"); // Initialises player to a sprite
    player.anchor.setTo(0.5,0.5); // set anchor property of the player - allowd player to rotate around a specified point
    player.x = 100; // starting x position of the player
    player.y = 200; //starting y position of the player
    game.physics.startSystem(Phaser.Physics.ARCADE); // create ARCADE Physics engine
    game.physics.arcade.enable(player); // Enable game physics for your player sprite
    mainmenu = game.add.text(335, 50, "Main Menu",{font: "40px Arial", fill: "yellow"});
    easybutton = game.add.sprite(390, 130, "easybutton");
    easybutton.inputEnabled = true; // allow image to be clicked etc.
    easybutton.events.onInputDown.add(easyoption, this);
    normalbutton = game.add.sprite(390, 200, "normalbutton");
    normalbutton.inputEnabled = true; // allow image to be clicked etc.
    normalbutton.events.onInputDown.add(normaloption, this);
  }

function start() {
  splashDisplay.destroy();
  game.input.onDown.add(clickHandler); // tells phraser to call the function 'clickHandler' if the mouse is clicked
  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start); // code to stop the start function being called several times
  welcome.destroy(); // remove welcome message
  player.body.gravity.y = gameGravity; // gravity acting on the player
  game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
                 .onDown.add(moveRight); // call the 'moveRight' function if  the right key is pressed
  game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
                 .onDown.add(moveLeft); // call the 'moveLeft' function if  the left key is pressed
  game.input.keyboard.addKey(Phaser.Keyboard.UP)
                 .onDown.add(moveUp); // call the 'moveUp' function if  the up key is pressed
  game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
                 .onDown.add(moveDown); // call the 'moveDown' function if  the down key is pressed
  game.input.keyboard
  .addKey(Phaser.Keyboard.SPACEBAR)
  .onDown
  .add(function() {
    player.body.velocity.y = -jumpPower;
  }); // use anonymous function if  the spacebar is pressed
  var pipeInterval = 1.75 * Phaser.Timer.SECOND;
  game.time.events.loop(
    pipeInterval,
    generate
  );
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  player.rotation = Math.atan(player.body.velocity.y / 200);
  if (player.y > 400 || player.y < 0) { // end game if the player goes off the screen
    gameOver();
}
  game.physics.arcade.overlap(player, pipes, gameOver);
checkBonus(balloons, -50, 0); // first argument - bonus type; second argument - change gravity; third argument - score change
checkBonus(weights, 50, 0);
checkBonus(stars, 0, 1);
for(var i = pipes.length - 1; i >=0; i--){ // remove pipes if they go left of the screen
  if(pipes[i].body.x < -60){
    pipes[i].destroy();
    pipes.splice(i, 1);
  }
}
}

function checkBonus(bonusArray, bonusEffect, bonusScore) {
    for(var i = bonusArray.length - 1; i >= 0; i--){
        if(bonusArray[i].body.x < -70 || bonusArray[i].body.y < -70) {
          bonusArray[i].destroy();
          bonusArray.splice(i, 1);
        } else {
        game.physics.arcade.overlap(player,bonusArray[i], function() {
            // destroy sprite
            bonusArray[i].destroy();
            // remove element from array
            bonusArray.splice(i, 1);
            // apply the bonus effect
            changeGravity(bonusEffect);
            // apply the bonus score (if the bonus is a star)
            changeScore(bonusScore);
        });
    }
}
}

function generate () {
  var diceRoll = game.rnd.integerInRange(1,10);
  if (diceRoll == 1) {
    balloon_bonus();
  }
  else if (diceRoll == 2) {
    weight_bonus();
  }
  else {
    generatePipe();
  }
  }

function gameOver() {
  try {
    backgroundmusic.stop(); // stop music by setting the playback position to 0
    game.add.text(50, 200, "Game over. Press the SPACEBAR to restart the game.",{font: "30px Arial", fill: "blue"});
    game.input
    .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    .onDown.add(restart_game);
    registerScore(score);
    game.paused = true;
  }
  catch (err) { //code to handle exception of no scoreboard in example.html
    backgroundmusic.stop(); // stop music by setting the playback position to 0
    game.paused = true;
    game.add.text(50, 200, "Game over. Press the SPACEBAR to restart the game.",{font: "30px Arial", fill: "blue"});
    game.input
    .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    .onDown.add(restart_game);
  }
}

function easyoption() {
  pipeInterval = modes.easy.pipeInterval;
  gameSpeed = modes.easy.gameSpeed;
  gameGravity = modes.easy.gameGravity;
  gapSize = modes.easy.gapSize;
  easybutton.destroy();
  normalbutton.destroy();
  mainmenu.destroy();
  splashDisplay = game.add.text(100, 200, "Press ENTER to start, SPACEBAR to jump.",{font: "30px Arial", fill: "yellow"});
  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
}

function normaloption() {
  pipeInterval = modes.normal.pipeInterval;
  gameSpeed = modes.normal.gameSpeed;
  gameGravity = modes.normal.gameGravity;
  gapSize = modes.normal.gapSize;
  easybutton.destroy();
  normalbutton.destroy();
  mainmenu.destroy();
  splashDisplay = game.add.text(100, 200, "Press ENTER to start, SPACEBAR to jump.",{font: "30px Arial", fill: "yellow"});
  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
}

function restart_game () {
  game.paused = false;
  stars = []; // reset stars to an empty array
  pipes = []; // reset pipes to an empty array to stop the accumulation of pipes
  backgroundmusic.destroy();
  game.cache.removeSound('backgroundmusic'); // completely stops current music
  game.state.restart();
  score = 0; // reset score
  gameGravity = 250; // reset gravity
}

function clickHandler(event) {
    game.paused = true;
    alert('Game paused!');
    game.paused = false;
}

function changeScore() {
	score ++; // increase score by 1
	labelScore.setText(score.toString());
}

function moveRight() {
	player.x += 30;
}

function moveLeft() {
	player.x -= 30;
}

function moveUp() {
	player.y -= 30;
}

function moveDown() {
	player.y += 30;
}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart - pipeEndHeight); // first pipe ending
    for(var y = gapStart - pipeEndHeight; y > 0; y -= blockHeight) {
        addPipeBlock(width, y - blockHeight);
    }

    addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart + gapSize); // second pipe ending
    for(y = gapStart + gapSize + pipeEndHeight; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    y = gapStart + gapSize + pipeEndHeight;
    addStar(width, gapStart + gapSize - (gapSize/2)); // add star in between two pipe ends
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipeBlock");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -gameSpeed;
}

function addPipeEnd(x, y) {
    var pipeEnd = game.add.sprite(x,y,"PipeEnd");
    pipes.push(pipeEnd);
    game.physics.arcade.enable(pipeEnd);
    pipeEnd.body.velocity.x = -gameSpeed;
}

function playerJump() {
    player.body.velocity.y = -jumpPower;
}

function changeGravity(g) {
  gameGravity += g;
  player.body.gravity.y = gameGravity;
}

function balloon_bonus() { // function that generates balloons
  var bonus = game.add.sprite(width, height,"balloons");
  game.physics.arcade.enable(bonus);
  balloons.push(bonus);
  bonus.body.velocity.x = -200;
  bonus.body.velocity.y = -game.rnd.integerInRange(60,100);
}

function weight_bonus() { // function that generates weights
  var bonus = game.add.sprite(width, 0,"weight");
  game.physics.arcade.enable(bonus);
  weights.push(bonus);
  bonus.body.velocity.x = -200;
  bonus.body.velocity.y = game.rnd.integerInRange(60,100);
}

function addStar(x, y) { // function that displays the stars
  var bonus = game.add.sprite(x, y, "star");
  game.physics.arcade.enable(bonus);
  stars.push(bonus);
  bonus.body.velocity.x = -gameSpeed;
}
