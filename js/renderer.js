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

    // Body
    ctx.fillStyle = p.superMode ? '#FF6F00' : '#FFC107';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stripes
    ctx.fillStyle = p.superMode ? '#4A148C' : '#2C2C2C';
    ctx.fillRect(-4, -4, 10, 3);
    ctx.fillRect(-6, 2, 12, 3);
    ctx.fillRect(-3, 7, 8, 3);

    // Head
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(12, -2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
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
    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.arc(20, -16, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(14, -19, 2, 0, Math.PI * 2);
    ctx.fill();

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

    // Smile
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(15, -1, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
}

function drawBird(e) {
    if (!e.alive) return;
    const sx = e.x - cameraX;
    if (sx < -50 || sx > canvas.width + 50) return;

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

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(canvas.width - 280, 10, 270, 30);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Arial';
    ctx.fillText('Oklar/WASD: Hareket | Space: Zipla | E: Igne', canvas.width - 275, 30);
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
