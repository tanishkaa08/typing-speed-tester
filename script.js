let userInput = document.getElementById("user-input");
let textToType = document.getElementById("text-to-type");
let timeDisplay = document.getElementById("time");
let wpmDisplay = document.getElementById("wpm");
let accuracyDisplay = document.getElementById("accuracy");
let resultDisplay = document.getElementById("result");

let timer;
let timeElapsed = 0;
let wordsTyped = 0;
let correctChars = 0;
let totalChars = 0;
let targetText = "";
let isTesting = false;

const randomTexts = [
  "The quick hello brown fox why jumps test over the lazy dog",
  "A journey of a thousand should be miles begins with a single step.",
  "To be or journey not to be bye possible that is the question.",
  "All pet plaster that glitters flower is not gold.",
  "Better late blooming ship sails together than never.",
  "A watched seashell pot quiz test never could boils.",
  "Actions speak louder pink minion than words.",
  "Every hello cloud has could has dog cat red blue nothing a silver gold lining."
];

// Start/stop the test when pressing Enter
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    if (isTesting) {
      stopTest();
    } else {
      startTest();
    }
  }
});

// Start the typing test
function startTest() {
  isTesting = true;
  userInput.disabled = false;
  userInput.value = "";
  userInput.focus();
  timeElapsed = 0;
  wordsTyped = 0;
  correctChars = 0;
  totalChars = 0;
  timeDisplay.textContent = timeElapsed;
  wpmDisplay.textContent = wordsTyped;
  accuracyDisplay.textContent = "100%";
  resultDisplay.textContent = "";
  
  targetText = getRandomText();  // Keep target text fixed
  textToType.textContent = targetText;  // Set the target text
  
  timer = setInterval(updateTime, 1000);
}

// Generate random text from predefined list
function getRandomText() {
  const randomIndex = Math.floor(Math.random() * randomTexts.length);
  return randomTexts[randomIndex];
}

// Update the timer every second
function updateTime() {
  timeElapsed++;
  timeDisplay.textContent = timeElapsed;

  // Calculate WPM and Accuracy when the test is over
  if (userInput.value === targetText) {
    stopTest();
  } else {
    calculateAccuracy();
  }
}

// Handle typing input and highlight correct/incorrect letters
userInput.addEventListener("input", function() {
  let typedText = userInput.value;
  let target = targetText;

  // Highlight correctly typed characters, preserve typed text
  let highlightedText = "";
  correctChars = 0;  // Reset correctChars for each input
  totalChars = targetText.length; // Set the total characters based on the target text
  
  // Go through the typed characters and check them against the target
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === target[i]) {
      highlightedText += `<span class="correct">${typedText[i]}</span>`;
      correctChars++;
    } else {
      highlightedText += `<span class="incorrect">${typedText[i]}</span>`;
    }
  }

  // Append the remaining target text after the typed characters
  highlightedText += target.slice(typedText.length);

  // Set the highlighted text, preserving the typed characters
  textToType.innerHTML = highlightedText;

  // Update accuracy
  calculateAccuracy();
});

// Calculate words per minute with accuracy consideration
function calculateWPM() {
  wordsTyped = Math.floor((userInput.value.split(" ").length / timeElapsed) * 60);
  let accuracy = parseFloat(accuracyDisplay.textContent.replace('%', '')) / 100; // Get accuracy as a decimal
  let adjustedWPM = Math.floor(wordsTyped * accuracy); // Adjust WPM by multiplying with accuracy percentage
  wpmDisplay.textContent = adjustedWPM;
}

// Calculate accuracy percentage
function calculateAccuracy() {
  let accuracy = ((correctChars / totalChars) * 100).toFixed(2);
  accuracyDisplay.textContent = `${accuracy}%`;

  // Recalculate WPM with accuracy after every input
  calculateWPM();
}

// Stop the typing test
function stopTest() {
  clearInterval(timer);
  isTesting = false;
  calculateWPM();
  resultDisplay.textContent = `Test completed! You typed at ${wpmDisplay.textContent} WPM.`;
  userInput.disabled = true;
  textToType.innerHTML = "Press Enter to start again.";
}
