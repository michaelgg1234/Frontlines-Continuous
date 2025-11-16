// Frontlines Continuous - Main Game Logic

// Constants
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;
const MAX_FORCE = 100;
const MAX_FORCE_PER_ARROW = 25;
const MAX_ARROW_LENGTH = 200;
const MIN_ARROW_LENGTH = 5;
const MAX_ARROWS_PER_TURN = 10;
const GAUSSIAN_SIGMA = 50;
const GAUSSIAN_RADIUS = 150; // 3 * sigma
const FRONTLINE_SAMPLE_INTERVAL = 5;
const MOVEMENT_CONSTANT = 35;
const MAX_MOVEMENT_PER_TURN = 350;
const TURN_TIME_LIMIT = 30;
const ARROW_FLASH_DURATION = 1000; // 1 second to show arrows
const ANIMATION_DURATION = 3000; // 3 seconds for frontline movement

// Game State
class GameState {
    constructor() {
        this.turn = 1;
        this.currentPlayer = 'red'; // 'red' or 'blue'
        this.phase = 'deployment'; // 'deployment', 'animation', 'gameover'
        this.timeRemaining = TURN_TIME_LIMIT;
        this.timerInterval = null;

        // Frontline control points
        this.frontline = this.initializeFrontline();

        // Force vectors for current turn
        this.redForces = [];
        this.blueForces = [];

        // Current deployment (temporary)
        this.currentForces = [];
        this.forceRemaining = { red: MAX_FORCE, blue: MAX_FORCE };

        // Territory percentages
        this.redTerritory = 0.5;
        this.blueTerritory = 0.5;

        // Input state
        this.isDragging = false;
        this.dragStart = null;
        this.currentArrow = null;

        // Animation state
        this.animationProgress = 0;
        this.oldFrontline = null;
        this.newFrontline = null;
    }

    initializeFrontline() {
        const points = [];
        const centerX = CANVAS_WIDTH / 2;

        // Create control points every 20 pixels vertically
        for (let y = 0; y <= CANVAS_HEIGHT; y += 20) {
            // Add slight natural variation
            const variation = Math.sin(y / 100) * 10;
            points.push({ x: centerX + variation, y: y });
        }

        return points;
    }

    reset() {
        this.turn = 1;
        this.currentPlayer = 'red';
        this.phase = 'deployment';
        this.timeRemaining = TURN_TIME_LIMIT;
        this.frontline = this.initializeFrontline();
        this.redForces = [];
        this.blueForces = [];
        this.currentForces = [];
        this.forceRemaining = { red: MAX_FORCE, blue: MAX_FORCE };
        this.redTerritory = 0.5;
        this.blueTerritory = 0.5;
        this.isDragging = false;
        this.dragStart = null;
        this.currentArrow = null;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// Game Instance
let game = new GameState();
let canvas, ctx;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Setup event listeners
    setupEventListeners();

    // Start game loop
    startTimer();
    gameLoop();
});

// Event Listeners
function setupEventListeners() {
    // Canvas mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // UI buttons
    document.getElementById('undo-btn').addEventListener('click', undoLastArrow);
    document.getElementById('clear-btn').addEventListener('click', clearAllArrows);
    document.getElementById('confirm-btn').addEventListener('click', confirmDeployment);
    document.getElementById('new-game-btn').addEventListener('click', newGame);
}

// Mouse Handlers
function handleMouseDown(e) {
    if (game.phase !== 'deployment') return;
    if (game.currentForces.length >= MAX_ARROWS_PER_TURN) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);

    // Check if click is near frontline
    const nearestPoint = findNearestFrontlinePoint(x, y);
    if (nearestPoint && nearestPoint.distance < 30) {
        game.isDragging = true;
        game.dragStart = { x: nearestPoint.x, y: nearestPoint.y };
        game.currentArrow = {
            startX: nearestPoint.x,
            startY: nearestPoint.y,
            endX: x,
            endY: y,
            magnitude: 0
        };
    }
}

