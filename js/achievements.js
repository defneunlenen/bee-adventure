// ============================================
// achievements.js - Achievement system
// ============================================

const ACHIEVEMENTS = {
    firstCoin:      { name: 'Ilk Bal',       desc: 'Ilk balini topla' },
    coinHunter:     { name: 'Bal Avcisi',    desc: '100 bal topla' },
    stomper:        { name: 'Ezici',         desc: 'Ilk dusmani ez' },
    superBee:       { name: 'Super Ari',     desc: 'Super modu kullan' },
    bossSlayer:     { name: 'Boss Avcisi',   desc: 'Bir boss yen' },
    secretExplorer: { name: 'Gizli Kasif',   desc: 'Gizli bolge bul' },
    invincible:     { name: 'Yenilmez',      desc: 'Olumsuz seviye bitir' }
};

let unlockedAchievements = JSON.parse(localStorage.getItem('beeAchievements') || '[]');

function checkAchievement(id) {
    if (!ACHIEVEMENTS[id]) return;
    if (unlockedAchievements.includes(id)) return;

    unlockedAchievements.push(id);
    localStorage.setItem('beeAchievements', JSON.stringify(unlockedAchievements));

    // Queue notification
    achievementNotifications.push({
        text: ACHIEVEMENTS[id].name,
        desc: ACHIEVEMENTS[id].desc,
        timer: 180 // 3 seconds at 60fps
    });

    sfxAchievement();
}

function getAchievementCount() {
    return unlockedAchievements.length;
}

function getTotalAchievements() {
    return Object.keys(ACHIEVEMENTS).length;
}
