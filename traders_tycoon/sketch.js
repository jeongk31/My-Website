/* TODO

- add difficulty
- save the game
- add help 'dictionary'
- add instructions

*/

let initial_budget = 250;

let time_period = 1;
let elapsedTime;
let initialIndexValue;

let canvasElement, canvasCoordinates;
let bgImage, phoneIconImage, shoppingIconImage;
let character, phoneIcon, shoppingIcon, phoneImg;
let stocks = [];
let items = [];
let player;
let notification = '';
let notificationTimeout;
let tradingCanvas, shoppingCanvas;
let closeTradingButton, closeShoppingButton;
let buyStockButton, sellStockButton, buyItemButton, sellItemButton, viewStockButton, summaryStockButton, viewAnotherStockButton;
let homeButton, currentAction;
let bgPoorHouse, bgRichHouse1, bgRichHouse2, bgRichHouse3;

let currentInterface = null;
let selectedStock = null;
let selectedItem = null;

let usedIndices = [];
let difficulty = "normal";
notificationShown = false; 


function preload() {
  //phone - https://www.freepik.com/free-vector/new-modern-realistic-front-view-black-iphone-mockup-isolated-white-mobile-template-vector_33632328.htm#query=phone%20template&position=1&from_view=keyword&track=ais&uuid=141200a2-2f49-4e33-8d6b-ccfcc532520d

  // poor house - https://www.vecteezy.com/vector-art/7238738-room-inside-cartoon-background-poor-house-with-kitchen-with-bed-table-window-door-chair-vector-illustration

  // rich house1 - https://www.vecteezy.com/vector-art/7238738-room-inside-cartoon-background-poor-house-with-kitchen-with-bed-table-window-door-chair-vector-illustration

  // rich house2 - https://www.freepik.com/free-vector/ballroom-night-illustration-palace-hall-with-crystal-chandelier-midnight-magic-moon_2890931.htm#query=rich%20house%20game%20background&position=4&from_view=search&track=ais&uuid=8e04194c-0fe2-42e8-8383-00850b5f36aa

  // rich house3 - https://www.freepik.com/free-vector/ballroom-night-illustration-palace-hall-with-crystal-chandelier-midnight-magic-moon_2890931.htm#query=rich%20house%20game%20background&position=4&from_view=search&track=ais&uuid=8e04194c-0fe2-42e8-8383-00850b5f36aa


  phoneImg = loadImage('images/opened_phone.png');
  phoneIconImage = loadImage('images/phone.png');
  shoppingIconImage = loadImage('images/market.png');
  characterImage = loadImage('images/char.png');
  bgPoorHouse = loadImage('images/poorhouse.jpg');
  bgRichHouse1 = loadImage('images/richhouse1.jpg');
  bgRichHouse2 = loadImage('images/richhouse2.jpg');
  bgRichHouse3 = loadImage('images/richhouse3.jpg');
  castle = loadImage('images/castle.jpg');
  car = loadImage('images/car.jpg');
  car2 = loadImage('images/car2.jpg');
  bgSound = loadSound('images/sound.mp3', soundLoaded);
}

function soundLoaded() {
  console.log("Sound is loaded!");
}

function setup() {
  const canvasElement = createCanvas(800, 600);
  // background(0, 0, 0, 10);
  bgSound.loop();
  canvasElement.parent('canvas-container');

  canvasCoordinates = canvasElement.position();
  
  player = new Player(initial_budget);
  character = new Character(width / 2, height / 2, 500);
  phoneIcon = new Icon('phone', phoneIconImage, 80, 520, 100);
  shoppingIcon = new Icon('shopping', shoppingIconImage, 690, 520, 100);

  createButtons();
  createStocks();
  createItems();
  initialIndexValue = calculateIndexValue();
  // phoneIcon.setHoverHandler(() => setCursor(HAND), () => setCursor(ARROW));
  // shoppingIcon.setHoverHandler(() => setCursor(HAND), () => setCursor(ARROW));
}



