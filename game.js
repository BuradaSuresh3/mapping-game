const logos = ["swiggy.png", "zomato.png", "flipkart.png"];
let cards = [];
let firstCard = null;
let lockBoard = false;
let score = 0;
let playerName = "";
let bestScore = 0;

const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const playerNameDisplay = document.getElementById("playerName");

// Load sounds
const tapSound = new Audio("assets/tap.wav");
const scoreSound = new Audio("assets/score.wav");

// Ask player name
function askPlayerName() {
    playerName = prompt("Enter your name:").trim();
    if (!playerName) return askPlayerName();
    playerNameDisplay.textContent = playerName;
    loadBestScore();
}

// Load best score from localStorage
function loadBestScore() {
    bestScore = localStorage.getItem(`logo_best_${playerName}`) || 0;
    bestScoreDisplay.textContent = bestScore;
}

// Save best score
function saveBestScore() {
    if (score > bestScore) {
        localStorage.setItem(`logo_best_${playerName}`, score);
        bestScore = score;
        bestScoreDisplay.textContent = bestScore;
    }
}

// Shuffle array
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Setup game board
function setupBoard() {
    score = 0;
    scoreDisplay.textContent = score;
    grid.innerHTML = "";
    let tileImages = [...logos, ...logos, "swiggy.png"]; // 3 pairs + 1 extra
    tileImages = shuffle(tileImages);

    tileImages.forEach(imgName => {
        const card = document.createElement("div");
        card.classList.add("card");
        const img = document.createElement("img");
        img.src = `assets/${imgName}`;
        card.appendChild(img);

        card.addEventListener("click", () => flipCard(card));
        grid.appendChild(card);
    });
}

// Flip card logic
function flipCard(card) {
    if (lockBoard || card.classList.contains("flipped")) return;
    tapSound.currentTime = 0;
    tapSound.play();
    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
    } else {
        checkMatch(card);
    }
}

// Check match
function checkMatch(secondCard) {
    const firstImg = firstCard.querySelector("img").src;
    const secondImg = secondCard.querySelector("img").src;

    if (firstImg === secondImg) {
        score++;
        scoreDisplay.textContent = score;
        scoreSound.currentTime = 0;
        scoreSound.play();
        saveBestScore();
        firstCard = null;
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard = null;
            lockBoard = false;
        }, 800);
    }
}

// Restart button
document.getElementById("restartBtn").addEventListener("click", setupBoard);

// Init
askPlayerName();
setupBoard();
