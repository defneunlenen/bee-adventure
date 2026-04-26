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
        ctx.fillText('N tusu ile karakter sec', canvas.width / 2, 340);

        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '14px sans-serif';
        ctx.fillText('Ok tuslari / WASD: Hareket | Space: Zipla | E/X: Igne at | M: Ses', canvas.width / 2, 400);

        // Start prompt
        const pulse = 0.7 + Math.sin(frameCount * 0.05) * 0.3;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#FF9800';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('SPACE ile Oyunu Basla', canvas.width / 2, 470);
        ctx.globalAlpha = 1;

        // High scores
        if (highScores.length > 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '13px sans-serif';
            ctx.fillText('En Yuksek: ' + highScores[0] + ' bal', canvas.width / 2, 510);
        }

        ctx.textAlign = 'start';

        // Start with Space or Enter
        if (keys['Space'] || keys['Enter']) {
            startGame();
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

// Canvas click to start from menu
canvas.addEventListener('click', () => {
    if (gameState === 'menu') startGame();
});

// Initialize
gameState = 'menu';
generateLevel(1);
setupTouchControls();
gameLoop();
