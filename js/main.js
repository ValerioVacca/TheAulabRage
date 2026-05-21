const gameArea = document.getElementById("gameArea");
const gameViewport = document.getElementById("gameViewport");
const gameStage = document.getElementById("gameStage");
const startOverlay = document.getElementById("startOverlay");
const endOverlay = document.getElementById("endOverlay");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const livesValue = document.getElementById("livesValue");
const studentsValue = document.getElementById("studentsValue");
const endEyebrow = document.getElementById("endEyebrow");
const endTitle = document.getElementById("endTitle");
const endMessage = document.getElementById("endMessage");

const GAME = {
    width: 1280,
    height: 720,
    playerSpeed: 4,
    studentSpeed: 2.2,
    studentTalkMin: 3800,
    studentTalkMax: 7600,
    projectileSpeed: 4.6,
    dragonSpeed: 8.2,
    attackCooldown: 380,
    spawnLives: 3,
    firstPowerUpDelay: 5000,
    powerUpLifetime: 3000,
    powerUpRespawnDelay: 10000,
    firstHeartPowerUpDelay: 7000,
    heartPowerUpLifetime: 3000,
    heartPowerUpRespawnDelay: 10000
};

const state = {
    running: false,
    gameOver: false,
    victory: false,
    currentLevel: 1,
    lastFrame: 0,
    lastAttackAt: 0,
    keys: new Set(),
    obstacles: [],
    students: [],
    projectiles: [],
    effects: [],
    powerUp: null,
    heartPowerUp: null,
    dragonStrike: null,
    nextPowerUpAt: 0,
    nextHeartPowerUpAt: 0,
    gameTimeMs: 0,
    player: null
};

const audioState = {
    context: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    musicIntervalId: null,
    nextMusicTime: 0,
    musicEnabled: false,
    ambientPulseLfo: null,
    speechEnabled: "speechSynthesis" in window
};

const levelConfigs = [
    {
        id: 1,
        projectilesPerShot: 1,
        playerSpawn: { x: 72, y: 90 },
        studentSpawns: [
            { x: 1020, y: 320 },
            { x: 1140, y: 520 },
            { x: 760, y: 120 },
            { x: 590, y: 590 },
            { x: 1040, y: 210 }
        ],
        obstacles: [
            { x: 0, y: 0, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 696, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 0, width: 24, height: 720, type: "wall" },
            { x: 1256, y: 0, width: 24, height: 720, type: "wall" },
            { x: 150, y: 130, width: 134, height: 66, type: "desk" },
            { x: 362, y: 130, width: 134, height: 66, type: "desk" },
            { x: 150, y: 332, width: 134, height: 66, type: "desk" },
            { x: 362, y: 332, width: 134, height: 66, type: "desk" },
            { x: 216, y: 204, width: 42, height: 34, type: "chair" },
            { x: 428, y: 204, width: 42, height: 34, type: "chair" },
            { x: 216, y: 406, width: 42, height: 34, type: "chair" },
            { x: 428, y: 406, width: 42, height: 34, type: "chair" },
            { x: 191, y: 144, width: 56, height: 24, type: "computer" },
            { x: 403, y: 144, width: 56, height: 24, type: "computer" },
            { x: 191, y: 346, width: 56, height: 24, type: "computer" },
            { x: 403, y: 346, width: 56, height: 24, type: "computer" },
            { x: 900, y: 62, width: 244, height: 22, type: "board" },
            { x: 760, y: 248, width: 352, height: 26, type: "wall" },
            { x: 86, y: 610, width: 46, height: 58, type: "plant" },
            { x: 730, y: 490, width: 134, height: 66, type: "desk" },
            { x: 958, y: 490, width: 134, height: 66, type: "desk" },
            { x: 776, y: 574, width: 42, height: 34, type: "chair" },
            { x: 1004, y: 574, width: 42, height: 34, type: "chair" },
            { x: 1188, y: 84, width: 40, height: 48, type: "bin" },
            { x: 760, y: 622, width: 382, height: 22, type: "wall" }
        ]
    },
    {
        id: 2,
        projectilesPerShot: 2,
        playerSpawn: { x: 76, y: 610 },
        studentSpawns: [
            { x: 190, y: 96 },
            { x: 430, y: 112 },
            { x: 812, y: 94 },
            { x: 1080, y: 150 },
            { x: 960, y: 474 },
            { x: 560, y: 602 }
        ],
        obstacles: [
            { x: 0, y: 0, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 696, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 0, width: 24, height: 720, type: "wall" },
            { x: 1256, y: 0, width: 24, height: 720, type: "wall" },
            { x: 118, y: 94, width: 150, height: 68, type: "desk" },
            { x: 366, y: 94, width: 150, height: 68, type: "desk" },
            { x: 184, y: 178, width: 44, height: 34, type: "chair" },
            { x: 432, y: 178, width: 44, height: 34, type: "chair" },
            { x: 160, y: 108, width: 64, height: 26, type: "computer" },
            { x: 408, y: 108, width: 64, height: 26, type: "computer" },
            { x: 690, y: 82, width: 246, height: 22, type: "board" },
            { x: 790, y: 180, width: 234, height: 24, type: "wall" },
            { x: 884, y: 286, width: 144, height: 68, type: "desk" },
            { x: 936, y: 368, width: 42, height: 34, type: "chair" },
            { x: 1112, y: 108, width: 40, height: 48, type: "bin" },
            { x: 270, y: 352, width: 148, height: 24, type: "wall" },
            { x: 116, y: 450, width: 136, height: 66, type: "desk" },
            { x: 344, y: 450, width: 136, height: 66, type: "desk" },
            { x: 162, y: 532, width: 42, height: 34, type: "chair" },
            { x: 390, y: 532, width: 42, height: 34, type: "chair" },
            { x: 88, y: 588, width: 46, height: 58, type: "plant" },
            { x: 664, y: 560, width: 182, height: 24, type: "wall" },
            { x: 916, y: 566, width: 146, height: 72, type: "desk" },
            { x: 966, y: 650, width: 42, height: 34, type: "chair" }
        ]
    }
];

