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

    const groundY = WORLD_HEIGHT - 2;

    // Ground with gaps
    for (let x = 0; x < WORLD_WIDTH; x++) {
        if (lvl === 1 && (x >= 45 && x <= 47 || x >= 78 && x <= 80 || x >= 120 && x <= 123)) continue;
        if (lvl === 2 && (x >= 30 && x <= 33 || x >= 55 && x <= 58 || x >= 90 && x <= 94 || x >= 130 && x <= 134)) continue;
        if (lvl === 3 && (x >= 25 && x <= 29 || x >= 50 && x <= 54 || x >= 75 && x <= 80 || x >= 110 && x <= 115 || x >= 145 && x <= 150)) continue;

        platforms.push({ x: x * TILE_SIZE, y: groundY * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE * 2, type: 'ground' });
    }

    // Floating platforms
    const platConfigs = [
        { x: 10, y: 8, len: 4 }, { x: 18, y: 6, len: 3 }, { x: 25, y: 9, len: 5 },
        { x: 35, y: 7, len: 3 }, { x: 42, y: 5, len: 4 }, { x: 50, y: 8, len: 3 },
        { x: 58, y: 6, len: 5 }, { x: 65, y: 9, len: 3 }, { x: 72, y: 7, len: 4 },
        { x: 82, y: 5, len: 3 }, { x: 90, y: 8, len: 4 }, { x: 98, y: 6, len: 3 },
        { x: 105, y: 9, len: 5 }, { x: 115, y: 7, len: 3 }, { x: 125, y: 5, len: 4 },
        { x: 135, y: 8, len: 3 }, { x: 145, y: 6, len: 5 }, { x: 155, y: 9, len: 3 },
        { x: 165, y: 7, len: 4 }, { x: 175, y: 5, len: 3 },
    ];

    // Gap-bridging platforms
    if (lvl >= 1) {
        platConfigs.push({ x: 44, y: 9, len: 2 }, { x: 46, y: 7, len: 2 });
        platConfigs.push({ x: 77, y: 9, len: 2 }, { x: 79, y: 7, len: 2 });
        platConfigs.push({ x: 119, y: 9, len: 2 }, { x: 122, y: 7, len: 2 });
    }

    platConfigs.forEach(p => {
        for (let i = 0; i < p.len; i++) {
            platforms.push({
                x: (p.x + i) * TILE_SIZE, y: p.y * TILE_SIZE,
                w: TILE_SIZE, h: TILE_SIZE, type: 'float'
            });
        }
    });

    // Coins (pollen) - placed above surfaces to ensure all are reachable
    const coinPositions = [];
    for (let i = 0; i < 40 + lvl * 10; i++) {
        const cx = 5 + Math.floor(Math.random() * (WORLD_WIDTH - 15));
        const coinX = cx * TILE_SIZE + 10;

        // Find platforms at this x position
        const platformsHere = platforms.filter(p =>
            coinX + 20 > p.x && coinX < p.x + p.w
        );

        if (platformsHere.length === 0) continue; // Over a gap, skip

        // Pick a random platform to place coin above
        const targetPlatform = platformsHere[Math.floor(Math.random() * platformsHere.length)];

        // Place 1-4 tiles above it (within jump reach)
        const tilesUp = 1 + Math.floor(Math.random() * 4);
        const coinY = targetPlatform.y - tilesUp * TILE_SIZE;

        if (coinY < TILE_SIZE) continue; // Don't place above screen

        // Ensure coin is not inside any platform
        const blocked = platforms.some(p =>
            coinX < p.x + p.w && coinX + 20 > p.x &&
            coinY < p.y + p.h && coinY + 20 > p.y
        );

        if (!blocked) {
            coinPositions.push({ x: coinX, y: coinY, collected: false });
        }
    }
    // Add coins above floating platforms
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

    // Wasps (esek arisi)
    const waspCount = 2 + lvl;
    const waspSpacing = Math.floor((WORLD_WIDTH - 40) / (waspCount + 1));
    for (let i = 0; i < waspCount; i++) {
        const wx = (15 + (i + 1) * waspSpacing) * TILE_SIZE;
        enemies.push({
            x: wx, y: (2 + Math.random() * 3) * TILE_SIZE,
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

    // Flag position
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

    // Checkpoints
    checkpoints = [];
    lastCheckpoint = null;
    const cpCount = 3 + lvl;
    const spacing = Math.floor((WORLD_WIDTH - 20) / (cpCount + 1));
    for (let i = 1; i <= cpCount; i++) {
        checkpoints.push({
            x: (5 + i * spacing) * TILE_SIZE,
            y: (groundY - 1) * TILE_SIZE,
            activated: false,
            glowFrame: Math.random() * Math.PI * 2
        });
    }

    // Super food boxes
    superBoxes = [];
    stingers = [];
    enemyStingers = [];
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
    cameraX = 0;
}