function handleMouseMove(e) {
    if (!game.isDragging || game.phase !== 'deployment') return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);

    // Update current arrow
    const dx = x - game.dragStart.x;
    const dy = y - game.dragStart.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > 0) {
        // Calculate magnitude based on length
        const constrainedLength = Math.min(length, MAX_ARROW_LENGTH);
        let magnitude = (constrainedLength / MAX_ARROW_LENGTH) * MAX_FORCE_PER_ARROW;

        // Snap to remaining force if arrow would exceed it
        const forceAvailable = game.forceRemaining[game.currentPlayer];
        if (magnitude > forceAvailable) {
            magnitude = forceAvailable;
        }

        // Calculate the actual length for this magnitude
        const actualLength = (magnitude / MAX_FORCE_PER_ARROW) * MAX_ARROW_LENGTH;

        // Update arrow position
        const normalizedDx = dx / length;
        const normalizedDy = dy / length;

        game.currentArrow.endX = game.dragStart.x + normalizedDx * actualLength;
        game.currentArrow.endY = game.dragStart.y + normalizedDy * actualLength;
        game.currentArrow.magnitude = magnitude;
    }
}

function handleMouseUp(e) {
    if (!game.isDragging || game.phase !== 'deployment') return;

    const dx = game.currentArrow.endX - game.currentArrow.startX;
    const dy = game.currentArrow.endY - game.currentArrow.startY;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Only add arrow if it meets minimum length (force is already clamped in handleMouseMove)
    if (length >= MIN_ARROW_LENGTH && game.currentArrow.magnitude > 0) {
        game.currentForces.push({ ...game.currentArrow });
        game.forceRemaining[game.currentPlayer] -= game.currentArrow.magnitude;
        updateUI();
    }

    game.isDragging = false;
    game.dragStart = null;
    game.currentArrow = null;
}

function handleMouseLeave() {
    game.isDragging = false;
    game.dragStart = null;
    game.currentArrow = null;
}

// UI Button Handlers
function undoLastArrow() {
    if (game.currentForces.length > 0) {
        const lastArrow = game.currentForces.pop();
        game.forceRemaining[game.currentPlayer] += lastArrow.magnitude;
        updateUI();
    }
}

function clearAllArrows() {
    game.currentForces = [];
    game.forceRemaining[game.currentPlayer] = MAX_FORCE;
    updateUI();
}

function confirmDeployment() {
    // Only allow confirmation during deployment phase
    if (game.phase !== 'deployment') return;

    // Store forces for current player
    if (game.currentPlayer === 'red') {
        game.redForces = [...game.currentForces];
        game.currentForces = [];
        game.currentPlayer = 'blue';
        startTimer(); // Restart timer for blue player
        updateUI();
    } else {
        game.blueForces = [...game.currentForces];
        game.currentForces = [];

        // Clear timer before starting animation
        if (game.timerInterval) {
            clearInterval(game.timerInterval);
            game.timerInterval = null;
        }

        // Both players have deployed - resolve combat
        resolveCombat();
    }
}

function newGame() {
    document.getElementById('victory-modal').classList.add('hidden');
    game.reset();
    startTimer();
    updateUI();
}

// Frontline Utilities
function findNearestFrontlinePoint(x, y) {
    let nearest = null;
    let minDist = Infinity;

    for (let i = 0; i < game.frontline.length; i++) {
        const point = game.frontline[i];
        const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);

        if (dist < minDist) {
            minDist = dist;
            nearest = { x: point.x, y: point.y, distance: dist, index: i };
        }
    }

    return nearest;
}

function interpolateFrontline(points) {
    // Use Catmull-Rom spline interpolation for smooth frontline
    if (points.length < 2) return points;

    const interpolated = [];

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        // Add several interpolated points between p1 and p2
        for (let t = 0; t < 1; t += 0.1) {
            const point = catmullRom(p0, p1, p2, p3, t);
            interpolated.push(point);
        }
    }

    // Add last point
    interpolated.push(points[points.length - 1]);

    return interpolated;
}