const studentStyles = [
    {
        shirtTop: "#7f8dff",
        shirtBottom: "#5968d9",
        legsTop: "#dfe5ff",
        legsBottom: "#aeb8e7",
        hairTop: "#4a3526",
        hairBottom: "#2e2118"
    },
    {
        shirtTop: "#ff8f7a",
        shirtBottom: "#d96554",
        legsTop: "#ffe0d9",
        legsBottom: "#d9b0a8",
        hairTop: "#3d2b1f",
        hairBottom: "#221711"
    },
    {
        shirtTop: "#66cfa4",
        shirtBottom: "#3f9b78",
        legsTop: "#d7fff0",
        legsBottom: "#9bd4bd",
        hairTop: "#3c302b",
        hairBottom: "#1f1815"
    },
    {
        shirtTop: "#f1c96b",
        shirtBottom: "#d39d2e",
        legsTop: "#fff0cf",
        legsBottom: "#d9c08d",
        hairTop: "#6a4a2f",
        hairBottom: "#402a18"
    },
    {
        shirtTop: "#ca89ff",
        shirtBottom: "#9258cf",
        legsTop: "#f0ddff",
        legsBottom: "#c5a7e4",
        hairTop: "#2c2322",
        hairBottom: "#120f0f"
    }
];

const studentMessages = [
    "non studio!",
    "che schifo Aulab",
    "quando c'era lui"
];

const musicLeadPattern = [
    261.63, 329.63, 392.0, 329.63,
    293.66, 349.23, 440.0, 349.23
];

const musicBassPattern = [
    130.81, 130.81, 146.83, 146.83,
    164.81, 164.81, 146.83, 146.83
];

function init() {
    bindEvents();
    resetGame();
    updateGameScale();
    requestAnimationFrame(gameLoop);
}

function bindEvents() {
    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", () => {
        resetGame();
        startGame();
    });

    window.addEventListener("keydown", (event) => {
        const key = normalizeKey(event.key);

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key) || ["w", "a", "s", "d"].includes(key)) {
            event.preventDefault();
        }

        if (key === "space") {
            if (!event.repeat) {
                attack();
            }
            return;
        }

        state.keys.add(key);
    });

    window.addEventListener("keyup", (event) => {
        state.keys.delete(normalizeKey(event.key));
    });

    window.addEventListener("resize", updateGameScale);
}

function normalizeKey(key) {
    const lower = key.toLowerCase();
    const aliases = {
        arrowup: "up",
        arrowdown: "down",
        arrowleft: "left",
        arrowright: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
        " ": "space"
    };

    return aliases[lower] || lower;
}

function createObstacles(layout) {
    clearObstacles();

    layout.forEach((config) => {
        const element = document.createElement("div");
        element.className = `obstacle ${config.type}`;
        setRectStyles(element, config);
        gameArea.appendChild(element);
        state.obstacles.push({ ...config, element });
    });
}

function clearObstacles() {
    state.obstacles.forEach((obstacle) => obstacle.element.remove());
    state.obstacles = [];
}

function resetGame() {
    clearEntities();
    stopStudentSpeech();

    state.running = false;
    state.gameOver = false;
    state.victory = false;
    state.currentLevel = 1;
    state.lastAttackAt = 0;
    state.gameTimeMs = 0;
    state.nextPowerUpAt = GAME.firstPowerUpDelay;
    state.nextHeartPowerUpAt = GAME.firstHeartPowerUpDelay;
    buildLevel(state.currentLevel, true);
    updateHud();

    startOverlay.classList.remove("d-none");
    endOverlay.classList.add("d-none");
}

function clearEntities() {
    state.students.forEach((student) => {
        if (student.speechTimeoutId) {
            window.clearTimeout(student.speechTimeoutId);
            student.speechTimeoutId = null;
        }
    });

    [state.player, ...state.students, ...state.projectiles, ...state.effects, state.powerUp, state.heartPowerUp, state.dragonStrike]
        .filter(Boolean)
        .forEach((entity) => entity.element.remove());

    state.students = [];
    state.projectiles = [];
    state.effects = [];
    state.powerUp = null;
    state.heartPowerUp = null;
    state.dragonStrike = null;
}

function clearLevelActors(keepPlayer = true) {
    state.students.forEach((student) => {
        if (student.speechTimeoutId) {
            window.clearTimeout(student.speechTimeoutId);
            student.speechTimeoutId = null;
        }
    });

    const entitiesToRemove = [
        ...(keepPlayer ? [] : [state.player]),
        ...state.students,
        ...state.projectiles,
        ...state.effects,
        state.powerUp,
        state.heartPowerUp,
        state.dragonStrike
    ];

    entitiesToRemove
        .filter(Boolean)
        .forEach((entity) => entity.element.remove());

    state.students = [];
    state.projectiles = [];
    state.effects = [];
    state.powerUp = null;
    state.heartPowerUp = null;
    state.dragonStrike = null;
}

