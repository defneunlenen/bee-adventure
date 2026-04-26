// ============================================
// ui.js - Overlay UI (menu, gameover, win),
//         high scores, skin selection
// ============================================

function showOverlay(title, text, btnText) {
    overlayTitle.textContent = title;
    overlayText.innerHTML = text;
    overlayBtn.textContent = btnText;
    overlay.style.display = 'block';
}

function startGame() {
    overlay.style.display = 'none';
    if (gameState === 'gameover' || gameState === 'win') {
        // Go back to menu to pick level
        selectedLevel = unlockedLevel;
        gameState = 'menu';
        generateLevel(1);
        return;
    }
    if (gameState === 'menu') {
        score = 0;
        lives = 3;
        level = selectedLevel;
        particles = [];
        pollenParticles = [];
        generateLevel(level);
        gameState = 'playing';
        initAudio();
        startMusic();
    }
}

function saveHighScore(s) {
    highScores.push(s);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('beeHighScores', JSON.stringify(highScores));
}

function getHighScoreText() {
    if (highScores.length === 0) return '';
    let txt = '<br><br><b>En Yuksek Skorlar:</b><br>';
    highScores.forEach((s, i) => {
        txt += (i + 1) + '. ' + s + ' bal<br>';
    });
    return txt;
}

function getSkinInfoText() {
    let txt = '<br><small>Skin: ' + SKINS[player.skin].name;
    txt += ' | N tusu ile degistir</small>';
    return txt;
}