function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;

    const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    );

    const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    );

    return { x, y };
}

// Gaussian Force Calculations
function getForceAtPoint(x, y, forceVectors) {
    let totalForce = 0;

    for (let vector of forceVectors) {
        const distance = Math.sqrt(
            (x - vector.endX) ** 2 +
            (y - vector.endY) ** 2
        );

        // Gaussian distribution
        const gaussianEffect = vector.magnitude *
            Math.exp(-(distance * distance) / (2 * GAUSSIAN_SIGMA * GAUSSIAN_SIGMA));

        totalForce += gaussianEffect;
    }

    return totalForce;
}

// Combat Resolution
function resolveCombat() {
    // Deep copy the current frontline before changing phase
    game.oldFrontline = game.frontline.map(p => ({ x: p.x, y: p.y }));

    // Calculate new frontline positions
    const newFrontline = [];

    for (let i = 0; i < game.frontline.length; i++) {
        const point = game.frontline[i];

        // Calculate net force at this frontline point
        const redForce = getForceAtPoint(point.x, point.y, game.redForces);
        const blueForce = getForceAtPoint(point.x, point.y, game.blueForces);
        const netForce = redForce - blueForce;

        // Calculate movement
        let movement = MOVEMENT_CONSTANT * Math.sign(netForce) * Math.sqrt(Math.abs(netForce));
        movement = Math.max(-MAX_MOVEMENT_PER_TURN, Math.min(MAX_MOVEMENT_PER_TURN, movement));

        // Red force pushes right (positive X), blue force pushes left (negative X)
        let newX = point.x + movement;

        // Constrain to canvas bounds
        newX = Math.max(50, Math.min(CANVAS_WIDTH - 50, newX));

        newFrontline.push({ x: newX, y: point.y });
    }

    // Smooth the new frontline and deep copy
    game.newFrontline = smoothFrontline(newFrontline).map(p => ({ x: p.x, y: p.y }));

    // Now enter animation phase
    game.phase = 'animation';
    game.animationProgress = 0;

    // Animate the transition
    animateCombatResolution();
}

function smoothFrontline(frontline) {
    // Validate input
    if (!frontline || frontline.length === 0) {
        console.error('smoothFrontline received invalid frontline');
        return frontline;
    }

    // Apply simple moving average smoothing
    const smoothed = [];
    const windowSize = 3;

    for (let i = 0; i < frontline.length; i++) {
        let sumX = 0;
        let count = 0;

        for (let j = -windowSize; j <= windowSize; j++) {
            const index = i + j;
            if (index >= 0 && index < frontline.length) {
                sumX += frontline[index].x;
                count++;
            }
        }

        smoothed.push({
            x: sumX / count,
            y: frontline[i].y
        });
    }

    return smoothed;
}

function animateCombatResolution() {
    const startTime = Date.now();
    const totalDuration = ARROW_FLASH_DURATION + ANIMATION_DURATION;

    function animate() {
        const elapsed = Date.now() - startTime;

        if (elapsed < totalDuration) {
            // Calculate progress within each phase
            if (elapsed < ARROW_FLASH_DURATION) {
                // Phase 1: Flash arrows (show them)
                game.animationProgress = 0; // Frontline doesn't move yet
            } else {
                // Phase 2: Animate frontline movement
                const movementElapsed = elapsed - ARROW_FLASH_DURATION;
                game.animationProgress = Math.min(movementElapsed / ANIMATION_DURATION, 1);
            }

            requestAnimationFrame(animate);
        } else {
            // Animation complete - update frontline before clearing animation data
            if (game.newFrontline && game.newFrontline.length > 0) {
                game.frontline = game.newFrontline.map(p => ({ x: p.x, y: p.y }));
            }
            game.oldFrontline = null;
            game.newFrontline = null;
            game.animationProgress = 0;
            game.redForces = [];
            game.blueForces = [];

            // Calculate territory
            calculateTerritory();

            // Check victory conditions
            if (checkVictory()) {
                return;
            }

            // Start next turn
            game.turn++;
            game.currentPlayer = 'red';
            game.phase = 'deployment';
            game.forceRemaining = { red: MAX_FORCE, blue: MAX_FORCE };
            startTimer();
            updateUI();
        }
    }

    animate();
}

