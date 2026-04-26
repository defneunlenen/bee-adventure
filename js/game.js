// ============================================
// game.js - Game loop, touch setup, bootstrap
// ============================================

function gameLoop() {
    frameCount++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSky();
    updateClouds();
    clouds.forEach(c => drawCloud(c));
    updateButterflies();
    butterflies.forEach(b => drawButterfly(b));
    drawPollenParticles();

    if (gameState === 'playing') {
        updatePlayer();
        updateEnemies();
        updateCoins();
        updateCheckpoints();
        updateSuperBoxes();
        updateStingers();
        updateEnemyStingers();
        updateMovingPlatforms();
        updateBoss();
        updatePowerUps();
        updateSecretAreas();
        checkWin();

        backgroundFlowers.forEach(f => drawFlowerBg(f));
        waterZones.forEach(wz => drawWaterZone(wz));
        platforms.forEach(p => drawGround(p));
        movingPlatforms.forEach(mp => drawMovingPlatform(mp));
        trampolines.forEach(t => drawTrampoline(t));
        secretAreas.forEach(sa => drawSecretArea(sa));
        powerUps.forEach(pu => drawPowerUp(pu));
        checkpoints.forEach(cp => drawCheckpoint(cp));
        superBoxes.forEach(b => drawSuperBox(b));
        coins.forEach(c => drawCoin(c));
        stingers.forEach(s => drawStinger(s));
        enemyStingers.forEach(s => drawEnemyStinger(s));
        enemies.forEach(e => {
            if (e.type === 'wasp') drawWasp(e);
            else drawBird(e);
        });
        drawBoss();
        drawBee(player);
        drawFlag();
        drawParticles();
        drawHUD();
        drawBossHP();
        drawAchievementNotifications();
    } else if (gameState === 'menu') {
        backgroundFlowers.forEach(f => drawFlowerBg(f));

        // Hide HTML overlay in menu - draw everything on canvas
        overlay.style.display = 'none';

        // Title
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFD54F';
        ctx.font = 'bold 42px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Defnenin Ari Macerasi', canvas.width / 2, 70);

        // Draw all 4 skins side by side
        const skinKeys = Object.keys(SKINS);
        const spacing = 180;
        const startX = canvas.width / 2 - (skinKeys.length - 1) * spacing / 2;

        skinKeys.forEach((key, i) => {
            const cx = startX + i * spacing;
            const cy = 200;
            const isSelected = player.skin === key;

            // Selection highlight
            if (isSelected) {
                ctx.strokeStyle = '#FFD54F';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#FFD54F';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.roundRect(cx - 55, cy - 60, 110, 120, 12);
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.fillStyle = 'rgba(255, 213, 79, 0.15)';
                ctx.beginPath();
                ctx.roundRect(cx - 55, cy - 60, 110, 120, 12);
                ctx.fill();
            }

            // Draw bee at 2.5x scale
            ctx.save();
            ctx.translate(cx, cy);
            const scale = isSelected ? 2.8 : 2.2;
            ctx.scale(scale, scale);
            ctx.translate(-cx, -cy);
            const beeX = cx - 16 + cameraX;
            const beeY = cy - 16;
            drawBee({ x: beeX, y: beeY, w: 32, h: 32, facing: 1, invincible: 0, superMode: false, shield: false, speedBoost: 0, skin: key });
            ctx.restore();

            // Skin name
            ctx.fillStyle = isSelected ? '#FFD54F' : 'rgba(255,255,255,0.6)';
            ctx.font = isSelected ? 'bold 16px sans-serif' : '14px sans-serif';
            ctx.fillText(SKINS[key].name, cx, cy + 75);
        });

        // Instructions
        ctx.fillStyle = 'white';
        ctx.font = '16px sans-serif';
        ctx.fillText('N tusu ile karakter sec', canvas.width / 2, 330);

        // Level selector
        const lvlY = 380;
        ctx.fillStyle = '#FFD54F';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Seviye Sec', canvas.width / 2, lvlY - 25);

        const lvlSpacing = 100;
        const lvlStartX = canvas.width / 2 - (2) * lvlSpacing / 2;
        const levelNames = ['Kolay', 'Orta', 'Zor'];

        for (let i = 1; i <= 3; i++) {
            const lx = lvlStartX + (i - 1) * lvlSpacing;
            const isUnlocked = i <= unlockedLevel;
            const isSelected = i === selectedLevel;

            // Box
            if (isSelected) {
                ctx.fillStyle = 'rgba(255, 213, 79, 0.25)';
                ctx.beginPath();
                ctx.roundRect(lx - 38, lvlY - 18, 76, 50, 10);
                ctx.fill();
                ctx.strokeStyle = '#FFD54F';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(lx - 38, lvlY - 18, 76, 50, 10);
                ctx.stroke();
            }

            // Number
            ctx.font = 'bold 22px sans-serif';
            if (!isUnlocked) {
                ctx.fillStyle = 'rgba(255,255,255,0.25)';
            } else if (isSelected) {
                ctx.fillStyle = '#FFD54F';
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
            }
            ctx.fillText(i, lx, lvlY + 5);

            // Label
            ctx.font = '12px sans-serif';
            if (!isUnlocked) {
                ctx.fillText('Kilitli', lx, lvlY + 22);
            } else {
                ctx.fillText(levelNames[i - 1], lx, lvlY + 22);
            }

            // Lock icon for locked levels
            if (!isUnlocked) {
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.font = '16px sans-serif';
                ctx.fillText('🔒', lx, lvlY - 5);
            }
        }

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '13px sans-serif';
        ctx.fillText('← → ok tuslari ile seviye sec', canvas.width / 2, lvlY + 48);

        // Controls info
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '13px sans-serif';
        ctx.fillText('WASD/Ok: Hareket | Space: Zipla | E/X: Igne | M: Ses', canvas.width / 2, lvlY + 70);

        // Start prompt
        const pulse = 0.7 + Math.sin(frameCount * 0.05) * 0.3;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#FF9800';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('SPACE ile Seviye ' + selectedLevel + ' Basla', canvas.width / 2, lvlY + 105);
        ctx.globalAlpha = 1;

        // High scores
        if (highScores.length > 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '12px sans-serif';
            ctx.fillText('En Yuksek: ' + highScores[0] + ' bal', canvas.width / 2, lvlY + 130);
        }

        ctx.textAlign = 'start';

        // Start with Space or Enter (debounce to avoid accidental start)
        if ((keys['Space'] || keys['Enter']) && !this._menuStartHeld) {
            this._menuStartHeld = true;
            startGame();
        }
        if (!keys['Space'] && !keys['Enter']) {
            this._menuStartHeld = false;
        }
    }

    requestAnimationFrame(gameLoop);
}

function setupTouchControls() {
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    function handleTouch(e) {
        e.preventDefault();
        touchLeft = false;
        touchRight = false;
        touchJump = false;
        for (let touch of e.touches) {
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            if (x < rect.width / 3) touchLeft = true;
            else if (x > rect.width * 2 / 3) touchRight = true;
            if (y < rect.height / 2) touchJump = true;
        }
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        if (e.touches.length === 0) {
            touchLeft = false;
            touchRight = false;
            touchJump = false;
        }
    }
}

// Canvas click to start from menu (lower half only)
canvas.addEventListener('click', (e) => {
    if (gameState === 'menu') {
        const rect = canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        if (y > rect.height * 0.75) startGame();
    }
});

// Initialize
gameState = 'menu';
generateLevel(1);
setupTouchControls();
gameLoop();