function createButtons() {
  buyStockButton = createButton('Buy');
  buyStockButton.position(canvasCoordinates.x + width/2.95, canvasCoordinates.y + height/7.5);
  buyStockButton.mousePressed(() => playerActions('buy', 'stocks'));
  buyStockButton.hide();

  sellStockButton = createButton('Sell');
  sellStockButton.position(canvasCoordinates.x + width/2.4, canvasCoordinates.y + height/7.5);
  sellStockButton.mousePressed(() => playerActions('sell', 'stocks'));
  sellStockButton.hide();

  viewStockButton = createButton('View');
  viewStockButton.position(canvasCoordinates.x + width/2.03, canvasCoordinates.y + height/7.5);
  viewStockButton.mousePressed(() => playerActions('view', 'stocks'));
  viewStockButton.hide();

  summaryStockButton = createButton('Summary');
  summaryStockButton.position(canvasCoordinates.x + width/1.73, canvasCoordinates.y + height/7.5);
  summaryStockButton.mousePressed(() => playerActions('summary', 'stocks'));
  summaryStockButton.hide();


  buyItemButton = createButton('Buy');
  buyItemButton.position(canvasCoordinates.x + width/2.75, canvasCoordinates.y + height/7.5);
  buyItemButton.mousePressed(() => playerActions('buy', 'items'));
  buyItemButton.hide();

  sellItemButton = createButton('Sell');
  sellItemButton.position(canvasCoordinates.x + width/2.09, canvasCoordinates.y + height/7.5);
  sellItemButton.mousePressed(() => playerActions('sell', 'items'));
  sellItemButton.hide();

  viewItemButton = createButton('View');
  viewItemButton.position(canvasCoordinates.x + width/1.7, canvasCoordinates.y + height/7.5);
  viewItemButton.mousePressed(() => playerActions('view', 'items'));
  viewItemButton.hide();


  homeButton = createButton('Home');
  homeButton.position(canvasCoordinates.x + width/2.12, canvasCoordinates.y + height/1.1);
  homeButton.mousePressed(() => homeButtonPressed());
  homeButton.hide();

  viewAnotherStockButton = createButton('View Another Stock');
  viewAnotherStockButton.position(canvasCoordinates.x + width/2.375, canvasCoordinates.y + height/1.16);
  viewAnotherStockButton.mousePressed(() => {
    selectedStock = null;
    currentAction = 'view';
    for (let i = 0; i < 10; i++) {
      showSelectStockButton(i);
    }
    viewAnotherStockButton.hide();
  });
  viewAnotherStockButton.hide();

  for(let i = 0; i < 10; i++) {
    let selectStockButton = createButton('Select');
    selectStockButton.position(canvasCoordinates.x + width/3, i * 40 + canvasCoordinates.y + height/4);
    selectStockButton.id('selectstock' + (i));
    selectStockButton.mousePressed(() => selectStock(i));
    selectStockButton.hide();
  }

  for(let i = 0; i < 10; i++) {
    let selectItemButton = createButton('Select');
    selectItemButton.position(canvasCoordinates.x + width/3, i * 40 + canvasCoordinates.y + height/4);
    selectItemButton.id('selectitem' + (i));
    selectItemButton.mousePressed(() => {
      selectItem(i);
      if (currentAction === 'view') {
        player.viewItem();
      }
    });
    selectItemButton.hide();
  }
  
}

function selectStock(stockIndex) {
  selectedStock = stocks[stockIndex];
  if(currentAction === 'buy') {
    player.buyStock(selectedStock);
  }
  if(currentAction === 'sell') {
    player.sellStock(selectedStock);
  }
  if(currentAction === 'view') {
    for (let i = 0; i < 10; i++) {
      hideselectStockButton(i);
    }
  }
}

function selectItem(itemIndex) {
  selectedItem = items[itemIndex];
  if(currentAction === 'buy') {
    player.buyItem(selectedItem);
  }
  if(currentAction === 'sell') {
    player.sellItem(selectedItem);
  }
  if(currentAction === 'view') {
    player.viewItem(selectedItem);
  }
}

function showSelectStockButton(buttonId) {
  let selectStockButton = select('#selectstock' + (buttonId));
  selectStockButton.show();
}

function hideselectStockButton(buttonId) {
  let selectStockButton = select('#selectstock' + (buttonId));
  selectStockButton.hide();
}

function showSelectItemButton(buttonId) {
  let selectItemButton = select('#selectitem' + (buttonId));
  selectItemButton.show();
}

function hideSelectItemButton(buttonId) {
  let selectItemButton = select('#selectitem' + (buttonId));
  selectItemButton.hide();
}

function homeButtonPressed() {
  currentAction = null;
  selectedStock = null;
  selectedItem = null;
  openMainInterface();
}


function playerActions(action, type) {
  selectedStock = null;
  selectedItem = null;
  viewAnotherStockButton.hide();
  if (type === 'stocks') {
    openTradingInterface();
  } else if (type === 'items') {
    openShoppingInterface();
  }
  currentAction = action; 
}


