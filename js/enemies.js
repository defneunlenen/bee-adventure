// ============================================
// enemies.js - Enemy, coin, checkpoint, superbox,
//              boss, powerup, secret area, moving
//              platform update logic + collision
// ============================================

function rectCollide(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function aliveCollide(a, e) {
    if (!e.alive) return false;
    const floatY = (e.type === 'flying' || e.type === 'wasp') ? Math.sin(frameCount * 0.05 + e.floatOffset) * 8 : 0;
    return a.x < e.x + e.w && a.x + a.w > e.x && a.y < e.y + e.h + floatY && a.y + a.h > e.y + floatY;
}

function updateEnemies() {
    enemies.forEach(e => {
        if (!e.alive) return;

        if (e.type === 'flying' || e.type === 'wasp') {
            e.x += e.vx;
            e.y += Math.sin(frameCount * 0.03 + e.floatOffset) * 0.5;

            if (e.x <= e.startX || e.x >= e.endX) {
                e.vx *= -1;
            }

            // Wasp shooting
            if (e.type === 'wasp') {
                e.shootTimer--;
                if (e.shootTimer <= 0) {
                    e.shootTimer = 600;
                    const dx = player.x - e.x;
                    const dy = player.y - e.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > 0) {
                        const speed = 3;
                        enemyStingers.push({
                            x: e.x + e.w / 2,
                            y: e.y + e.h / 2,
                            vx: (dx / dist) * speed,
                            vy: (dy / dist) * speed,
                            life: 300
                        });
                        sfxShoot();
                    }
                }
            }
        } else {
            // Walking enemy
            e.vy += GRAVITY;
            if (e.vy > 15) e.vy = 15;

            e.x += e.vx;

            platforms.forEach(p => {
                if (e.x < p.x + p.w && e.x + e.w > p.x && e.y < p.y + p.h && e.y + e.h > p.y) {
                    if (e.vx > 0) e.x = p.x - e.w;
                    else if (e.vx < 0) e.x = p.x + p.w;
                    e.vx *= -1;
                }
            });

            e.y += e.vy;

            e.onGround = false;
            platforms.forEach(p => {
                if (e.x < p.x + p.w && e.x + e.w > p.x && e.y < p.y + p.h && e.y + e.h > p.y) {
                    if (e.vy > 0) {
                        e.y = p.y - e.h;
                        e.vy = 0;
                        e.onGround = true;
                    } else if (e.vy < 0) {
                        e.y = p.y + p.h;
                        e.vy = 0;
                    }
                }
            });

            if (e.onGround) {
                const checkX = e.vx > 0 ? e.x + e.w + 2 : e.x - 2;
                const checkY = e.y + e.h + 5;
                const hasFloor = platforms.some(p =>
                    checkX >= p.x && checkX <= p.x + p.w &&
                    checkY >= p.y && checkY <= p.y + p.h
                );
                if (!hasFloor) e.vx *= -1;
            }

            if (e.y > canvas.height + 100) e.alive = false;

            if (e.x <= e.startX || e.x >= e.endX) e.vx *= -1;
        }

        // Player collision
        if (player.invincible <= 0 && aliveCollide(player, e)) {
            const eFloatY = (e.type === 'flying' || e.type === 'wasp') ? Math.sin(frameCount * 0.05 + e.floatOffset) * 8 : 0;
            const stompZone = e.type === 'wasp' ? e.h * 0.7 : e.h / 2;
            if (player.vy > 0 && player.y + player.h - 10 < e.y + eFloatY + stompZone) {
                e.alive = false;
                player.vy = -9.6;
                score += e.type === 'wasp' ? 150 : 100;
                spawnParticles(e.x, e.y, e.type === 'wasp' ? '#FF8F00' : '#e74c3c', 12);
                spawnParticles(e.x, e.y, '#f39c12', 8);
                sfxStomp();
                checkAchievement('stomper');
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
            sfxCoin();
            checkAchievement('firstCoin');
            const totalCoins = coins.filter(cc => cc.collected).length;
            if (totalCoins >= 100) checkAchievement('coinHunter');
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
            sfxCheckpoint();
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
            sfxSuperBox();
            checkAchievement('superBee');
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
        sfxShoot();
    }
    if (player.shootCooldown > 0) player.shootCooldown--;

    stingers.forEach((s, si) => {
        s.x += s.vx;
        s.life--;
        if (s.life <= 0) { stingers.splice(si, 1); return; }

        // Hit enemies
        enemies.forEach(e => {
            if (!e.alive) return;
            const floatY = (e.type === 'flying' || e.type === 'wasp') ? Math.sin(frameCount * 0.05 + e.floatOffset) * 8 : 0;
            const eRect = { x: e.x, y: e.y + floatY, w: e.w, h: e.h };
            const sRect = { x: s.x - 5, y: s.y - 3, w: 10, h: 6 };
            if (rectCollide(sRect, eRect)) {
                e.alive = false;
                s.life = 0;
                score += 150;
                spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#e74c3c', 12);
                spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#FFD54F', 8);
                sfxStomp();
            }
        });

        // Hit boss
        if (boss && boss.alive) {
            const sRect = { x: s.x - 5, y: s.y - 3, w: 10, h: 6 };
            const floatY = Math.sin(frameCount * 0.04 + boss.floatOffset) * 10;
            const bRect = { x: boss.x, y: boss.y + floatY, w: boss.w, h: boss.h };
            if (rectCollide(sRect, bRect)) {
                boss.hp--;
                boss.flashTimer = 20;
                s.life = 0;
                sfxBossHit();
                spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#FFD54F', 10);
                if (boss.hp <= 0) {
                    boss.alive = false;
                    score += 500 * level;
                    sfxBossDie();
                    spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#e74c3c', 25);
                    spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#FFD54F', 20);
                    checkAchievement('bossSlayer');
                }
            }
        }
    });
}

function updateEnemyStingers() {
    enemyStingers.forEach((s, si) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life--;

        if (s.life <= 0) { enemyStingers.splice(si, 1); return; }

        if (player.invincible <= 0) {
            const sRect = { x: s.x - 5, y: s.y - 3, w: 10, h: 6 };
            if (rectCollide(player, sRect)) {
                s.life = 0;
                playerDie();
                return;
            }
        }

        const sRect = { x: s.x - 5, y: s.y - 3, w: 10, h: 6 };
        const hitPlatform = platforms.some(p => rectCollide(sRect, p));
        if (hitPlatform) {
            spawnParticles(s.x, s.y, '#FF6F00', 4);
            s.life = 0;
        }
    });

    for (let i = enemyStingers.length - 1; i >= 0; i--) {
        if (enemyStingers[i].life <= 0) enemyStingers.splice(i, 1);
    }
}

function updateMovingPlatforms() {
    movingPlatforms.forEach(mp => {
        const prevX = mp.x;
        const prevY = mp.y;

        if (mp.axis === 'x') {
            mp.x = mp.originX + Math.sin(frameCount * 0.02 * mp.speed + mp.phase) * mp.range;
        } else {
            mp.y = mp.originY + Math.sin(frameCount * 0.02 * mp.speed + mp.phase) * mp.range;
        }

        mp._dx = mp.x - prevX;
        mp._dy = mp.y - prevY;
    });
}

function updateBoss() {
    if (!boss || !boss.alive) return;

    if (boss.flashTimer > 0) boss.flashTimer--;

    // Movement
    boss.x += boss.vx;
    boss.y += Math.sin(frameCount * 0.03 + boss.floatOffset) * 0.5;

    if (boss.x <= boss.startX || boss.x >= boss.endX) {
        boss.vx *= -1;
    }

    // Attack patterns
    boss.attackTimer--;

    if (boss.type === 'bigbird') {
        // Dive attack
        if (boss.attackTimer <= 0) {
            boss.attackTimer = 180;
            // Dive toward player
            if (Math.abs(player.x - boss.x) < 300) {
                boss.vy = 4;
                setTimeout(() => { if (boss) boss.vy = -2; }, 500);
                setTimeout(() => { if (boss) boss.vy = 0; }, 1000);
            }
        }
        boss.y += boss.vy;
    } else if (boss.type === 'giantwasp') {
        // Stinger barrage
        boss.shootTimer--;
        if (boss.shootTimer <= 0) {
            boss.shootTimer = 90;
            for (let i = -1; i <= 1; i++) {
                const dx = player.x - boss.x;
                const dy = player.y - boss.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const angle = Math.atan2(dy, dx) + i * 0.3;
                enemyStingers.push({
                    x: boss.x + boss.w / 2,
                    y: boss.y + boss.h / 2,
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3,
                    life: 250
                });
            }
            sfxShoot();
        }
    } else if (boss.type === 'kingbird') {
        // Dive + stinger + summon
        if (boss.attackTimer <= 0) {
            boss.attackTimer = 120;
            boss.vy = 5;
            setTimeout(() => { if (boss) boss.vy = -3; }, 400);
            setTimeout(() => { if (boss) boss.vy = 0; }, 900);
        }
        boss.y += boss.vy;

        boss.shootTimer--;
        if (boss.shootTimer <= 0) {
            boss.shootTimer = 70;
            const dx = player.x - boss.x;
            const dy = player.y - boss.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            enemyStingers.push({
                x: boss.x + boss.w / 2,
                y: boss.y + boss.h / 2,
                vx: (dx / dist) * 3.5,
                vy: (dy / dist) * 3.5,
                life: 300
            });
            sfxShoot();
        }

        // Summon minions
        boss.summonTimer--;
        if (boss.summonTimer <= 0) {
            boss.summonTimer = 400;
            enemies.push({
                x: boss.x, y: boss.y,
                w: 36, h: 28,
                vx: (Math.random() > 0.5 ? 1 : -1) * 2,
                startX: boss.x - 200, endX: boss.x + 200,
                alive: true,
                type: 'flying',
                wingFrame: Math.random() * Math.PI * 2,
                vy: 0,
                floatOffset: Math.random() * Math.PI * 2
            });
        }
    }

    // Boss-player collision (stomp)
    if (player.invincible <= 0) {
        const floatY = Math.sin(frameCount * 0.04 + boss.floatOffset) * 10;
        const bRect = { x: boss.x, y: boss.y + floatY, w: boss.w, h: boss.h };
        if (rectCollide(player, bRect)) {
            if (player.vy > 0 && player.y + player.h - 10 < boss.y + floatY + boss.h * 0.8) {
                boss.hp--;
                boss.flashTimer = 20;
                player.vy = -12;
                sfxBossHit();
                spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#FFD54F', 10);
                if (boss.hp <= 0) {
                    boss.alive = false;
                    score += 500 * level;
                    sfxBossDie();
                    spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#e74c3c', 25);
                    spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#FFD54F', 20);
                    checkAchievement('bossSlayer');
                }
            } else {
                playerDie();
            }
        }
    }
}

function updatePowerUps() {
    powerUps.forEach(pu => {
        if (pu.collected) return;
        if (rectCollide(player, pu)) {
            pu.collected = true;
            sfxPowerUp();
            spawnParticles(pu.x + pu.w / 2, pu.y + pu.h / 2, '#FFD54F', 10);

            if (pu.kind === 'shield') {
                player.shield = true;
                score += 50;
            } else if (pu.kind === 'magnet') {
                player.magnet = 900; // 15 seconds
                score += 50;
            } else if (pu.kind === 'speed') {
                player.speedBoost = 600; // 10 seconds
                score += 50;
            } else if (pu.kind === 'doubleJump') {
                player.hasDoubleJump = true;
                player.doubleJumpAvailable = true;
                score += 50;
            }
        }
    });
}

function updateSecretAreas() {
    secretAreas.forEach(sa => {
        if (sa.discovered) {
            if (sa.flashTimer > 0) sa.flashTimer--;
            return;
        }

        const triggerRect = { x: sa.triggerX, y: sa.triggerY, w: sa.triggerW, h: sa.triggerH };
        if (rectCollide(player, triggerRect)) {
            sa.discovered = true;
            sa.flashTimer = 120;
            score += 500;
            sfxSecret();
            checkAchievement('secretExplorer');

            // Spawn bonus coins
            for (let i = 0; i < sa.coinCount; i++) {
                coins.push({
                    x: sa.triggerX + Math.random() * sa.triggerW,
                    y: sa.triggerY + Math.random() * sa.triggerH * 0.5,
                    collected: false
                });
            }

            spawnParticles(sa.triggerX + sa.triggerW / 2, sa.triggerY + sa.triggerH / 2, '#CE93D8', 20);
            spawnParticles(sa.triggerX + sa.triggerW / 2, sa.triggerY + sa.triggerH / 2, '#FFD54F', 15);
        }
    });
}

function checkWin() {
    if (boss && boss.alive) return; // Must defeat boss first

    if (player.x + player.w > flagX && player.x < flagX + 40) {
        if (deathsThisLevel === 0) checkAchievement('invincible');

        if (level < 3) {
            level++;
            generateLevel(level);
            spawnParticles(player.x, player.y, '#FFD54F', 20);
        } else {
            gameState = 'win';
            stopMusic();
            sfxWin();
            saveHighScore(score);
            showOverlay('Tebrikler!', 'Tum seviyeleri tamamladin! Toplam Bal: ' + score + getHighScoreText(), 'Tekrar Oyna');
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
