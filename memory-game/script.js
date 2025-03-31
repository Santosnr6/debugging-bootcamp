const log = (msg) => console.log(msg);

let oGameData = {};

document.querySelector('#newGame').addEventListener('click', initGame);

function initGame() {
    log('initGame()');
    initGlobalObject();
    collectPlayerDetails();
    
    document.querySelector('#form').classList.add('d-none');
    document.querySelector('#errorMsg').textContent = '';
    
    generateGameField();
    generateStartingPlayer();
    document.querySelector('#gameTable').addEventListener('click', executeMove);
}

function initGlobalObject() {
    oGameData = {
        nickNamePlayerOne: '',
        colorPlayerOne: '',
        scorePlayerOne: 0,
        nickNamePlayerTwo: '',
        colorPlayerTwo: '',
        scorePlayerTwo: 0,
        currentPlayer: '',
        currentMove: 1,
        flippedCard: '',
        remainingCards: 16
    };
}

function collectPlayerDetails() {
    log('collectPlayerDetails()');
    oGameData.nickNamePlayerOne = document.querySelector('#nick_1').value;
    oGameData.nickNamePlayerTwo = document.querySelector('#nick_2').value;
    oGameData.colorPlayerOne = document.querySelector('#color_1').value;
    oGameData.colorPlayerTwo = document.querySelector('#color_2').value;
}

function generateStartingPlayer() {
    log('generateStartingPlayer()');
    let playerName = '';
    if (Math.random() < 0.5) {
        oGameData.currentPlayer = 1;
        playerName = oGameData.nickNamePlayerOne;
    } else {
        oGameData.currentPlayer = 2;
        playerName = oGameData.nickNamePlayerTwo;
    }
    document.querySelector('#msg').textContent = `Aktuell spelare är ${playerName}`;
}

function executeMove(event) {
    log('executeMove()');
    if (event.target.tagName === 'TD') {
        if (event.target.firstChild.dataset.cardInplay) {
            event.target.firstChild.classList.toggle('d-none');
            if (oGameData.currentMove === 1) {
                oGameData.currentMove++;
                oGameData.flippedCard = event.target.firstChild;
            } else {
                if (oGameData.flippedCard.dataset.cardId === event.target.firstChild.dataset.cardId) {
                    oGameData.flippedCard.dataset.cardInplay = false;
                    event.target.firstChild.dataset.cardInplay = false;
                    oGameData.remainingCards -= 2;
                } else {
                    setTimeout(() => {
                        event.target.firstChild.classList.toggle('d-none');
                        oGameData.flippedCard.classList.toggle('d-none');
                        changePlayer();
                    }, 1500);
                }
                checkForWinner();
            }
        }
    }
}

function checkForWinner() {
    if (oGameData.remainingCards === 0) {
        let winner;
        if (oGameData.scorePlayerOne > oGameData.scorePlayerTwo) {
            winner = 1;
        } else if (oGameData.scorePlayerOne < oGameData.scorePlayerTwo) {
            winner = 2;
        } else {
            winner = 3;
        }
        gameOver(winner);
    }
}

function gameOver(winner) {
    document.querySelector('#form').classList.remove('d-none');
    document.querySelector('#gameTable').removeEventListener('click', executeMove);
    document.querySelector('#msg').textContent = `${winner ? winner : 'Ingen'} vann!`;
}

function changePlayer() {
    oGameData.currentPlayer = oGameData.currentPlayer === 1 ? 2 : 1;
    document.querySelector('#msg').textContent = `Aktuell spelare är ${oGameData.currentPlayer === 1 ? oGameData.nickNamePlayerOne : oGameData.nickNamePlayerTwo}`;
}

function generateGameField() {
    log('generateGameField()');
    const gameAreaRef = document.querySelector('#gameArea');
    gameAreaRef.innerHTML = '';
    gameAreaRef.classList.add('row', 'justify-content-center', 'mt-5');

    const tableRef = document.createElement('table');
    tableRef.id = 'gameTable';

    const deck = createDeck();

    for (let i = 0; i < 4; i++) {
        const rowRef = document.createElement('tr');
        for (let j = 0; j < 4; j++) {
            const tdRef = document.createElement('td');
            tdRef.style = 'width: 100px; height: 160px; border: 1px solid darkgrey; text-align: center; background-color: #CCCCCC';
            let card = deck.pop();
            const imgRef = document.createElement('img');
            imgRef.dataset.cardId = card.value;
            imgRef.dataset.cardInplay = true;
            imgRef.src = card.imageUrl;
            imgRef.classList.add('w-100', 'd-none');
            tdRef.appendChild(imgRef);
            rowRef.appendChild(tdRef);
        }
        tableRef.appendChild(rowRef);
    }
    gameAreaRef.appendChild(tableRef);
}

function createDeck() {
    log('createDeck()');
    let deck = [];
    for (let i = 1; i <= 8; i++) {
        for (let j = 0; j < 2; j++) {
            deck.push({ value: i, imageUrl: `./images/${i}.jpg` });
        }
    }
    return shuffleDeck(deck);
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}
