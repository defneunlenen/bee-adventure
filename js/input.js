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
