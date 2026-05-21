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

// Nuovi elementi DOM per la gestione del Docente
const addTeacherBtn = document.getElementById("addTeacherBtn");
const teacherModal = document.getElementById("teacherModal");
const addTeacherForm = document.getElementById("addTeacherForm");
const teacherNameInput = document.getElementById("teacherName");
const teacherImageFile = document.getElementById("teacherImageFile");
const teacherImageUrl = document.getElementById("teacherImageUrl");
const imagePreview = document.getElementById("imagePreview");
const teacherToolInput = document.getElementById("teacherTool");
const teacherToolStyleSelect = document.getElementById("teacherToolStyle");
const closeTeacherModal = document.getElementById("closeTeacherModal");
const teacherCardsContainer = document.getElementById("teacherCards");
const startDescription = document.getElementById("startDescription");

// Nuovi elementi DOM per la gestione dell'Hackademy
const addHackademyBtn = document.getElementById("addHackademyBtn");
const hackademyModal = document.getElementById("hackademyModal");
const addHackademyForm = document.getElementById("addHackademyForm");
const hackademyNameInput = document.getElementById("hackademyName");
const hackademyStudentsCountInput = document.getElementById("hackademyStudentsCount");
const closeHackademyModal = document.getElementById("closeHackademyModal");
const hackademyPillsContainer = document.getElementById("hackademyPills");

const muteBtn = document.getElementById("muteBtn");
const intermissionOverlay = document.getElementById("intermissionOverlay");
const intermissionTitle = document.getElementById("intermissionTitle");
const intermissionMessage = document.getElementById("intermissionMessage");
const intermissionButton = document.getElementById("intermissionButton");
const levelValue = document.getElementById("levelValue");
const resumeButton = document.getElementById("resumeButton");
const savedLevelNum = document.getElementById("savedLevelNum");
const menuButton = document.getElementById("menuButton");

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

const defaultTeachers = [
    {
        id: "valerio",
        name: "Valerio",
        image: "./assets/player-face.png",
        tool: "martello di gomma",
        toolStyle: "hammer"
    }
];

const defaultHackademies = [
    {
        id: "standard",
        name: "Standard",
        studentsCount: 5
    }
];

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
    player: null,
    teachers: [],
    selectedTeacherId: "valerio",
    hackademies: [],
    selectedHackademyId: "standard",
    boss: null,
    campfireElement: null,
    summoningActive: false,
    summoningTimer: 0,
    lastRumbleAt: 0,
    currentScale: 1
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
    speechEnabled: "speechSynthesis" in window,
    muted: false
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
    },
    {
        id: 3,
        projectilesPerShot: 3,
        playerSpawn: { x: 80, y: 320 },
        studentSpawns: [
            { x: 520, y: 340 },
            { x: 680, y: 340 },
            { x: 600, y: 240 },
            { x: 600, y: 420 }
        ],
        obstacles: [
            { x: 0, y: 0, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 696, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 0, width: 24, height: 720, type: "wall" },
            { x: 1256, y: 0, width: 24, height: 720, type: "wall" },
            { x: 100, y: 80, width: 134, height: 66, type: "desk" },
            { x: 1046, y: 80, width: 134, height: 66, type: "desk" },
            { x: 100, y: 560, width: 134, height: 66, type: "desk" },
            { x: 1046, y: 560, width: 134, height: 66, type: "desk" },
            { x: 260, y: 80, width: 46, height: 58, type: "plant" },
            { x: 970, y: 80, width: 46, height: 58, type: "plant" },
            { x: 146, y: 154, width: 42, height: 34, type: "chair" },
            { x: 1092, y: 154, width: 42, height: 34, type: "chair" }
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

const typeMessages = {
    fast: [
        "TikTok > studio!",
        "vado a 100 all'ora!",
        "non mi prendi!",
        "vado di fretta!",
        "sono altrove..."
    ],
    shooter: [
        "prendi questo!",
        "pioggia di pietre!",
        "non mi fermo!",
        "ti colpisco!",
        "tieni!"
    ],
    dodger: [
        "schivato!",
        "liscio!",
        "copio e scappo!",
        "quasi preso!",
        "ti piacerebbe!"
    ]
};

const musicLeadPattern = [
    261.63, 329.63, 392.0, 329.63,
    293.66, 349.23, 440.0, 349.23
];

const musicBassPattern = [
    130.81, 130.81, 146.83, 146.83,
    164.81, 164.81, 146.83, 146.83
];

function init() {
    // Load muted state
    const storedMuted = localStorage.getItem("aulab_rage_muted");
    audioState.muted = storedMuted === "true";

    loadTeachers();
    loadHackademies();
    bindEvents();
    resetGame();
    updateGameScale();
    updateMuteButtonVisual();
    requestAnimationFrame(gameLoop);
}

function bindEvents() {
    startButton.addEventListener("click", startGame);
    if (resumeButton) {
        resumeButton.addEventListener("click", resumeGame);
    }
    restartButton.addEventListener("click", () => {
        resetGame();
        startGame();
    });
    if (menuButton) {
        menuButton.addEventListener("click", () => {
            resetGame();
        });
    }

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

    // Event listener per la creazione del docente
    addTeacherBtn.addEventListener("click", () => {
        teacherModal.classList.remove("d-none");
        addTeacherForm.reset();
        imagePreview.src = "";
        imagePreview.classList.add("d-none");
    });

    closeTeacherModal.addEventListener("click", () => {
        teacherModal.classList.add("d-none");
    });

    // Anteprima e gestione del file caricato (Base64)
    teacherImageFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.classList.remove("d-none");
                teacherImageUrl.value = ""; // Pulisce il campo URL se c'è un file caricato
            };
            reader.readAsDataURL(file);
        }
    });

    // Anteprima e gestione dell'URL inserito
    teacherImageUrl.addEventListener("input", (e) => {
        const url = e.target.value.trim();
        if (url) {
            imagePreview.src = url;
            imagePreview.classList.remove("d-none");
            teacherImageFile.value = ""; // Pulisce il file se c'è un URL inserito
        } else if (!teacherImageFile.files[0]) {
            imagePreview.src = "";
            imagePreview.classList.add("d-none");
        }
    });

    // Invio del form di aggiunta docente
    addTeacherForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = teacherNameInput.value.trim();
        const tool = teacherToolInput.value.trim();
        const toolStyle = teacherToolStyleSelect.value;
        
        let image = imagePreview.src;
        if (!image || imagePreview.classList.contains("d-none")) {
            image = "./assets/player-face.png";
        }
        
        if (!name || !tool) return;
        
        const newTeacher = {
            id: `custom_${Date.now()}`,
            name,
            image,
            tool,
            toolStyle
        };
        
        state.teachers.push(newTeacher);
        saveTeachers();
        selectTeacher(newTeacher.id);
        
        teacherModal.classList.add("d-none");
    });

    // Event listener per la creazione dell'hackademy
    addHackademyBtn.addEventListener("click", () => {
        hackademyModal.classList.remove("d-none");
        addHackademyForm.reset();
    });

    closeHackademyModal.addEventListener("click", () => {
        hackademyModal.classList.add("d-none");
    });

    addHackademyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = hackademyNameInput.value.trim();
        const count = parseInt(hackademyStudentsCountInput.value, 10);
        
        if (!name || isNaN(count) || count < 1 || count > 15) return;
        
        const newHackademy = {
            id: `custom_hackademy_${Date.now()}`,
            name,
            studentsCount: count
        };
        
        state.hackademies.push(newHackademy);
        saveHackademies();
        selectHackademy(newHackademy.id);
        
        hackademyModal.classList.add("d-none");
    });

    // Mute button listener
    if (muteBtn) {
        muteBtn.addEventListener("click", toggleMute);
    }

    // Intermission proceed button listener
    if (intermissionButton) {
        intermissionButton.addEventListener("click", () => {
            if (intermissionOverlay) {
                intermissionOverlay.classList.add("d-none");
            }
            const nextLevel = state.currentLevel + 1;
            buildLevel(nextLevel, false);
            if (state.selectedHackademyId === "standard") {
                localStorage.setItem("aulab_rage_saved_level", nextLevel);
            }
            state.lastFrame = performance.now();
            state.running = true;
        });
    }
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
    if (intermissionOverlay) {
        intermissionOverlay.classList.add("d-none");
    }
    updateResumeButton();
}