function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCompanyName() {     // random fake company names to use
  let stockNames = [
    "Microsh", "Starbax", "Netflax", "Appario", "Intelli",
    "Teslar", "GoldSax", "JPMorg", "Walmrn", "Disnoy",
    "Boing", "Berkshy", "Exxonc", "Johnsn", "UnitHlt",
    "HomeDp", "ProctG", "Master", "Verizn", "CocaCb",
    "PepsiC", "ATT", "Amaznt", "Googly", "Facebk",
    "Applau", "Oracle", "Cisco", "Merck", "Pfizer",
    "Walgrn", "Chevrc", "BofAmr", "WellsF", "CitiGr",
    "MorgSt", "GoldS", "Raythn", "Honeyw", "AbbVic",
    "AbbotL", "Salesf", "Linde", "Qualcm", "Thermo",
    "Broadc", "Danahr", "AmEx", "Lilly", "Accen",
    "TexIns", "Micron", "Nike", "Lowes", "Chartr",
    "DukeE", "AmTowr", "NextEr", "Gilead", "UnionP",
    "USBanc", "Mondel", "Lockhd", "FedEx", "GenElc",
    "PhilMo", "Northr", "Diagon", "Berksh", "Chubb",
    "S&P", "Abode", "Biogen", "BostSc", "KraftH",
    "Allsta", "CapitW", "DowChm", "GenMot", "MetLf"
  ]

  let stockDescriptions = [
    "A tech giant known for its innovative gadgets, rumored to be working on a device that can alter reality. Their latest project is shrouded in secrecy, sparking worldwide curiosity and conspiracy theories.",
    "The largest chain of intergalactic coffee shops, famous for their superhuman energy-boosting brews. They also host mysterious, after-hours cosmic events that are the talk of the universe.",
    "A streaming service with shows so addictive, they're considered hypnotic by some. Their secret? Each series is crafted using advanced AI that taps into viewers' deepest desires.",
    "Specializes in creating customizable AI companions, each unique and learning from its user. Rumors suggest they're developing an AI with emotions, blurring the lines between technology and humanity.",
    "A cybersecurity firm with unbreakable encryption, making them the defender of the digital universe. Their latest challenge involves a mysterious cyber entity that's been infiltrating top-secret data vaults.",
    "Revolutionizing space travel with electric spacecraft, possibly harnessing a new energy source. They're also rumored to be exploring time travel, with prototypes hidden in a secret space station.",
    "A financial institution that can predict market trends with eerie accuracy. Recently, they've been investing heavily in unknown territories, sparking rumors of discovering a new dimension.",
    "An investment firm dealing in cosmic currencies and funding interstellar expeditions. Their latest venture involves a planet rumored to have oceans of liquid diamonds.",
    "A retail giant with stores in every corner of the galaxy, selling everything from starships to ancient artifacts. They recently acquired a mysterious artifact that's said to hold the key to eternal youth.",
    "An entertainment conglomerate famous for its planet-sized theme parks and legendary holographic shows. They're now venturing into virtual reality experiences that promise to transport you to other worlds.",
    "An aerospace and defense juggernaut, developing technology for interstellar warfare. Their latest prototype is a starship capable of cloaking and teleportation, feared by enemies across galaxies.",
    "A conglomerate with a diverse portfolio, including time-travel insurance and asteroid mining. They've recently unveiled a plan to build a city on Mars, complete with its own artificial sun.",
    "An energy titan with a secret research facility rumored to have cracked the code for unlimited energy. Their experiments with dark matter have attracted the attention of many rival corporations.",
    "A healthcare giant with a division dedicated to cybernetic enhancements. They've just announced a breakthrough in memory transfer technology, stirring ethical debates worldwide.",
    "A health services behemoth with a secret project rumored to extend human lifespan indefinitely. Their latest venture involves a virtual world where consciousness can be uploaded and preserved.",
    "A home improvement titan that's secretly building a habitat for humanity on an undiscovered planet. Their technology allows buildings to grow organically from the planet's unique minerals.",
    "A consumer goods powerhouse rumored to be developing a product that can alter human perceptions. Their latest line of gadgets reportedly interfaces directly with the human brain.",
    "A tech firm that's the go-to for revolutionary gadgets and cutting-edge technology. They've recently unveiled a device that allows users to manipulate the elements, causing a stir in scientific communities.",
    "A telecommunications leader working on a network that connects different dimensions. Their latest breakthrough promises to let users communicate across parallel universes.",
    "A beverage titan exploring a drink formula that grants temporary superhuman abilities. Their research in exotic planets has led to the discovery of ingredients that defy the laws of physics.",
    "A soft drink conglomerate with a secret formula said to enhance cognitive abilities. They've recently been involved in a scandal over a new drink that reportedly allows telepathic communication.",
    "A telecommunications giant with a project to create a universal translator, rumored to even decipher alien languages. Their technology is said to bridge communication gaps across the galaxy.",
    "An e-commerce titan expanding into interstellar trade, with delivery drones capable of warp speed. Their latest venture is a virtual marketplace that can predict your needs before you do.",
    "A search engine so advanced, it's believed to have achieved sentience. It's now offering predictive search results, knowing what you want before you even ask.",
    "A social media platform with algorithms that can influence emotions and decisions. They're now experimenting with virtual reality social spaces that feel more real than the physical world.",
    "A tech company famous for its user-friendly devices and a fiercely loyal customer base. They've just launched a device that seamlessly integrates with the human mind, blurring the line between man and machine.",
    "A database powerhouse rumored to have the most secure data vaults in the universe. They've recently embarked on a project to create a digital oracle, capable of predicting global events.",
    "A networking giant that has now branched into creating smart cities, where everything is interconnected. Their latest city is rumored to be completely autonomous, run by an advanced AI.",
    "A pharmaceutical company that's developing a cure for aging. Their latest trial reportedly reversed aging in a small group of volunteers, sparking a frenzy among the elite.",
    "A biopharmaceutical firm working on a serum that enhances human abilities. They've recently been linked to a super soldier project, shrouded in mystery and controversy.",
    "A retail pharmacy giant now venturing into creating medicines from extraterrestrial plants. Their latest drug promises to cure diseases previously thought incurable.",
    "An oil and gas behemoth secretly working on a portal to other dimensions for resource extraction. They've reportedly discovered a planet made entirely of a fuel source more powerful than anything on Earth.",
    "A banking titan rumored to be the financial backbone of secret societies. They've recently launched a cryptocurrency that's immune to market fluctuations, causing a stir in the financial world.",
    "A financial institution now pioneering in time banking, where you can borrow or save time. Their latest product lets you invest time in different timelines, creating a frenzy among investors.",
    "A media and entertainment mogul rumored to have a device that can control the weather. They're planning to launch a new form of entertainment that lets you experience different weather phenomena.",
    "A conglomerate with a range of businesses from starship construction to quantum computing. They've recently unveiled a quantum teleporter, capable of transporting objects instantly across vast distances.",
    "An insurance company now offering policies for interdimensional travel mishaps. Their latest product covers any anomalies encountered in alternate realities, a first in the insurance industry.",
    "A conglomerate specializing in biotech and artificial intelligence. They're rumored to have created the first sentient AI, sparking debates about the future of technology.",
    "A consumer electronics company leading in virtual and augmented reality tech. Their latest gadget lets users live alternate lives in virtual worlds, indistinguishable from reality.",
    "A beverage company that's discovered a liquid that can store memories. Drinking it allows you to experience someone else's memories as if they were your own.",
    "A sports apparel company that's now making gear with adaptive camouflage, perfect for interstellar explorers. Their latest line includes suits that can morph to match any environment.",
    "A home improvement retailer branching into constructing modular lunar habitats. Their DIY kits allow settlers to build their own moon bases with ease and efficiency.",
    "A telecommunications company now offering intergalactic data plans. Their latest satellite network promises connectivity even in the most remote corners of the universe.",
    "An energy company developing a reactor that harnesses the power of black holes. They're on the brink of a breakthrough that could provide unlimited energy to entire star systems.",
    "A communications firm specializing in deep space communication technologies. Their new device allows instant communication across galaxies, revolutionizing interstellar relations.",
    "A healthcare provider expanding into galactic medical services. They're developing a network of orbiting hospitals equipped with the latest in alien medical technology.",
    "A real estate investment firm specializing in off-world properties. They're currently selling luxury habitats on a newly terraformed planet with breathtaking views of the galaxy.",
    "An energy company working on a way to harness the power of stars. Their solar farms are capable of powering entire planets, making them a leader in renewable energy.",
    "A pharmaceutical giant that's creating drugs to adapt humans to alien environments. Their latest pill allows humans to breathe on planets with different atmospheres.",
    "A biotech company rumored to have developed a shape-shifting serum. Their research could revolutionize the field of personal identity and cosmetic alteration.",
    "A retail chain now offering goods from parallel universes. Their exclusive products include gadgets and materials that defy the laws of physics as we know them.",
    "An oil company secretly building a fleet of deep space mining ships. They're scouting for planets rich in a newly discovered, incredibly efficient fuel source.",
    "A financial institution rumored to have built an AI that predicts global economic trends. Their forecasts are so accurate, they're reshaping the world's financial markets.",
    "An entertainment company that owns a network of virtual reality worlds. Their latest VR world simulates historical events, allowing users to live through different eras.",
    "An aerospace and defense company known for building the fastest starfighters in the galaxy. They've just unveiled a ship that can travel faster than light, shattering previous speed records.",
    "A diversified conglomerate with interests in artificial gravity and planetary engineering. They've recently created an artificial moon, sparking interest from space colonizers.",
    "An insurance company specializing in covering extreme space expeditions. Their policies now include coverage for time dilation effects and wormhole travel accidents.",
    "A biotech firm on the verge of creating the first hybrid human-alien species. Their groundbreaking research could change the course of evolution.",
    "A consumer electronics giant that's pioneering brain-computer interfaces. Their devices allow users to control technology with their thoughts, ushering in a new era of human-computer interaction.",
    "A beverage company that has discovered a drink granting night vision. Their latest product is a hit among interstellar travelers and nocturnal adventurers.",
    "A robotics company specializing in AI-driven androids. Their latest creation, rumored to possess human-like emotions, has sparked ethical debates across the universe.",
    "A transportation company with plans to build a network of interstellar highways. They promise to reduce travel time between galaxies by 90%.",
    "An entertainment conglomerate famous for holographic performances. They're working on a project that will allow audiences to step into their favorite movie scenes.",
    "A genetics firm pushing the boundaries of human evolution. Their controversial gene-editing technology claims to offer immortality but at a steep price.",
    "A tech giant that's secretly developed a device capable of detecting parallel universes. They've begun exploratory missions into these alternate dimensions.",
    "A virtual reality company creating simulated worlds indistinguishable from reality. They're rumored to be testing a new game that blurs the lines between virtual and actual existence.",
    "An energy corporation harnessing the power of cosmic storms for clean energy. Their research could revolutionize power generation throughout the universe.",
    "A research organization at the forefront of quantum teleportation. They're working on a teleporter that can transport humans across galaxies in an instant.",
    "A biotech firm that's discovered a plant with extraordinary healing properties. They've developed a medicine that can regenerate tissues and even bring the dead back to life.",
    "An aerospace company specializing in space elevators, making interstellar travel more accessible. Their latest project aims to build a space elevator to the moon.",
    "A robotics and AI company that's developed sentient robots capable of self-improvement. Some say they're on the brink of creating the first AI civilization.",
    "An extraterrestrial research institute studying alien life forms. They've recently made contact with a peaceful alien species, opening up possibilities for intergalactic cooperation.",
    "A transportation giant with plans to build a hyperloop connecting distant galaxies. Their project could revolutionize long-distance space travel.",
    "A pharmaceutical conglomerate researching a drug that allows humans to survive in extreme conditions. Their work is crucial for space colonization efforts.",
    "A security firm with technology that can detect cosmic threats before they reach inhabited planets. They're the first line of defense against interstellar dangers.",
    "A research company delving into the mysteries of dark matter. They've discovered a way to harness dark matter for faster-than-light travel.",
    "An energy corporation pioneering in solar sails that propel spaceships using starlight. They've just launched the first solar-sail-powered spacecraft to explore distant stars.",
    "A genetics company offering genetic modification for personalized enhancements. Their clients include athletes seeking superhuman abilities and explorers preparing for deep-space missions.",
    "A space agency working on a warp drive technology that can fold space and time for instantaneous travel. Their warp drive prototypes are shrouded in secrecy.",
    "A cybersecurity firm defending against cosmic cyber threats. Their advanced AI security systems protect the digital universe from intergalactic hackers."
  ];

  let index;
  do {
    index = Math.floor(Math.random() * stockNames.length);
  } while (usedIndices.includes(index));

  usedIndices.push(index);

  let companyName = stockNames[index];
  let companyDescription = stockDescriptions[index];

  return { companyName, companyDescription };
}

