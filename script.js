const container = document.getElementById('game-container');
const basket = document.getElementById('basket');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const menu = document.getElementById('menu');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const newRecordMsg = document.getElementById('new-record-msg');

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameActive = false;
let basketX = 400;
let gameInterval;
let currentSettings = {};

// Başlangıçta rekoru yazdır
highScoreElement.innerText = highScore;

// Zorluk Ayarları
const levels = {
    easy: { speedMin: 2, speedMax: 4, spawnRate: 800, bombChance: 0.1 },
    normal: { speedMin: 4, speedMax: 6, spawnRate: 600, bombChance: 0.2 },
    hard: { speedMin: 6, speedMax: 9, spawnRate: 400, bombChance: 0.35 },
    impossible: { speedMin: 10, speedMax: 15, spawnRate: 250, bombChance: 0.5 }
};

container.addEventListener('mousemove', (e) => {
    if (!gameActive) return;
    const rect = container.getBoundingClientRect();
    basketX = e.clientX - rect.left;
    if (basketX < 40) basketX = 40;
    if (basketX > 760) basketX = 760;
    basket.style.left = basketX + 'px';
});

function createFallingItem() {
    if (!gameActive) return;

    const item = document.createElement('div');
    item.className = 'falling-item';
    
    // Rastgele Obje Belirleme
    let type;
    const rand = Math.random();
    
    if (rand < currentSettings.bombChance) {
        type = { char: '💣', points: 'DEAD' };
    } else if (rand > 0.85) {
        type = { char: '⭐', points: 5 };
    } else {
        type = { char: '🎁', points: 2 };
    }
    
    item.innerText = type.char;
    item.style.left = Math.random() * (750) + 'px';
    container.appendChild(item);

    let posY = -50;
    const speed = currentSettings.speedMin + Math.random() * (currentSettings.speedMax - currentSettings.speedMin);

    const fall = setInterval(() => {
        if (!gameActive) {
            clearInterval(fall);
            item.remove();
            return;
        }

        posY += speed;
        item.style.top = posY + 'px';

        // Yakalama Kontrolü
        if (posY > 510 && posY < 570) {
            const itemX = parseInt(item.style.left);
            if (Math.abs(itemX - (basketX - 25)) < 55) {
                if (type.points === 'DEAD') {
                    endGame();
                } else {
                    score += type.points;
                    scoreElement.innerText = score;
                    clearInterval(fall);
                    item.remove();
                }
            }
        }

        if (posY > 600) {
            clearInterval(fall);
            item.remove();
        }
    }, 20);
}

function startGame(level) {
    currentSettings = levels[level];
    score = 0;
    gameActive = true;
    scoreElement.innerText = score;
    menu.style.display = 'none';
    gameOverScreen.style.display = 'none';
    newRecordMsg.style.display = 'none';
    
    document.querySelectorAll('.falling-item').forEach(i => i.remove());
    gameInterval = setInterval(createFallingItem, currentSettings.spawnRate);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    finalScoreElement.innerText = score;
    gameOverScreen.style.display = 'block';

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.innerText = highScore;
        newRecordMsg.style.display = 'block';
    }
}

function showMenu() {
    gameOverScreen.style.display = 'none';
    menu.style.display = 'block';
}
