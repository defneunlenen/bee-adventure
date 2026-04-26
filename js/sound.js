// ============================================
// sound.js - Web Audio API sound system
// ============================================

let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, duration, type, volume, ramp) {
    if (!soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (ramp) osc.frequency.linearRampToValueAtTime(ramp, audioCtx.currentTime + duration);
    gain.gain.setValueAtTime(volume || 0.15, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playNoise(duration, volume) {
    if (!soundEnabled || !audioCtx) return;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(volume || 0.05, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();
}

// Sound effects
function sfxJump() {
    playTone(400, 0.15, 'sine', 0.12, 800);
}

function sfxDoubleJump() {
    playTone(500, 0.1, 'sine', 0.1, 1000);
    setTimeout(() => playTone(700, 0.1, 'sine', 0.1, 1200), 50);
}

function sfxCoin() {
    playTone(880, 0.08, 'sine', 0.1);
    setTimeout(() => playTone(1180, 0.1, 'sine', 0.1), 60);
}

function sfxStomp() {
    playTone(200, 0.15, 'square', 0.1, 80);
    playNoise(0.08, 0.06);
}

function sfxDie() {
    playTone(400, 0.1, 'square', 0.12, 100);
    setTimeout(() => playTone(300, 0.15, 'square', 0.1, 80), 100);
    setTimeout(() => playTone(200, 0.2, 'square', 0.08, 60), 220);
}

function sfxCheckpoint() {
    playTone(523, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 100);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.12), 200);
}

function sfxSuperBox() {
    playTone(440, 0.1, 'sine', 0.12);
    setTimeout(() => playTone(554, 0.1, 'sine', 0.12), 80);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.12), 160);
    setTimeout(() => playTone(880, 0.2, 'sine', 0.15), 240);
}

function sfxShoot() {
    playTone(800, 0.08, 'sawtooth', 0.06, 400);
}

function sfxBossHit() {
    playTone(150, 0.2, 'square', 0.12, 80);
    playNoise(0.1, 0.08);
}

function sfxBossDie() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            playTone(200 + i * 50, 0.15, 'square', 0.1, 80);
            playNoise(0.1, 0.05);
        }, i * 120);
    }
    setTimeout(() => {
        playTone(523, 0.15, 'sine', 0.12);
        setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 100);
        setTimeout(() => playTone(784, 0.15, 'sine', 0.12), 200);
        setTimeout(() => playTone(1047, 0.3, 'sine', 0.15), 300);
    }, 600);
}

function sfxTrampoline() {
    playTone(300, 0.15, 'sine', 0.12, 900);
}

function sfxSplash() {
    playNoise(0.2, 0.08);
    playTone(200, 0.15, 'sine', 0.05, 100);
}

function sfxPowerUp() {
    playTone(440, 0.08, 'sine', 0.1);
    setTimeout(() => playTone(660, 0.08, 'sine', 0.1), 70);
    setTimeout(() => playTone(880, 0.12, 'sine', 0.12), 140);
}

function sfxSecret() {
    playTone(392, 0.12, 'sine', 0.1);
    setTimeout(() => playTone(494, 0.12, 'sine', 0.1), 120);
    setTimeout(() => playTone(587, 0.12, 'sine', 0.1), 240);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.15), 360);
}

function sfxAchievement() {
    playTone(523, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 80);
    setTimeout(() => playTone(784, 0.1, 'sine', 0.1), 160);
    setTimeout(() => playTone(1047, 0.25, 'sine', 0.12), 240);
}

function sfxWin() {
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((n, i) => {
        setTimeout(() => playTone(n, 0.2, 'sine', 0.12), i * 100);
    });
}

// Background music
let musicInterval = null;

function startMusic() {
    if (!soundEnabled || !audioCtx) return;
    stopMusic();
    const notes = [262, 330, 392, 523, 392, 330, 262, 330, 392, 440, 392, 330];
    let noteIndex = 0;
    musicInterval = setInterval(() => {
        if (!soundEnabled) { stopMusic(); return; }
        playTone(notes[noteIndex], 0.2, 'sine', 0.04);
        playTone(notes[noteIndex] / 2, 0.3, 'triangle', 0.02);
        noteIndex = (noteIndex + 1) % notes.length;
    }, 300);
}

function stopMusic() {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    if (!soundEnabled) stopMusic();
    else if (gameState === 'playing') startMusic();
}