function createStocks() {
  for (let i = 0; i < 10; i++) {
    let { companyName, companyDescription } = generateCompanyName();
    stocks.push(new Stock(companyName, companyDescription, width/2.4, i * 40 + height/4.3));
  }
}


function createItems() {
    items.push(new Item('House 1', random(20, 50), width/2.4, height/4.3, bgRichHouse1));
    items.push(new Item('House 2', random(50, 70), width/2.4, height/4.3, bgRichHouse2));
    items.push(new Item('House 3', random(70, 100), width/2.4, height/4.3, bgRichHouse3));
    items.push(new Item('House 4', random(100, 150), width/2.4, height/4.3, castle));
    items.push(new Item('Car', random(50, 70), width/2.4, height/4.3, car));
    items.push(new Item('Car 2', random(100, 150), width/2.4, height/4.3, car2));
    items.push(new Item('Lottery Ticket 1', 15, width/2.4, height/4.3, null, null, 100));
    items.push(new Item('Lottery Ticket 2', 25, width/2.4, height/4.3, null, null, 1000));
    items.push(new Item('Lottery Ticket 3', 65, width/2.4, height/4.3, null, null, 10000));
}

function updateNotification(message) {
  notification = message;
  clearTimeout(notificationTimeout);
  notificationTimeout = setTimeout(() => {
    notification = '';
    document.getElementById('notification').textContent = '';
  }, 3000);
}

