// ============================================
// input.js - Keyboard and touch input handling
// ============================================

const keys = {};
const gameKeys = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyA','KeyD','KeyW','KeyS','KeyE','KeyX'];

document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (gameKeys.includes(e.code)) e.preventDefault();
});
document.addEventListener('keyup', e => {
    keys[e.code] = false;
    if (gameKeys.includes(e.code)) e.preventDefault();
});
window.addEventListener('blur', () => {
    for (let k in keys) keys[k] = false;
});

// Touch controls
let touchLeft = false, touchRight = false, touchJump = false;