function resumeGame() {
    unlockAudio();
    const savedLevel = localStorage.getItem("aulab_rage_saved_level");
    const parsedLevel = parseInt(savedLevel, 10);
    if (parsedLevel && parsedLevel > 1 && parsedLevel <= 3) {
        selectHackademy("standard", false);

        buildLevel(parsedLevel, true);
        state.running = true;
        state.gameOver = false;
        state.victory = false;
        state.lastFrame = performance.now();
        startOverlay.classList.add("d-none");
        endOverlay.classList.add("d-none");
        startBackgroundMusic();
    }
}

function updateResumeButton() {
    if (!resumeButton) return;
    const savedLevel = localStorage.getItem("aulab_rage_saved_level");
    const parsedLevel = parseInt(savedLevel, 10);
    if (parsedLevel && parsedLevel > 1 && parsedLevel <= 3) {
        if (savedLevelNum) {
            savedLevelNum.textContent = parsedLevel;
        }
        resumeButton.classList.remove("d-none");
    } else {
        resumeButton.classList.add("d-none");
    }
}

function clearEntities() {
    state.students.forEach((student) => {
        if (student.speechTimeoutId) {
            window.clearTimeout(student.speechTimeoutId);
            student.speechTimeoutId = null;
        }
    });

    if (state.boss) {
        state.boss.element.remove();
        state.boss = null;
    }
    if (state.campfireElement) {
        state.campfireElement.remove();
        state.campfireElement = null;
    }
    state.summoningActive = false;
    const bossHealthContainer = document.getElementById("bossHealthContainer");
    if (bossHealthContainer) bossHealthContainer.classList.add("d-none");
    const summoningBanner = document.getElementById("summoningBanner");
    if (summoningBanner) summoningBanner.classList.add("d-none");

    [state.player, ...state.students, ...state.projectiles, ...state.effects, state.powerUp, state.heartPowerUp, state.dragonStrike]
        .filter(Boolean)
        .forEach((entity) => entity.element.remove());

    state.students = [];
    state.projectiles = [];
    state.effects = [];
    state.powerUp = null;
    state.heartPowerUp = null;
    state.dragonStrike = null;
    state.player = null; // Risolve il bug del riavvio ricreando l'elemento del player nel DOM
    if (intermissionOverlay) {
        intermissionOverlay.classList.add("d-none");
    }
}

function clearLevelActors(keepPlayer = true) {
    state.students.forEach((student) => {
        if (student.speechTimeoutId) {
            window.clearTimeout(student.speechTimeoutId);
            student.speechTimeoutId = null;
        }
    });

    if (state.boss) {
        state.boss.element.remove();
        state.boss = null;
    }
    if (state.campfireElement) {
        state.campfireElement.remove();
        state.campfireElement = null;
    }
    state.summoningActive = false;
    const bossHealthContainer = document.getElementById("bossHealthContainer");
    if (bossHealthContainer) bossHealthContainer.classList.add("d-none");
    const summoningBanner = document.getElementById("summoningBanner");
    if (summoningBanner) summoningBanner.classList.add("d-none");

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
    if (intermissionOverlay) {
        intermissionOverlay.classList.add("d-none");
    }
}

