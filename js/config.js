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
    shootCooldown: 0
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