function drawNotification() {
  if (notification !== '') {
    fill(255, 0, 0);
    textSize(20);
    textAlign(CENTER, TOP);
    let padding = 100;
    text(notification, 400, 50);
  }
}

function draw() {
  background(255)
  push();
  image(player.currentBg, width/2, height/2, width + 10, height + 10);
  imageMode(CENTER);
  pop();

  elapsedTime = millis();
  displayElapsedTime();

  currentIndexValue = calculateIndexValue();
  stocks.forEach(stock => stock.updatePrice());

  phoneIcon.display();
  shoppingIcon.display();
  displayPlayerStats();
  character.display();
  player.update();

  if (currentInterface === 'stocks') {
    drawTradingInterface();
    if(currentAction === 'buy' || currentAction === 'sell') {
      displayStocks();
    }
    if (currentAction === 'view') {
      if (selectedStock) {
        displaySelectedStockInfo(selectedStock);
        drawGraph(selectedStock);
        viewAnotherStockButton.show();
      } else {
        displayStocks();
        viewAnotherStockButton.hide();
      }
    }
  } 
  else if (currentInterface === 'items') {
    drawShoppingInterface();
    if(currentAction === 'buy' || currentAction === 'sell' || currentAction === 'view') {
      displayItems();
    }
  } 
  else {
    showInstructions();
  }
  if (!notificationShown) {
    drawNotification();
  }
}

function displayElapsedTime() {
  push();
  fill(255,255,255);
  textSize(16);
  textAlign(CENTER, TOP);
  let hours = nf(int(elapsedTime / 3600000), 2);
  let minutes = nf(int((elapsedTime % 3600000) / 60000), 2);
  let seconds = nf(int((elapsedTime % 60000) / 1000), 2);
  text(`Time Elapsed: ${hours}:${minutes}:${seconds}`, width / 2, 20);
  pop();
}

function drawTradingInterface() {
  push();
  imageMode(CENTER);
  image(phoneImg, width/2, height/2, width * 1.1, height * 1.2);
  pop();

  if (currentAction === 'summary') {
    const stats = calculateSummaryStats();
    push();
    textSize(17);
    fill(0);
    textAlign(CENTER, TOP);
    text(`Unrealized Profit: $${stats.unrealized_profit}`, width / 2, 190);
    text(`Unrealized Profit Percentage: ${stats.unrealized_profitPercentage}`, width / 2, 220);
    text(`Return on Investment: ${stats.return_on_investment}`, width / 2, 270);
    text(`Portfolio Diversification Score: ${stats.portfolio_diversification_score}`, width / 2, 320);
    text(`Alpha: ${stats.alpha}`, width / 2, 370);
    pop();
  }

}

function drawShoppingInterface() {
  push();
  imageMode(CENTER);
  image(phoneImg, width/2, height/2, width * 1.1, height * 1.2);
  pop();
}


function displayStocks() {
  push();
  textAlign(LEFT, TOP);
  textSize(12);
  fill(0);

  let yPos = height/4.3;
  let ySpacing = 40;

  stocks.forEach((stock, index) => {
    if(currentAction === 'buy' || currentAction === 'view') {
      stock.y = yPos;
      stock.display();
      positionselectStockButton(index, yPos + canvasCoordinates.y + height/300);
      showSelectStockButton(index);
      yPos += ySpacing;
    } else if(currentAction === 'sell') {
      if (player.stocksOwned[stock.name] && player.stocksOwned[stock.name] > 0) {
        stock.y = yPos;
        stock.displayWithQuantity(player.stocksOwned[stock.name]);
        positionselectStockButton(index, yPos + canvasCoordinates.y + height/300);
        showSelectStockButton(index);
        yPos += ySpacing;
      } else {
        hideselectStockButton(index);
      }
    }
  });

  pop();
}

function positionselectStockButton(buttonIndex, yPos) {
  let xPosition = canvasCoordinates.x + width/3;
  let button = select('#selectstock' + buttonIndex);
  button.position(xPosition, yPos);
}


function displayItems() {
  push();
  textAlign(LEFT, TOP);
  textSize(12);
  fill(0);

  let yPos = height/4.3;
  let ySpacing = 40;

  items.forEach((item, index) => {
    if(currentAction === 'buy') {
      item.y = yPos;
      item.display();
      positionselectItemButton(index, yPos + canvasCoordinates.y + height/300);
      showSelectItemButton(index);
      yPos += ySpacing;
    } else if(currentAction === 'sell' || currentAction === 'view') {
      if (player.itemsOwned[item.name] && player.itemsOwned[item.name] > 0) {
        item.y = yPos;
        item.display();
        positionselectItemButton(index, yPos + canvasCoordinates.y + height/300);
        showSelectItemButton(index);
        yPos += ySpacing;
      } else {
        hideSelectItemButton(index);
      }
    }
  });

  pop();
}