function getCurrentLevelConfig() {
    return levelConfigs.find((level) => level.id === state.currentLevel) || levelConfigs[0];
}

function buildLevel(levelNumber, resetPlayerLives = false) {
    state.currentLevel = levelNumber;
    const level = getCurrentLevelConfig();
    createObstacles(level.obstacles);

    if (!state.player) {
        state.player = createPlayer(level.playerSpawn, resetPlayerLives);
    } else {
        repositionPlayer(level.playerSpawn);
        if (resetPlayerLives) {
            state.player.lives = GAME.spawnLives;
            state.player.invulnerableUntil = 0;
        }
    }

    state.students = level.studentSpawns.map((spawn, index) => createStudent(spawn, index));
}

function createPlayer(spawn, resetPlayerLives = false) {
    const element = document.createElement("div");
    const figure = document.createElement("div");
    const face = document.createElement("span");
    const torso = document.createElement("span");
    const armLeft = document.createElement("span");
    const armRight = document.createElement("span");
    const legLeft = document.createElement("span");
    const legRight = document.createElement("span");
    const hammer = document.createElement("span");
    const hammerHead = document.createElement("span");

    figure.className = "player-figure";
    face.className = "player-face";
    torso.className = "player-body";
    armLeft.className = "player-arm arm-left";
    armRight.className = "player-arm arm-right";
    legLeft.className = "player-leg leg-left";
    legRight.className = "player-leg leg-right";
    hammer.className = "player-hammer";
    hammerHead.className = "player-hammer-head";

    hammer.appendChild(hammerHead);
    figure.append(face, torso, armLeft, armRight, legLeft, legRight, hammer);
    element.appendChild(figure);

    const player = {
        x: spawn.x,
        y: spawn.y,
        width: 62,
        height: 74,
        lives: resetPlayerLives ? GAME.spawnLives : GAME.spawnLives,
        direction: "right",
        invulnerableUntil: 0,
        attackEndsAt: 0,
        element
    };

    placeEntityInFreeSpot(player);
    player.element.className = "entity player";
    updatePlayerVisual(player, false);
    gameArea.appendChild(player.element);
    syncEntity(player);
    return player;
}

function repositionPlayer(spawn) {
    state.player.x = spawn.x;
    state.player.y = spawn.y;
    state.player.direction = "right";
    state.player.attackEndsAt = 0;
    state.player.invulnerableUntil = 0;
    state.player.element.classList.remove("attacking", "flash-damage");
    placeEntityInFreeSpot(state.player);
    syncEntity(state.player);
}

function createStudent(spawn, index) {
    const element = document.createElement("div");
    const figure = document.createElement("div");
    const head = document.createElement("span");
    const body = document.createElement("span");
    const armLeft = document.createElement("span");
    const armRight = document.createElement("span");
    const legLeft = document.createElement("span");
    const legRight = document.createElement("span");
    const stone = document.createElement("span");

    figure.className = "student-figure";
    head.className = "student-head";
    body.className = "student-body";
    armLeft.className = "student-arm arm-left";
    armRight.className = "student-arm arm-right";
    legLeft.className = "student-leg leg-left";
    legRight.className = "student-leg leg-right";
    stone.className = "student-hand-stone";

    figure.append(head, body, armLeft, armRight, legLeft, legRight, stone);
    element.appendChild(figure);

    const student = {
        id: `student-${index}`,
        x: spawn.x,
        y: spawn.y,
        width: 52,
        height: 60,
        projectilesPerShot: getCurrentLevelConfig().projectilesPerShot,
        direction: "left",
        fleeTimer: Math.random() * 60,
        shotTimer: 70 + Math.random() * 140,
        talkTimer: randomBetween(GAME.studentTalkMin, GAME.studentTalkMax),
        wanderTimer: 0,
        wanderVector: { x: 0, y: 0 },
        isThrowing: false,
        throwReleaseAt: 0,
        speechTimeoutId: null,
        element
    };

    const palette = studentStyles[index % studentStyles.length];
    element.style.setProperty("--student-shirt-top", palette.shirtTop);
    element.style.setProperty("--student-shirt-bottom", palette.shirtBottom);
    element.style.setProperty("--student-legs-top", palette.legsTop);
    element.style.setProperty("--student-legs-bottom", palette.legsBottom);
    element.style.setProperty("--student-hair-top", palette.hairTop);
    element.style.setProperty("--student-hair-bottom", palette.hairBottom);

    placeEntityInFreeSpot(student);
    student.element.className = "entity student";
    gameArea.appendChild(student.element);
    updateStudentVisual(student, false);
    syncEntity(student);
    return student;
}

function startGame() {
    unlockAudio();
    state.running = true;
    state.gameOver = false;
    state.victory = false;
    state.lastFrame = performance.now();
    startOverlay.classList.add("d-none");
    endOverlay.classList.add("d-none");
    startBackgroundMusic();
}

function gameLoop(timestamp) {
    // Delta normalizzato per mantenere un movimento coerente anche se il frame rate varia.
    const frameDeltaMs = state.lastFrame ? Math.max(timestamp - state.lastFrame, 0) : 16.67;
    const delta = Math.min(frameDeltaMs / 16.67 || 1, 1.4);
    state.lastFrame = timestamp;

    if (state.running) {
        state.gameTimeMs += Math.min(frameDeltaMs, 50);
        updatePlayer(delta, timestamp);
        updateStudents(delta, timestamp);
        updateProjectiles(delta, timestamp);
        updatePowerUps(delta);
        checkEndConditions();
        updateHud();
    }

    requestAnimationFrame(gameLoop);
}

