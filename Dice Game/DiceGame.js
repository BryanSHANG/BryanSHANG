const listOfAllDice = document.querySelectorAll(".die"); // All dice elements

const scoreInputs = document.querySelectorAll("#score-options input"); // Radio buttons for scoring

const scoreSpans = document.querySelectorAll("#score-options span"); // Score display spans

const roundElement = document.getElementById("current-round"); // Current round display

const rollsElement = document.getElementById("current-round-rolls"); // Rolls left display

const totalScoreElement = document.getElementById("total-score"); // Total score display

const scoreHistory = document.getElementById("score-history"); // Past scores list

const rollDiceBtn = document.getElementById("roll-dice-btn"); // Roll dice button

const keepScoreBtn = document.getElementById("keep-score-btn"); // Keep score button

const rulesContainer = document.querySelector(".rules-container"); // Rules popup

const rulesBtn = document.getElementById("rules-btn"); // Toggle rules button


let diceValuesArr = []; // This is meant to store current dice values (e.g., [1, 3, 5, 2, 4])
let isModalShowing = false; // Keeps track if rules are visible
let score = 0; // Total game score
let round = 1; // Current round (1-6)
let rolls = 0; // Rolls left in round (0-3)

const rollDice = () => {
  diceValuesArr = []; // Reset dice values
  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1; // Random num 1-6
    diceValuesArr.push(randomDice); // Add to array
  }
  // Updates UI to show die faces
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

const updateStats = () => {
  rollsElement.textContent = rolls;
  roundElement.textContent = round;
};

const updateRadioOption = (index, score) => {
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;
  scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
  score += parseInt(selectedValue);
  totalScoreElement.textContent = score;

  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};


const getHighestDuplicates = (arr) => {
    const counts = {}; // Track die frequencies (e.g., {1:2, 3:3})
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1; // Increment count
  }
  let highestCount = 0;
  for (const num of arr) {
    const count = counts[num];
    if (count >= 3 && count > highestCount) highestCount = count; // Track max duplicates
  }
  const sumOfAllDice = arr.reduce((a, b) => a + b, 0); // Sum all die
  
  if (highestCount >= 4) updateRadioOption(1, sumOfAllDice); // 4-of-a-kind
  
  if (highestCount >= 3) updateRadioOption(0, sumOfAllDice); // 3-of-a-kind
  
  updateRadioOption(5, 0); // Default "no score" option
};

const detectFullHouse = (arr) => {
    const counts = {};
  
   for (const num of arr) counts[num] = (counts[num] || 0) + 1; // Count frequencies
  
  const hasThreeOfAKind = Object.values(counts).includes(3); // Check for 3 matches
  
  const hasPair = Object.values(counts).includes(2); // Check for 2 matches
  
  if (hasThreeOfAKind && hasPair) updateRadioOption(2, 25); // Award 25 points
  
  updateRadioOption(5, 0); // Default "no score"
};

const checkForStraights = (arr) => {
  const sortedNumbersArr = arr.sort((a, b) => a - b); // Sort dice (e.g., [1,2,3,4,5])
  
  const uniqueNumbersArr = [...new Set(sortedNumbersArr)]; // Remove duplicates
  
  const uniqueNumbersStr = uniqueNumbersArr.join(""); // Convert to string (e.g., "1234")
  
  const smallStraightsArr = ["1234", "2345", "3456"]; // List of possible small straights
  
  const largeStraightsArr = ["12345", "23456"]; // List of possible large straights
  
  if (smallStraightsArr.some(straight => uniqueNumbersStr.includes(straight))) {
    updateRadioOption(3, 30); // Small straight = 30 pts
  }
  
  if (largeStraightsArr.includes(uniqueNumbersStr)) {
    updateRadioOption(4, 40); // Large straight = 40 pts
  }
  
  updateRadioOption(5, 0); // Default "no score"
};

const resetRadioOptions = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};

const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  round = 1;
  rolls = 0;

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScoreElement.textContent = score;
  scoreHistory.innerHTML = "";

  rollsElement.textContent = rolls;
  roundElement.textContent = round;

  resetRadioOptions();
};

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You’ve used all rolls. Select a score!"); // Remidner text to enforce rules
  } else {
    rolls++; // Increment roll count
    resetRadioOptions(); // Clear old options
    rollDice(); // Generate new dice
    updateStats(); // Update round AND rolls display
    // Check for scoring opportunities:
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);
    checkForStraights(diceValuesArr);
  }
});


rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;

  if (isModalShowing) {
    rulesBtn.textContent = "Hide rules";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Show rules";
    rulesContainer.style.display = "none";
  }
});

keepScoreBtn.addEventListener("click", () => {
  let selectedValue, achieved;
  // Finds which radio button is selected:
  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }
  if (selectedValue) {
    rolls = 0; // Reset rolls
    round++; // Advance round
    updateStats(); // Update UI
    resetRadioOptions(); // Clear selections
    updateScore(selectedValue, achieved); // Add to total score
    if (round > 6) { // End game after 6 rounds
      setTimeout(() => {
        alert(`Game Over! Final Score: ${score}`);
        resetGame(); // Restart
      }, 500);
    }
  } else {
    alert("Please select a score or roll again!"); // Validation
  }
});