// Funzioni ausiliarie per la gestione dei docenti
function loadTeachers() {
    const stored = localStorage.getItem("aulab_rage_teachers");
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            state.teachers = [...defaultTeachers, ...parsed];
        } catch (e) {
            state.teachers = [...defaultTeachers];
        }
    } else {
        state.teachers = [...defaultTeachers];
    }
    
    const storedSelect = localStorage.getItem("aulab_rage_selected_teacher");
    if (storedSelect && state.teachers.some(t => t.id === storedSelect)) {
        state.selectedTeacherId = storedSelect;
    } else {
        state.selectedTeacherId = "valerio";
    }
    
    renderTeacherCards();
    updateStartDescription();
}

function saveTeachers() {
    const custom = state.teachers.filter(t => t.id !== "valerio");
    localStorage.setItem("aulab_rage_teachers", JSON.stringify(custom));
}

function renderTeacherCards() {
    if (!teacherCardsContainer) return;
    teacherCardsContainer.innerHTML = "";
    state.teachers.forEach(teacher => {
        const card = document.createElement("div");
        card.className = `teacher-card ${teacher.id === state.selectedTeacherId ? 'selected' : ''}`;
        card.dataset.id = teacher.id;
        
        const avatar = document.createElement("div");
        avatar.className = "teacher-card-avatar";
        avatar.style.backgroundImage = `url(${teacher.image})`;
        
        const name = document.createElement("div");
        name.className = "teacher-card-name";
        name.textContent = teacher.name;
        
        const tool = document.createElement("div");
        tool.className = "teacher-card-tool";
        tool.textContent = teacher.tool;
        
        card.append(avatar, name, tool);
        
        card.addEventListener("click", () => {
            selectTeacher(teacher.id);
        });
        
        teacherCardsContainer.appendChild(card);
    });
}

function selectTeacher(id) {
    state.selectedTeacherId = id;
    localStorage.setItem("aulab_rage_selected_teacher", id);
    renderTeacherCards();
    updateStartDescription();
}

// Funzioni ausiliarie per la gestione delle Hackademy
function loadHackademies() {
    const stored = localStorage.getItem("aulab_rage_hackademies");
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            state.hackademies = [...defaultHackademies, ...parsed];
        } catch (e) {
            state.hackademies = [...defaultHackademies];
        }
    } else {
        state.hackademies = [...defaultHackademies];
    }
    
    const storedSelect = localStorage.getItem("aulab_rage_selected_hackademy");
    if (storedSelect && state.hackademies.some(h => h.id === storedSelect)) {
        state.selectedHackademyId = storedSelect;
    } else {
        state.selectedHackademyId = "standard";
    }
    
    renderHackademyPills();
    updateStartDescription();
}

function saveHackademies() {
    const custom = state.hackademies.filter(h => h.id !== "standard");
    localStorage.setItem("aulab_rage_hackademies", JSON.stringify(custom));
}

function renderHackademyPills() {
    if (!hackademyPillsContainer) return;
    hackademyPillsContainer.innerHTML = "";
    state.hackademies.forEach(hackademy => {
        const pill = document.createElement("div");
        pill.className = `hackademy-pill ${hackademy.id === state.selectedHackademyId ? 'selected' : ''}`;
        pill.dataset.id = hackademy.id;
        
        let label = hackademy.name;
        if (hackademy.id !== "standard") {
            label += ` (${hackademy.studentsCount} st.)`;
        }
        pill.textContent = label;
        
        pill.addEventListener("click", () => {
            selectHackademy(hackademy.id);
        });
        
        hackademyPillsContainer.appendChild(pill);
    });
}

function selectHackademy(id, rebuild = true) {
    state.selectedHackademyId = id;
    localStorage.setItem("aulab_rage_selected_hackademy", id);
    renderHackademyPills();
    updateStartDescription();
    if (rebuild) {
        buildLevel(1, true);
        updateHud();
    }
}

function updateStartDescription() {
    const teacher = getSelectedTeacher();
    if (startDescription) {
        let targetText = "l'ufficio Aulab";
        if (state.selectedHackademyId !== "standard") {
            const hackademy = state.hackademies.find(h => h.id === state.selectedHackademyId);
            if (hackademy) {
                targetText = `la classe ${hackademy.name}`;
            }
        }
        startDescription.innerHTML = `${teacher.name} deve liberare ${targetText} inseguendo gli studenti che non studiano, schivando le pietre e colpendoli con il suo ${teacher.tool}... hem, sì... volevo dire "${teacher.tool}".`;
    }
}

function getSelectedTeacher() {
    return state.teachers.find(t => t.id === state.selectedTeacherId) || state.teachers[0];
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

    if (state.selectedHackademyId !== "standard") {
        const hackademy = state.hackademies.find(h => h.id === state.selectedHackademyId);
        const count = hackademy ? hackademy.studentsCount : 5;
        const studentSpawns = [];
        for (let i = 0; i < count; i++) {
            studentSpawns.push({
                x: 100 + Math.random() * 1000,
                y: 100 + Math.random() * 500
            });
        }
        state.students = studentSpawns.map((spawn, index) => createStudent(spawn, index));
    } else {
        state.students = level.studentSpawns.map((spawn, index) => createStudent(spawn, index));
        
        if (levelNumber === 3) {
            spawnCampfire();
            state.students.forEach((student) => {
                student.isChanting = true;
                student.element.classList.add("student-chanting");
            });
            state.summoningActive = true;
            state.summoningTimer = 5000;
            state.lastRumbleAt = 0;
            const banner = document.getElementById("summoningBanner");
            if (banner) {
                banner.classList.remove("d-none");
            }
        }
    }
}