function updatePlayer(delta, timestamp) {
    const movement = getInputVector();
    const stepX = movement.x * GAME.playerSpeed * delta;
    const stepY = movement.y * GAME.playerSpeed * delta;
    const isMoving = movement.x !== 0 || movement.y !== 0;

    if (isMoving) {
        state.player.direction = getDirectionFromVector(movement);
    }

    updatePlayerVisual(state.player, isMoving);
    moveWithCollisions(state.player, stepX, stepY);

    if (timestamp < state.player.invulnerableUntil) {
        state.player.element.classList.add("flash-damage");
    } else {
        state.player.element.classList.remove("flash-damage");
    }

    if (state.player.attackEndsAt && timestamp >= state.player.attackEndsAt) {
        state.player.attackEndsAt = 0;
        state.player.element.classList.remove("attacking");
    }
}

function getInputVector() {
    let x = 0;
    let y = 0;

    if (state.keys.has("left")) {
        x -= 1;
    }
    if (state.keys.has("right")) {
        x += 1;
    }
    if (state.keys.has("up")) {
        y -= 1;
    }
    if (state.keys.has("down")) {
        y += 1;
    }

    return normalizeVector(x, y);
}

function updateStudents(delta) {
    state.students.forEach((student) => {
        const dx = centerOf(student).x - centerOf(state.player).x;
        const dy = centerOf(student).y - centerOf(state.player).y;
        const distance = Math.hypot(dx, dy);
        const fleeMode = distance < 220;
        const now = performance.now();
        let vector;

        // Quando Donato si avvicina, lo studente prova a scappare; altrimenti vaga nell'ufficio.
        if (fleeMode) {
            vector = normalizeVector(dx, dy);
            student.element.classList.add("coward");
        } else {
            student.element.classList.remove("coward");
            vector = getStudentWanderVector(student);
        }

        student.direction = getDirectionFromVector(vector);
        updateStudentVisual(student, vector.x !== 0 || vector.y !== 0);
        moveWithCollisions(student, vector.x * GAME.studentSpeed * delta, vector.y * GAME.studentSpeed * delta);

        student.fleeTimer -= delta;
        student.shotTimer -= delta;
        student.talkTimer -= delta * 16.67;

        if (student.isThrowing && now >= student.throwReleaseAt) {
            student.isThrowing = false;
            student.element.classList.remove("throwing");
            throwStone(student);
            student.shotTimer = 105 + Math.random() * 120;
        }

        if (!student.isThrowing && student.shotTimer <= 0 && hasLineOfSight(student, state.player)) {
            beginThrow(student, now);
        }

        if (student.fleeTimer <= 0) {
            student.fleeTimer = 30 + Math.random() * 50;
            student.wanderTimer = 0;
        }

        if (student.talkTimer <= 0) {
            student.talkTimer = randomBetween(GAME.studentTalkMin, GAME.studentTalkMax);
            speakStudent(student);
        }
    });
}

function getStudentWanderVector(student) {
    student.wanderTimer -= 1;

    if (student.wanderTimer <= 0) {
        student.wanderTimer = 30 + Math.random() * 70;
        student.wanderVector = normalizeVector(Math.random() * 2 - 1, Math.random() * 2 - 1);
    }

    return student.wanderVector;
}

function hasLineOfSight(source, target) {
    const sourceCenter = centerOf(source);
    const targetCenter = centerOf(target);
    const sightRect = {
        x: Math.min(sourceCenter.x, targetCenter.x),
        y: Math.min(sourceCenter.y, targetCenter.y),
        width: Math.abs(sourceCenter.x - targetCenter.x) || 1,
        height: Math.abs(sourceCenter.y - targetCenter.y) || 1
    };

    return !state.obstacles.some((obstacle) => rectsIntersect(expandRect(sightRect, 8), obstacle));
}

function throwStone(student) {
    const source = centerOf(student);
    const target = centerOf(state.player);
    const vector = normalizeVector(target.x - source.x, target.y - source.y);
    const perpendicular = { x: -vector.y, y: vector.x };
    const totalProjectiles = student.projectilesPerShot || 1;

    for (let index = 0; index < totalProjectiles; index += 1) {
        const spreadOffset = totalProjectiles === 1 ? 0 : index === 0 ? -9 : 9;
        const projectile = {
            x: source.x - 7 + perpendicular.x * spreadOffset,
            y: source.y - 7 + perpendicular.y * spreadOffset,
            width: 14,
            height: 14,
            velocityX: vector.x * GAME.projectileSpeed,
            velocityY: vector.y * GAME.projectileSpeed,
            ownerId: student.id,
            element: document.createElement("div")
        };

        projectile.element.className = "projectile";
        gameArea.appendChild(projectile.element);
        syncEntity(projectile);
        state.projectiles.push(projectile);
    }
}

function beginThrow(student, now) {
    student.isThrowing = true;
    student.throwReleaseAt = now + 220;
    student.element.classList.add("throwing");
}

