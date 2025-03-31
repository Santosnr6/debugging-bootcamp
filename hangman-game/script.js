const programmingLanguages = [
  "python", "javascript", "mongodb", "json", "java", "html", "css", "c", "csharp", "golang", "kotlin", "php", "sql", "ruby"
];

let answer = '';
let maxWrong = 6;
let mistakes = 0;
let guessed = [];
let wordStatus = '';

// DOM-element
const elements = {
  keyboard: document.getElementById('keyboard'),
  wordSpotlight: document.getElementById('wordSpotlight'),
  hangmanPic: document.getElementById('hangmanPic'),
  mistakes: document.getElementById('mistake'),
  maxWrong: document.getElementById('maxWrong'),
  restartButton: document.getElementById('restartbutton')
};

// Starta spelet
function startGame() {
  mistakes = 0;
  guessed = [];
  randomWord();
  updateWordStatus();
  updateMistakes();
  generateButtons();
  elements.maxWrong.innerHTML = maxWrong;
  elements.hangmanPic.src = './images/0.png';
  elements.restartButton.style.display = 'none'; // Dölj restart-knappen tills spelet är slut
}

// Välj ett slumpmässigt ord
function randomWord() {
  answer = programmingLanguages[Math.floor(Math.random() * programmingLanguages.length)];
}

// Skapa knappfunktioner
function generateButtons() {
  elements.keyboard.innerHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => `
    <button
      class="btn btn-lg btn-primary m-2"
      id="${letter}"
      onClick="handleGuess('${letter}')"
    >
      ${letter}
    </button>
  `).join('');
}

// Hantera gissningar
function handleGuess(chosenLetter) {
  if (!guessed.includes(chosenLetter)) {
    guessed.push(chosenLetter);
    document.getElementById(chosenLetter).setAttribute('disabled', true);

    if (answer.includes(chosenLetter)) {
      updateWordStatus();
      checkIfGameWon();
    } else {
      mistakes--;
      updateMistakes();
      checkIfGameLost();
      updateHangmanPicture();
    }
  }
}

// Uppdatera hangman-bilden baserat på antal misstag
function updateHangmanPicture() {
  elements.hangmanPic.src = `./images/${mistakes}.jpg`;
}

// Uppdatera antalet misstag på sidan
function updateMistakes() {
  elements.mistakes.innerHTML = mistakes;
}

// Kontrollera om spelaren har vunnit
function checkIfGameWon() {
  if (wordStatus = answer) {
    elements.keyboard.innerHTML = 'You Won!!!';
    elements.restartButton.style.display = 'inline'; // Visa restart-knappen när spelet är slut
  }
}

// Kontrollera om spelaren har förlorat
function checkIfGameLost() {
  if (mistakes === maxWrong) {
    elements.wordSpotlight.innerHTML = `The answer was: ${answer}`;
    elements.keyboard.innerHTML = 'You Lost!!!';
    elements.restartButton.style.display = 'inline'; // Visa restart-knappen när spelet är slut
  }
}

// Uppdatera ordstatus med korrekt gissade bokstäver
function updateWordStatus() {
  wordStatus = answer.split('').map(letter => (guessed.includes(letter) ? letter : ' _ ')).join('');
  elements.wordSpotlight.innerHTML = wordStatus;
}

// Starta spelet direkt när sidan laddas
startGame();

// Lägg till eventlyssnare för återställningsknappen
elements.restartButton.addEventListener('click', resetgame);

// Återställ spelet
const resetGame = () => {
  startGame();
  elements.restartButton.style.display = 'none'; // Dölj restart-knappen tills nästa gång
}