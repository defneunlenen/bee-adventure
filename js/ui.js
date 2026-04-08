// ============================================
// ui.js - Overlay UI (menu, gameover, win)
// ============================================

function showOverlay(title, text, btnText) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlayBtn.textContent = btnText;
    overlay.style.display = 'block';
}

function startGame() {
    overlay.style.display = 'none';
    if (gameState === 'menu' || gameState === 'gameover' || gameState === 'win') {
        score = 0;
        lives = 3;
        level = 1;
        particles = [];
        pollenParticles = [];
        generateLevel(level);
        gameState = 'playing';
    }
}