function updateProjectiles(delta, timestamp) {
    const nextProjectiles = [];

    state.projectiles.forEach((projectile) => {
        projectile.x += projectile.velocityX * delta;
        projectile.y += projectile.velocityY * delta;
        syncEntity(projectile);

        const outsideArena =
            projectile.x < 0 ||
            projectile.y < 0 ||
            projectile.x + projectile.width > GAME.width ||
            projectile.y + projectile.height > GAME.height;

        const hitsObstacle = state.obstacles.some((obstacle) => rectsIntersect(projectile, obstacle));

        if (outsideArena || hitsObstacle) {
            projectile.element.remove();
            return;
        }

        const playerCanBeHit = timestamp >= state.player.invulnerableUntil;
        if (playerCanBeHit && rectsIntersect(projectile, state.player)) {
            projectile.element.remove();
            damagePlayer();
            createHitEffect(projectile.x - 20, projectile.y - 20);
            return;
        }

        nextProjectiles.push(projectile);
    });

    state.projectiles = nextProjectiles;
}

function updatePowerUps(delta) {
    if (!state.powerUp && !state.dragonStrike && state.gameTimeMs >= state.nextPowerUpAt && state.students.length > 0) {
        spawnCoffeePowerUp();
    }

    if (
        state.player.lives < GAME.spawnLives &&
        !state.heartPowerUp &&
        state.gameTimeMs >= state.nextHeartPowerUpAt
    ) {
        spawnHeartPowerUp();
    }

    if (state.powerUp && rectsIntersect(state.powerUp, state.player)) {
        collectCoffeePowerUp();
    } else if (state.powerUp) {
        const remainingMs = Math.max(0, state.powerUp.expiresAt - state.gameTimeMs);
        const secondsLeft = Math.ceil(remainingMs / 1000);
        state.powerUp.counter.textContent = `${secondsLeft}`;

        if (remainingMs <= 0) {
            expireCoffeePowerUp();
        }
    }

    if (state.heartPowerUp && rectsIntersect(state.heartPowerUp, state.player)) {
        collectHeartPowerUp();
    } else if (state.heartPowerUp) {
        const remainingMs = Math.max(0, state.heartPowerUp.expiresAt - state.gameTimeMs);
        const secondsLeft = Math.ceil(remainingMs / 1000);
        state.heartPowerUp.counter.textContent = `${secondsLeft}`;

        if (remainingMs <= 0) {
            expireHeartPowerUp();
        }
    }

    if (state.dragonStrike) {
        updateDragonStrike(delta);
    }
}

function attack() {
    const now = performance.now();
    if (!state.running || now - state.lastAttackAt < GAME.attackCooldown) {
        return;
    }

    playHammerSound();
    state.lastAttackAt = now;
    state.player.attackEndsAt = now + 220;
    state.player.element.classList.add("attacking");
    const attackZone = getAttackZone();
    createSwingEffect(attackZone);

    const survivors = [];
    state.students.forEach((student) => {
        if (rectsIntersect(attackZone, student)) {
            createHitEffect(student.x - 18, student.y - 18);
            student.element.remove();
            return;
        }

        survivors.push(student);
    });

    state.students = survivors;
}

function getAttackZone() {
    const offset = 58;
    const zone = {
        x: state.player.x,
        y: state.player.y,
        width: 82,
        height: 82
    };

    if (state.player.direction === "up") {
        zone.x -= 10;
        zone.y -= offset;
    } else if (state.player.direction === "down") {
        zone.x -= 10;
        zone.y += 28;
    } else if (state.player.direction === "left") {
        zone.x -= offset;
        zone.y -= 6;
    } else {
        zone.x += 26;
        zone.y -= 6;
    }

    return zone;
}

function createSwingEffect(zone) {
    const effect = document.createElement("div");
    effect.className = "hammer-swing";
    effect.style.left = `${zone.x}px`;
    effect.style.top = `${zone.y + 22}px`;

    if (state.player.direction === "up" || state.player.direction === "down") {
        effect.style.transform = "rotate(90deg)";
    }

    gameArea.appendChild(effect);
    window.setTimeout(() => effect.remove(), 180);
}

function createHitEffect(x, y) {
    const effect = {
        element: document.createElement("div")
    };

    effect.element.className = "effect";
    effect.element.style.left = `${x}px`;
    effect.element.style.top = `${y}px`;
    gameArea.appendChild(effect.element);
    state.effects.push(effect);

    window.setTimeout(() => {
        effect.element.remove();
        state.effects = state.effects.filter((entry) => entry !== effect);
    }, 220);
}

function createFlameEffect(x, y) {
    const effect = {
        element: document.createElement("div")
    };

    effect.element.className = "effect flame-effect";
    effect.element.style.left = `${x}px`;
    effect.element.style.top = `${y}px`;
    gameArea.appendChild(effect.element);
    state.effects.push(effect);

    window.setTimeout(() => {
        effect.element.remove();
        state.effects = state.effects.filter((entry) => entry !== effect);
    }, 520);
}

function damagePlayer() {
    state.player.lives -= 1;
    state.player.invulnerableUntil = performance.now() + 1000;
    playPlayerHitSound();
}

function moveWithCollisions(entity, stepX, stepY) {
    // Risolviamo X e Y separatamente per evitare che i personaggi attraversino gli ostacoli in diagonale.
    entity.x += stepX;
    entity.x = clamp(entity.x, 24, GAME.width - entity.width - 24);

    if (hitsObstacle(entity)) {
        entity.x -= stepX;
    }

    entity.y += stepY;
    entity.y = clamp(entity.y, 24, GAME.height - entity.height - 24);

    if (hitsObstacle(entity)) {
        entity.y -= stepY;
    }

    syncEntity(entity);
}

