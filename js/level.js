// ============================================
// level.js - Level generation
// ============================================

function generateLevel(lvl) {
    platforms = [];
    flowers = [];
    coins = [];
    enemies = [];
    clouds = [];
    backgroundFlowers = [];
    butterflies = [];
    movingPlatforms = [];
    trampolines = [];
    waterZones = [];
    boss = null;
    secretAreas = [];
    powerUps = [];
    enemyStingers = [];

    const groundY = WORLD_HEIGHT - 2;

    // Ground with gaps
    for (let x = 0; x < WORLD_WIDTH; x++) {
        if (lvl === 1 && (x >= 45 && x <= 47 || x >= 78 && x <= 80 || x >= 120 && x <= 123)) continue;
        if (lvl === 2 && (x >= 30 && x <= 33 || x >= 55 && x <= 58 || x >= 90 && x <= 94 || x >= 130 && x <= 134)) continue;
        if (lvl === 3 && (x >= 25 && x <= 29 || x >= 50 && x <= 54 || x >= 75 && x <= 80 || x >= 110 && x <= 115 || x >= 145 && x <= 150)) continue;

        platforms.push({ x: x * TILE_SIZE, y: groundY * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE * 2, type: 'ground' });
    }

    // Floating platforms (y <= groundY-3 to ensure 2-tile gap above ground)
    const maxPlatY = groundY - 3; // y=8 max, leaves 2 tiles to ground
    const platConfigs = [
        { x: 10, y: 7, len: 4 }, { x: 18, y: 5, len: 3 }, { x: 25, y: 8, len: 5 },
        { x: 35, y: 6, len: 3 }, { x: 42, y: 4, len: 4 }, { x: 50, y: 7, len: 3 },
        { x: 58, y: 5, len: 5 }, { x: 65, y: 8, len: 3 }, { x: 72, y: 6, len: 4 },
        { x: 82, y: 4, len: 3 }, { x: 90, y: 7, len: 4 }, { x: 98, y: 5, len: 3 },
        { x: 105, y: 8, len: 5 }, { x: 115, y: 6, len: 3 }, { x: 125, y: 4, len: 4 },
        { x: 135, y: 7, len: 3 }, { x: 145, y: 5, len: 5 }, { x: 155, y: 8, len: 3 },
        { x: 165, y: 6, len: 4 }, { x: 175, y: 4, len: 3 },
    ];

    // Gap-bridging platforms
    if (lvl >= 1) {
        platConfigs.push({ x: 44, y: 8, len: 2 }, { x: 46, y: 5, len: 2 });
        platConfigs.push({ x: 77, y: 8, len: 2 }, { x: 79, y: 5, len: 2 });
        platConfigs.push({ x: 119, y: 8, len: 2 }, { x: 122, y: 5, len: 2 });
    }

    // Enforce minimum 2-tile vertical gap between platforms at same x
    platConfigs.forEach(p => {
        // Clamp y to ensure 2-tile gap above ground
        if (p.y > maxPlatY) p.y = maxPlatY;
    });

    platConfigs.forEach(p => {
        for (let i = 0; i < p.len; i++) {
            platforms.push({
                x: (p.x + i) * TILE_SIZE, y: p.y * TILE_SIZE,
                w: TILE_SIZE, h: TILE_SIZE, type: 'float'
            });
        }
    });

    // Post-process: remove floating platforms too close to another platform at same x
    const MIN_GAP = 2 * TILE_SIZE; // 2 tiles = 80px
    platforms = platforms.filter((p, idx) => {
        if (p.type !== 'float') return true;
        // Check against all other platforms at overlapping x
        for (let j = 0; j < platforms.length; j++) {
            if (j === idx) continue;
            const other = platforms[j];
            // Check x overlap
            if (p.x + p.w <= other.x || p.x >= other.x + other.w) continue;
            // Check vertical gap
            const pBottom = p.y + p.h;
            const oBottom = other.y + other.h;
            const gap = p.y > other.y
                ? p.y - oBottom
                : other.y - pBottom;
            if (gap < MIN_GAP && gap >= 0) {
                // Too close - remove the higher one (keep lower for accessibility)
                if (p.y < other.y) return false;
            }
        }
        return true;
    });

    // Coins (pollen) - placed above surfaces to ensure all are reachable
    const coinPositions = [];
    for (let i = 0; i < 40 + lvl * 10; i++) {
        const cx = 5 + Math.floor(Math.random() * (WORLD_WIDTH - 15));
        const coinX = cx * TILE_SIZE + 10;

        const platformsHere = platforms.filter(p =>
            coinX + 20 > p.x && coinX < p.x + p.w
        );

        if (platformsHere.length === 0) continue;

        const targetPlatform = platformsHere[Math.floor(Math.random() * platformsHere.length)];

        const tilesUp = 1 + Math.floor(Math.random() * 4);
        const coinY = targetPlatform.y - tilesUp * TILE_SIZE;

        if (coinY < TILE_SIZE) continue;

        const blocked = platforms.some(p =>
            coinX < p.x + p.w && coinX + 20 > p.x &&
            coinY < p.y + p.h && coinY + 20 > p.y
        );

        if (!blocked) {
            coinPositions.push({ x: coinX, y: coinY, collected: false });
        }
    }
    platConfigs.forEach(p => {
        for (let i = 0; i < p.len; i += 2) {
            const coinX = (p.x + i) * TILE_SIZE + 10;
            const coinY = (p.y - 2) * TILE_SIZE;
            const blocked = platforms.some(pl =>
                coinX < pl.x + pl.w && coinX + 20 > pl.x &&
                coinY < pl.y + pl.h && coinY + 20 > pl.y
            );
            if (!blocked) {
                coinPositions.push({ x: coinX, y: coinY, collected: false });
            }
        }
    });
    coins = coinPositions;

    // Enemies (birds)
    const enemyCount = 8 + lvl * 4;
    for (let i = 0; i < enemyCount; i++) {
        const ex = (20 + i * Math.floor((WORLD_WIDTH - 30) / enemyCount)) * TILE_SIZE;
        const isFlying = Math.random() > 0.4;
        enemies.push({
            x: ex, y: isFlying ? (3 + Math.random() * 4) * TILE_SIZE : (groundY - 1) * TILE_SIZE,
            w: 36, h: 28,
            vx: (1 + Math.random() * 1.5) * (Math.random() > 0.5 ? 1 : -1) * (0.8 + lvl * 0.2),
            startX: ex - 80, endX: ex + 80,
            alive: true,
            type: isFlying ? 'flying' : 'walking',
            wingFrame: Math.random() * Math.PI * 2,
            vy: isFlying ? Math.sin(Math.random() * Math.PI * 2) * 0.5 : 0,
            floatOffset: Math.random() * Math.PI * 2
        });
    }

    // Wasps (esek arisi) - spawned at reachable height
    const waspCount = 2 + lvl;
    const waspSpacing = Math.floor((WORLD_WIDTH - 40) / (waspCount + 1));
    for (let i = 0; i < waspCount; i++) {
        const wx = (15 + (i + 1) * waspSpacing) * TILE_SIZE;
        enemies.push({
            x: wx, y: (groundY - 4 + Math.floor(Math.random() * 2)) * TILE_SIZE,
            w: 40, h: 32,
            vx: (0.6 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1) * (0.8 + lvl * 0.2),
            startX: wx - 120, endX: wx + 120,
            alive: true,
            type: 'wasp',
            wingFrame: Math.random() * Math.PI * 2,
            vy: 0,
            floatOffset: Math.random() * Math.PI * 2,
            shootTimer: Math.floor(300 + Math.random() * 300)
        });
    }

    // Moving platforms
    const movPlatDefs = [
        { x: 32, y: 6, len: 3, axis: 'y', range: 3, speed: 0.8 },
        { x: 55, y: 7, len: 3, axis: 'x', range: 4, speed: 1.0 },
        { x: 95, y: 5, len: 3, axis: 'y', range: 4, speed: 0.6 },
        { x: 140, y: 6, len: 3, axis: 'x', range: 3, speed: 0.9 },
    ];
    const movCount = Math.min(3 + lvl, movPlatDefs.length);
    for (let i = 0; i < movCount; i++) {
        const d = movPlatDefs[i];
        movingPlatforms.push({
            x: d.x * TILE_SIZE, y: d.y * TILE_SIZE,
            w: d.len * TILE_SIZE, h: TILE_SIZE,
            originX: d.x * TILE_SIZE, originY: d.y * TILE_SIZE,
            axis: d.axis,
            range: d.range * TILE_SIZE,
            speed: d.speed,
            phase: Math.random() * Math.PI * 2,
            type: 'moving'
        });
    }

    // Trampolines
    const trampDefs = [
        { x: 14, y: groundY }, { x: 43, y: groundY }, { x: 70, y: groundY },
        { x: 100, y: groundY }, { x: 130, y: groundY }, { x: 160, y: groundY }
    ];
    const trampCount = Math.min(4 + lvl, trampDefs.length);
    for (let i = 0; i < trampCount; i++) {
        const d = trampDefs[i];
        trampolines.push({
            x: d.x * TILE_SIZE, y: d.y * TILE_SIZE - 20,
            w: 30, h: 20,
            bounceTimer: 0
        });
    }

    // Water zones
    const waterDefs = [
        { x1: 60, x2: 68, depth: 3 },
        { x1: 150, x2: 158, depth: 3 },
        { x1: 108, x2: 114, depth: 3 }
    ];
    const waterCount = Math.min(1 + lvl, waterDefs.length);
    for (let i = 0; i < waterCount; i++) {
        const d = waterDefs[i];
        waterZones.push({
            x: d.x1 * TILE_SIZE,
            y: (groundY - d.depth) * TILE_SIZE,
            w: (d.x2 - d.x1) * TILE_SIZE,
            h: (d.depth + 2) * TILE_SIZE,
            waveOffset: Math.random() * Math.PI * 2
        });
    }

    // Secret areas
    const secretDefs = [
        { x: 38, y: 3, w: 4, h: 4, coins: 8 },
        { x: 88, y: 2, w: 5, h: 5, coins: 12 },
        { x: 160, y: 3, w: 4, h: 4, coins: 10 }
    ];
    const secretCount = Math.min(1 + lvl, secretDefs.length);
    for (let i = 0; i < secretCount; i++) {
        const d = secretDefs[i];
        secretAreas.push({
            triggerX: d.x * TILE_SIZE, triggerY: d.y * TILE_SIZE,
            triggerW: TILE_SIZE, triggerH: d.h * TILE_SIZE,
            discovered: false,
            coinCount: d.coins,
            flashTimer: 0
        });
    }

    // Power-ups
    const puDefs = [
        { x: 22, y: 7, kind: 'shield' },
        { x: 68, y: 6, kind: 'magnet' },
        { x: 112, y: 7, kind: 'speed' },
        { x: 155, y: 6, kind: 'doubleJump' },
        { x: 180, y: 7, kind: 'shield' }
    ];
    const puCount = Math.min(2 + lvl, puDefs.length);
    for (let i = 0; i < puCount; i++) {
        const d = puDefs[i];
        powerUps.push({
            x: d.x * TILE_SIZE, y: d.y * TILE_SIZE,
            w: 28, h: 28,
            kind: d.kind,
            collected: false,
            bobPhase: Math.random() * Math.PI * 2
        });
    }

    // Boss (near end of level) - lowered for reachability
    const bossX = (WORLD_WIDTH - 15) * TILE_SIZE;
    const bossBaseY = (groundY - 5) * TILE_SIZE;
    if (lvl === 1) {
        boss = { x: bossX, y: bossBaseY, baseY: bossBaseY, w: 64, h: 48, hp: 5, maxHp: 5, type: 'bigbird', phase: 'patrol', attackTimer: 120, vx: 1.5, vy: 0, startX: bossX - 160, endX: bossX + 160, floatOffset: 0, alive: true, flashTimer: 0 };
    } else if (lvl === 2) {
        boss = { x: bossX, y: bossBaseY, baseY: bossBaseY, w: 72, h: 56, hp: 8, maxHp: 8, type: 'giantwasp', phase: 'patrol', attackTimer: 90, vx: 1.2, vy: 0, startX: bossX - 200, endX: bossX + 200, floatOffset: 0, alive: true, flashTimer: 0, shootTimer: 60 };
    } else {
        boss = { x: bossX, y: bossBaseY, baseY: bossBaseY, w: 80, h: 60, hp: 12, maxHp: 12, type: 'kingbird', phase: 'patrol', attackTimer: 80, vx: 1.8, vy: 0, startX: bossX - 240, endX: bossX + 240, floatOffset: 0, alive: true, flashTimer: 0, shootTimer: 50, summonTimer: 300 };
    }

    // Boss area: guaranteed super box + trampolines + checkpoint
    const bossAreaX = WORLD_WIDTH - 20;

    // Super box right before boss - always available, resets on death
    superBoxes.push({
        x: bossAreaX * TILE_SIZE,
        y: (groundY - 2) * TILE_SIZE,
        w: 36, h: 36,
        opened: false,
        hintPhase: 0,
        bossBox: true
    });

    // Checkpoint right before boss area
    checkpoints.push({
        x: (bossAreaX - 2) * TILE_SIZE,
        y: (groundY - 1) * TILE_SIZE,
        activated: false,
        glowFrame: 0
    });

    // Trampolines in boss fight area
    const bossTrampolines = [
        { x: bossAreaX + 2 },
        { x: bossAreaX + 6 },
        { x: bossAreaX + 10 },
    ];
    bossTrampolines.forEach(bt => {
        trampolines.push({
            x: bt.x * TILE_SIZE,
            y: groundY * TILE_SIZE - 20,
            w: 30, h: 20,
            bounceTimer: 0
        });
    });

    // Flag position (after boss area)
    flagX = (WORLD_WIDTH - 5) * TILE_SIZE;

    // Background clouds
    for (let i = 0; i < 20; i++) {
        clouds.push({
            x: Math.random() * WORLD_WIDTH * TILE_SIZE,
            y: 20 + Math.random() * 120,
            w: 80 + Math.random() * 120,
            h: 30 + Math.random() * 40,
            speed: 0.2 + Math.random() * 0.5,
            opacity: 0.5 + Math.random() * 0.4
        });
    }

    // Background flowers
    for (let i = 0; i < 60; i++) {
        backgroundFlowers.push({
            x: Math.random() * WORLD_WIDTH * TILE_SIZE,
            y: (groundY) * TILE_SIZE - 5 - Math.random() * 15,
            size: 8 + Math.random() * 14,
            color: ['#ff6b9d', '#c06cff', '#ff9ff3', '#feca57', '#ff6348', '#ee5a24', '#f8a5c2', '#7ed6df'][Math.floor(Math.random() * 8)],
            petalCount: 5 + Math.floor(Math.random() * 3),
            stemHeight: 15 + Math.random() * 25,
            swayOffset: Math.random() * Math.PI * 2
        });
    }

    // Butterflies
    for (let i = 0; i < 15; i++) {
        butterflies.push({
            x: Math.random() * WORLD_WIDTH * TILE_SIZE,
            y: 100 + Math.random() * 200,
            vx: 0.3 + Math.random() * 0.8,
            vy: 0,
            wingFrame: Math.random() * Math.PI * 2,
            color: ['#ff6b9d', '#c06cff', '#feca57', '#48dbfb', '#ff9ff3'][Math.floor(Math.random() * 5)],
            size: 6 + Math.random() * 6
        });
    }

    // Checkpoints - ensure they're on solid ground
    checkpoints = [];
    lastCheckpoint = null;
    const cpCount = 3 + lvl;
    const spacing = Math.floor((WORLD_WIDTH - 20) / (cpCount + 1));
    for (let i = 1; i <= cpCount; i++) {
        let cpTile = 5 + i * spacing;
        // Check if there's ground beneath, shift if over a gap
        const hasGround = (tx) => platforms.some(p =>
            p.type === 'ground' && p.x === tx * TILE_SIZE
        );
        if (!hasGround(cpTile)) {
            // Search nearby tiles for ground (up to 10 tiles in each direction)
            for (let offset = 1; offset <= 10; offset++) {
                if (hasGround(cpTile + offset)) { cpTile = cpTile + offset; break; }
                if (hasGround(cpTile - offset)) { cpTile = cpTile - offset; break; }
            }
        }
        checkpoints.push({
            x: cpTile * TILE_SIZE,
            y: (groundY - 1) * TILE_SIZE,
            activated: false,
            glowFrame: Math.random() * Math.PI * 2
        });
    }

    // Super food boxes
    superBoxes = [];
    stingers = [];
    const boxPositions = [
        { x: 15, y: 7 }, { x: 38, y: 6 }, { x: 60, y: 5 },
        { x: 85, y: 7 }, { x: 110, y: 6 }, { x: 140, y: 5 },
        { x: 170, y: 7 }
    ];
    const boxCount = 3 + lvl;
    for (let i = 0; i < Math.min(boxCount, boxPositions.length); i++) {
        superBoxes.push({
            x: boxPositions[i].x * TILE_SIZE,
            y: boxPositions[i].y * TILE_SIZE,
            w: 36, h: 36,
            opened: false,
            hintPhase: Math.random() * Math.PI * 2
        });
    }

    // Reset player
    player.x = 100;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.invincible = 0;
    player.superMode = false;
    player.shootCooldown = 0;
    player.hasDoubleJump = false;
    player.doubleJumpAvailable = false;
    player.shield = false;
    player.magnet = 0;
    player.speedBoost = 0;
    player.inWater = false;
    deathsThisLevel = 0;
    cameraX = 0;
}
