var MafiaH = MafiaH || {};

MafiaH.Event = {};

MafiaH.Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -3,
    text: 'Lebensmittel Vergiftung. Anzahl Opfer: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -4,
    text: 'Die Grippe ist ausgebrochen. Anzahl Opfer: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Deine Lebensmittel wurden von würmer angegriffen. Lebensmittel verloren: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'Diebe haben dir Geld abgenommen $'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'oxen',
    value: -1,
    text: 'Pferde Virus ist ausgebrochen. Anzahl Opfer: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Wilde Bohnen gefunden, sehen gut aus. Lebensmittel hinzugefügt: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Wilde Bohnen gefunden, wieso sollte man die nicht essen? Lebensmittel hinzugefügt: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'oxen',
    value: 1,
    text: 'Wildes Pferd gezähmt. Anzahl Pferde: '
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Ein E-BEA Bot erscheint, wie kann ich behilflich sein?',
    products: [
      {item: 'food', qty: 20, price: 50},
      {item: 'oxen', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 50},
      {item: 'crew', qty: 5, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Ein E-BEA Bot erscheint, wie kann ich behilflich sein?',
    products: [
      {item: 'food', qty: 30, price: 50},
      {item: 'oxen', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 20},
      {item: 'crew', qty: 10, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Schmuggler verkaufen heisse Ware.',
    products: [
      {item: 'food', qty: 20, price: 60},
      {item: 'oxen', qty: 1, price: 300},
      {item: 'firepower', qty: 2, price: 80},
      {item: 'crew', qty: 5, price: 60}
    ]
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Banditen greifen dich an.'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Banditen überfallen dich aus dem Hinterhalt.'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bonjwa Banditen greifen dich an.'
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