function placeEntityInFreeSpot(entity) {
    if (!hitsObstacle(entity)) {
        return;
    }

    const originX = entity.x;
    const originY = entity.y;
    const maxRadius = 220;
    const step = 12;

    for (let radius = step; radius <= maxRadius; radius += step) {
        for (let angle = 0; angle < 360; angle += 30) {
            const radians = angle * (Math.PI / 180);
            entity.x = clamp(originX + Math.cos(radians) * radius, 24, GAME.width - entity.width - 24);
            entity.y = clamp(originY + Math.sin(radians) * radius, 24, GAME.height - entity.height - 24);

            if (!hitsObstacle(entity)) {
                return;
            }
        }
    }

    entity.x = clamp(originX, 24, GAME.width - entity.width - 24);
    entity.y = clamp(originY, 24, GAME.height - entity.height - 24);
}

function placePowerUpInFreeSpot(entity) {
    const safeMargin = 58;
    const minX = safeMargin;
    const minY = safeMargin;
    const maxX = GAME.width - entity.width - safeMargin;
    const maxY = GAME.height - entity.height - safeMargin;

    for (let attempts = 0; attempts < 80; attempts += 1) {
        entity.x = Math.random() * (maxX - minX) + minX;
        entity.y = Math.random() * (maxY - minY) + minY;

        const overlapsActor =
            rectsIntersect(entity, state.player) ||
            state.students.some((student) => rectsIntersect(entity, student));
        const overlapsOtherPowerUp =
            (state.powerUp && rectsIntersect(entity, state.powerUp)) ||
            (state.heartPowerUp && rectsIntersect(entity, state.heartPowerUp));

        if (!hitsObstacle(entity) && !overlapsActor && !overlapsOtherPowerUp) {
            return;
        }
    }

    entity.x = minX;
    entity.y = minY;
}

function hitsObstacle(entity) {
    return state.obstacles.some((obstacle) => rectsIntersect(entity, obstacle));
}

function checkEndConditions() {
    if (state.player.lives <= 0) {
        finishGame(false);
        return;
    }

    if (state.students.length === 0) {
        if (state.currentLevel < levelConfigs.length) {
            advanceToNextLevel();
            return;
        }

        finishGame(true);
    }
}

function advanceToNextLevel() {
    clearLevelActors(true);
    stopStudentSpeech();
    state.lastAttackAt = 0;
    state.gameTimeMs = 0;
    state.nextPowerUpAt = GAME.firstPowerUpDelay;
    state.nextHeartPowerUpAt = GAME.firstHeartPowerUpDelay;
    buildLevel(state.currentLevel + 1, false);
}

function spawnCoffeePowerUp() {
    const counter = document.createElement("span");
    const icon = document.createElement("span");
    const powerUp = {
        x: 0,
        y: 0,
        width: 28,
        height: 28,
        expiresAt: state.gameTimeMs + GAME.powerUpLifetime,
        counter,
        element: document.createElement("div")
    };

    powerUp.element.className = "coffee-powerup";
    icon.className = "coffee-powerup-icon";
    counter.className = "coffee-powerup-counter";
    counter.textContent = "3";
    powerUp.element.append(counter, icon);
    placePowerUpInFreeSpot(powerUp);
    gameArea.appendChild(powerUp.element);
    syncEntity(powerUp);
    state.powerUp = powerUp;
}

function spawnHeartPowerUp() {
    const counter = document.createElement("span");
    const icon = document.createElement("span");
    const heartPowerUp = {
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        expiresAt: state.gameTimeMs + GAME.heartPowerUpLifetime,
        counter,
        element: document.createElement("div")
    };

    heartPowerUp.element.className = "heart-powerup";
    icon.className = "heart-powerup-icon";
    counter.className = "coffee-powerup-counter";
    counter.textContent = "3";
    heartPowerUp.element.append(counter, icon);
    placePowerUpInFreeSpot(heartPowerUp);
    gameArea.appendChild(heartPowerUp.element);
    syncEntity(heartPowerUp);
    state.heartPowerUp = heartPowerUp;
}

function collectCoffeePowerUp() {
    if (!state.powerUp || state.students.length === 0) {
        return;
    }

    const origin = centerOf(state.powerUp);
    state.powerUp.element.remove();
    state.powerUp = null;
    playPowerUpSound();
    launchDragonStrike(origin);
    state.nextPowerUpAt = state.gameTimeMs + GAME.powerUpRespawnDelay;
}

function expireCoffeePowerUp() {
    if (!state.powerUp) {
        return;
    }

    state.powerUp.element.remove();
    state.powerUp = null;
    state.nextPowerUpAt = state.gameTimeMs + GAME.powerUpRespawnDelay;
}

function collectHeartPowerUp() {
    if (!state.heartPowerUp || state.player.lives >= GAME.spawnLives) {
        return;
    }

    state.heartPowerUp.element.remove();
    state.heartPowerUp = null;
    state.player.lives = Math.min(GAME.spawnLives, state.player.lives + 1);
    playHealSound();
    state.nextHeartPowerUpAt = state.gameTimeMs + GAME.heartPowerUpRespawnDelay;
}

function expireHeartPowerUp() {
    if (!state.heartPowerUp) {
        return;
    }

    state.heartPowerUp.element.remove();
    state.heartPowerUp = null;
    state.nextHeartPowerUpAt = state.gameTimeMs + GAME.heartPowerUpRespawnDelay;
}

