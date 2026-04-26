// ============================================
// player.js - Player physics, movement, death
// ============================================

function updatePlayer() {
    const moveLeft = keys['ArrowLeft'] || keys['KeyA'] || touchLeft;
    const moveRight = keys['ArrowRight'] || keys['KeyD'] || touchRight;
    const jump = keys['Space'] || keys['ArrowUp'] || keys['KeyW'] || touchJump;

    // Check if in water
    player.inWater = waterZones.some(wz =>
        player.x + player.w > wz.x && player.x < wz.x + wz.w &&
        player.y + player.h > wz.y && player.y < wz.y + wz.h
    );

    const speedMult = player.speedBoost > 0 ? 1.5 : 1;
    const waterSpeedMult = player.inWater ? 0.6 : 1;
    const maxSpeed = 5 * speedMult * waterSpeedMult;
    const accel = 0.8 * speedMult * waterSpeedMult;

    if (moveLeft) {
        player.vx = Math.max(player.vx - accel, -maxSpeed);
        player.facing = -1;
    } else if (moveRight) {
        player.vx = Math.min(player.vx + accel, maxSpeed);
        player.facing = 1;
    } else {
        player.vx *= 0.85;
        if (Math.abs(player.vx) < 0.2) player.vx = 0;
    }

    // Jump
    if (jump && player.onGround) {
        player.vy = player.inWater ? -8 : -14.4;
        player.onGround = false;
        player.doubleJumpAvailable = player.hasDoubleJump;
        sfxJump();
    } else if (jump && !player.onGround && player.doubleJumpAvailable && !player._jumpHeld) {
        // Double jump
        player.vy = -12;
        player.doubleJumpAvailable = false;
        sfxDoubleJump();
        spawnParticles(player.x + player.w / 2, player.y + player.h, '#CE93D8', 6);
    }

    // Water: allow repeated swim jumps
    if (player.inWater && jump && !player._jumpHeld) {
        player.vy = -6;
        player._jumpHeld = true;
    }

    // Track jump key state for edge detection
    player._jumpHeld = jump;

    // Gravity (reduced in water)
    const grav = player.inWater ? GRAVITY * 0.3 : GRAVITY;
    player.vy += grav;
    if (player.inWater && player.vy > 3) player.vy = 3;
    else if (player.vy > 15) player.vy = 15;

    // Move X
    player.x += player.vx;
    player.onGround = false;

    // Collision X - static platforms
    platforms.forEach(p => {
        if (rectCollide(player, p)) {
            if (player.vx > 0) player.x = p.x - player.w;
            else if (player.vx < 0) player.x = p.x + p.w;
            player.vx = 0;
        }
    });

    // Collision X - moving platforms
    movingPlatforms.forEach(mp => {
        if (rectCollide(player, mp)) {
            if (player.vx > 0) player.x = mp.x - player.w;
            else if (player.vx < 0) player.x = mp.x + mp.w;
            player.vx = 0;
        }
    });

    // Move Y
    player.y += player.vy;

    // Collision Y - static platforms
    platforms.forEach(p => {
        if (rectCollide(player, p)) {
            if (player.vy > 0) {
                player.y = p.y - player.h;
                player.vy = 0;
                player.onGround = true;
            } else if (player.vy < 0) {
                player.y = p.y + p.h;
                player.vy = 0;
            }
        }
    });

    // Collision Y - moving platforms
    movingPlatforms.forEach(mp => {
        if (rectCollide(player, mp)) {
            if (player.vy > 0) {
                player.y = mp.y - player.h;
                player.vy = 0;
                player.onGround = true;
                // Carry player with platform
                if (mp.axis === 'x') {
                    player.x += mp._dx || 0;
                }
            } else if (player.vy < 0) {
                player.y = mp.y + mp.h;
                player.vy = 0;
            }
        }
    });

    // Trampoline collision
    trampolines.forEach(t => {
        const tRect = { x: t.x - 5, y: t.y - 5, w: t.w + 10, h: t.h + 5 };
        if (player.vy > 0 && rectCollide(player, tRect)) {
            player.vy = -20;
            player.onGround = false;
            t.bounceTimer = 15;
            player.doubleJumpAvailable = player.hasDoubleJump;
            sfxTrampoline();
            spawnParticles(t.x + t.w / 2, t.y, '#FFEB3B', 8);
        }
        if (t.bounceTimer > 0) t.bounceTimer--;
    });

    // Reset double jump on landing
    if (player.onGround) {
        player.doubleJumpAvailable = player.hasDoubleJump;
    }

    // Fall death
    if (player.y > canvas.height + 50) {
        playerDie();
    }

    // Left boundary
    if (player.x < 0) player.x = 0;

    // Invincibility timer
    if (player.invincible > 0) player.invincible--;

    // Power-up timers
    if (player.magnet > 0) player.magnet--;
    if (player.speedBoost > 0) player.speedBoost--;

    // Magnet effect - attract nearby coins
    if (player.magnet > 0) {
        coins.forEach(c => {
            if (c.collected) return;
            const dx = (player.x + player.w / 2) - (c.x + 10);
            const dy = (player.y + player.h / 2) - (c.y + 10);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150 && dist > 5) {
                c.x += (dx / dist) * 3;
                c.y += (dy / dist) * 3;
            }
        });
    }

    // Camera
    const targetCam = player.x - canvas.width / 3;
    cameraX += (targetCam - cameraX) * 0.08;
    if (cameraX < 0) cameraX = 0;
    const maxCam = WORLD_WIDTH * TILE_SIZE - canvas.width;
    if (cameraX > maxCam) cameraX = maxCam;
}

function playerDie() {
    // Shield absorbs one hit
    if (player.shield) {
        player.shield = false;
        player.invincible = 60;
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#42A5F5', 12);
        return;
    }

    lives--;
    deathsThisLevel++;
    spawnParticles(player.x, player.y, '#FFC107', 15);
    sfxDie();

    if (lives <= 0) {
        gameState = 'gameover';
        stopMusic();
        saveHighScore(score);
        showOverlay('Oyun Bitti!', 'Toplam Bal: ' + score + getHighScoreText(), 'Tekrar Oyna');
    } else {
        if (lastCheckpoint) {
            player.x = lastCheckpoint.x - 20;
            player.y = lastCheckpoint.y - player.h;
            cameraX = Math.max(0, player.x - canvas.width / 3);
        } else {
            player.x = 100;
            player.y = 300;
            cameraX = 0;
        }
        player.vx = 0;
        player.vy = 0;
        player.invincible = 120;
        player.shootCooldown = 0;
        stingers = [];

        // If boss is alive, keep super mode and reset boss super box
        if (boss && boss.alive) {
            // Player keeps super mode for boss fight
            superBoxes.forEach(b => {
                if (b.bossBox) b.opened = false;
            });
        } else {
            player.superMode = false;
        }
    }
}
