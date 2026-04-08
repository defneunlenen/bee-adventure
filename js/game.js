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
        checkWin();

        backgroundFlowers.forEach(f => drawFlowerBg(f));
        platforms.forEach(p => drawGround(p));
        checkpoints.forEach(cp => drawCheckpoint(cp));
        superBoxes.forEach(b => drawSuperBox(b));
        coins.forEach(c => drawCoin(c));
        stingers.forEach(s => drawStinger(s));
        enemies.forEach(e => drawBird(e));
        drawBee(player);
        drawFlag();
        drawParticles();
        drawHUD();
    } else if (gameState === 'menu') {
        backgroundFlowers.forEach(f => drawFlowerBg(f));
        // Static bee in menu
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 - 80);
        const menuBob = Math.sin(frameCount * 0.05) * 10;
        ctx.translate(0, menuBob);

        ctx.scale(2, 2);
        const wf = Math.sin(frameCount * 0.3) * 0.4;
        ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
        ctx.save();
        ctx.rotate(-0.3 + wf);
        ctx.beginPath();
        ctx.ellipse(-2, -14, 12, 7, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#FFC107';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(-4, -4, 10, 3);
        ctx.fillRect(-6, 2, 12, 3);
        ctx.fillStyle = '#FFD54F';
        ctx.beginPath();
        ctx.arc(12, -2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(15, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(16, -4, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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

// Initialize
showOverlay('Ari Macerasi', 'Ok tuslari veya WASD ile hareket et, Space ile zipla! Kuslarin ustune ziplayarak yok et!', 'Oyunu Basla');
gameState = 'menu';
generateLevel(1);
setupTouchControls();
gameLoop();