function spawnCampfire() {
    const campfire = document.createElement("div");
    campfire.className = "campfire";
    campfire.style.left = "600px";
    campfire.style.top = "320px";
    
    const logs = document.createElement("div");
    logs.className = "campfire-logs";
    
    const flame = document.createElement("div");
    flame.className = "campfire-flame";
    
    const portal = document.createElement("div");
    portal.className = "summoning-portal";
    
    campfire.append(logs, flame, portal);
    gameArea.appendChild(campfire);
    
    state.campfireElement = campfire;
    
    setTimeout(() => {
        if (portal) portal.classList.add("active");
    }, 100);
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
    
    // Imposta l'avatar personalizzato del docente selezionato
    const selectedTeacher = getSelectedTeacher();
    face.style.backgroundImage = `url(${selectedTeacher.image})`;
    face.style.backgroundSize = "cover";
    face.style.backgroundPosition = "center";

    torso.className = "player-body";
    armLeft.className = "player-arm arm-left";
    armRight.className = "player-arm arm-right";
    legLeft.className = "player-leg leg-left";
    legRight.className = "player-leg leg-right";
    
    // Applica lo stile grafico dell'arma associata al docente
    hammer.className = `player-hammer tool-${selectedTeacher.toolStyle}`;
    hammerHead.className = "player-hammer-head";

    hammer.appendChild(hammerHead);
    figure.append(face, torso, armLeft, armRight, legLeft, legRight, hammer);
    element.appendChild(figure);

    const shieldBubble = document.createElement("div");
    shieldBubble.className = "player-shield-bubble";
    element.appendChild(shieldBubble);

    const player = {
        x: spawn.x,
        y: spawn.y,
        width: 62,
        height: 74,
        lives: resetPlayerLives ? GAME.spawnLives : GAME.spawnLives,
        direction: "right",
        invulnerableUntil: 0,
        attackEndsAt: 0,
        shieldHits: 0,
        speedBoostUntil: 0,
        superHammerUntil: 0,
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
    state.player.shieldHits = 0;
    state.player.speedBoostUntil = 0;
    state.player.superHammerUntil = 0;
    state.player.element.classList.remove("attacking", "flash-damage", "shield-active", "speed-boosted", "super-hammer-active");
    state.player.element.removeAttribute("data-shield-hits");
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

    const types = ["fast", "shooter", "dodger"];
    const type = types[index % types.length];

    const student = {
        id: `student-${index}`,
        x: spawn.x,
        y: spawn.y,
        width: 52,
        height: 60,
        projectilesPerShot: getCurrentLevelConfig().projectilesPerShot,
        direction: "left",
        fleeTimer: Math.random() * 60,
        shotTimer: type === "shooter" ? (15 + Math.random() * 25) : (70 + Math.random() * 140),
        talkTimer: randomBetween(GAME.studentTalkMin, GAME.studentTalkMax),
        wanderTimer: 0,
        wanderVector: { x: 0, y: 0 },
        isThrowing: false,
        throwReleaseAt: 0,
        speechTimeoutId: null,
        studentType: type,
        dodgeCooldown: 0,
        dashTimer: 0,
        dashVector: null,
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
    student.element.className = `entity student type-${type}`;
    gameArea.appendChild(student.element);
    updateStudentVisual(student, false);
    syncEntity(student);
    return student;
}

function startGame() {
    unlockAudio();
    localStorage.removeItem("aulab_rage_saved_level");
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

        // --- GESTIONE EVOCAZIONE BOSS ---
        if (state.summoningActive) {
            state.summoningTimer -= frameDeltaMs;

            // Rombi ed effetto terremoto sullo schermo
            if (timestamp - state.lastRumbleAt > 700) {
                state.lastRumbleAt = timestamp;
                playSummoningRumbleSound();
                triggerScreenShake(300, 3);
            }

            const secondsLeft = Math.max(0, Math.ceil(state.summoningTimer / 1000));
            const timerEl = document.getElementById("summoningTimer");
            if (timerEl) {
                timerEl.textContent = secondsLeft.toString();
            }
            const barFillEl = document.getElementById("summoningBarFill");
            if (barFillEl) {
                const pct = Math.max(0, (state.summoningTimer / 5000) * 100);
                barFillEl.style.width = `${pct}%`;
            }

            if (state.summoningTimer <= 0) {
                state.summoningActive = false;
                const banner = document.getElementById("summoningBanner");
                if (banner) {
                    banner.classList.add("d-none");
                }

                // Disattiva chanting per tutti gli studenti
                state.students.forEach((student) => {
                    student.isChanting = false;
                    student.element.classList.remove("student-chanting");
                    const oldBubble = student.element.querySelector(".speech-bubble");
                    if (oldBubble) oldBubble.remove();
                    student.element.classList.remove("speaking");
                    if (student.speechTimeoutId) {
                        clearTimeout(student.speechTimeoutId);
                        student.speechTimeoutId = null;
                    }
                });

                spawnBoss();
            }
        }

        // Aggiorna il Boss se presente
        if (state.boss) {
            updateBoss(delta, timestamp);
        }
        // ---------------------------------

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
    let speedMult = 1.0;
    if (state.player.speedBoostUntil) {
        if (timestamp < state.player.speedBoostUntil) {
            speedMult = 2.0;
            state.player.element.classList.add("speed-boosted");
        } else {
            state.player.speedBoostUntil = 0;
            state.player.element.classList.remove("speed-boosted");
        }
    }

    if (state.player.superHammerUntil && timestamp >= state.player.superHammerUntil) {
        state.player.superHammerUntil = 0;
        state.player.element.classList.remove("super-hammer-active");
    }

    const movement = getInputVector();
    const stepX = movement.x * GAME.playerSpeed * speedMult * delta;
    const stepY = movement.y * GAME.playerSpeed * speedMult * delta;
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

function updateStudents(delta, timestamp) {
    state.students.forEach((student) => {
        if (student.isChanting) {
            // Guarda verso il falò al centro (640, 360)
            const dx = 640 - centerOf(student).x;
            const dy = 360 - centerOf(student).y;
            student.direction = getDirectionFromVector({ x: dx, y: dy });
            updateStudentVisual(student, false);
            
            student.talkTimer -= delta * 16.67;
            if (student.talkTimer <= 0) {
                student.talkTimer = randomBetween(1500, 3000);
                speakChant(student);
            }
            return;
        }

        const dx = centerOf(student).x - centerOf(state.player).x;
        const dy = centerOf(student).y - centerOf(state.player).y;
        const distance = Math.hypot(dx, dy);
        const fleeMode = distance < 220;
        const now = timestamp || performance.now();
        let vector;

        if (student.dodgeCooldown > 0) {
            student.dodgeCooldown -= delta;
        }

        if (student.dashTimer > 0) {
            student.dashTimer -= delta;
            vector = student.dashVector;
            student.element.classList.add("dashing");
            
            const speed = 3.5 * GAME.studentSpeed;
            moveWithCollisions(student, vector.x * speed * delta, vector.y * speed * delta);
            student.direction = getDirectionFromVector(vector);
            updateStudentVisual(student, true);
        } else {
            student.element.classList.remove("dashing");
            
            if (fleeMode) {
                vector = normalizeVector(dx, dy);
                student.element.classList.add("coward");
                
                if (student.studentType === "dodger" && distance < 110 && (!student.dodgeCooldown || student.dodgeCooldown <= 0)) {
                    student.dashTimer = 15;
                    student.dodgeCooldown = 100;
                    student.dashVector = normalizeVector(dx + (Math.random() - 0.5) * 0.4, dy + (Math.random() - 0.5) * 0.4);
                    speakStudent(student);
                }
            } else {
                student.element.classList.remove("coward");
                vector = getStudentWanderVector(student);
            }

            student.direction = getDirectionFromVector(vector);
            updateStudentVisual(student, vector.x !== 0 || vector.y !== 0);
            
            let speedMult = 1.0;
            if (student.studentType === "fast") {
                speedMult = 1.65;
            } else if (student.studentType === "shooter") {
                speedMult = 0.15;
            }
            
            moveWithCollisions(student, vector.x * GAME.studentSpeed * speedMult * delta, vector.y * GAME.studentSpeed * speedMult * delta);
        }

        student.fleeTimer -= delta;
        student.shotTimer -= delta;
        student.talkTimer -= delta * 16.67;

        if (student.isThrowing && now >= student.throwReleaseAt) {
            student.isThrowing = false;
            student.element.classList.remove("throwing");
            throwStone(student);
            if (student.studentType === "shooter") {
                student.shotTimer = 35 + Math.random() * 45;
            } else {
                student.shotTimer = 105 + Math.random() * 120;
            }
        }

        if (student.studentType !== "fast" && !student.isThrowing && student.shotTimer <= 0 && hasLineOfSight(student, state.player)) {
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
            if (state.player.shieldHits > 0) {
                state.player.shieldHits -= 1;
                state.player.invulnerableUntil = timestamp + 600;
                if (state.player.shieldHits <= 0) {
                    state.player.element.classList.remove("shield-active");
                    state.player.element.removeAttribute("data-shield-hits");
                    playShieldBreakSound();
                } else {
                    state.player.element.setAttribute("data-shield-hits", state.player.shieldHits.toString());
                    playShieldSound();
                }
            } else {
                damagePlayer();
            }
            createHitEffect(projectile.x - 20, projectile.y - 20);
            return;
        }

        nextProjectiles.push(projectile);
    });

    state.projectiles = nextProjectiles;
}

function updatePowerUps(delta) {
    if (!state.powerUp && !state.dragonStrike && state.gameTimeMs >= state.nextPowerUpAt && state.students.length > 0) {
        spawnPowerUp();
    }

    if (
        state.player.lives < GAME.spawnLives &&
        !state.heartPowerUp &&
        state.gameTimeMs >= state.nextHeartPowerUpAt
    ) {
        spawnHeartPowerUp();
    }

    if (state.powerUp && rectsIntersect(state.powerUp, state.player)) {
        collectPowerUp();
    } else if (state.powerUp) {
        const remainingMs = Math.max(0, state.powerUp.expiresAt - state.gameTimeMs);
        const secondsLeft = Math.ceil(remainingMs / 1000);
        state.powerUp.counter.textContent = `${secondsLeft}`;

        if (remainingMs <= 0) {
            expirePowerUp();
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

    // Gestione colpi al Boss
    if (state.boss && rectsIntersect(attackZone, state.boss)) {
        createHitEffect(state.boss.x + state.boss.width / 2 - 18, state.boss.y + state.boss.height / 2 - 18);
        damageBoss();
    }

    const survivors = [];
    state.students.forEach((student) => {
        if (rectsIntersect(attackZone, student)) {
            if (student.isChanting) {
                // Studente immune durante l'evocazione
                playShieldSound();
                createHitEffect(student.x - 18, student.y - 18);
                survivors.push(student);
                return;
            }
            createHitEffect(student.x - 18, student.y - 18);
            student.element.remove();
            return;
        }

        survivors.push(student);
    });

    state.students = survivors;
}

function getAttackZone() {
    const now = performance.now();
    const hasSuperHammer = state.player.superHammerUntil && now < state.player.superHammerUntil;

    if (hasSuperHammer) {
        const size = 190;
        return {
            x: state.player.x + state.player.width / 2 - size / 2,
            y: state.player.y + state.player.height / 2 - size / 2,
            width: size,
            height: size,
            is360: true
        };
    }

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
    if (zone.is360) {
        effect.className = "hammer-swing-360";
        effect.style.left = `${zone.x}px`;
        effect.style.top = `${zone.y}px`;
        effect.style.width = `${zone.width}px`;
        effect.style.height = `${zone.height}px`;
    } else {
        effect.className = "hammer-swing";
        effect.style.left = `${zone.x}px`;
        effect.style.top = `${zone.y + 22}px`;

        if (state.player.direction === "up" || state.player.direction === "down") {
            effect.style.transform = "rotate(90deg)";
        }
    }

    gameArea.appendChild(effect);
    window.setTimeout(() => effect.remove(), zone.is360 ? 300 : 180);
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
    triggerScreenShake(300, 6);
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
        if (state.selectedHackademyId === "standard") {
            if (state.currentLevel === 3 && (state.boss || state.summoningActive)) {
                return;
            }
            
            // Salva il livello corrente nel localstorage
            localStorage.setItem("aulab_rage_saved_level", state.currentLevel);

            if (state.currentLevel < levelConfigs.length) {
                advanceToNextLevel();
                return;
            }
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
    
    state.running = false;
    
    if (intermissionTitle && intermissionMessage && intermissionOverlay) {
        if (state.currentLevel === 1) {
            intermissionTitle.textContent = "Livello 1 Completato! 🎉";
            intermissionMessage.textContent = "Gli studenti del primo anno sono stati convinti a studiare. Preparati per il Livello 2...";
            if (intermissionButton) {
                intermissionButton.textContent = "Entra nel Livello 2";
            }
        } else if (state.currentLevel === 2) {
            intermissionTitle.textContent = "Livello 2 Completato! 🔥";
            intermissionMessage.textContent = "Attento! Gli studenti si stanno radunando attorno al fuoco per evocare qualcosa di spaventoso nel Livello 3...";
            if (intermissionButton) {
                intermissionButton.textContent = "Affronta il Livello 3 (Boss Battle)";
            }
        } else {
            intermissionTitle.textContent = `Livello ${state.currentLevel} Completato!`;
            intermissionMessage.textContent = "Preparati per la prossima sfida!";
            if (intermissionButton) {
                intermissionButton.textContent = `Procedi al Livello ${state.currentLevel + 1}`;
            }
        }
        intermissionOverlay.classList.remove("d-none");
    } else {
        const nextLevel = state.currentLevel + 1;
        buildLevel(nextLevel, false);
        if (state.selectedHackademyId === "standard") {
            localStorage.setItem("aulab_rage_saved_level", nextLevel);
        }
        state.lastFrame = performance.now();
        state.running = true;
    }
}

function spawnPowerUp() {
    const counter = document.createElement("span");
    const icon = document.createElement("span");
    
    const types = ["coffee", "shield", "speed", "super_hammer"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const powerUp = {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        type,
        expiresAt: state.gameTimeMs + GAME.powerUpLifetime,
        counter,
        element: document.createElement("div")
    };

    powerUp.element.className = `game-powerup type-${type}`;
    icon.className = "powerup-icon";
    counter.className = "powerup-counter";
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
    counter.className = "powerup-counter";
    counter.textContent = "3";
    heartPowerUp.element.append(counter, icon);
    placePowerUpInFreeSpot(heartPowerUp);
    gameArea.appendChild(heartPowerUp.element);
    syncEntity(heartPowerUp);
    state.heartPowerUp = heartPowerUp;
}

function collectPowerUp() {
    if (!state.powerUp || state.students.length === 0) {
        return;
    }

    const type = state.powerUp.type;
    const origin = centerOf(state.powerUp);
    
    state.powerUp.element.remove();
    state.powerUp = null;
    
    const now = performance.now();

    if (type === "coffee") {
        playPowerUpSound();
        launchDragonStrike(origin);
    } else if (type === "shield") {
        playShieldSound();
        state.player.shieldHits = 2;
        state.player.element.setAttribute("data-shield-hits", "2");
        state.player.element.classList.add("shield-active");
    } else if (type === "speed") {
        playSpeedSound();
        state.player.speedBoostUntil = now + 5000;
        state.player.element.classList.add("speed-boosted");
    } else if (type === "super_hammer") {
        playSuperHammerSound();
        state.player.superHammerUntil = now + 8000;
        state.player.element.classList.add("super-hammer-active");
    }

    state.nextPowerUpAt = state.gameTimeMs + GAME.powerUpRespawnDelay;
}

function expirePowerUp() {
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
    triggerScreenShake(400, 4);

    window.setTimeout(() => {
        target.element.remove();
        state.students = state.students.filter((student) => student !== target);
    }, 320);
}

function pickDragonTargetId() {
    const activeStudents = state.students.filter(s => !s.isChanting);
    if (activeStudents.length === 0) return "";
    const target = activeStudents[Math.floor(Math.random() * activeStudents.length)];
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
    const messages = typeMessages[student.studentType] || studentMessages;
    const message = messages[Math.floor(Math.random() * messages.length)];
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
    } else {
        localStorage.removeItem("aulab_rage_saved_level");
    }
    endOverlay.classList.remove("d-none");
    endEyebrow.textContent = isVictory ? "Arena ripulita" : "Missione fallita";
    endTitle.textContent = isVictory ? "Vittoria" : "Game Over";
    
    const teacher = getSelectedTeacher();
    if (isVictory) {
        if (state.selectedHackademyId !== "standard") {
            const hackademy = state.hackademies.find(h => h.id === state.selectedHackademyId);
            const hackademyName = hackademy ? hackademy.name : "Hackademy";
            endMessage.textContent = `${teacher.name} ha rimesso tutti a studiare. La classe ${hackademyName} è sotto controllo.`;
        } else {
            endMessage.textContent = `${teacher.name} ha rimesso tutti a studiare. L'ufficio Aulab e' di nuovo sotto controllo.`;
        }
        
        // Reset alla modalità Standard in caso di vittoria del docente per evitare di rimanere bloccati in Sandbox
        selectHackademy("standard", false);
    } else {
        endMessage.textContent = `Le pietre hanno fermato ${teacher.name}. Riprova e libera l'ufficio dagli studenti svogliati.`;
    }
}

function updateHud() {
    if (state.player) {
        renderLives(state.player.lives);
    }
    studentsValue.textContent = state.students.length;
    if (levelValue) {
        levelValue.textContent = state.selectedHackademyId === "standard" ? state.currentLevel : "Sandbox";
    }
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
    state.currentScale = safeScale;

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
        audioState.masterGain.gain.value = audioState.muted ? 0 : 0.82;
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

function playShieldSound() {
    playToneBurst({
        frequencies: [261.63, 329.63, 523.25],
        duration: 0.3,
        type: "sine",
        peakGain: 0.12,
        stagger: 0.05
    });
}

function playShieldBreakSound() {
    playToneBurst({
        frequencies: [440, 220],
        duration: 0.25,
        type: "sawtooth",
        peakGain: 0.15,
        slideTo: 110
    });
}

function playSpeedSound() {
    playToneBurst({
        frequencies: [329.63, 440, 587.33, 783.99],
        duration: 0.35,
        type: "triangle",
        peakGain: 0.12,
        stagger: 0.04
    });
}

function playSuperHammerSound() {
    playToneBurst({
        frequencies: [196, 293.66, 392, 587.33],
        duration: 0.5,
        type: "sawtooth",
        peakGain: 0.15,
        stagger: 0.06,
        slideTo: 98
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
    if (!audioState.speechEnabled || !state.running || audioState.muted) {
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

// --- FUNZIONALITÀ BOSS E RITO DI EVOCAZIONE (LIVELLO 3) ---

const chantMessages = [
    "Sorgi, o Grande Svogliato!",
    "Evoca il potere dello svacco!",
    "Niente studio oggi!",
    "Grande Svogliato, ascoltaci!",
    "Vieni a liberarci!",
    "La procrastinazione trionferà!"
];

function speakChant(student) {
    if (!student) return;

    const previousBubble = student.element.querySelector(".speech-bubble");
    if (previousBubble) {
        previousBubble.remove();
    }

    if (student.speechTimeoutId) {
        window.clearTimeout(student.speechTimeoutId);
    }

    const bubble = document.createElement("div");
    bubble.className = "speech-bubble";
    const message = chantMessages[Math.floor(Math.random() * chantMessages.length)];
    bubble.textContent = message;
    student.element.appendChild(bubble);
    student.element.classList.add("speaking");

    student.speechTimeoutId = window.setTimeout(() => {
        bubble.remove();
        student.element.classList.remove("speaking");
        student.speechTimeoutId = null;
    }, 1200);
}

function triggerScreenShake(durationMs, intensity) {
    const startTime = performance.now();
    function shake() {
        const elapsed = performance.now() - startTime;
        if (elapsed < durationMs && state.running) {
            const dx = (Math.random() - 0.5) * intensity;
            const dy = (Math.random() - 0.5) * intensity;
            gameArea.style.transform = `scale(${state.currentScale}) translate(${dx}px, ${dy}px)`;
            requestAnimationFrame(shake);
        } else {
            gameArea.style.transform = `scale(${state.currentScale})`;
        }
    }
    shake();
}

function playSummoningRumbleSound() {
    playToneBurst({
        frequencies: [60, 50, 45],
        duration: 0.6,
        type: "sawtooth",
        peakGain: 0.18,
        slideTo: 30,
        stagger: 0.1
    });
}

function playBossShotSound(isGiant) {
    if (isGiant) {
        playToneBurst({
            frequencies: [150, 100, 80],
            duration: 0.5,
            type: "sawtooth",
            peakGain: 0.15,
            slideTo: 50
        });
    } else {
        playToneBurst({
            frequencies: [220, 260],
            duration: 0.2,
            type: "triangle",
            peakGain: 0.1,
            slideTo: 150
        });
    }
}

function playBossHitSound() {
    playToneBurst({
        frequencies: [350, 250, 150],
        duration: 0.15,
        type: "sawtooth",
        peakGain: 0.15,
        slideTo: 80
    });
}

function playBossDeathSound() {
    playToneBurst({
        frequencies: [300, 150, 80],
        duration: 1.5,
        type: "sawtooth",
        peakGain: 0.2,
        slideTo: 30,
        stagger: 0.2
    });
}

function spawnBoss() {
    const element = document.createElement("div");
    element.className = "entity boss";
    
    const wrapper = document.createElement("div");
    wrapper.className = "boss-wrapper";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    
    const figure = document.createElement("div");
    figure.className = "boss-figure";
    
    const crown = document.createElement("div");
    crown.className = "boss-crown";
    
    const body = document.createElement("div");
    body.className = "boss-body";
    
    const ears = document.createElement("div");
    ears.className = "boss-ears";
    
    const eyes = document.createElement("div");
    eyes.className = "boss-eyes";
    const eyeL = document.createElement("div");
    eyeL.className = "boss-eye";
    const eyeR = document.createElement("div");
    eyeR.className = "boss-eye";
    eyes.append(eyeL, eyeR);
    
    figure.append(crown, body, ears, eyes);
    wrapper.appendChild(figure);
    element.appendChild(wrapper);
    
    gameArea.appendChild(element);
    
    state.boss = {
        x: 590,
        y: 300,
        width: 100,
        height: 120,
        lives: 15,
        maxLives: 15,
        speed: 1.1,
        direction: "right",
        lastShotAt: 0,
        lastSummonAt: 0,
        shootCooldown: 2200,
        summonCooldown: 8000,
        element
    };
    
    syncEntity(state.boss);
    const healthContainer = document.getElementById("bossHealthContainer");
    if (healthContainer) {
        healthContainer.classList.remove("d-none");
    }
    updateBossHealthBar();
    
    triggerScreenShake(800, 8);
    playBossShotSound(true);
}

function updateBoss(delta, timestamp) {
    if (!state.boss) return;
    
    // Inseguimento player
    const bossCenter = centerOf(state.boss);
    const playerCenter = centerOf(state.player);
    const dx = playerCenter.x - bossCenter.x;
    const dy = playerCenter.y - bossCenter.y;
    const vector = normalizeVector(dx, dy);
    
    const stepX = vector.x * state.boss.speed * delta;
    const stepY = vector.y * state.boss.speed * delta;
    
    moveWithCollisions(state.boss, stepX, stepY);
    
    // Orientamento visivo
    const wrapper = state.boss.element.querySelector(".boss-wrapper");
    if (wrapper) {
        if (vector.x < 0) {
            wrapper.style.transform = "scaleX(-1)";
        } else {
            wrapper.style.transform = "";
        }
    }
    
    // Attacchi periodici
    if (!state.boss.lastShotAt) {
        state.boss.lastShotAt = timestamp;
    }
    if (timestamp - state.boss.lastShotAt > state.boss.shootCooldown) {
        bossShoot(timestamp);
    }
    
    // Evocazioni minion periodiche
    if (!state.boss.lastSummonAt) {
        state.boss.lastSummonAt = timestamp;
    }
    if (timestamp - state.boss.lastSummonAt > state.boss.summonCooldown) {
        bossSummonStudent(timestamp);
    }
}

function bossShoot(timestamp) {
    if (!state.boss) return;
    state.boss.lastShotAt = timestamp;
    
    const isGiant = Math.random() < 0.35;
    playBossShotSound(isGiant);
    
    const source = centerOf(state.boss);
    const target = centerOf(state.player);
    const vector = normalizeVector(target.x - source.x, target.y - source.y);
    
    if (isGiant) {
        const projectile = {
            x: source.x - 24,
            y: source.y - 24,
            width: 48,
            height: 48,
            velocityX: vector.x * GAME.projectileSpeed * 1.3,
            velocityY: vector.y * GAME.projectileSpeed * 1.3,
            ownerId: "boss",
            isGiant: true,
            element: document.createElement("div")
        };
        projectile.element.className = "projectile boss-projectile giant-fireball";
        gameArea.appendChild(projectile.element);
        syncEntity(projectile);
        state.projectiles.push(projectile);
    } else {
        const baseAngle = Math.atan2(vector.y, vector.x);
        const angles = [baseAngle - 0.25, baseAngle, baseAngle + 0.25];
        
        angles.forEach((angle) => {
            const vx = Math.cos(angle) * GAME.projectileSpeed * 1.1;
            const vy = Math.sin(angle) * GAME.projectileSpeed * 1.1;
            
            const projectile = {
                x: source.x - 12,
                y: source.y - 12,
                width: 24,
                height: 24,
                velocityX: vx,
                velocityY: vy,
                ownerId: "boss",
                element: document.createElement("div")
            };
            projectile.element.className = "projectile boss-projectile";
            gameArea.appendChild(projectile.element);
            syncEntity(projectile);
            state.projectiles.push(projectile);
        });
    }
}

function bossSummonStudent(timestamp) {
    if (!state.boss) return;
    state.boss.lastSummonAt = timestamp;
    
    if (state.students.length >= 6) return;
    
    const range = 180;
    const angle = Math.random() * Math.PI * 2;
    const targetX = clamp(state.boss.x + state.boss.width / 2 + Math.cos(angle) * range - 26, 40, GAME.width - 92);
    const targetY = clamp(state.boss.y + state.boss.height / 2 + Math.sin(angle) * range - 30, 40, GAME.height - 110);
    
    const index = Math.floor(Math.random() * 100);
    const student = createStudent({ x: targetX, y: targetY }, index);
    state.students.push(student);
    
    const effectEl = document.createElement("div");
    effectEl.className = "boss-summon-effect";
    effectEl.style.left = `${student.x - 4}px`;
    effectEl.style.top = `${student.y - 4}px`;
    gameArea.appendChild(effectEl);
    setTimeout(() => effectEl.remove(), 600);
    
    playToneBurst({
        frequencies: [200, 400, 800],
        duration: 0.3,
        type: "sine",
        peakGain: 0.1,
        stagger: 0.04
    });
}

function damageBoss() {
    if (!state.boss || state.boss.lives <= 0) return;
    
    state.boss.lives -= 1;
    playBossHitSound();
    triggerScreenShake(200, 4);
    
    state.boss.element.classList.add("flash-damage");
    setTimeout(() => {
        if (state.boss && state.boss.element) {
            state.boss.element.classList.remove("flash-damage");
        }
    }, 150);
    
    updateBossHealthBar();
    
    if (state.boss.lives <= 0) {
        killBoss();
    }
}

function updateBossHealthBar() {
    if (!state.boss) return;
    const bar = document.getElementById("bossHealthBar");
    if (bar) {
        const pct = Math.max(0, (state.boss.lives / state.boss.maxLives) * 100);
        bar.style.width = `${pct}%`;
    }
}

function killBoss() {
    if (!state.boss) return;
    
    playBossDeathSound();
    triggerScreenShake(1200, 9);
    
    state.boss.element.classList.add("boss-defeated");
    
    const deadBoss = state.boss;
    state.boss = null;
    
    setTimeout(() => {
        if (deadBoss.element) {
            deadBoss.element.remove();
        }
        
        if (state.campfireElement) {
            state.campfireElement.remove();
            state.campfireElement = null;
        }
        
        clearLevelActors(true);
        
        const healthContainer = document.getElementById("bossHealthContainer");
        if (healthContainer) {
            healthContainer.classList.add("d-none");
        }
        
        checkEndConditions();
    }, 1500);
}

function toggleMute() {
    audioState.muted = !audioState.muted;
    if (audioState.masterGain) {
        audioState.masterGain.gain.value = audioState.muted ? 0 : 0.82;
    }
    localStorage.setItem("aulab_rage_muted", audioState.muted ? "true" : "false");
    updateMuteButtonVisual();
}

function updateMuteButtonVisual() {
    const muteBtn = document.getElementById("muteBtn");
    if (!muteBtn) return;
    
    if (audioState.muted) {
        muteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x" viewBox="0 0 24 24">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
        `;
        muteBtn.classList.add("muted");
    } else {
        muteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2" viewBox="0 0 24 24">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;
        muteBtn.classList.remove("muted");
    }
}

init();