function positionselectItemButton(buttonIndex, yPos) {
  let xPosition = canvasCoordinates.x + width/3;
  let button = select('#selectitem' + buttonIndex);
  button.position(xPosition, yPos);
}


function displayPlayerStats() {
  const budgetElement = document.getElementById('budget');
  const totalWealthElement = document.getElementById('total-wealth');

  budgetElement.textContent = `$${player.budget.toFixed(2)}`;
  totalWealthElement.textContent = `$${player.totalWealth.toFixed(2)}`;
}


function displaySelectedStockInfo(stock) {
  push();
  fill(0);

  textSize(28);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text(stock.name, width / 2, height/5.1);

  textSize(14);
  let maxWidth = 300;
  let startX = (width - maxWidth) / 1.95;
  let startY = height / 3.7;

  textAlign(LEFT, TOP);
  text("Description:", startX, startY);

  let descriptionY = startY + 25;

  textStyle(NORMAL);
  text(stock.description, startX, descriptionY, maxWidth);
  pop();
}


function drawGraph(stock) {
  if (!stock || !stock.valueHistory || stock.valueHistory.length === 0) return;

  const graphWidth = 270;
  const graphHeight = 150;
  const startY = height - graphHeight - 120;
  const endY = startY + graphHeight;
  const startX = (width - graphWidth) / 2;
  const endX = startX + graphWidth;

  const minValue = Math.min(...stock.valueHistory);
  const maxValue = Math.max(...stock.valueHistory);
  const latestPrice = stock.valueHistory[stock.valueHistory.length - 1];

  push();
  stroke(0);
  noFill();
  rect(startX - 10, startY - 10, graphWidth + 20, graphHeight + 20);
  pop();

  push();
  textSize(17);
  fill(0);
  noStroke();
  textAlign(CENTER);
  text(`Current Price: $${latestPrice.toFixed(2)}`, width/2, startY-40);
  pop();

  push();
  stroke(25, 118, 210);
  noFill();
  beginShape();
  for (let i = 0; i < stock.valueHistory.length; i++) {
    let x = map(i, 0, stock.valueHistory.length - 1, startX, endX);
    let y = map(stock.valueHistory[i], minValue, maxValue, endY, startY);
    vertex(x, y);
  }
  endShape();
  pop();
}



class Player {
  constructor(budget) {
    this.budget = budget;
    this.totalWealth = budget;
    this.stocksOwned = {};
    this.itemsOwned = {};
    this.currentBg = bgPoorHouse;
    this.character = new Character(width / 2, height / 2, 500);
  }


  update() {
    let totalStockValue = 0;
    for (let stockName in player.stocksOwned) {
      if (player.stocksOwned.hasOwnProperty(stockName)) {    //googled this method to fix errors
        let stockQuantity = player.stocksOwned[stockName];
        let stockPrice = stocks.find(stock => stock.name === stockName).price;
        totalStockValue += stockQuantity * stockPrice;
      }
    }
    this.totalWealth = this.budget + totalStockValue;
  }

  buyStock() {
    if (selectedStock) {
      if (this.budget >= selectedStock.price) {
        this.budget -= selectedStock.price;
        this.stocksOwned[selectedStock.name] = (this.stocksOwned[selectedStock.name] || 0) + 1;
        updateNotification(`Bought ${selectedStock.name}`);
      } else {
          updateNotification("Not enough budget.");
      }
    } else {
      updateNotification("No stock selected.");
    }
  }

  sellStock() {
    if (selectedStock) {
      if (this.stocksOwned[selectedStock.name] && this.stocksOwned[selectedStock.name] > 0) {
        this.budget += selectedStock.price;
        this.stocksOwned[selectedStock.name]--;
        updateNotification(`Sold ${selectedStock.name}`);
      } else {
        updateNotification("You do not own any of this stock.");
      }
    } else {
      updateNotification("No stock selected.");
    }
  }

  buyItem() {
    if (selectedItem) {
      if (this.budget >= selectedItem.price) {
        this.budget -= selectedItem.price;
        this.itemsOwned[selectedItem.name] = (this.itemsOwned[selectedItem.name] || 0) + 1;
        this.currentBg = selectedItem.bg;
        this.character.customize(selectedItem);
        selectedItem.purchaseTime = millis();
        updateNotification(`Bought ${selectedItem.name}`);
  
        if (selectedItem.name.includes('Lottery Ticket')) {
          if (Math.random() < 0.000001) {
            this.budget += selectedItem.prize;
            updateNotification(`Congratulations! You won the lottery and earned $${selectedItem.prize}!`);
          } else {
            updateNotification(`Sorry, you didn't win the lottery this time. Better luck next time!`);
          }
        }
      } else {
        updateNotification("Not enough budget");
      }
    } else {
      updateNotification("No item selected.");
    }
  }
  
  
  sellItem() {
    if (selectedItem) {
      if (this.itemsOwned[selectedItem.name] && this.itemsOwned[selectedItem.name] > 0) {
        let sellPrice = selectedItem.price;
        let ownershipDuration = millis() - selectedItem.purchaseTime;
        if (ownershipDuration < 200000) { // if the player owned the item for less than 200 seconds
          sellPrice *= 0.7; // they get only 70% of the price
        } else {
          sellPrice *= 1.2; // they get 120% of the price
        }
        this.budget += sellPrice;
        this.itemsOwned[selectedItem.name]--;
        this.currentBg = bgPoorHouse;
        updateNotification(`Sold ${selectedItem.name}`);
      } else {
        updateNotification("You do not own any of this item.");
      }
    } else {
      updateNotification("No item selected.");
    }
  }
  
