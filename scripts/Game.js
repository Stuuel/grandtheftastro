var MafiaH = MafiaH || {};

//constants
MafiaH.WEIGHT_PER_OX = 20;
MafiaH.WEIGHT_PER_PERSON = 2;
MafiaH.FOOD_WEIGHT = 0.6;
MafiaH.FIREPOWER_WEIGHT = 5;
MafiaH.GAME_SPEED = 800;
MafiaH.DAY_PER_STEP = 0.2;
MafiaH.FOOD_PER_PERSON = 0.02;
MafiaH.FULL_SPEED = 5;
MafiaH.SLOW_SPEED = 3;
MafiaH.FINAL_DISTANCE = 1000;
MafiaH.EVENT_PROBABILITY = 0.15;
MafiaH.ENEMY_FIREPOWER_AVG = 5;
MafiaH.ENEMY_GOLD_AVG = 50;

MafiaH.Game = {};

//initiate the game
MafiaH.Game.init = function(){

  //reference ui
  this.ui = MafiaH.UI;

  //reference event manager
  this.eventManager = MafiaH.Event;

  //setup caravan
  this.caravan = MafiaH.Caravan;
  this.caravan.init({
    day: 0,
    distance: 0,
    crew: 30,
    food: 80,
    oxen: 2,
    money: 300,
    firepower: 2
  });

  //pass references
  this.caravan.ui = this.ui;
  this.caravan.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.caravan = this.caravan;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.caravan = this.caravan;
  this.eventManager.ui = this.ui;

  //begin adventure!
  this.startJourney();
};

//start the journey and time starts running
MafiaH.Game.startJourney = function() {
  this.gameActive = true;
  this.previousTime = null;
  this.ui.notify('A great adventure begins', 'positive');

  this.step();
};

//game loop
MafiaH.Game.step = function(timestamp) {

  //starting, setup the previous time for the first time
  if(!this.previousTime){
    this.previousTime = timestamp;
    this.updateGame();
  }

  //time difference
  var progress = timestamp - this.previousTime;

  //game update
  if(progress >= MafiaH.GAME_SPEED) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  //we use "bind" so that we can refer to the context "this" inside of the step method
  if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

//update game stats
MafiaH.Game.updateGame = function() {
  //day update
  this.caravan.day += MafiaH.DAY_PER_STEP;

  //food consumption
  this.caravan.consumeFood();

  if(this.caravan.food === 0) {
    this.ui.notify('Your caravan starved to death', 'negative');
    this.gameActive = false;
    return;
  }

  //update weight
  this.caravan.updateWeight();

  //update progress
  this.caravan.updateDistance();

  //show stats
  this.ui.refreshStats();

  //check if everyone died
  if(this.caravan.crew <= 0) {
    this.caravan.crew = 0;
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  //check win game
  if(this.caravan.distance >= MafiaH.FINAL_DISTANCE) {
    this.ui.notify('You have returned home!', 'positive');
    this.gameActive = false;
    return;
  }

  //random events
  if(Math.random() <= MafiaH.EVENT_PROBABILITY) {
    this.eventManager.generateEvent();
  }
};

//pause the journey
MafiaH.Game.pauseJourney = function() {
  this.gameActive = false;
};

//resume the journey
MafiaH.Game.resumeJourney = function() {
  this.gameActive = true;
  this.step();
};


//init game
MafiaH.Game.init();
