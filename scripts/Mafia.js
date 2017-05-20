var MafiaH = MafiaH || {};

MafiaH.Caravan = {};

MafiaH.Caravan.init = function(stats){
  this.day = stats.day;
  this.distance = stats.distance;
  this.crew = stats.crew;
  this.food = stats.food;
  this.oxen = stats.oxen;
  this.money = stats.money;
  this.firepower = stats.firepower;
};

//update weight and capacity
MafiaH.Caravan.updateWeight = function(){
  var droppedFood = 0;
  var droppedGuns = 0;

  //how much can the caravan carry
  this.capacity = this.oxen * MafiaH.WEIGHT_PER_OX + this.crew * MafiaH.WEIGHT_PER_PERSON;

  //how much weight do we currently have
  this.weight = this.food * MafiaH.FOOD_WEIGHT + this.firepower * MafiaH.FIREPOWER_WEIGHT;

  //drop things behind if it's too much weight
  //assume guns get dropped before food
  while(this.firepower && this.capacity <= this.weight) {
    this.firepower--;
    this.weight -= MafiaH.FIREPOWER_WEIGHT;
    droppedGuns++;
  }

  if(droppedGuns) {
    this.ui.notify('Du hast '+droppedGuns+' Waffen verloren', 'negative');
  }

  while(this.food && this.capacity <= this.weight) {
    this.food--;
    this.weight -= MafiaH.FOOD_WEIGHT;
    droppedFood++;
  }

  if(droppedFood) {
    this.ui.notify('Du hast  '+droppedFood+' Lebensmittel verloren', 'negative');
  }
};

//update covered distance
MafiaH.Caravan.updateDistance = function() {
  //the closer to capacity, the slower
  var diff = this.capacity - this.weight;
  var speed = MafiaH.SLOW_SPEED + diff/this.capacity * MafiaH.FULL_SPEED;
  this.distance += speed;
};

//food consumption
MafiaH.Caravan.consumeFood = function() {
  this.food -= this.crew * MafiaH.FOOD_PER_PERSON;

  if(this.food < 0) {
    this.food = 0;
  }
};