function launchDragonStrike(origin) {
    const image = document.createElement("img");
    const strike = {
        x: origin.x - 48,
        y: origin.y - 48,
        width: 96,
        height: 96,
        targetId: pickDragonTargetId(),
        image,
        element: document.createElement("div")
    };

    strike.element.className = "dragon-strike";
    image.className = "dragon-strike-image";
    image.src = "./assets/charizard.png";
    image.alt = "Charizard strike";
    strike.element.appendChild(image);
    gameArea.appendChild(strike.element);
    syncEntity(strike);
    state.dragonStrike = strike;
}

function updateDragonStrike(delta) {
    const target = getStudentById(state.dragonStrike.targetId) || state.students[0];

    if (!target) {
        state.dragonStrike.element.remove();
        state.dragonStrike = null;
        return;
    }

    state.dragonStrike.targetId = target.id;
    const strikeCenter = centerOf(state.dragonStrike);
    const targetCenter = centerOf(target);
    const vector = normalizeVector(targetCenter.x - strikeCenter.x, targetCenter.y - strikeCenter.y);

    state.dragonStrike.x += vector.x * GAME.dragonSpeed * delta;
    state.dragonStrike.y += vector.y * GAME.dragonSpeed * delta;
    state.dragonStrike.image.style.transform = vector.x < 0 ? "scaleX(-1)" : "scaleX(1)";
    syncEntity(state.dragonStrike);

    if (rectsIntersect(expandRect(state.dragonStrike, -28), target)) {
        burnStudent(target);
        state.dragonStrike.element.remove();
        state.dragonStrike = null;
    }
}

function burnStudent(target) {
    if (target.speechTimeoutId) {
        window.clearTimeout(target.speechTimeoutId);
        target.speechTimeoutId = null;
    }
    target.element.classList.add("burning");
    target.element.classList.remove("speaking");
    const oldBubble = target.element.querySelector(".speech-bubble");
    if (oldBubble) {
        oldBubble.remove();
    }
    createFlameEffect(target.x - 8, target.y - 10);

    window.setTimeout(() => {
        target.element.remove();
        state.students = state.students.filter((student) => student !== target);
    }, 320);
}

function pickDragonTargetId() {
    const target = state.students[Math.floor(Math.random() * state.students.length)];
    return target ? target.id : "";
}

function getStudentById(id) {
    return state.students.find((student) => student.id === id) || null;
}

function speakStudent(student) {
    if (!student || student.element.classList.contains("burning")) {
        return;
    }

    const previousBubble = student.element.querySelector(".speech-bubble");
    if (previousBubble) {
        previousBubble.remove();
    }

    if (student.speechTimeoutId) {
        window.clearTimeout(student.speechTimeoutId);
    }

    const bubble = document.createElement("div");
    bubble.className = "speech-bubble";
    const message = studentMessages[Math.floor(Math.random() * studentMessages.length)];
    bubble.textContent = message;
    student.element.appendChild(bubble);
    student.element.classList.add("speaking");
    speakStudentLine(message);

    student.speechTimeoutId = window.setTimeout(() => {
        bubble.remove();
        student.element.classList.remove("speaking");
        student.speechTimeoutId = null;
    }, 1700);
}

function finishGame(isVictory) {
    state.running = false;
    state.gameOver = !isVictory;
    state.victory = isVictory;
    stopBackgroundMusic();
    stopStudentSpeech();
    if (!isVictory) {
        playGameOverSound();
    }
    endOverlay.classList.remove("d-none");
    endEyebrow.textContent = isVictory ? "Arena ripulita" : "Missione fallita";
    endTitle.textContent = isVictory ? "Vittoria" : "Game Over";
    endMessage.textContent = isVictory
        ? "Valerio ha rimesso tutti a studiare. L'ufficio Aulab e' di nuovo sotto controllo."
        : "Le pietre hanno fermato Valerio. Riprova e libera l'ufficio dagli studenti svogliati.";
}

function updateHud() {
    renderLives(state.player.lives);
    studentsValue.textContent = state.students.length;
}

function renderLives(currentLives) {
    const maxLives = GAME.spawnLives;
    livesValue.innerHTML = "";

    for (let index = 0; index < maxLives; index += 1) {
        const heart = document.createElement("span");
        heart.className = `heart${index < currentLives ? "" : " empty"}`;
        livesValue.appendChild(heart);
    }
}

function updateGameScale() {
    const viewportWidth = gameViewport.clientWidth;
    const viewportHeight = gameViewport.clientHeight;
    const horizontalPadding = 12;
    const verticalPadding = 12;
    const scale = Math.min(
        (viewportWidth - horizontalPadding) / GAME.width,
        (viewportHeight - verticalPadding) / GAME.height,
        1
    );
    const safeScale = Math.max(scale, 0.1);

    gameStage.style.width = `${GAME.width * safeScale}px`;
    gameStage.style.height = `${GAME.height * safeScale}px`;
    gameArea.style.transform = `scale(${safeScale})`;
}

function syncEntity(entity) {
    entity.element.style.transform = `translate(${entity.x}px, ${entity.y}px)`;
}

function updateStudentVisual(student, isMoving) {
    student.element.classList.toggle("running", isMoving);
    student.element.classList.remove("dir-up", "dir-down", "dir-left", "dir-right");
    student.element.classList.add(`dir-${student.direction}`);
}

function updatePlayerVisual(player, isMoving) {
    player.element.classList.toggle("running", isMoving);
    player.element.classList.remove("dir-up", "dir-down", "dir-left", "dir-right");
    player.element.classList.add(`dir-${player.direction}`);
}

function setRectStyles(element, rect) {
    element.style.left = `${rect.x}px`;
    element.style.top = `${rect.y}px`;
    element.style.width = `${rect.width}px`;
    element.style.height = `${rect.height}px`;
}