// Territory Calculation
function calculateTerritory() {
    // Sample points across the canvas and count which side of frontline they're on
    let redCount = 0;
    let blueCount = 0;
    const sampleInterval = 20;

    for (let x = 0; x < CANVAS_WIDTH; x += sampleInterval) {
        for (let y = 0; y < CANVAS_HEIGHT; y += sampleInterval) {
            if (isPointInRedTerritory(x, y)) {
                redCount++;
            } else {
                blueCount++;
            }
        }
    }

    const total = redCount + blueCount;
    game.redTerritory = redCount / total;
    game.blueTerritory = blueCount / total;
}

function isPointInRedTerritory(x, y) {
    // Find the frontline X position at this Y coordinate
    const frontlineX = getFrontlineXAtY(y);
    return x < frontlineX;
}

function getFrontlineXAtY(y) {
    // Find the two control points that bracket this Y
    for (let i = 0; i < game.frontline.length - 1; i++) {
        if (game.frontline[i].y <= y && game.frontline[i + 1].y >= y) {
            // Linear interpolation
            const t = (y - game.frontline[i].y) / (game.frontline[i + 1].y - game.frontline[i].y);
            return game.frontline[i].x + t * (game.frontline[i + 1].x - game.frontline[i].x);
        }
    }

    // If not found, use nearest point
    return game.frontline[0].x;
}

// Victory Conditions
function checkVictory() {
    let winner = null;
    let reason = '';

    // Territory victory (75%)
    if (game.redTerritory >= 0.75) {
        winner = 'RED';
        reason = 'Territory Domination (75%+)';
    } else if (game.blueTerritory >= 0.75) {
        winner = 'BLUE';
        reason = 'Territory Domination (75%+)';
    }

    // Edge elimination
    const avgX = game.frontline.reduce((sum, p) => sum + p.x, 0) / game.frontline.length;
    if (avgX < 100) {
        winner = 'BLUE';
        reason = 'Pushed frontline to edge';
    } else if (avgX > CANVAS_WIDTH - 100) {
        winner = 'RED';
        reason = 'Pushed frontline to edge';
    }

    // Turn limit (50 turns)
    if (game.turn >= 50) {
        if (game.redTerritory > game.blueTerritory) {
            winner = 'RED';
            reason = `Territory Control (${(game.redTerritory * 100).toFixed(1)}%)`;
        } else {
            winner = 'BLUE';
            reason = `Territory Control (${(game.blueTerritory * 100).toFixed(1)}%)`;
        }
    }

    if (winner) {
        showVictoryScreen(winner, reason);
        game.phase = 'gameover';
        clearInterval(game.timerInterval);
        return true;
    }

    return false;
}

function showVictoryScreen(winner, reason) {
    const modal = document.getElementById('victory-modal');
    const title = document.getElementById('victory-title');
    const message = document.getElementById('victory-message');

    title.textContent = `${winner} WINS!`;
    title.style.color = winner === 'RED' ? '#dc2626' : '#3b82f6';
    message.textContent = reason;

    modal.classList.remove('hidden');
}

