var MafiaH = MafiaH || {};

MafiaH.Event = {};

MafiaH.Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -3,
    text: 'Nahrungsmittelvergiftung. Opfer: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -4,
    text: 'Weltraum Grippe ist ausgebrochen. Opfer: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Lebensmittel sind verdorben. Lebensmittel verloren: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'Taschendiebe bestehlen euch ihr verliert $'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'oxen',
    value: -1,
    text: 'Pferde Grippe ist ausgebrochen. Opfer: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Wilde Weltraum Beeren gefunden. Wieso sollte man die auch nicht essen? Lebensmittel hinzugefügt: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Wilde Weltraum Beeren gefunden. Wieso sollte man die auch nicht essen? Lebensmittel hinzugefügt: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'oxen',
    value: 1,
    text: 'Wilde Alien Pferde gefunden, haben zwar nur drei Beine aber sind nicht zu unterschätzen. Neue Pferde: '
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Ein Droide mit dem Namen C0RLL30N3 bietet dir seine Dienste an',
    products: [
      {item: 'Lebensmittel', qty: 20, price: 50},
      {item: 'Pferde', qty: 1, price: 200},
      {item: 'Laserpower', qty: 2, price: 50},
      {item: 'Crew', qty: 5, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Ein Droide mit dem Namen C0RLL30N3 bietet dir seine Dienste an',
    products: [
      {item: 'Lebensmittel', qty: 30, price: 50},
      {item: 'Pferde', qty: 1, price: 200},
      {item: 'Laserpower', qty: 2, price: 20},
      {item: 'Crew', qty: 10, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Ein Schmugler ruft dich, ey pssssst! Gute Preise, Gute Besserung',
    products: [
      {item: 'Lebensmittel', qty: 20, price: 60},
      {item: 'Pferde', qty: 1, price: 300},
      {item: 'Laserpower', qty: 2, price: 80},
      {item: 'Crew', qty: 5, price: 60}
    ]
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Alien Banditen greifen dich an, einer hat was von Jimmy die Lippe'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Banditen, die aussehen wie übergrosse Caneloni, greifen dich an'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Alien Banditen wollen dir ans Leder.'
  }
];

MafiaH.Event.generateEvent = function(){
  //pick random one
  var eventIndex = Math.floor(Math.random() * this.eventTypes.length);
  var eventData = this.eventTypes[eventIndex];

  //events that consist in updating a stat
  if(eventData.type == 'STAT-CHANGE') {
    this.stateChangeEvent(eventData);
  }

  //shops
  else if(eventData.type == 'SHOP') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.shopEvent(eventData);
  }

  //attacks
  else if(eventData.type == 'ATTACK') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.attackEvent(eventData);
  }
};

MafiaH.Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.caravan[eventData.stat] >= 0) {
    this.caravan[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};

MafiaH.Event.shopEvent = function(eventData) {
  //number of products for sale
  var numProds = Math.ceil(Math.random() * 4);

  //product list
  var products = [];
  var j, priceFactor;

  for(var i = 0; i < numProds; i++) {
    //random product
    j = Math.floor(Math.random() * eventData.products.length);

    //multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();

    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      price: Math.round(eventData.products[j].price * priceFactor)
    });
  }

  this.ui.showShop(products);
};

//prepare an attack event
MafiaH.Event.attackEvent = function(eventData){
  var firepower = Math.round((0.7 + 0.6 * Math.random()) * MafiaH.ENEMY_FIREPOWER_AVG);
  var gold = Math.round((0.7 + 0.6 * Math.random()) * MafiaH.ENEMY_GOLD_AVG);

  this.ui.showAttack(firepower, gold);
};
