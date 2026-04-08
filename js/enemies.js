// ============================================
// enemies.js - Enemy, coin, checkpoint, superbox
//              update logic + collision helpers
// ============================================

function rectCollide(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function aliveCollide(a, e) {
    if (!e.alive) return false;
    const floatY = e.type === 'flying' ? Math.sin(frameCount * 0.05 + e.floatOffset) * 8 : 0;
    return a.x < e.x + e.w && a.x + a.w > e.x && a.y < e.y + e.h + floatY && a.y + a.h > e.y + floatY;
}

function updateEnemies() {
    enemies.forEach(e => {
        if (!e.alive) return;

        e.x += e.vx;

        if (e.type === 'flying') {
            e.y += Math.sin(frameCount * 0.03 + e.floatOffset) * 0.5;
        }

        // Patrol
        if (e.x <= e.startX || e.x >= e.endX) {
            e.vx *= -1;
        }

        // Player collision
        if (player.invincible <= 0 && aliveCollide(player, e)) {
            if (player.vy > 0 && player.y + player.h - 10 < e.y + e.h / 2) {
                // Stomp!
                e.alive = false;
                player.vy = -9.6;
                score += 100;
                spawnParticles(e.x, e.y, '#e74c3c', 12);
                spawnParticles(e.x, e.y, '#f39c12', 8);
            } else {
                playerDie();
            }
        }
    });
}

function updateCoins() {
    coins.forEach(c => {
        if (c.collected) return;
        const coinRect = { x: c.x, y: c.y, w: 20, h: 20 };
        if (rectCollide(player, coinRect)) {
            c.collected = true;
            score += 10;
            spawnParticles(c.x + 10, c.y + 10, '#FFD54F', 8);
            spawnParticles(c.x + 10, c.y + 10, '#FFF176', 5);
        }
    });
}

function updateCheckpoints() {
    checkpoints.forEach(cp => {
        if (cp.activated) return;
        const cpRect = { x: cp.x - 15, y: cp.y - 80, w: 30, h: 80 };
        if (rectCollide(player, cpRect)) {
            cp.activated = true;
            lastCheckpoint = cp;
            spawnParticles(cp.x, cp.y - 50, '#FFD54F', 15);
            spawnParticles(cp.x, cp.y - 50, '#FFF176', 10);
            score += 50;
        }
    });
}

function updateSuperBoxes() {
    superBoxes.forEach(box => {
        if (box.opened) return;
        if (rectCollide(player, box)) {
            box.opened = true;
            player.superMode = true;
            player.shootCooldown = 0;
            score += 200;
            spawnParticles(box.x + 18, box.y + 18, '#E040FB', 20);
            spawnParticles(box.x + 18, box.y + 18, '#FFD54F', 15);
            spawnParticles(box.x + 18, box.y + 18, '#CE93D8', 10);
        }
    });
}

function updateStingers() {
    if (player.superMode && (keys['KeyE'] || keys['KeyX']) && player.shootCooldown <= 0) {
        stingers.push({
            x: player.x + player.w / 2 + player.facing * 16,
            y: player.y + player.h / 2,
            vx: player.facing * 10,
            dir: player.facing,
            life: 80
        });
        player.shootCooldown = 15;
    }
    if (player.shootCooldown > 0) player.shootCooldown--;

    stingers.forEach((s, si) => {
        s.x += s.vx;
        s.life--;
        if (s.life <= 0) { stingers.splice(si, 1); return; }

        enemies.forEach(e => {
            if (!e.alive) return;
            const floatY = e.type === 'flying' ? Math.sin(frameCount * 0.05 + e.floatOffset) * 8 : 0;
            const eRect = { x: e.x, y: e.y + floatY, w: e.w, h: e.h };
            const sRect = { x: s.x - 5, y: s.y - 3, w: 10, h: 6 };
            if (rectCollide(sRect, eRect)) {
                e.alive = false;
                s.life = 0;
                score += 150;
                spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#e74c3c', 12);
                spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#FFD54F', 8);
            }
        });
    });
}

function checkWin() {
    if (player.x + player.w > flagX && player.x < flagX + 40) {
        if (level < 3) {
            level++;
            generateLevel(level);
            spawnParticles(player.x, player.y, '#FFD54F', 20);
        } else {
            gameState = 'win';
            showOverlay('Tebrikler!', 'Tum seviyeleri tamamladin! Toplam Bal: ' + score, 'Tekrar Oyna');
        }
    }
}

function updateClouds() {
    clouds.forEach(c => {
        c.x += c.speed;
        if (c.x - cameraX * 0.3 > canvas.width + c.w) {
            c.x = cameraX * 0.3 - c.w;
        }
    });
}

function updateButterflies() {
    butterflies.forEach(b => {
        b.x += b.vx;
        b.y += Math.sin(frameCount * 0.03 + b.wingFrame) * 0.5;
        if (b.x - cameraX * 0.5 > canvas.width + 30) {
            b.x = cameraX * 0.5 - 30;
            b.y = 100 + Math.random() * 200;
        }
    });
}
