let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
        //using the document.querySelector function to access HTML elements in the .js script
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
]; //Array containing all the in-game weapons and their respective power levels
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
] // Array containing all in-game monsters, their respective lvls and health pools
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. ☠️"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! 🎉" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];// locations Array containing in-game actions/options/locations and a special surprise ;)

// initialize buttons and sends you the the respective places indicated
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

//update function which dynamically updates the players location dependin on where they are in the game
function update(location) {
  monsterStats.style.display = "none"; //hides the monsters stats
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);                      //update function is called and the location array with an index of [0] is passed as ana argument
}

function goStore() {
  update(locations[1]);                   //update function is called and the location array with an index of [1] is passed as ana argument
}

function goCave() {
  update(locations[2]);                //update function is called and the location array with an index of [2] is passed as ana argument
}

function buyHealth() {
  if (gold >= 10) {                  //checks the players gold to see if it is enough to purchase health
    gold -= 10;                    // takes 10 gold to give 10 health see next line (+= and -= used to simplify)
    health += 10;
    goldText.innerText = gold;      //updates the text value of gold (decreases when health is purchased)

    healthText.innerText = health; //updates the text value of health increases when health is purchased and gold is sent
  } else {
    text.innerText = "You do not have enough gold to buy health."; //conditional statement if the IF Statement does not pass.
  }
}

function buyWeapon() {                            //function which enables player to purchase weapons
  if (currentWeapon < weapons.length - 1) {        //checks the weapon array to make sure you don't have all the weapons
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;                        //increments the current weapon by 1
      goldText.innerText = gold;             //updates the text value of gold to show spending
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);           //push method pushes the purchased weapon onto the inventory
      text.innerText += " In your inventory you have: " + inventory;        //updates the text of the inventory
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";      //if you have all the weapons and would like to sell some
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {                                          //checks to make sure you have at least one weapon before you sell it. You don't want to face the monsters without a weapon do you?
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();                           //removes sold weapn from array
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;  //displays what you have in your inventory after selling
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() { //the following 3 functions represent the monsters in game and make use of the goFight function to locate them and fighting variable to name them from 0 to 2
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {                                            //goFight function calls the update function and passes locations[3] which holds the fight commands dodge attack and run
  update(locations[3]);
  monsterHealth = monsters[fighting].health;                  // displays the monsters health using monsters[fighting].health.  the [fighting] names the number index from 0-2 and the .health accesses the monsters health stat
  monsterStats.style.display = "block";                      //displays the monstes stats in block format
  monsterName.innerText = monsters[fighting].name;          //displays the monsters name 
  monsterHealthText.innerText = monsterHealth;             //updates monsters health text value
}

function attack() {                                                                                            //attack function to determine if players has hit the monster and the resulting consequences
  text.innerText = "The " + monsters[fighting].name + " attacks.";                                             //monsters array[fighting number(0-2)].name(monsters name)
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";                            //weapons array[currentWeapon(0-3)].name (weapons name)
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;         // decreases the monsters health if isMonsterHit returns a value true which is dependent on the power of your weapon and your xp multiplied by a random whole number plus 1
  } else { 
    text.innerText += " You miss. Better go learn Chinese!!";                           // if isMonsterHit does not return true or a value at all, because its consditions were not met, the you miss buddy
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;                               //updates your health and the monsters health text values

  if (health <= 0) {                                                         //checks if your health is less than or equal to zero. if it is then you lost
    lose();
  } else if (monsterHealth <= 0) {                                            // another check to see if the monsters health is less than or equal to zero if it is then you won
    fighting === 2 ? winGame() : defeatMonster();
  }
  if (Math.random() <= .1 && inventory.length !== 1) {                        // checks to see if your weapon broke
    text.innerText += " Your " + inventory.pop() + " breaks.";             //if you weapon breaks if gets popped out of the inventory 
    currentWeapon--;                                                        // and your current weapon is decremented by 1
}

function getMonsterAttackValue(level) { // this function defines the monsters hit power and ties it to 5times the monsters level minus a random number multiplied by the players xp. 
  const hit = (level * 5) - (Math.floor(Math.random() * xp));  //calculates the strength of the monsters hit
  console.log(hit);   //logs hit strength in the console
  return hit > 0 ? hit : 0;  //returns either the value of the hit when this function is called or 0 if the monster did not do any damage to the player
}

function isMonsterHit() { // this functtion returns true if the random condition passes or if the players health is below 20 when it is called
  return Math.random() > .2 || health < 20;
}

function dodge() {  //dodges are flawless. Might add a random chance to take damage on a dodge
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {   // Function for defeating monster and getting awarded gold and XP.
  gold += Math.floor(monsters[fighting].level * 6.7);  //this calculates the gold you earn by multiplying the monsters level by 6.7 and rounds it up. So the higher level the monster, the more gold you earn.
  xp += monsters[fighting].level;  // also awards you xp and updates the xp and gold text values
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {  //restarts the game and sends you back to the town square, resets your health, XP, gold and weapon inventory
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}


// THE SURPRISE!!!!!!  This was mainly for me to learn how to use for loops while loops and Math.
function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {                                  // you will pick a number from 1-10 and this function checks using a numbers array whether the number you picked is in that randomly generated array
  const numbers = [];                                  // notice i started with an empty array which i will populate with a while loop
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));    // randomly generating the numbers array using a while lop and Math.random
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";  // the function takes a parameter guess which is used to check if the numbers in the array are found in the guess parameter
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";  //if they are, you win 20 gold
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";  // if they are not you lose 20 health
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
}


//FOR ANY QUESTIONS ABOUT MY CODE OR CORRECTS/SIMPLIFICATIONS PLEASE FEEL FREE TO CONTACT ME AT BRYANKSHANG@GMAIL.COM