  viewItem() {
    if (selectedItem) {
      this.currentBg = selectedItem.bg;
      updateNotification(`Viewing ${selectedItem.name}`);
    } else {
      updateNotification("No item selected.");
    }
  }

  buyItem() {
    if (selectedItem) {
        if (this.budget >= selectedItem.price) {
            this.budget -= selectedItem.price;
            this.itemsOwned[selectedItem.name] = (this.itemsOwned[selectedItem.name] || 0) + 1;
            selectedItem.purchaseTime = millis();
            updateNotification(`Bought ${selectedItem.name}`);

            if (selectedItem.name.includes('Lottery Ticket')) {
                this.processLotteryTicketPurchase(selectedItem);
            } else {
                this.currentBg = selectedItem.bg;
                this.character.customize(selectedItem);
            }
        } else {
            updateNotification("Not enough budget");
        }
    } else {
        updateNotification("No item selected.");
    }
}

processLotteryTicketPurchase(lotteryItem) {
    if (Math.random() < 0.000001) {
        this.budget += lotteryItem.prize;
        updateNotification(`Congratulations! You won the lottery and earned $${lotteryItem.prize}!`);
    } else {
        updateNotification(`Sorry, you didn't win the lottery this time. Better luck next time!`);
    }
}
  

}
  
class Character {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.characterImage = loadImage('images/char.png');
  }

  display() {
    image(this.characterImage, this.x, this.y, this.size, this.size);
  }

  customize(item) {
    this.characterImage = item.avatar;
    console.log(`Customized character with ${item.name}`);
  }
}

class Stock {
  constructor(name, description, x, y) {
    this.name = name;
    this.description = description;
    this.x = x;
    this.y = y;
    this.price = random(10, 100);
    this.noiseScale = random(0.001, 0.01);
    this.time = random(100);
    this.valueHistory = [];
  }

  updatePrice() {
    let increaseChance;
    switch (difficulty) {
      case "easy":
        increaseChance = 0.55;
        break;
      case "normal":
        increaseChance = 0.5; 
        break;
      case "hard":
        increaseChance = 0.45;
        break;
    }

    if(frameCount % 60 === 0) {
      let noiseValue = noise(this.time);

      if(random(1) < 0.1) {
        noiseValue += random(-5, 5); 
      }

      if (random(1) < increaseChance) {
        this.price += noiseValue;
      } else {
        this.price -= noiseValue;
      }

      this.price = max(this.price, 0.1);

      this.time += this.noiseScale;
      this.valueHistory.push(this.price);
    }
  }

  display() {
    textAlign(LEFT, TOP);
    push();
    textSize(20);
    text(`${this.name}: $${this.price.toFixed(2)}`, this.x, this.y);
    pop();
  }

  displayWithQuantity(quantity) {
    textAlign(LEFT, TOP);
    push();
    textSize(20);
    text(`${this.name}: $${this.price.toFixed(2)} {${quantity}}`, this.x, this.y);
    pop();
  }
}

class Item {
  constructor(name, price, x, y, bg, avatar, prize) {
    this.name = name;
    this.price = price;
    this.x = x;
    this.y = y;
    this.bg = bg;
    this.avatar = avatar;
    this.prize = prize; 
    this.purchaseTime = null;
  }

  display() {
    textAlign(LEFT, TOP);
    push();
    textSize(20);
    text(`${this.name} - $${this.price.toFixed(2)}`, this.x, this.y);
    pop();
  }
}

class Icon {
  constructor(type, img, x, y, size) {
    this.type = type;
    this.img = img;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  display() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.size, this.size);
  }

  clicked(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    return d < this.size / 2;
  }
    setHoverHandler(onHover, onLeave) {
    this.onHover = onHover;
    this.onLeave = onLeave;
  }

  checkHover() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.size / 2) {
      this.onHover;
    } else {
      this.onLeave;
    }
  }
}

function calculateIndexValue() {
  let totalValue = 0;
  stocks.forEach(stock => {
    totalValue += stock.price;
  });
  return totalValue / stocks.length;
}

function calculateSummaryStats() {
  let unrealized_profit = player.totalWealth - initial_budget;
  let unrealized_profitPercentage = initial_budget > 0 ? (unrealized_profit / initial_budget) * 100 : 0;
  let return_on_investment = (initial_budget + unrealized_profit)/initial_budget * 100;

  let uniqueStocks = new Set(Object.keys(player.stocksOwned));
  let totalStocks = uniqueStocks.size;
  let portfolio_diversification_score = totalStocks / 10 * 100;

  let gameYears = elapsedTime / (10 * 60 * 1000);

  let indexGrowthRate = currentIndexValue / initialIndexValue - 1;

  let totalInvested = initial_budget;
  let totalCurrentValue = player.totalWealth;
  let totalBenchmarkValue = totalInvested * (1 + indexGrowthRate) ** gameYears;
  
  let portfolioPerformance = totalCurrentValue - totalInvested;
  let benchmarkPerformance = totalBenchmarkValue - totalInvested;
  let alpha = portfolioPerformance - benchmarkPerformance;

  return {
    unrealized_profit: unrealized_profit.toFixed(2),
    unrealized_profitPercentage: unrealized_profitPercentage.toFixed(2) + '%',
    return_on_investment: return_on_investment.toFixed(2) + '%',
    portfolio_diversification_score: portfolio_diversification_score.toFixed(2),
    alpha: alpha.toFixed(2)
  };
}


