
// Personagens e imagens

const characters = [
    {
        name: "The Knight",
        image: "./assets/knight.png"
    },
    {
        name: "Hornet",
        image: "./assets/hornet.png"
    },
    {
        name: "Quirrel",
        image: "./assets/quirrel.png"
    },
    {
        name: "Elderbug",
        image: "./assets/elderbug.png"
    },
    {
        name: "Zote",
        image: "./assets/zote.png"
    },
    {
        name: "Grimm",
        image: "./assets/grimm.png"
    }
];

// Elementos HTML

const board = document.getElementById("board");

const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const progressDisplay = document.getElementById("progress");

const overlay = document.getElementById("overlay");

const finalMoves = document.getElementById("finalMoves");
const finalTime = document.getElementById("finalTime");

const restartButton = document.getElementById("restart");
const playAgainButton = document.getElementById("playAgain");

// Variáveis do jogo

let firstCard = null;
let secondCard = null;

let moves = 0;
let matchedPairs = 0;

let lockBoard = false;
let gameStarted = false;

let timerInterval = null;
let seconds = 0;

// Embaralhar cartas

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;
}

// Criar tabuleiro

function createBoard() {

    board.innerHTML = "";

    // Duplicar personagens para formar 6 pares

    let cards = [...characters, ...characters];

    // Embaralhar as cartas

    shuffle(cards);

    cards.forEach((character) => {

        const card = document.createElement("button");

        card.classList.add("card");

        card.type = "button";

        card.setAttribute("aria-label", "Carta fechada");

        card.dataset.name = character.name;

        card.innerHTML = `

            <div class="card-inner">

                <div class="card-front"></div>

                <div class="card-back">

                    <img
                        src="${character.image}"
                        alt="${character.name}"
                        loading="lazy"
                        onerror="this.style.display='none'; this.parentElement.querySelector('.character-name').textContent += ' (imagem indisponível)'"
                    >

                    <span class="character-name">
                        ${character.name}
                    </span>

                </div>

            </div>

        `;

        card.addEventListener("click", () => flipCard(card));

        board.appendChild(card);

    });

}

// Iniciar cronômetro

function startTimer() {

    if (gameStarted) return;

    gameStarted = true;

    timerInterval = setInterval(() => {

        seconds++;

        updateTimer();

    }, 1000);

}

// Atualizar cronômetro

function updateTimer() {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(remainingSeconds).padStart(2, "0");

}

// Virar carta

function flipCard(card) {

    // Impedir cliques durante comparação

    if (lockBoard) return;

    // Impedir clicar em cartas já abertas

    if (
        card === firstCard ||
        card.classList.contains("matched") ||
        card.classList.contains("flipped")
    ) {
        return;
    }

    // Iniciar cronômetro no primeiro clique

    startTimer();

    // Revelar carta

    card.classList.add("flipped");

    card.setAttribute("aria-label", card.dataset.name);

    // Selecionar primeira carta

    if (!firstCard) {

        firstCard = card;

        return;

    }

    // Selecionar segunda carta

    secondCard = card;

    // Contabilizar tentativa

    moves++;

    movesDisplay.textContent = moves;

    // Comparar cartas

    checkMatch();

}

// Verificar pares

function checkMatch() {

    const isMatch =
        firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {

        // Manter cartas abertas

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.setAttribute("aria-label", "Par encontrado");
        secondCard.setAttribute("aria-label", "Par encontrado");

        matchedPairs++;

        progressDisplay.textContent = matchedPairs + " / 6";

        resetSelection();

        // Verificar se todos os pares foram encontrados

        if (matchedPairs === 6) {

            finishGame();

        }

    } else {

        // Bloquear tabuleiro durante comparação

        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard.setAttribute("aria-label", "Carta fechada");
            secondCard.setAttribute("aria-label", "Carta fechada");

            resetSelection();

        }, 1000);

    }

}

// Limpar seleção

function resetSelection() {

    firstCard = null;
    secondCard = null;

    lockBoard = false;

}

// Finalizar jogo

function finishGame() {

    clearInterval(timerInterval);

    gameStarted = false;

    // Mostrar resultados

    finalMoves.textContent = moves;

    finalTime.textContent = timerDisplay.textContent;

    // Exibir tela de vitória

    setTimeout(() => {

        overlay.classList.add("active");

    }, 500);

}

// Reiniciar jogo

function restartGame() {

    // Parar cronômetro

    clearInterval(timerInterval);

    // Restaurar variáveis

    firstCard = null;
    secondCard = null;

    moves = 0;
    matchedPairs = 0;

    seconds = 0;

    lockBoard = false;
    gameStarted = false;

    // Atualizar estatísticas

    movesDisplay.textContent = "0";

    progressDisplay.textContent = "0 / 6";

    timerDisplay.textContent = "00:00";

    // Fechar tela de vitória

    overlay.classList.remove("active");

    // Criar novo tabuleiro

    createBoard();

}

// Eventos dos botões

restartButton.addEventListener("click", restartGame);

playAgainButton.addEventListener("click", restartGame);

// Iniciar jogo

createBoard();
