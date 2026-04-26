// ============================================
// input.js - Keyboard and touch input handling
// ============================================

const keys = {};
const gameKeys = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyA','KeyD','KeyW','KeyS','KeyE','KeyX','KeyM','KeyN','KeyP'];

document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (gameKeys.includes(e.code)) e.preventDefault();
    // M: toggle sound
    if (e.code === 'KeyM') toggleSound();
    // N: cycle skin in menu
    if (e.code === 'KeyN' && gameState === 'menu') cycleSkin();
    // Level selection in menu
    if (gameState === 'menu') {
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            if (selectedLevel < unlockedLevel) selectedLevel++;
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            if (selectedLevel > 1) selectedLevel--;
        }
        if (e.code === 'Digit1') selectedLevel = 1;
        if (e.code === 'Digit2' && unlockedLevel >= 2) selectedLevel = 2;
        if (e.code === 'Digit3' && unlockedLevel >= 3) selectedLevel = 3;
    }
});
document.addEventListener('keyup', e => {
    keys[e.code] = false;
    if (gameKeys.includes(e.code)) e.preventDefault();
});
window.addEventListener('blur', () => {
    for (let k in keys) keys[k] = false;
});

function cycleSkin() {
    const skinKeys = Object.keys(SKINS);
    const available = skinKeys.filter(k => unlockedSkins.includes(k));
    const idx = available.indexOf(player.skin);
    player.skin = available[(idx + 1) % available.length];
    selectedSkin = player.skin;
    localStorage.setItem('beeSelectedSkin', selectedSkin);
}

// Touch controls
let touchLeft = false, touchRight = false, touchJump = false;