// Timer
function startTimer() {
    if (game.timerInterval) {
        clearInterval(game.timerInterval);
        game.timerInterval = null;
    }

    game.timeRemaining = TURN_TIME_LIMIT;
    updateTimerDisplay();

    game.timerInterval = setInterval(() => {
        game.timeRemaining--;
        updateTimerDisplay();

        if (game.timeRemaining <= 0) {
            // Clear the timer first to prevent negative numbers
            clearInterval(game.timerInterval);
            game.timerInterval = null;
            game.timeRemaining = 0;
            updateTimerDisplay();

            // Auto-confirm deployment
            confirmDeployment();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    const overlay = document.getElementById('timer-overlay');

    display.textContent = game.timeRemaining;

    overlay.classList.remove('warning', 'critical');
    if (game.timeRemaining <= 5) {
        overlay.classList.add('critical');
    } else if (game.timeRemaining <= 10) {
        overlay.classList.add('warning');
    }
}

// UI Updates
function updateUI() {
    // Player indicator
    const playerIndicator = document.getElementById('player-color-indicator');
    const playerName = document.getElementById('player-name');

    playerIndicator.className = game.currentPlayer === 'red' ? 'red-player' : 'blue-player';
    playerName.textContent = game.currentPlayer === 'red' ? 'RED PLAYER' : 'BLUE PLAYER';

    // Turn info
    document.getElementById('turn-number').textContent = game.turn;
    document.getElementById('phase-name').textContent =
        game.phase === 'deployment' ? 'Deployment' :
        game.phase === 'animation' ? 'Combat Resolution' : 'Game Over';

    // Force bars
    const redBar = document.getElementById('red-force-bar');
    const blueBar = document.getElementById('blue-force-bar');
    const redForcePercent = (game.forceRemaining.red / MAX_FORCE) * 100;
    const blueForcePercent = (game.forceRemaining.blue / MAX_FORCE) * 100;

    redBar.style.height = `${redForcePercent}%`;
    blueBar.style.height = `${blueForcePercent}%`;
    redBar.querySelector('.force-value').textContent = Math.round(game.forceRemaining.red);
    blueBar.querySelector('.force-value').textContent = Math.round(game.forceRemaining.blue);

    // Territory
    document.getElementById('red-territory-percent').textContent =
        `${(game.redTerritory * 100).toFixed(1)}%`;
    document.getElementById('blue-territory-percent').textContent =
        `${(game.blueTerritory * 100).toFixed(1)}%`;
    document.getElementById('red-territory-fill').style.width =
        `${game.redTerritory * 100}%`;
    document.getElementById('blue-territory-fill').style.width =
        `${game.blueTerritory * 100}%`;

    // Arrow count
    document.getElementById('arrow-count-display').textContent = game.currentForces.length;

    // Buttons
    const undoBtn = document.getElementById('undo-btn');
    const clearBtn = document.getElementById('clear-btn');
    const confirmBtn = document.getElementById('confirm-btn');

    const hasArrows = game.currentForces.length > 0;
    const canDeploy = game.phase === 'deployment';

    undoBtn.disabled = !hasArrows || !canDeploy;
    clearBtn.disabled = !hasArrows || !canDeploy;
    confirmBtn.disabled = !canDeploy;
}

// Rendering
function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
}

function render() {
    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Determine which frontline to draw (for animation)
    let frontlineToRender = null;

    if (game.phase === 'animation' && game.oldFrontline && game.newFrontline &&
        game.oldFrontline.length > 0 && game.newFrontline.length > 0) {
        // Interpolate between old and new frontline during animation
        frontlineToRender = [];
        const maxLength = Math.min(game.oldFrontline.length, game.newFrontline.length);
        for (let i = 0; i < maxLength; i++) {
            const oldPoint = game.oldFrontline[i];
            const newPoint = game.newFrontline[i];
            if (oldPoint && newPoint) {
                frontlineToRender.push({
                    x: oldPoint.x + (newPoint.x - oldPoint.x) * game.animationProgress,
                    y: oldPoint.y + (newPoint.y - oldPoint.y) * game.animationProgress
                });
            }
        }

        // Validate interpolated frontline
        if (frontlineToRender.length === 0) {
            frontlineToRender = null;
        }
    }

    // Fallback to current frontline if interpolation failed or not animating
    if (!frontlineToRender || frontlineToRender.length === 0) {
        frontlineToRender = game.frontline;
    }

    // Safety check - ensure we have a valid frontline
    if (!frontlineToRender || frontlineToRender.length < 2) {
        console.error('Invalid frontline in render:', frontlineToRender);
        return; // Skip this frame
    }

    // Draw territories
    drawTerritories(frontlineToRender);

    // Show arrows during deployment phase
    if (game.phase === 'deployment') {
        const color = game.currentPlayer === 'red' ? '#dc2626' : '#3b82f6';
        drawForceVectors(game.currentForces, color, 1);

        // Draw current arrow being dragged
        if (game.isDragging && game.currentArrow) {
            drawArrow(game.currentArrow, color, 0.7);
            drawGaussianPreview(game.currentArrow, color);
        }
    }

    // Flash both teams' arrows during animation phase
    if (game.phase === 'animation' && (game.redForces.length > 0 || game.blueForces.length > 0)) {
        // Draw both teams' arrows
        drawForceVectors(game.redForces, '#dc2626', 1);
        drawForceVectors(game.blueForces, '#3b82f6', 1);
    }

    // Draw frontline
    drawFrontline(frontlineToRender);
}

function drawTerritories(frontline) {
    // Safety check
    if (!frontline || frontline.length < 2) return;

    // Red territory (left of frontline)
    ctx.fillStyle = 'rgba(220, 38, 38, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(frontline[0].x, frontline[0].y);

    for (let i = 1; i < frontline.length; i++) {
        ctx.lineTo(frontline[i].x, frontline[i].y);
    }

    ctx.lineTo(0, CANVAS_HEIGHT);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Blue territory (right of frontline)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.beginPath();
    ctx.moveTo(frontline[0].x, frontline[0].y);

    for (let i = 1; i < frontline.length; i++) {
        ctx.lineTo(frontline[i].x, frontline[i].y);
    }

    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, 0);
    ctx.lineTo(frontline[0].x, frontline[0].y);
    ctx.closePath();
    ctx.fill();
}

function drawFrontline(frontline) {
    if (frontline.length < 2) return;

    // Draw smooth curve
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(frontline[0].x, frontline[0].y);

    // Use quadratic curves for smoothness
    for (let i = 1; i < frontline.length - 1; i++) {
        const xc = (frontline[i].x + frontline[i + 1].x) / 2;
        const yc = (frontline[i].y + frontline[i + 1].y) / 2;
        ctx.quadraticCurveTo(frontline[i].x, frontline[i].y, xc, yc);
    }

    // Draw to last point
    ctx.lineTo(frontline[frontline.length - 1].x, frontline[frontline.length - 1].y);
    ctx.stroke();
}

function drawForceVectors(vectors, color, alpha) {
    for (let vector of vectors) {
        drawArrow(vector, color, alpha);
    }
}

function drawArrow(arrow, color, alpha) {
    const dx = arrow.endX - arrow.startX;
    const dy = arrow.endY - arrow.startY;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length < 1) return;

    const angle = Math.atan2(dy, dx);

    // Draw arrow shaft
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(arrow.startX, arrow.startY);
    ctx.lineTo(arrow.endX, arrow.endY);
    ctx.stroke();

    // Draw arrowhead
    const headLength = 15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(arrow.endX, arrow.endY);
    ctx.lineTo(
        arrow.endX - headLength * Math.cos(angle - Math.PI / 6),
        arrow.endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        arrow.endX - headLength * Math.cos(angle + Math.PI / 6),
        arrow.endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Draw magnitude label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
        arrow.magnitude.toFixed(1),
        arrow.endX,
        arrow.endY - 20
    );

    ctx.globalAlpha = 1;
}

function drawGaussianPreview(arrow, color) {
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(arrow.endX, arrow.endY, GAUSSIAN_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
}

function drawGaussianOverlays() {
    const alpha = 0.3;

    // Draw red gaussian fields
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#dc2626';
    for (let vector of game.redForces) {
        ctx.beginPath();
        ctx.arc(vector.endX, vector.endY, GAUSSIAN_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw blue gaussian fields
    ctx.fillStyle = '#3b82f6';
    for (let vector of game.blueForces) {
        ctx.beginPath();
        ctx.arc(vector.endX, vector.endY, GAUSSIAN_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

// Initialize UI on load
window.addEventListener('load', () => {
    updateUI();
});
