// ============================================
// config.js - Global state, constants, DOM refs
// ============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('ui-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const overlayBtn = document.getElementById('overlay-btn');

canvas.width = 960;
canvas.height = 540;

// Game state
let gameState = 'menu';
let score = 0;
let lives = 3;
let level = 1;
let cameraX = 0;
let particles = [];
let pollenParticles = [];
let frameCount = 0;
let deathsThisLevel = 0;

// Constants
const GRAVITY = 0.6;
const TILE_SIZE = 40;
const WORLD_WIDTH = 200;
const WORLD_HEIGHT = 13;

// Player
const player = {
    x: 100, y: 300, w: 32, h: 32,
    vx: 0, vy: 0,
    onGround: false,
    facing: 1,
    wingFrame: 0,
    invincible: 0,
    animFrame: 0,
    superMode: false,
    shootCooldown: 0,
    // Double jump
    hasDoubleJump: false,
    doubleJumpAvailable: false,
    // Power-ups
    shield: false,
    magnet: 0,
    speedBoost: 0,
    // Water
    inWater: false,
    // Skin
    skin: 'normal'
};

// Level data
let platforms = [];
let flowers = [];
let coins = [];
let enemies = [];
let flagX = 0;
let clouds = [];
let backgroundFlowers = [];
let butterflies = [];
let checkpoints = [];
let lastCheckpoint = null;
let superBoxes = [];
let stingers = [];
let enemyStingers = [];

// New feature arrays
let movingPlatforms = [];
let trampolines = [];
let waterZones = [];
let boss = null;
let secretAreas = [];
let powerUps = [];

// Skin definitions (all unlocked from start)
const SKINS = {
    normal:  { name: 'Normal Ari',   body: '#FFC107', head: '#FFD54F', stripe: '#2C2C2C' },
    girl:    { name: 'Kiz Ari',      body: '#FF80AB', head: '#FFB6C1', stripe: '#C2185B' },
    super:   { name: 'Super Ari',    body: '#7C4DFF', head: '#B388FF', stripe: '#311B92' },
    funny:   { name: 'Komik Ari',    body: '#76FF03', head: '#CCFF90', stripe: '#33691E' }
};

// Sound toggle
let soundEnabled = true;

// High scores
let highScores = JSON.parse(localStorage.getItem('beeHighScores') || '[]');

// All skins unlocked
let unlockedSkins = Object.keys(SKINS);
let selectedSkin = localStorage.getItem('beeSelectedSkin') || 'normal';
// Validate saved skin still exists
if (!SKINS[selectedSkin]) selectedSkin = 'normal';
player.skin = selectedSkin;

// Achievement notification queue
let achievementNotifications = [];

// Level progress
let unlockedLevel = parseInt(localStorage.getItem('beeUnlockedLevel') || '1');
let selectedLevel = unlockedLevel;
