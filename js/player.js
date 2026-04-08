// ============================================
// player.js - Player physics, movement, death
// ============================================

function updatePlayer() {
    const moveLeft = keys['ArrowLeft'] || keys['KeyA'] || touchLeft;
    const moveRight = keys['ArrowRight'] || keys['KeyD'] || touchRight;
    const jump = keys['Space'] || keys['ArrowUp'] || keys['KeyW'] || touchJump;

    if (moveLeft) {
        player.vx = Math.max(player.vx - 0.8, -5);
        player.facing = -1;
    } else if (moveRight) {
        player.vx = Math.min(player.vx + 0.8, 5);
        player.facing = 1;
    } else {
        player.vx *= 0.85;
        if (Math.abs(player.vx) < 0.2) player.vx = 0;
    }

    if (jump && player.onGround) {
        player.vy = -14.4;
        player.onGround = false;
    }

    player.vy += GRAVITY;
    if (player.vy > 15) player.vy = 15;

    // Move X
    player.x += player.vx;
    player.onGround = false;

    // Collision X
    platforms.forEach(p => {
        if (rectCollide(player, p)) {
            if (player.vx > 0) player.x = p.x - player.w;
            else if (player.vx < 0) player.x = p.x + p.w;
            player.vx = 0;
        }
    });

    // Move Y
    player.y += player.vy;

    // Collision Y
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

    // Fall death
    if (player.y > canvas.height + 50) {
        playerDie();
    }

    // Left boundary
    if (player.x < 0) player.x = 0;

    // Invincibility timer
    if (player.invincible > 0) player.invincible--;

    // Camera
    const targetCam = player.x - canvas.width / 3;
    cameraX += (targetCam - cameraX) * 0.08;
    if (cameraX < 0) cameraX = 0;
    const maxCam = WORLD_WIDTH * TILE_SIZE - canvas.width;
    if (cameraX > maxCam) cameraX = maxCam;
}

function playerDie() {
    lives--;
    spawnParticles(player.x, player.y, '#FFC107', 15);
    if (lives <= 0) {
        gameState = 'gameover';
        showOverlay('Oyun Bitti!', 'Toplam Bal: ' + score, 'Tekrar Oyna');
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
        player.superMode = false;
        player.shootCooldown = 0;
        stingers = [];
    }
}
