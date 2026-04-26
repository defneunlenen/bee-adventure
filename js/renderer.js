// ============================================
// renderer.js - All drawing/rendering functions
// ============================================

function drawSky() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#87CEEB');
    grad.addColorStop(0.3, '#98D8EF');
    grad.addColorStop(0.6, '#B0E0F6');
    grad.addColorStop(1, '#D4F0FC');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun
    const sunX = 780 - cameraX * 0.05;
    const sunY = 70;
    ctx.save();
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 80);
    sunGlow.addColorStop(0, 'rgba(255, 236, 179, 0.8)');
    sunGlow.addColorStop(1, 'rgba(255, 236, 179, 0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(sunX - 80, sunY - 80, 160, 160);
    ctx.fillStyle = '#FFE066';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF3B0';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 224, 102, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + frameCount * 0.005;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * 40, sunY + Math.sin(angle) * 40);
        ctx.lineTo(sunX + Math.cos(angle) * 55, sunY + Math.sin(angle) * 55);
        ctx.stroke();
    }
    ctx.restore();
}

function drawCloud(cloud) {
    const sx = cloud.x - cameraX * 0.3;
    if (sx < -cloud.w - 50 || sx > canvas.width + 50) return;
    ctx.save();
    ctx.globalAlpha = cloud.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(sx, cloud.y, cloud.w / 2, cloud.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(sx - cloud.w * 0.25, cloud.y + 5, cloud.w * 0.3, cloud.h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(sx + cloud.w * 0.25, cloud.y + 3, cloud.w * 0.35, cloud.h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawFlowerBg(f) {
    const sx = f.x - cameraX * 0.9;
    if (sx < -30 || sx > canvas.width + 30) return;
    const sway = Math.sin(frameCount * 0.02 + f.swayOffset) * 3;

    ctx.save();
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, f.y + f.stemHeight);
    ctx.quadraticCurveTo(sx + sway, f.y + f.stemHeight / 2, sx + sway * 0.5, f.y);
    ctx.stroke();

    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.ellipse(sx + sway * 0.3, f.y + f.stemHeight * 0.6, 6, 3, -0.5, 0, Math.PI * 2);
    ctx.fill();

    const centerX = sx + sway * 0.5;
    const centerY = f.y;
    for (let i = 0; i < f.petalCount; i++) {
        const angle = (i / f.petalCount) * Math.PI * 2 + frameCount * 0.005;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.ellipse(
            centerX + Math.cos(angle) * f.size * 0.5,
            centerY + Math.sin(angle) * f.size * 0.5,
            f.size * 0.4, f.size * 0.25,
            angle, 0, Math.PI * 2
        );
        ctx.fill();
    }
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(centerX, centerY, f.size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.arc(centerX, centerY, f.size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawButterfly(b) {
    const sx = b.x - cameraX * 0.5;
    if (sx < -20 || sx > canvas.width + 20) return;

    const wingAngle = Math.sin(frameCount * 0.15 + b.wingFrame) * 0.6;
    ctx.save();
    ctx.translate(sx, b.y);

    ctx.fillStyle = b.color;
    ctx.globalAlpha = 0.7;
    ctx.save();
    ctx.scale(Math.cos(wingAngle), 1);
    ctx.beginPath();
    ctx.ellipse(-b.size, 0, b.size, b.size * 0.7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.scale(Math.cos(wingAngle + 0.5), 1);
    ctx.beginPath();
    ctx.ellipse(b.size, 0, b.size, b.size * 0.7, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-1, -b.size * 0.5, 2, b.size);
    ctx.restore();
}

function drawGround(p) {
    const sx = p.x - cameraX;
    if (sx < -TILE_SIZE || sx > canvas.width + TILE_SIZE) return;

    if (p.type === 'ground') {
        const grassGrad = ctx.createLinearGradient(sx, p.y, sx, p.y + 10);
        grassGrad.addColorStop(0, '#4CAF50');
        grassGrad.addColorStop(1, '#388E3C');
        ctx.fillStyle = grassGrad;
        ctx.fillRect(sx, p.y, p.w, 10);

        const dirtGrad = ctx.createLinearGradient(sx, p.y + 10, sx, p.y + p.h);
        dirtGrad.addColorStop(0, '#8D6E63');
        dirtGrad.addColorStop(1, '#5D4037');
        ctx.fillStyle = dirtGrad;
        ctx.fillRect(sx, p.y + 10, p.w, p.h - 10);

        ctx.fillStyle = '#66BB6A';
        for (let i = 0; i < 3; i++) {
            const gx = sx + 5 + i * 14;
            const sway = Math.sin(frameCount * 0.03 + gx * 0.1) * 2;
            ctx.beginPath();
            ctx.moveTo(gx, p.y);
            ctx.lineTo(gx + 2 + sway, p.y - 6);
            ctx.lineTo(gx + 4, p.y);
            ctx.fill();
        }
    } else {
        const platGrad = ctx.createLinearGradient(sx, p.y, sx, p.y + p.h);
        platGrad.addColorStop(0, '#A5D6A7');
        platGrad.addColorStop(0.3, '#81C784');
        platGrad.addColorStop(1, '#66BB6A');
        ctx.fillStyle = platGrad;
        ctx.fillRect(sx, p.y, p.w, p.h);
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 1;
        ctx.strokeRect(sx, p.y, p.w, p.h);

        ctx.fillStyle = '#388E3C';
        ctx.fillRect(sx + 2, p.y + p.h - 4, p.w - 4, 2);
    }
}

function drawBee(p) {
    if (p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0) return;

    const sx = p.x - cameraX;
    const sy = p.y;
    const dir = p.facing;
    const bob = Math.sin(frameCount * 0.1) * 2;

    ctx.save();
    ctx.translate(sx + p.w / 2, sy + p.h / 2 + bob);
    ctx.scale(dir, 1);

    // Wings
    const wingFlap = Math.sin(frameCount * 0.4) * 0.4;
    ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
    ctx.strokeStyle = 'rgba(150, 200, 240, 0.8)';
    ctx.lineWidth = 1;
    ctx.save();
    ctx.rotate(-0.3 + wingFlap);
    ctx.beginPath();
    ctx.ellipse(-2, -14, 12, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.rotate(0.1 + wingFlap * 0.5);
    ctx.beginPath();
    ctx.ellipse(-4, -8, 9, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Super mode aura
    if (p.superMode) {
        ctx.globalAlpha = 0.25 + Math.sin(frameCount * 0.1) * 0.1;
        ctx.fillStyle = '#E040FB';
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    // Shield aura
    if (p.shield) {
        ctx.globalAlpha = 0.2 + Math.sin(frameCount * 0.08) * 0.1;
        ctx.strokeStyle = '#42A5F5';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 24, 20, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    // Speed boost trail
    if (p.speedBoost > 0) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#FF9800';
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.ellipse(-p.facing * i * 8, i * 2, 6 - i, 4 - i, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // Body (skin-aware)
    const skinDef = SKINS[p.skin] || SKINS.normal;
    ctx.fillStyle = p.superMode ? '#FF6F00' : skinDef.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stripes
    ctx.fillStyle = p.superMode ? '#4A148C' : skinDef.stripe;
    ctx.fillRect(-4, -4, 10, 3);
    ctx.fillRect(-6, 2, 12, 3);
    ctx.fillRect(-3, 7, 8, 3);

    // Head
    ctx.fillStyle = p.superMode ? '#FFD54F' : skinDef.head;
    ctx.beginPath();
    ctx.arc(12, -2, 8, 0, Math.PI * 2);
    ctx.fill();

    // --- Skin-specific details ---
    if (p.skin === 'girl') {
        // Kiz Ari: kirpikler, fiyonk, allık
        // Blush (allık)
        ctx.fillStyle = 'rgba(255, 105, 180, 0.35)';
        ctx.beginPath();
        ctx.ellipse(14, 2, 4, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eyelashes (kirpikler)
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(18, -8);
        ctx.lineTo(20, -11);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(16, -8);
        ctx.lineTo(17, -11);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(14, -8);
        ctx.lineTo(14, -11);
        ctx.stroke();
        // Bow (fiyonk) on head
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.moveTo(10, -10);
        ctx.quadraticCurveTo(4, -18, 10, -16);
        ctx.quadraticCurveTo(16, -18, 10, -10);
        ctx.fill();
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(10, -13, 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (p.skin === 'super') {
        // Super Ari: pelerin, yıldız, maske
        // Cape (pelerin)
        ctx.fillStyle = '#D500F9';
        ctx.beginPath();
        ctx.moveTo(-8, -6);
        ctx.quadraticCurveTo(-20, 0, -16, 14);
        ctx.lineTo(-10, 10);
        ctx.quadraticCurveTo(-14, 4, -8, -2);
        ctx.fill();
        // Mask (maske)
        ctx.fillStyle = '#7C4DFF';
        ctx.beginPath();
        ctx.moveTo(10, -6);
        ctx.lineTo(20, -6);
        ctx.lineTo(21, -3);
        ctx.lineTo(10, -3);
        ctx.fill();
        // Star on body (gogus yildizi)
        ctx.fillStyle = '#FFEB3B';
        const starX = 0, starY = -1;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI / 5);
            const outerR = 4;
            const innerR = 1.8;
            ctx.lineTo(starX + Math.cos(angle) * outerR, starY + Math.sin(angle) * outerR);
            const a2 = angle + Math.PI / 5;
            ctx.lineTo(starX + Math.cos(a2) * innerR, starY + Math.sin(a2) * innerR);
        }
        ctx.closePath();
        ctx.fill();
    } else if (p.skin === 'funny') {
        // Komik Ari: kocaman gozler, dil, komik anten toplari
        // Big silly eyes drawn below (replaces normal eyes)
    }

    // Eyes (skin-specific for funny, normal for others)
    if (p.skin === 'funny') {
        // Huge silly eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(14, -4, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        // Cross-eyed pupils
        const pupilX = 14 + Math.sin(frameCount * 0.1) * 2;
        ctx.beginPath();
        ctx.arc(pupilX, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(pupilX + 0.5, -4.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Normal eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(15, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(16, -4, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(16.5, -5, 0.8, 0, Math.PI * 2);
        ctx.fill();
    }

    // Antennae
    ctx.strokeStyle = '#2C2C2C';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(14, -9);
    ctx.quadraticCurveTo(16, -18, 20, -16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12, -9);
    ctx.quadraticCurveTo(10, -20, 14, -19);
    ctx.stroke();
    if (p.skin === 'funny') {
        // Big colorful antenna balls
        ctx.fillStyle = '#FF1744';
        ctx.beginPath();
        ctx.arc(20, -16, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2979FF';
        ctx.beginPath();
        ctx.arc(14, -19, 4, 0, Math.PI * 2);
        ctx.fill();
    } else if (p.skin === 'girl') {
        // Heart-shaped antenna tips
        ctx.fillStyle = '#FF1493';
        for (const pos of [[20, -16], [14, -19]]) {
            ctx.beginPath();
            ctx.arc(pos[0] - 1.5, pos[1] - 1, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(pos[0] + 1.5, pos[1] - 1, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(pos[0] - 3, pos[1]);
            ctx.lineTo(pos[0], pos[1] + 3);
            ctx.lineTo(pos[0] + 3, pos[1]);
            ctx.fill();
        }
    } else {
        ctx.fillStyle = p.skin === 'super' ? '#FFEB3B' : '#FF9800';
        ctx.beginPath();
        ctx.arc(20, -16, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(14, -19, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Stinger
    ctx.fillStyle = p.superMode ? '#E040FB' : '#2C2C2C';
    ctx.beginPath();
    ctx.moveTo(-14, 2);
    ctx.lineTo(p.superMode ? -24 : -20, 0);
    ctx.lineTo(-14, -1);
    ctx.fill();
    if (p.superMode) {
        ctx.fillStyle = '#FFD54F';
        ctx.beginPath();
        ctx.arc(-22, 0, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Legs
    ctx.strokeStyle = '#2C2C2C';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
        const legX = -5 + i * 6;
        const legAnim = Math.sin(frameCount * 0.15 + i) * 2;
        ctx.beginPath();
        ctx.moveTo(legX, 9);
        ctx.lineTo(legX - 2, 14 + legAnim);
        ctx.stroke();
    }

    // Mouth
    if (p.skin === 'funny') {
        // Big open grin + tongue
        ctx.fillStyle = '#F44336';
        ctx.beginPath();
        ctx.arc(15, 0, 4, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#E91E63';
        ctx.beginPath();
        ctx.ellipse(15, 4, 2, 3 + Math.sin(frameCount * 0.08) * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (p.skin === 'girl') {
        // Cute small smile
        ctx.strokeStyle = '#C2185B';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(15, -1, 2.5, 0.3, Math.PI - 0.3);
        ctx.stroke();
    } else {
        // Normal smile
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(15, -1, 3, 0.2, Math.PI - 0.2);
        ctx.stroke();
    }

    ctx.restore();
}

function drawBird(e) {
    if (!e.alive) return;
    const sx = e.x - cameraX;
    if (sx < -50 || sx > canvas.width + 50) return;

    if (e.type === 'wasp') {
        drawWasp(e);
        return;
    }

    const dir = e.vx > 0 ? 1 : -1;
    const floatY = e.type === 'flying' ? Math.sin(frameCount * 0.05 + e.floatOffset) * 8 : 0;

    ctx.save();
    ctx.translate(sx + e.w / 2, e.y + e.h / 2 + floatY);
    ctx.scale(dir, 1);

    const wingAngle = Math.sin(frameCount * 0.2 + e.wingFrame);

    ctx.fillStyle = e.type === 'flying' ? '#e74c3c' : '#8e44ad';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = e.type === 'flying' ? '#c0392b' : '#6c3483';
    ctx.beginPath();
    ctx.arc(14, -4, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.moveTo(20, -4);
    ctx.lineTo(28, -2);
    ctx.lineTo(20, 0);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(16, -6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(17, -6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(13, -10);
    ctx.lineTo(19, -9);
    ctx.stroke();

    ctx.fillStyle = e.type === 'flying' ? '#e57373' : '#ab47bc';
    ctx.save();
    ctx.rotate(wingAngle * 0.5 - 0.3);
    ctx.beginPath();
    ctx.ellipse(-5, -10, 14, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = e.type === 'flying' ? '#ef5350' : '#9c27b0';
    ctx.beginPath();
    ctx.moveTo(-14, -2);
    ctx.lineTo(-24, -8);
    ctx.lineTo(-22, 0);
    ctx.lineTo(-24, 6);
    ctx.lineTo(-14, 2);
    ctx.fill();

    if (e.type === 'walking') {
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 2;
        const legAnim = Math.sin(frameCount * 0.15) * 3;
        ctx.beginPath();
        ctx.moveTo(-2, 8);
        ctx.lineTo(-2 + legAnim, 15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(5, 8);
        ctx.lineTo(5 - legAnim, 15);
        ctx.stroke();
    }

    ctx.restore();
}

function drawWasp(e) {
    if (!e.alive) return;
    const sx = e.x - cameraX;
    const dir = e.vx > 0 ? 1 : -1;
    const floatY = Math.sin(frameCount * 0.05 + e.floatOffset) * 8;

    ctx.save();
    ctx.translate(sx + e.w / 2, e.y + e.h / 2 + floatY);
    ctx.scale(dir, 1);

    // Wings (larger, more aggressive)
    const wingFlap = Math.sin(frameCount * 0.5) * 0.5;
    ctx.fillStyle = 'rgba(220, 240, 255, 0.5)';
    ctx.strokeStyle = 'rgba(180, 210, 240, 0.7)';
    ctx.lineWidth = 1;
    ctx.save();
    ctx.rotate(-0.4 + wingFlap);
    ctx.beginPath();
    ctx.ellipse(-3, -16, 16, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.rotate(0.1 + wingFlap * 0.6);
    ctx.beginPath();
    ctx.ellipse(-5, -10, 12, 6, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Body (yellow-black wasp)
    ctx.fillStyle = '#FFB300';
    ctx.beginPath();
    ctx.ellipse(0, 0, 17, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Black stripes (thicker, more prominent)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-6, -6, 14, 4);
    ctx.fillRect(-8, 1, 16, 4);
    ctx.fillRect(-5, 7, 12, 3);

    // Head
    ctx.fillStyle = '#FF8F00';
    ctx.beginPath();
    ctx.arc(14, -2, 9, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(16, -5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(17, -5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(17.5, -6, 1, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyebrows
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(12, -12);
    ctx.lineTo(20, -10);
    ctx.stroke();

    // Mandibles
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.moveTo(21, 0);
    ctx.lineTo(26, 3);
    ctx.lineTo(22, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(21, -2);
    ctx.lineTo(26, -5);
    ctx.lineTo(22, -5);
    ctx.fill();

    // Antennae
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(16, -10);
    ctx.quadraticCurveTo(18, -22, 24, -18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(13, -10);
    ctx.quadraticCurveTo(11, -24, 17, -22);
    ctx.stroke();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(24, -18, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(17, -22, 2, 0, Math.PI * 2);
    ctx.fill();

    // Stinger (large, menacing)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(-17, 2);
    ctx.lineTo(-28, 0);
    ctx.lineTo(-17, -1);
    ctx.fill();
    // Stinger highlight
    ctx.fillStyle = '#FF6F00';
    ctx.beginPath();
    ctx.arc(-22, 0.5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
        const legX = -5 + i * 7;
        const legAnim = Math.sin(frameCount * 0.15 + i) * 2;
        ctx.beginPath();
        ctx.moveTo(legX, 10);
        ctx.lineTo(legX - 3, 16 + legAnim);
        ctx.stroke();
    }

    // Shoot warning glow (when about to shoot)
    if (e.shootTimer < 90) {
        const warn = 0.3 + Math.sin(frameCount * 0.3) * 0.2;
        ctx.globalAlpha = warn;
        ctx.fillStyle = '#FF3D00';
        ctx.beginPath();
        ctx.arc(-25, 0, 6 + Math.sin(frameCount * 0.2) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    ctx.restore();
}

function drawEnemyStinger(s) {
    const sx = s.x - cameraX;
    if (sx < -20 || sx > canvas.width + 20) return;

    ctx.save();
    ctx.translate(sx, s.y);

    // Trail glow
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#FF6F00';
    ctx.beginPath();
    ctx.ellipse(-s.vx * 2, -s.vy * 2, 10, 4, Math.atan2(s.vy, s.vx), 0, Math.PI * 2);
    ctx.fill();

    // Stinger body
    ctx.globalAlpha = 1;
    const angle = Math.atan2(s.vy, s.vx);
    ctx.rotate(angle);
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-4, -3);
    ctx.lineTo(-4, 3);
    ctx.fill();

    // Orange core
    ctx.fillStyle = '#FF6F00';
    ctx.beginPath();
    ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawCoin(c) {
    if (c.collected) return;
    const sx = c.x - cameraX;
    if (sx < -20 || sx > canvas.width + 20) return;

    const bob = Math.sin(frameCount * 0.08 + c.x * 0.01) * 4;
    const glow = 0.3 + Math.sin(frameCount * 0.06 + c.x * 0.02) * 0.2;

    ctx.save();
    ctx.translate(sx + 10, c.y + 10 + bob);

    ctx.globalAlpha = glow;
    ctx.fillStyle = '#FFF176';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFB300';
    ctx.beginPath();
    ctx.arc(0, 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-5, -2);
    ctx.quadraticCurveTo(0, -12, 5, -2);
    ctx.fill();

    ctx.fillStyle = '#FFE082';
    ctx.beginPath();
    ctx.arc(-2, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawFlag() {
    const sx = flagX - cameraX;
    if (sx < -50 || sx > canvas.width + 50) return;

    const groundY = (WORLD_HEIGHT - 2) * TILE_SIZE;

    ctx.fillStyle = '#795548';
    ctx.fillRect(sx, groundY - 160, 5, 160);

    ctx.fillStyle = '#FFD54F';
    const flagWave = Math.sin(frameCount * 0.05) * 5;
    ctx.beginPath();
    ctx.moveTo(sx + 5, groundY - 160);
    ctx.lineTo(sx + 55 + flagWave, groundY - 145);
    ctx.lineTo(sx + 50 + flagWave, groundY - 130);
    ctx.lineTo(sx + 5, groundY - 120);
    ctx.fill();
    ctx.strokeStyle = '#F57F17';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#F57F17';
    ctx.beginPath();
    ctx.arc(sx + 28 + flagWave * 0.5, groundY - 142, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(sx + 2, groundY - 163, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 213, 79, 0.3)';
    ctx.font = '12px Arial';
    const textBob = Math.sin(frameCount * 0.04) * 3;
    ctx.fillText('KOVAN', sx - 5, groundY - 170 + textBob);
}

function drawCheckpoint(cp) {
    const sx = cp.x - cameraX;
    if (sx < -60 || sx > canvas.width + 60) return;

    const groundY = cp.y;
    const pulse = Math.sin(frameCount * 0.06 + cp.glowFrame) * 0.3 + 0.7;
    const activated = cp.activated;

    ctx.save();
    ctx.translate(sx, groundY);

    ctx.fillStyle = activated ? '#FFD54F' : '#9E9E9E';
    ctx.fillRect(-3, -70, 6, 70);

    ctx.fillStyle = activated ? '#A1887F' : '#757575';
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(-10, -15);
    ctx.lineTo(10, -15);
    ctx.lineTo(14, 0);
    ctx.fill();
    ctx.fillStyle = activated ? '#8D6E63' : '#616161';
    ctx.fillRect(-12, -18, 24, 5);

    if (activated) {
        ctx.save();
        ctx.translate(0, -75);

        ctx.globalAlpha = 0.3 * pulse;
        ctx.fillStyle = '#FFE082';
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + frameCount * 0.01;
            ctx.fillStyle = '#FFC107';
            ctx.beginPath();
            ctx.ellipse(
                Math.cos(angle) * 10,
                Math.sin(angle) * 10,
                8, 4, angle, 0, Math.PI * 2
            );
            ctx.fill();
        }

        ctx.fillStyle = '#FF8F00';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFB300';
        ctx.beginPath();
        ctx.arc(-1, -1, 3, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 3; i++) {
            const sa = frameCount * 0.04 + i * 2.1;
            const sr = 18 + Math.sin(frameCount * 0.08 + i) * 5;
            ctx.globalAlpha = 0.5 + Math.sin(frameCount * 0.1 + i) * 0.3;
            ctx.fillStyle = '#FFF9C4';
            ctx.beginPath();
            ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#FFD54F';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('KAYIT', 0, -100);
    } else {
        ctx.save();
        ctx.translate(0, -75);
        ctx.fillStyle = '#9E9E9E';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#757575';
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.ellipse(Math.cos(angle) * 6, Math.sin(angle) * 6, 5, 3, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    ctx.restore();
}

function drawSuperBox(box) {
    if (box.opened) return;
    const sx = box.x - cameraX;
    if (sx < -60 || sx > canvas.width + 60) return;

    const hover = Math.sin(frameCount * 0.06 + box.hintPhase) * 4;
    const pulse = 0.6 + Math.sin(frameCount * 0.08 + box.hintPhase) * 0.4;

    ctx.save();
    ctx.translate(sx + box.w / 2, box.y + box.h / 2 + hover);

    ctx.globalAlpha = 0.2 * pulse;
    ctx.fillStyle = '#E040FB';
    ctx.beginPath();
    ctx.arc(0, 0, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 4; i++) {
        const angle = frameCount * 0.03 + (i / 4) * Math.PI * 2 + box.hintPhase;
        const r = 28 + Math.sin(frameCount * 0.05 + i) * 5;
        const sparkSize = 2 + Math.sin(frameCount * 0.1 + i * 1.5) * 1;
        ctx.fillStyle = i % 2 === 0 ? '#E040FB' : '#FFD54F';
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, sparkSize, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;

    const boxGrad = ctx.createLinearGradient(-18, -18, 18, 18);
    boxGrad.addColorStop(0, '#9C27B0');
    boxGrad.addColorStop(0.5, '#7B1FA2');
    boxGrad.addColorStop(1, '#6A1B9A');
    ctx.fillStyle = boxGrad;
    ctx.fillRect(-18, -18, 36, 36);

    ctx.strokeStyle = '#CE93D8';
    ctx.lineWidth = 2;
    ctx.strokeRect(-18, -18, 36, 36);

    ctx.strokeStyle = '#AB47BC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, -10);
    ctx.lineTo(18, -10);
    ctx.stroke();

    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 0, 4);

    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(0, -24, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(-2, -26, 4, 1.5);
    ctx.fillRect(-3, -23, 5, 1.5);

    const arrowBob = Math.sin(frameCount * 0.1) * 4;
    ctx.fillStyle = '#E040FB';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -38 + arrowBob);
    ctx.lineTo(-6, -45 + arrowBob);
    ctx.lineTo(6, -45 + arrowBob);
    ctx.fill();

    ctx.restore();
}

function drawStinger(s) {
    const sx = s.x - cameraX;
    if (sx < -20 || sx > canvas.width + 20) return;

    ctx.save();
    ctx.translate(sx, s.y);

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.ellipse(-s.dir * 8, 0, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#2C2C2C';
    ctx.beginPath();
    ctx.moveTo(s.dir * 10, 0);
    ctx.lineTo(-s.dir * 4, -3);
    ctx.lineTo(-s.dir * 4, 3);
    ctx.fill();

    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawHUD() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(10, 10, 200, 45);
    ctx.strokeStyle = 'rgba(255, 193, 7, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 200, 45);

    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Bal: ' + score, 20, 32);
    ctx.fillText('Seviye: ' + level, 120, 32);

    ctx.fillText('Can: ', 20, 50);
    for (let i = 0; i < lives; i++) {
        ctx.fillStyle = '#FFC107';
        ctx.beginPath();
        ctx.arc(70 + i * 22, 46, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(67 + i * 22, 44, 3, 2);
        ctx.fillRect(67 + i * 22, 47, 3, 2);
    }

    if (player.superMode) {
        const smPulse = 0.7 + Math.sin(frameCount * 0.1) * 0.3;
        ctx.fillStyle = 'rgba(224, 64, 251, ' + (0.4 * smPulse) + ')';
        ctx.fillRect(220, 10, 130, 45);
        ctx.strokeStyle = '#E040FB';
        ctx.lineWidth = 1;
        ctx.strokeRect(220, 10, 130, 45);
        ctx.fillStyle = '#E040FB';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('SUPER ARI!', 235, 30);
        ctx.fillStyle = '#FFD54F';
        ctx.font = '12px Arial';
        ctx.fillText('E/X: Igne At', 235, 48);
    }

    // Power-up indicators
    let puX = 220;
    if (!player.superMode) puX = 220;
    else puX = 360;

    if (player.shield) {
        ctx.fillStyle = 'rgba(66, 165, 245, 0.4)';
        ctx.fillRect(puX, 10, 50, 20);
        ctx.fillStyle = '#42A5F5';
        ctx.font = 'bold 11px Arial';
        ctx.fillText('KALKAN', puX + 4, 24);
        puX += 55;
    }
    if (player.magnet > 0) {
        ctx.fillStyle = 'rgba(244, 67, 54, 0.4)';
        ctx.fillRect(puX, 10, 50, 20);
        ctx.fillStyle = '#EF5350';
        ctx.font = 'bold 11px Arial';
        ctx.fillText('MIKNAT', puX + 2, 24);
        puX += 55;
    }
    if (player.speedBoost > 0) {
        ctx.fillStyle = 'rgba(255, 152, 0, 0.4)';
        ctx.fillRect(puX, 10, 40, 20);
        ctx.fillStyle = '#FF9800';
        ctx.font = 'bold 11px Arial';
        ctx.fillText('HIZ', puX + 8, 24);
        puX += 45;
    }
    if (player.hasDoubleJump) {
        ctx.fillStyle = 'rgba(156, 39, 176, 0.4)';
        ctx.fillRect(puX, 10, 45, 20);
        ctx.fillStyle = '#CE93D8';
        ctx.font = 'bold 11px Arial';
        ctx.fillText('2xZIP', puX + 4, 24);
    }

    // Boss HP bar
    if (boss && boss.alive) {
        drawBossHP();
    }

    // Sound indicator
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px Arial';
    ctx.fillText(soundEnabled ? 'M:Ses ON' : 'M:Ses OFF', canvas.width - 70, canvas.height - 10);

    // Controls hint
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(canvas.width - 280, 10, 270, 30);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Arial';
    ctx.fillText('Oklar/WASD: Hareket | Space: Zipla | E: Igne', canvas.width - 275, 30);

    // Achievement notifications
    drawAchievementNotifications();
}

function drawParticles() {
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vy += 0.1;

        if (p.life <= 0) { particles.splice(i, 1); return; }

        ctx.save();
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function drawPollenParticles() {
    if (frameCount % 15 === 0) {
        pollenParticles.push({
            x: cameraX + Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0.2 + Math.random() * 0.3,
            vy: -0.1 + Math.random() * 0.2,
            life: 200,
            size: 1 + Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.4
        });
    }

    pollenParticles.forEach((p, i) => {
        p.x += p.vx + Math.sin(frameCount * 0.02 + p.y * 0.01) * 0.3;
        p.y += p.vy + Math.cos(frameCount * 0.015 + p.x * 0.01) * 0.2;
        p.life--;

        if (p.life <= 0) { pollenParticles.splice(i, 1); return; }

        const sx = p.x - cameraX;
        if (sx < -10 || sx > canvas.width + 10) return;

        ctx.save();
        ctx.globalAlpha = p.opacity * (p.life / 200);
        ctx.fillStyle = '#FFF9C4';
        ctx.beginPath();
        ctx.arc(sx, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    if (pollenParticles.length > 80) pollenParticles.splice(0, 10);
}

function drawMovingPlatform(mp) {
    const sx = mp.x - cameraX;
    if (sx < -mp.w - 10 || sx > canvas.width + 10) return;

    const grad = ctx.createLinearGradient(sx, mp.y, sx, mp.y + mp.h);
    grad.addColorStop(0, '#80DEEA');
    grad.addColorStop(0.3, '#4DD0E1');
    grad.addColorStop(1, '#26C6DA');
    ctx.fillStyle = grad;
    ctx.fillRect(sx, mp.y, mp.w, mp.h);
    ctx.strokeStyle = '#00ACC1';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, mp.y, mp.w, mp.h);

    // Arrow indicators
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(mp.axis === 'y' ? '↕' : '↔', sx + mp.w / 2, mp.y + mp.h / 2 + 5);
    ctx.textAlign = 'left';
}

function drawTrampoline(t) {
    const sx = t.x - cameraX;
    if (sx < -40 || sx > canvas.width + 40) return;

    const squish = t.bounceTimer > 0 ? Math.sin(t.bounceTimer * 0.3) * 4 : 0;

    ctx.save();
    ctx.translate(sx + t.w / 2, t.y + t.h);

    // Stem
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(-3, -t.h + squish, 6, t.h - squish);

    // Mushroom cap
    ctx.fillStyle = '#E53935';
    ctx.beginPath();
    ctx.ellipse(0, -t.h + squish, 18, 10 - squish, 0, Math.PI, 0);
    ctx.fill();

    // White spots
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-7, -t.h - 4 + squish, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5, -t.h - 6 + squish, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -t.h - 2 + squish, 2, 0, Math.PI * 2);
    ctx.fill();

    // Bounce effect
    if (t.bounceTimer > 0) {
        ctx.globalAlpha = t.bounceTimer / 15;
        ctx.strokeStyle = '#FFEB3B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, -t.h - 10 + squish, 20, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();
}

function drawWaterZone(wz) {
    const sx = wz.x - cameraX;
    if (sx < -wz.w || sx > canvas.width + 10) return;

    ctx.save();

    // Water body
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#1565C0';
    ctx.fillRect(sx, wz.y, wz.w, wz.h);

    // Wave surface
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#42A5F5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < wz.w; x += 4) {
        const wy = wz.y + Math.sin((x + frameCount * 2) * 0.05 + wz.waveOffset) * 4;
        if (x === 0) ctx.moveTo(sx + x, wy);
        else ctx.lineTo(sx + x, wy);
    }
    ctx.stroke();

    // Bubbles
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#90CAF9';
    for (let i = 0; i < 5; i++) {
        const bx = sx + (wz.w * (i + 0.5)) / 5;
        const by = wz.y + wz.h * 0.3 + Math.sin(frameCount * 0.03 + i * 2) * wz.h * 0.25;
        const br = 2 + Math.sin(frameCount * 0.05 + i) * 1;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

function drawBoss() {
    if (!boss || !boss.alive) return;
    const sx = boss.x - cameraX;
    if (sx < -100 || sx > canvas.width + 100) return;

    const floatY = Math.sin(frameCount * 0.04 + boss.floatOffset) * 10;
    const flash = boss.flashTimer > 0 && Math.floor(boss.flashTimer / 3) % 2 === 0;

    ctx.save();
    ctx.translate(sx + boss.w / 2, boss.y + boss.h / 2 + floatY);

    if (flash) {
        ctx.globalAlpha = 0.5;
    }

    const dir = boss.vx > 0 ? 1 : -1;
    ctx.scale(dir, 1);
    const scale = boss.w / 64;

    // Boss body (enlarged bird/wasp)
    if (boss.type === 'bigbird' || boss.type === 'kingbird') {
        // Large red/gold body
        const bodyColor = boss.type === 'kingbird' ? '#FFD700' : '#c0392b';
        const headColor = boss.type === 'kingbird' ? '#FFF8E1' : '#e74c3c';
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, 28 * scale, 20 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(22 * scale, -6 * scale, 14 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Crown for king
        if (boss.type === 'kingbird') {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.moveTo(14 * scale, -20 * scale);
            ctx.lineTo(18 * scale, -30 * scale);
            ctx.lineTo(22 * scale, -22 * scale);
            ctx.lineTo(26 * scale, -32 * scale);
            ctx.lineTo(30 * scale, -20 * scale);
            ctx.fill();
        }

        // Angry eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(26 * scale, -10 * scale, 6 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b71c1c';
        ctx.beginPath();
        ctx.arc(27 * scale, -10 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Eyebrow
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20 * scale, -18 * scale);
        ctx.lineTo(32 * scale, -15 * scale);
        ctx.stroke();

        // Beak
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(34 * scale, -6 * scale);
        ctx.lineTo(44 * scale, -3 * scale);
        ctx.lineTo(34 * scale, 0);
        ctx.fill();

        // Wings
        const wingA = Math.sin(frameCount * 0.15) * 0.4;
        ctx.fillStyle = headColor;
        ctx.save();
        ctx.rotate(wingA - 0.3);
        ctx.beginPath();
        ctx.ellipse(-8 * scale, -16 * scale, 22 * scale, 10 * scale, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else {
        // Giant wasp
        ctx.fillStyle = '#FFB300';
        ctx.beginPath();
        ctx.ellipse(0, 0, 30 * scale, 22 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(-12 * scale, -10 * scale, 24 * scale, 6 * scale);
        ctx.fillRect(-14 * scale, 2 * scale, 28 * scale, 6 * scale);

        ctx.fillStyle = '#FF8F00';
        ctx.beginPath();
        ctx.arc(24 * scale, -4 * scale, 14 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(28 * scale, -8 * scale, 7 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b71c1c';
        ctx.beginPath();
        ctx.arc(29 * scale, -8 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Stinger
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.moveTo(-28 * scale, 2 * scale);
        ctx.lineTo(-42 * scale, 0);
        ctx.lineTo(-28 * scale, -2 * scale);
        ctx.fill();

        const wingF = Math.sin(frameCount * 0.4) * 0.5;
        ctx.fillStyle = 'rgba(220,240,255,0.5)';
        ctx.save();
        ctx.rotate(-0.4 + wingF);
        ctx.beginPath();
        ctx.ellipse(-5 * scale, -20 * scale, 24 * scale, 12 * scale, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    ctx.restore();
}

function drawBossHP() {
    if (!boss || !boss.alive) return;
    const barW = 200;
    const barH = 16;
    const bx = (canvas.width - barW) / 2;
    const by = canvas.height - 35;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(bx - 2, by - 2, barW + 4, barH + 4);

    ctx.fillStyle = '#424242';
    ctx.fillRect(bx, by, barW, barH);

    const hpRatio = boss.hp / boss.maxHp;
    const hpColor = hpRatio > 0.5 ? '#4CAF50' : hpRatio > 0.25 ? '#FF9800' : '#F44336';
    ctx.fillStyle = hpColor;
    ctx.fillRect(bx, by, barW * hpRatio, barH);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    const bossName = boss.type === 'bigbird' ? 'BUYUK KUS' : boss.type === 'giantwasp' ? 'DEV ESEK ARISI' : 'KRAL KUS';
    ctx.fillText(bossName + ' ' + boss.hp + '/' + boss.maxHp, canvas.width / 2, by + 12);
    ctx.textAlign = 'left';
}

function drawSecretArea(sa) {
    if (sa.discovered) {
        if (sa.flashTimer > 0) {
            const sx = sa.triggerX - cameraX;
            ctx.save();
            ctx.globalAlpha = sa.flashTimer / 120;
            ctx.fillStyle = '#FFD54F';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GIZLI BOLGE! +500', sx + sa.triggerW / 2, sa.triggerY - 10);
            ctx.textAlign = 'left';
            ctx.restore();
        }
        return;
    }

    const sx = sa.triggerX - cameraX;
    if (sx < -50 || sx > canvas.width + 50) return;

    // Hint: slightly different colored wall section
    ctx.save();
    const pulse = 0.15 + Math.sin(frameCount * 0.04) * 0.05;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#CE93D8';
    ctx.fillRect(sx, sa.triggerY, sa.triggerW, sa.triggerH);
    ctx.restore();
}

function drawPowerUp(pu) {
    if (pu.collected) return;
    const sx = pu.x - cameraX;
    if (sx < -30 || sx > canvas.width + 30) return;

    const bob = Math.sin(frameCount * 0.07 + pu.bobPhase) * 5;

    ctx.save();
    ctx.translate(sx + pu.w / 2, pu.y + pu.h / 2 + bob);

    // Glow
    const colors = { shield: '#42A5F5', magnet: '#EF5350', speed: '#FF9800', doubleJump: '#CE93D8' };
    const icons = { shield: '🛡', magnet: '🧲', speed: '⚡', doubleJump: '↑↑' };
    const color = colors[pu.kind] || '#FFD54F';

    ctx.globalAlpha = 0.3 + Math.sin(frameCount * 0.08) * 0.15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;

    // Box
    ctx.fillStyle = color;
    ctx.fillRect(-14, -14, 28, 28);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(-14, -14, 28, 28);

    // Icon
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (pu.kind === 'doubleJump') {
        ctx.fillText('2x', 0, 0);
    } else if (pu.kind === 'shield') {
        ctx.fillText('S', 0, 0);
    } else if (pu.kind === 'magnet') {
        ctx.fillText('M', 0, 0);
    } else {
        ctx.fillText('H', 0, 0);
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    ctx.restore();
}

function drawAchievementNotifications() {
    achievementNotifications.forEach((n, i) => {
        n.timer--;
        if (n.timer <= 0) { achievementNotifications.splice(i, 1); return; }

        const slideIn = Math.min(1, (120 - n.timer) / 15);
        const slideOut = n.timer < 20 ? n.timer / 20 : 1;
        const alpha = slideIn * slideOut;
        const x = canvas.width - 250 * slideIn;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(x, 50 + i * 45, 240, 38);
        ctx.strokeStyle = '#FFD54F';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, 50 + i * 45, 240, 38);
        ctx.fillStyle = '#FFD54F';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('BASARIM!', x + 10, 66 + i * 45);
        ctx.fillStyle = 'white';
        ctx.font = '11px Arial';
        ctx.fillText(n.text, x + 10, 80 + i * 45);
        ctx.restore();
    });
}

function spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 6,
            vy: -Math.random() * 5 - 1,
            life: 30 + Math.random() * 20,
            maxLife: 50,
            size: 2 + Math.random() * 3,
            color
        });
    }
}