function rectsIntersect(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function centerOf(entity) {
    return {
        x: entity.x + entity.width / 2,
        y: entity.y + entity.height / 2
    };
}

function expandRect(rect, amount) {
    return {
        x: rect.x - amount,
        y: rect.y - amount,
        width: rect.width + amount * 2,
        height: rect.height + amount * 2
    };
}

function normalizeVector(x, y) {
    const length = Math.hypot(x, y);

    if (!length) {
        return { x: 0, y: 0 };
    }

    return {
        x: x / length,
        y: y / length
    };
}

function getDirectionFromVector(vector) {
    if (vector.x === 0 && vector.y === 0) {
        return state.player ? state.player.direction : "right";
    }

    if (Math.abs(vector.x) > Math.abs(vector.y)) {
        return vector.x >= 0 ? "right" : "left";
    }

    return vector.y >= 0 ? "down" : "up";
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function unlockAudio() {
    if (!audioState.context) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            return;
        }

        audioState.context = new AudioContextClass();
        audioState.masterGain = audioState.context.createGain();
        audioState.musicGain = audioState.context.createGain();
        audioState.sfxGain = audioState.context.createGain();
        audioState.masterGain.gain.value = 0.82;
        audioState.musicGain.gain.value = 0.18;
        audioState.sfxGain.gain.value = 0.24;
        audioState.musicGain.connect(audioState.masterGain);
        audioState.sfxGain.connect(audioState.masterGain);
        audioState.masterGain.connect(audioState.context.destination);
    }

    if (audioState.context.state === "suspended") {
        audioState.context.resume();
    }
}

function startBackgroundMusic() {
    if (!audioState.context || audioState.musicEnabled) {
        return;
    }

    audioState.musicEnabled = true;
    audioState.nextMusicTime = audioState.context.currentTime + 0.05;
    scheduleMusicChunk();
    audioState.musicIntervalId = window.setInterval(scheduleMusicChunk, 900);
}

function stopBackgroundMusic() {
    if (!audioState.musicEnabled) {
        return;
    }

    audioState.musicEnabled = false;
    if (audioState.musicIntervalId) {
        window.clearInterval(audioState.musicIntervalId);
        audioState.musicIntervalId = null;
    }
}

function scheduleMusicChunk() {
    if (!audioState.context || !audioState.musicEnabled) {
        return;
    }

    const ctx = audioState.context;
    const lookAhead = 1.6;
    const stepDuration = 0.34;
    let stepIndex = Math.floor(audioState.nextMusicTime / stepDuration) % musicLeadPattern.length;

    while (audioState.nextMusicTime < ctx.currentTime + lookAhead) {
        scheduleLeadNote(audioState.nextMusicTime, musicLeadPattern[stepIndex]);
        scheduleBassNote(audioState.nextMusicTime, musicBassPattern[stepIndex]);
        audioState.nextMusicTime += stepDuration;
        stepIndex = (stepIndex + 1) % musicLeadPattern.length;
    }
}

function scheduleLeadNote(time, frequency) {
    const osc = audioState.context.createOscillator();
    const gain = audioState.context.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.06, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);
    osc.connect(gain);
    gain.connect(audioState.musicGain);
    osc.start(time);
    osc.stop(time + 0.3);
}

function scheduleBassNote(time, frequency) {
    const osc = audioState.context.createOscillator();
    const gain = audioState.context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.05, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);
    osc.connect(gain);
    gain.connect(audioState.musicGain);
    osc.start(time);
    osc.stop(time + 0.34);
}

function playHammerSound() {
    playToneBurst({
        frequencies: [180, 130],
        duration: 0.12,
        type: "square",
        peakGain: 0.12
    });
}

function playPowerUpSound() {
    playToneBurst({
        frequencies: [392, 523.25, 659.25],
        duration: 0.42,
        type: "triangle",
        peakGain: 0.11,
        stagger: 0.05
    });
}

function playHealSound() {
    playToneBurst({
        frequencies: [523.25, 659.25, 783.99],
        duration: 0.34,
        type: "sine",
        peakGain: 0.1,
        stagger: 0.04
    });
}

function playPlayerHitSound() {
    playToneBurst({
        frequencies: [220, 180],
        duration: 0.2,
        type: "sawtooth",
        peakGain: 0.1,
        slideTo: 120
    });
}

function playGameOverSound() {
    playToneBurst({
        frequencies: [329.63, 246.94, 196],
        duration: 0.95,
        type: "triangle",
        peakGain: 0.12,
        stagger: 0.12,
        slideTo: 164.81
    });
}

function playToneBurst(options) {
    if (!audioState.context) {
        return;
    }

    const {
        frequencies,
        duration,
        type,
        peakGain,
        stagger = 0,
        slideTo = null
    } = options;

    const ctx = audioState.context;
    frequencies.forEach((frequency, index) => {
        const startTime = ctx.currentTime + stagger * index;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, startTime);
        if (slideTo) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 40), startTime + duration);
        }
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(audioState.sfxGain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.03);
    });
}

function speakStudentLine(message) {
    if (!audioState.speechEnabled || !state.running) {
        return;
    }

    const synth = window.speechSynthesis;
    if (!synth) {
        return;
    }

    if (synth.pending) {
        synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "it-IT";
    utterance.rate = 1.02;
    utterance.pitch = 1.18;
    utterance.volume = 0.85;
    synth.speak(utterance);
}

function stopStudentSpeech() {
    if (audioState.speechEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

init();