function showInstructions() {
  fill(0);
  textSize(16);
  textAlign(CENTER, TOP);
  text("Click icons to open interfaces", width / 2, height - 30);
}


function mouseMoved() {
  phoneIcon.checkHover();
  shoppingIcon.checkHover();
}

function openTradingInterface() {
  selectedStock = null;
  selectedItem = null;
  currentInterface = 'stocks';
  buyStockButton.show();
  sellStockButton.show();
  viewStockButton.show();
  summaryStockButton.show();
  buyItemButton.hide();
  viewAnotherStockButton.hide();
  sellItemButton.hide();
  viewItemButton.hide();
  homeButton.show();
  for(let i = 0; i < 10; i++) {
    hideselectStockButton(i);
    hideSelectItemButton(i);
  }
}

function openShoppingInterface() {
  selectedStock = null;
  selectedItem = null;
  currentInterface = 'items';
  buyItemButton.show();
  sellItemButton.show();
  viewItemButton.show();
  buyStockButton.hide();
  sellStockButton.hide();
  viewStockButton.hide();
  viewAnotherStockButton.hide();
  summaryStockButton.hide();
  homeButton.show();
  for(let i = 0; i < 10; i++) {
    hideselectStockButton(i);
    hideSelectItemButton(i);
  }
}

function openMainInterface() {
  currentInterface = null;
  homeButton.hide();
  buyStockButton.hide();
  sellStockButton.hide();
  buyItemButton.hide();
  sellItemButton.hide();
  viewItemButton.hide();
  viewStockButton.hide();
  viewAnotherStockButton.hide();
  summaryStockButton.hide();
  for(let i = 0; i < 10; i++) {
    hideselectStockButton(i);
    hideSelectItemButton(i);
  }
  selectedStock = null;
  selectedItem = null;
}


function mousePressed() {
  if (currentInterface === null) {
    if (phoneIcon.clicked(mouseX, mouseY)) {
      bgSound.play();
      openTradingInterface();
    } else if (shoppingIcon.clicked(mouseX, mouseY)) {
      bgSound.play(); 
      openShoppingInterface();
    }
  } else if (currentInterface === 'stocks' && currentAction === 'view') {
    if (selectedStock == null) {
      displayStocks();
    } else {
      stocks.forEach((stock, index) => {
        if (stock.clicked(mouseX, mouseY)) {
          bgSound.play();
          selectedStock = stock;
        }
      });
    }
  }
}



const helpDictionary = {
  "Buying Stocks": "To buy stocks, click the phone icon, pick a stock, and press 'Buy'. Make sure you have enough money!",
  "Selling Stocks": "Want to sell stocks? Click the phone icon and hit 'Sell' on the stock you want to sell.",
  "Viewing Stock Market": "Curious about stock prices? Click the phone icon and choose 'View' to see the market.",
  "Portfolio Summary": `
    Check how your stocks are doing! Click the phone icon and look at the portfolio summary.

    Definitions:
    - Unrealized Profit: The profit you would make if you sold all your stocks at their current market value. It's 'unrealized' because you haven't actually sold the stocks yet.

    - Return on Investment (ROI): A measure of the profitability of your investments. It's calculated as the percentage gain or loss on your investment relative to the amount of money invested.

    - Portfolio Diversification Score: A metric that reflects how well your investments are spread across different stocks. A higher score means your investments are more diversified, reducing risk.

    - Alpha: A measure of your investment performance compared to a benchmark index. A positive alpha indicates that your portfolio has performed better than the market average.
  `,
  "Buying Items": "Click the shopping icon to buy cool items that help in the game.",
  "Selling Items": "You can sell items you own for money. Just use the shopping icon to find and sell them.",
  "Checking Budget and Wealth": "Keep track of your money! Your budget and total wealth are shown on the screen.",
  "Game Difficulty": "Choose your game challenge level: easy, normal, or hard. It changes how the stock market works.",
  "Customizing Character": "Make your character look cool with items from the shopping interface!",
  "Game Timer": "Time in the game is important for planning. Keep an eye on it!",
  "Stock Value History": "Each stock's price change over time is shown in a graph. Use it to make smart choices.",
  "Buying Lottery Tickets": "Try your luck with lottery tickets! Buy them using the shopping icon. If you're super lucky, you might win a big prize!",
  "Selling Used Items": "Sell items you own for extra cash. If you sell them quickly (in less than 200 seconds), you'll get 70% of the price. If you keep them longer, you'll earn 120%!"
};



function displayHelp(topic) {
  const helpText = helpDictionary[topic];
  if (helpText) {
    alert(helpText);
  } else {
    alert("Help topic not found. Please try a different keyword."); 
  }
}

let instructionsShown = false;


function showInstructions() {
  if (!instructionsShown) {
    const message1 = "Welcome to the Stock Market Game! Use the phone/market icons to buy/sell stocks and items. Check your stats regularly.";
    alert(message1);
    instructionsShown = true;
  }
}

function createHelpDropdown() {
  const helpDropdown = document.getElementById('helpDropdown');
  Object.keys(helpDictionary).forEach((topic) => {
    let option = document.createElement('option');
    option.value = topic;
    option.text = topic;
    helpDropdown.appendChild(option);
  });

  helpDropdown.addEventListener('change', () => {
    const selectedTopic = helpDropdown.value;
    if (selectedTopic !== 'Select Topic') {
      displayHelp(selectedTopic);
      notificationShown = false; 
    }
  });
}

