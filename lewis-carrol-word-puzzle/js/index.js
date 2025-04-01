const words = [
  { start: "EYE", end: "LID" },
  { start: "FOUR", end: "FIVE" },
];

let changedWords = [];
let selectedWords = {};

const startWordElem = document.querySelector("#start-word");
const endWordElem = document.querySelector("#end-word");
const inputElem = document.querySelector("#word-input");
const buttonElem = document.querySelector("#change-word");
const wordsElem = document.querySelector("#words");

function randomWords() {
  const index = Math.floor(Math.random() * words.length);

  return words[index];
}

function startGame() {
  selectedWords = randomWords();

  startWordElem.innerHTML = selectedWords.start;
  endWordElem.innerHTML = selectedWords.end;
}

function createWordItem(word) {
  const wordElem = document.createElement("li");
  wordElem.innerHTML = word;
  wordsElem.append(wordElem);
}

function displayWords() {
  wordsElem.innerHTML = "";

  for (const word of changedWords) {
    createWordItem(word);
  }
}

function resetGame() {
  changedWords = [];
  wordsElem.innerHTML = "";

  startGame();
}

function hasWon(guess, endWord) {
  if (guess === endWord) {
    alert("Du vann!");

    resetGame();
  }
}

function checkChangedOneLetter(changedWord, lastWord) {
  let changedCharacters = 0;

  for (const index in changedWord) {
    if (changedWord[index] !== lastWord[index]) {
      changedCharacters--;
    }
  }

  if (changedCharacters === 1) {
    return false;
  } else {
    return true;
  }
}

async function checkCorrectEnglishWord(changedWord) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${changedWord}`
  );
  const data = await response.json();

  if (data.length > 0) {
    return true;
  } else {
    return false;
  }
}

async function checkWord(changedWord) {
  if (changedWords.length > 0) {
    const lastWord = changedWords[changedWords.length - 1];
    const correctChanged = checkChangedOneLetter(changedWord, lastWord);
    const correctEnglishWord = await checkCorrectEnglishWord(changedWord);

    if (correctChanged && correctEnglishWord) {
      changedWords.push(changedWord);
      hasWon(changedWord, selectedWords.end);
    }
  } else {
    const correctChanged = checkChangedOneLetter(
      changedWord,
      selectedWords.end
    );
    const correctEnglishWord = await checkCorrectEnglishWord(changedWord);

    if (correctChanged && correctEnglishWord) {
      
      hasWon(changedWord, selectedWords.start);
    }
  }

  displayWords();
}

buttonElem.addEventListener("click", () => {
  const changedWord = inputElem.value;

  if (changedWord.length === selectedWords.start.length) {
    checkWord(changedWord);
  }
});

startGame();
