const gameArea = document.getElementById("gameArea");
const gameViewport = document.getElementById("gameViewport");
const gameStage = document.getElementById("gameStage");
const startOverlay = document.getElementById("startOverlay");
const endOverlay = document.getElementById("endOverlay");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const livesValue = document.getElementById("livesValue");
const studentsValue = document.getElementById("studentsValue");
const studentsChip = studentsValue?.parentElement || null;
const endEyebrow = document.getElementById("endEyebrow");
const endTitle = document.getElementById("endTitle");
const endMessage = document.getElementById("endMessage");

// Elementi DOM per la Storia
const storyOverlay = document.getElementById("storyOverlay");
const closeStoryButton = document.getElementById("closeStoryButton");
const storyContent = document.getElementById("storyContent");
const storyButton = document.getElementById("storyButton");
const modeOverlay = document.getElementById("modeOverlay");
const politicallyCorrectModeBtn = document.getElementById("politicallyCorrectModeBtn");
const explicitContentModeBtn = document.getElementById("explicitContentModeBtn");

// Override di sviluppo: usa ?devLevel=4 nell'URL per partire da un livello specifico.
const DEV_START_LEVEL_QUERY_PARAM = "devLevel";

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
const resetCustomDataBtn = document.getElementById("resetCustomDataBtn");
const resetConfirmModal = document.getElementById("resetConfirmModal");
const cancelResetCustomDataBtn = document.getElementById("cancelResetCustomDataBtn");
const confirmResetCustomDataBtn = document.getElementById("confirmResetCustomDataBtn");

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
const levelChip = levelValue?.parentElement || null;
const resumeButton = document.getElementById("resumeButton");
const savedLevelNum = document.getElementById("savedLevelNum");
const menuButton = document.getElementById("menuButton");
const finalWipModal = document.getElementById("finalWipModal");
const finalWipMenuButton = document.getElementById("finalWipMenuButton");
const weaponVisionOverlay = document.getElementById("weaponVisionOverlay");
const weaponVisionCaption = document.getElementById("weaponVisionCaption");
const weaponVisionProgress = document.getElementById("weaponVisionProgress");
const weaponVisionTc = document.getElementById("weaponVisionTc");
const weaponVisionTeacherFace = document.getElementById("weaponVisionTeacherFace");
const skipWeaponVisionBtn = document.getElementById("skipWeaponVisionBtn");

// Elementi DOM per la stamina
const hudStamina = document.getElementById("hudStamina");
const staminaBarFill = document.getElementById("staminaBarFill");
const hudStaminaLabel = hudStamina?.querySelector(".hud-label") || null;

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
    powerUpLifetime: 5000,
    powerUpRespawnDelay: 10000,
    firstHeartPowerUpDelay: 7000,
    heartPowerUpLifetime: 5000,
    heartPowerUpRespawnDelay: 10000,
    // Sistema di stamina e schivata
    maxStamina: 100,
    staminaPerDodge: 50,
    staminaRegenRate: 25,
    staminaRegenDelay: 800,
    dodgeDistance: 80,
    dodgeDuration: 200,
    dodgeCooldown: 100,
};

const miniStoryParagraphs = [
    "[SISTEMA] Hackademy nel caos. Gli studenti si sono ribellati e stanno trasformando l'aula in una zona di guerra.",
    "I docenti devono rimettere ordine colpendo studenti, raccogliendo power-up e sopravvivendo abbastanza da arrivare al boss finale.",
    "Entra, menali con eleganza accademica e salva la consegna finale."
];

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
    teacherProjectiles: [],
    effects: [],
    powerUp: null,
    heartPowerUp: null,
    dragonStrike: null,
    studiaStrike: null,
    pendingStudiaShots: 0,
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
    studentSpeechQueue: [],
    activeStudentSpeech: null,
    currentScale: 1,
    currentScaleX: 1,
    currentScaleY: 1,
    rageActive: false,
    pendingDodge: null,
    rageMeter: 0,
    rageActiveUntil: 0,
    rageDurationMs: 5000,
    levelSevenWeaponUnlocked: false,
    debris: [],
    contentMode: null,
    bonusRoad: null,
    roadTripNosHeldCount: 0,
    lastRageParticleSpawnAt: 0,
    shakeOffsetX: 0,
    shakeOffsetY: 0,
    cutsceneTimeoutIds: [],
    cutsceneIntervalIds: [],
    activeCutsceneSkipHandler: null
};

const audioState = {
    context: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    musicIntervalId: null,
    roadTripEngineIntervalId: null,
    roadTripEnginePhase: 0,
    nextMusicTime: 0,
    musicEnabled: false,
    ambientPulseLfo: null,
    speechEnabled: "speechSynthesis" in window,
    speechPrimed: false,
    muted: false
};

function getViewportMetrics() {
    const visualViewport = window.visualViewport;
    return {
        width: Math.max(1, Math.round(visualViewport?.width || window.innerWidth || gameViewport?.clientWidth || GAME.width)),
        height: Math.max(1, Math.round(visualViewport?.height || window.innerHeight || gameViewport?.clientHeight || GAME.height))
    };
}

function isTouchViewport() {
    return (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || (navigator.maxTouchPoints || 0) > 0;
}

function isCompactMobileViewport() {
    const { width, height } = getViewportMetrics();
    return isTouchViewport() || width <= 1024 || height <= 820;
}

function syncViewportCssVars() {
    const { width, height } = getViewportMetrics();
    document.documentElement.style.setProperty("--app-width", `${width}px`);
    document.documentElement.style.setProperty("--app-height", `${height}px`);
}

function applyDeviceUiMode() {
    document.body.classList.toggle("mobile-optimized", isCompactMobileViewport());
}

function updateViewportLayout() {
    syncViewportCssVars();
    applyDeviceUiMode();
    updateGameScale();
}

function attemptImmersiveMode() {
    if (!isCompactMobileViewport()) {
        return;
    }

    const fullscreenTarget = document.documentElement;
    const requestFullscreen =
        fullscreenTarget.requestFullscreen ||
        fullscreenTarget.webkitRequestFullscreen ||
        fullscreenTarget.msRequestFullscreen;

    if (!document.fullscreenElement && typeof requestFullscreen === "function") {
        Promise.resolve(requestFullscreen.call(fullscreenTarget, { navigationUI: "hide" })).catch(() => {});
    }

    if (screen.orientation && typeof screen.orientation.lock === "function") {
        screen.orientation.lock("landscape").catch(() => {});
    }

    window.setTimeout(updateViewportLayout, 120);
}

function applyGameAreaTransform() {
    const scaleX = state.currentScaleX || state.currentScale || 1;
    const scaleY = state.currentScaleY || state.currentScale || 1;
    const dx = state.shakeOffsetX || 0;
    const dy = state.shakeOffsetY || 0;
    gameArea.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
}

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
        bossKind: "greatSlacker",
        summoningDuration: 5000,
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
            
            // Server racks removed (Level 3) // removed to match new design

            // Chaotic scattered obstacles (well-spaced to prevent movement blocks)
            { x: 100, y: 140, width: 134, height: 66, type: "desk" },
            { x: 146, y: 206, width: 42, height: 34, type: "chair" },
            { x: 80, y: 420, width: 40, height: 48, type: "bin" },
            { x: 380, y: 300, width: 46, height: 58, type: "plant" },
            { x: 340, y: 480, width: 134, height: 66, type: "desk" },

            { x: 880, y: 320, width: 134, height: 66, type: "desk" },
            { x: 1120, y: 150, width: 134, height: 66, type: "desk" },
            { x: 1080, y: 220, width: 42, height: 34, type: "chair" },
            { x: 850, y: 100, width: 40, height: 48, type: "bin" },
            { x: 1150, y: 420, width: 46, height: 58, type: "plant" },

            { x: 580, y: 580, width: 134, height: 66, type: "desk" },
            { x: 626, y: 646, width: 42, height: 34, type: "chair" }
        ]
    },
    {
        id: 4,
        mode: "roadTrip",
        projectilesPerShot: 1,
        playerSpawn: { x: 170, y: 320 },
        studentSpawns: [],
        obstacles: []
    },
    {
        id: 5,
        projectilesPerShot: 3,
        playerSpawn: { x: 88, y: 616 },
        studentSpawns: [
            { x: 1060, y: 118, studentType: "fast", speechType: "panicked", roleLabel: "NASPI" },
            { x: 1114, y: 554, studentType: "shooter", speechType: "boomer", roleLabel: "SPID" },
            { x: 856, y: 176, studentType: "shooter", speechType: "passacarte", roleLabel: "MODULI" },
            { x: 688, y: 602, studentType: "dodger", speechType: "spid", roleLabel: "OTP" },
            { x: 414, y: 134, studentType: "cheater", speechType: "caf", roleLabel: "CAF" },
            { x: 962, y: 354, studentType: "shooter", speechType: "boomer", roleLabel: "PIN" },
            { x: 536, y: 268, studentType: "fast", speechType: "panicked", roleLabel: "AIUTO" }
        ],
        obstacles: [
            { x: 0, y: 0, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 696, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 0, width: 24, height: 720, type: "wall" },
            { x: 1256, y: 0, width: 24, height: 720, type: "wall" },
            { x: 510, y: 126, width: 260, height: 26, type: "barrier" },
            { x: 540, y: 218, width: 200, height: 148, type: "kiosk" },
            { x: 214, y: 238, width: 198, height: 52, type: "bench" },
            { x: 868, y: 238, width: 198, height: 52, type: "bench" },
            { x: 138, y: 132, width: 72, height: 174, type: "sign" },
            { x: 1070, y: 132, width: 72, height: 174, type: "sign" },
            { x: 246, y: 492, width: 108, height: 52, type: "planter" },
            { x: 926, y: 492, width: 108, height: 52, type: "planter" },
            { x: 472, y: 416, width: 62, height: 34, type: "scooter" },
            { x: 746, y: 416, width: 62, height: 34, type: "scooter" },
            { x: 420, y: 572, width: 40, height: 48, type: "bin" },
            { x: 818, y: 572, width: 40, height: 48, type: "bin" }
        ]
    },
    {
        id: 6,
        projectilesPerShot: 4,
        playerSpawn: { x: 98, y: 626 },
        studentSpawns: [
            { x: 1040, y: 112, studentType: "shooter", speechType: "vocal", roleLabel: "VOCALI" },
            { x: 1142, y: 584, studentType: "fast", speechType: "panicked", roleLabel: "AIUTO" },
            { x: 796, y: 118, studentType: "cheater", speechType: "caf", roleLabel: "CAF" },
            { x: 902, y: 602, studentType: "dodger", speechType: "spid", roleLabel: "OTP" },
            { x: 624, y: 202, studentType: "shooter", speechType: "passacarte", roleLabel: "MODULI" },
            { x: 468, y: 602, studentType: "shooter", speechType: "boomer", roleLabel: "PIN" },
            { x: 282, y: 164, studentType: "fast", speechType: "panicked", roleLabel: "NASPI" },
            { x: 986, y: 362, studentType: "shooter", speechType: "vocal", roleLabel: "AUDIO" }
        ],
        obstacles: [
            { x: 0, y: 0, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 696, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 0, width: 24, height: 720, type: "wall" },
            { x: 1256, y: 0, width: 24, height: 720, type: "wall" },
            { x: 490, y: 86, width: 300, height: 92, type: "stage" },
            { x: 246, y: 188, width: 176, height: 26, type: "barrier" },
            { x: 858, y: 188, width: 176, height: 26, type: "barrier" },
            { x: 560, y: 254, width: 160, height: 26, type: "barrier" },
            { x: 126, y: 254, width: 70, height: 88, type: "speaker" },
            { x: 1084, y: 254, width: 70, height: 88, type: "speaker" },
            { x: 88, y: 376, width: 72, height: 170, type: "sign" },
            { x: 1120, y: 376, width: 72, height: 170, type: "sign" },
            { x: 232, y: 424, width: 202, height: 52, type: "bench" },
            { x: 846, y: 424, width: 202, height: 52, type: "bench" },
            { x: 552, y: 480, width: 184, height: 150, type: "kiosk" },
            { x: 450, y: 310, width: 62, height: 34, type: "scooter" },
            { x: 772, y: 310, width: 62, height: 34, type: "scooter" },
            { x: 454, y: 598, width: 62, height: 34, type: "scooter" },
            { x: 768, y: 598, width: 62, height: 34, type: "scooter" },
            { x: 360, y: 560, width: 40, height: 48, type: "bin" },
            { x: 878, y: 560, width: 40, height: 48, type: "bin" }
        ]
    },
    {
        id: 7,
        projectilesPerShot: 4,
        playerSpawn: { x: 88, y: 342 },
        bossKind: "spidOverlord",
        summoningDuration: 5500,
        studentSpawns: [
            { x: 536, y: 250, studentType: "shooter", speechType: "passacarte", roleLabel: "OTP" },
            { x: 694, y: 250, studentType: "cheater", speechType: "caf", roleLabel: "CAF" },
            { x: 536, y: 430, studentType: "shooter", speechType: "vocal", roleLabel: "AUDIO" },
            { x: 694, y: 430, studentType: "dodger", speechType: "spid", roleLabel: "SPID" }
        ],
        obstacles: [
            { x: 0, y: 0, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 696, width: 1280, height: 24, type: "wall" },
            { x: 0, y: 0, width: 24, height: 720, type: "wall" },
            { x: 1256, y: 0, width: 24, height: 720, type: "wall" },
            { x: 142, y: 120, width: 188, height: 30, type: "barrier" },
            { x: 952, y: 120, width: 188, height: 30, type: "barrier" },
            { x: 142, y: 570, width: 188, height: 30, type: "barrier" },
            { x: 952, y: 570, width: 188, height: 30, type: "barrier" },
            { x: 176, y: 264, width: 70, height: 88, type: "speaker" },
            { x: 1034, y: 264, width: 70, height: 88, type: "speaker" },
            { x: 378, y: 114, width: 84, height: 170, type: "sign" },
            { x: 818, y: 114, width: 84, height: 170, type: "sign" },
            { x: 374, y: 504, width: 84, height: 170, type: "sign" },
            { x: 822, y: 504, width: 84, height: 170, type: "sign" },
            { x: 566, y: 148, width: 146, height: 84, type: "stage" },
            { x: 566, y: 488, width: 146, height: 84, type: "stage" },
            { x: 312, y: 330, width: 168, height: 58, type: "bench" },
            { x: 800, y: 330, width: 168, height: 58, type: "bench" },
            { x: 498, y: 342, width: 62, height: 34, type: "scooter" },
            { x: 720, y: 342, width: 62, height: 34, type: "scooter" },
            { x: 574, y: 302, width: 130, height: 118, type: "terminal" }
        ]
    }
];

function isDevelopmentStartLevelEnabled() {
    return window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function getDevelopmentStartLevelOverride() {
    if (!isDevelopmentStartLevelEnabled()) {
        return null;
    }

    const params = new URLSearchParams(window.location.search);
    const rawLevel = params.get(DEV_START_LEVEL_QUERY_PARAM);
    const parsedLevel = Number.parseInt(rawLevel || "", 10);

    if (!Number.isInteger(parsedLevel) || parsedLevel < 1 || parsedLevel > levelConfigs.length) {
        return null;
    }

    return parsedLevel;
}

function isRoadTripLevel(levelNumber = state.currentLevel) {
    const level = levelConfigs.find((entry) => entry.id === levelNumber);
    return level?.mode === "roadTrip";
}

function isRoadTripActive() {
    return Boolean(state.bonusRoad?.active);
}

function isLevelSixMachineGunActive() {
    return state.currentLevel === 7 && state.levelSevenWeaponUnlocked;
}

function registerCutsceneTimeout(callback, delay) {
    const timeoutId = window.setTimeout(() => {
        state.cutsceneTimeoutIds = state.cutsceneTimeoutIds.filter((id) => id !== timeoutId);
        callback();
    }, delay);
    state.cutsceneTimeoutIds.push(timeoutId);
    return timeoutId;
}

function registerCutsceneInterval(callback, delay) {
    const intervalId = window.setInterval(callback, delay);
    state.cutsceneIntervalIds.push(intervalId);
    return intervalId;
}

function clearCutsceneTimers() {
    state.cutsceneTimeoutIds.forEach((id) => window.clearTimeout(id));
    state.cutsceneIntervalIds.forEach((id) => window.clearInterval(id));
    state.cutsceneTimeoutIds = [];
    state.cutsceneIntervalIds = [];
}

function resetCutsceneOverlays() {
    state.activeCutsceneSkipHandler = null;

    if (weaponVisionOverlay) {
        weaponVisionOverlay.classList.add("d-none");
        weaponVisionOverlay.classList.remove("playing");
    }
    if (weaponVisionCaption) {
        weaponVisionCaption.textContent = "Segnale dal cloud... upgrade in arrivo.";
    }
    if (weaponVisionProgress) {
        weaponVisionProgress.style.width = "0%";
    }
    if (weaponVisionTc) {
        weaponVisionTc.textContent = "TC 00:00:00:00";
    }

    const bossIntroOverlay = document.getElementById("bossIntroOverlay");
    if (bossIntroOverlay) {
        bossIntroOverlay.classList.add("d-none");
    }
}

function clearActiveCutscenes() {
    clearCutsceneTimers();
    resetCutsceneOverlays();
}

function getPlayerAttackCooldown() {
    if (isRoadTripActive()) {
        return 240;
    }
    return isLevelSixMachineGunActive() ? 95 : GAME.attackCooldown;
}

function getPlayerWeaponToolStyle() {
    const selectedTeacher = getSelectedTeacher();
    if (isLevelSixMachineGunActive()) {
        return "machinegun";
    }
    return selectedTeacher?.toolStyle || "hammer";
}

function setLevelSevenWeaponUnlocked(isUnlocked) {
    state.levelSevenWeaponUnlocked = Boolean(isUnlocked);

    if (state.player) {
        applyPlayerWeaponAppearance(state.player);
    }

    updateAttackButtonAppearance();
}

function clearBonusRoad() {
    stopRoadTripEngineSound();
    state.roadTripNosHeldCount = 0;
    if (!state.bonusRoad) {
        state.player?.element?.classList.remove("roadtrip-engine-on");
        gameArea.removeAttribute("data-roadtrip-lane");
        gameArea.classList.remove("roadtrip-finale");
        return;
    }

    state.bonusRoad.entities?.forEach((entity) => clearSpeechForEntity(entity, false));
    state.bonusRoad.entities?.forEach((entity) => entity.element?.remove());
    state.bonusRoad.projectiles?.forEach((projectile) => projectile.element?.remove());
    state.bonusRoad.entities = [];
    state.bonusRoad.projectiles = [];
    gameArea.style.removeProperty("--road-shift");
    gameArea.classList.remove("roadtrip-mode");
    gameArea.classList.remove("roadtrip-finale");
    gameArea.removeAttribute("data-roadtrip-lane");
    state.player?.element?.classList.remove("roadtrip-engine-on");
    state.bonusRoad = null;
}

function setupRoadTripLevel() {
    clearBonusRoad();
    gameArea.classList.add("roadtrip-mode");
    const laneGrounds = [522, 592, 660];
    state.bonusRoad = {
        active: true,
        distance: 0,
        goalDistance: 10000,
        baseScrollSpeed: 4.05,
        scrollSpeed: 4.05,
        spawnTimer: 1180,
        groundY: 592,
        laneGrounds,
        currentLane: 1,
        targetLane: 1,
        playerVisualY: laneGrounds[1] - 86,
        targetPlayerY: laneGrounds[1] - 86,
        jumpStartedAt: 0,
        jumpEndsAt: 0,
        jumpHeight: 132,
        jumpRampBoost: false,
        rampRushUntil: 0,
        jumpInputLatched: false,
        laneInputLatched: false,
        warningStage: 0,
        arrivalTriggered: false,
        entities: [],
        projectiles: []
    };

    state.player.width = 138;
    state.player.height = 86;
    state.player.direction = "right";
    state.player.x = 118;
    state.player.y = state.bonusRoad.playerVisualY;
    state.player.roadTripNosLevel = 0;
    state.player.element.style.setProperty("--roadtrip-car-tilt", "0deg");
    state.player.element.style.setProperty("--roadtrip-car-scale-x", "1");
    state.player.element.style.setProperty("--roadtrip-car-scale-y", "1");
    state.player.element.style.setProperty("--roadtrip-wheel-lift", "0px");
    state.player.element.classList.add("bonus-driving");
    state.player.element.classList.add("roadtrip-engine-on");
    state.player.element.classList.remove("attacking", "dodging");
    gameArea.dataset.roadtripLane = "2";
    syncRoadTripPlayer();
    startRoadTripEngineSound();
    updateAttackButtonAppearance();

    window.setTimeout(() => {
        if (state.currentLevel === 4 && state.bonusRoad?.active) {
            showToast("🚗 Roadtrip per Piazza del Ferrarese: cambia corsia con su e giu', lancia il martello con Space e attiva il NOS con Ctrl.");
        }
    }, 900);
}

function teardownRoadTripPlayerState() {
    if (!state.player) {
        return;
    }

    state.player.width = 62;
    state.player.height = 74;
    state.player.element.style.removeProperty("transform");
    state.player.element.style.removeProperty("--roadtrip-car-tilt");
    state.player.element.style.removeProperty("--roadtrip-car-scale-x");
    state.player.element.style.removeProperty("--roadtrip-car-scale-y");
    state.player.element.style.removeProperty("--roadtrip-wheel-lift");
    state.player.element.classList.remove("bonus-driving", "bonus-jumping", "roadtrip-engine-on", "speed-boosted", "roadtrip-rage-truck");
}

function getRoadTripJumpOffset() {
    if (!isRoadTripActive()) {
        return 0;
    }

    const now = performance.now();
    if (now >= state.bonusRoad.jumpEndsAt) {
        state.bonusRoad.jumpRampBoost = false;
        return 0;
    }

    const duration = Math.max(1, state.bonusRoad.jumpEndsAt - state.bonusRoad.jumpStartedAt);
    const progress = clamp((now - state.bonusRoad.jumpStartedAt) / duration, 0, 1);
    const arc = Math.sin(progress * Math.PI);
    return Math.pow(arc, 0.82) * state.bonusRoad.jumpHeight;
}

function getRoadTripJumpMotion() {
    if (!isRoadTripActive()) {
        return {
            offset: 0,
            progress: 0,
            active: false,
            forward: 0,
            tilt: 0,
            scaleX: 1,
            scaleY: 1,
            wheelLift: 0
        };
    }

    const now = performance.now();
    if (now >= state.bonusRoad.jumpEndsAt) {
        state.bonusRoad.jumpRampBoost = false;
        return {
            offset: 0,
            progress: 0,
            active: false,
            forward: 0,
            tilt: 0,
            scaleX: 1,
            scaleY: 1,
            wheelLift: 0
        };
    }

    const duration = Math.max(1, state.bonusRoad.jumpEndsAt - state.bonusRoad.jumpStartedAt);
    const progress = clamp((now - state.bonusRoad.jumpStartedAt) / duration, 0, 1);
    const arc = Math.sin(progress * Math.PI);
    const offset = Math.pow(arc, 0.82) * state.bonusRoad.jumpHeight;
    const rampBoost = Boolean(state.bonusRoad.jumpRampBoost);
    const forward = rampBoost
        ? (Math.sin(progress * Math.PI) * 26) + (Math.sin(progress * Math.PI * 0.68) * 22)
        : Math.sin(progress * Math.PI) * 8;
    const tilt = rampBoost
        ? (progress < 0.52
            ? (-13 * Math.sin((progress / 0.52) * (Math.PI / 2)))
            : (9 * Math.sin(((progress - 0.52) / 0.48) * (Math.PI / 2))))
        : (progress < 0.5 ? -4 : 3);
    const scaleX = rampBoost ? 1 + (arc * 0.03) : 1 + (arc * 0.015);
    const scaleY = rampBoost ? 1 - (arc * 0.045) : 1 - (arc * 0.02);
    const wheelLift = rampBoost ? (-6 * arc) : (-2 * arc);

    return {
        offset,
        progress,
        active: true,
        forward,
        tilt,
        scaleX,
        scaleY,
        wheelLift
    };
}

function syncRoadTripPlayer() {
    if (!state.player) {
        return;
    }

    const jumpMotion = getRoadTripJumpMotion();
    const bob = jumpMotion.active ? 0 : Math.sin(state.gameTimeMs / 120) * 3;
    state.player.element.style.transform = `translate(${state.player.x + jumpMotion.forward}px, ${state.player.y - jumpMotion.offset + bob}px)`;
    state.player.element.style.setProperty("--roadtrip-car-tilt", `${jumpMotion.tilt.toFixed(2)}deg`);
    state.player.element.style.setProperty("--roadtrip-car-scale-x", jumpMotion.scaleX.toFixed(3));
    state.player.element.style.setProperty("--roadtrip-car-scale-y", jumpMotion.scaleY.toFixed(3));
    state.player.element.style.setProperty("--roadtrip-wheel-lift", `${jumpMotion.wheelLift.toFixed(2)}px`);
}

function triggerRoadTripJump() {
    return triggerRoadTripJumpWithOptions();
}

function triggerRoadTripJumpWithOptions(options = {}) {
    if (!isRoadTripActive()) {
        return false;
    }

    const now = performance.now();
    if (now < state.bonusRoad.jumpEndsAt && !options.force) {
        return false;
    }

    const jumpDuration = Number.isFinite(options.duration) ? options.duration : 620;
    const jumpHeight = Number.isFinite(options.height) ? options.height : 132;
    state.bonusRoad.jumpStartedAt = now;
    state.bonusRoad.jumpEndsAt = now + jumpDuration;
    state.bonusRoad.jumpHeight = jumpHeight;
    state.bonusRoad.jumpRampBoost = Boolean(options.rampBoost);
    state.bonusRoad.rampRushUntil = options.rampBoost ? now + (jumpDuration * 0.78) : 0;
    state.player.element.classList.add("bonus-jumping");
    if (options.rampBoost) {
        playRampBoostSound();
    } else {
        playSpeedSound();
    }
    syncRoadTripPlayer();
    return true;
}

function getRoadTripLaneGround(laneIndex) {
    const lanes = state.bonusRoad?.laneGrounds || [522, 592, 660];
    return lanes[clamp(laneIndex, 0, lanes.length - 1)];
}

function getRoadTripLanePlayerY(laneIndex) {
    return getRoadTripLaneGround(laneIndex) - state.player.height;
}

function adjustRoadTripNosHeldCount(delta) {
    state.roadTripNosHeldCount = Math.max(0, (state.roadTripNosHeldCount || 0) + delta);
    if (state.roadTripNosHeldCount > 0) {
        state.keys.add("control");
    } else {
        state.keys.delete("control");
    }
}

function getRoadTripPlayerLaneFloat() {
    if (!isRoadTripActive() || !state.player) {
        return 0;
    }

    const laneGrounds = state.bonusRoad.laneGrounds || [522, 592, 660];
    const playerGroundY = state.player.y + state.player.height;

    for (let i = 0; i < laneGrounds.length - 1; i += 1) {
        const currentGround = laneGrounds[i];
        const nextGround = laneGrounds[i + 1];
        if (playerGroundY >= currentGround && playerGroundY <= nextGround) {
            const progress = (playerGroundY - currentGround) / Math.max(1, nextGround - currentGround);
            return i + progress;
        }
    }

    if (playerGroundY < laneGrounds[0]) {
        return 0;
    }

    return laneGrounds.length - 1;
}

function isRoadTripEntityInPlayerLane(entity) {
    if (!isRoadTripActive() || !entity || typeof entity.lane !== "number") {
        return false;
    }

    const playerLaneFloat = getRoadTripPlayerLaneFloat();
    return Math.abs(entity.lane - playerLaneFloat) <= 0.42;
}

function shiftRoadTripLane(direction) {
    if (!isRoadTripActive() || !state.player) {
        return false;
    }

    const nextLane = clamp((state.bonusRoad.targetLane ?? state.bonusRoad.currentLane ?? 1) + direction, 0, state.bonusRoad.laneGrounds.length - 1);
    if (nextLane === state.bonusRoad.targetLane) {
        return false;
    }

    state.bonusRoad.targetLane = nextLane;
    state.bonusRoad.targetPlayerY = getRoadTripLanePlayerY(nextLane);
    gameArea.dataset.roadtripLane = String(nextLane + 1);
    return true;
}

function updateRoadTripPlayerLane(delta) {
    if (!isRoadTripActive() || !state.player) {
        return;
    }

    const targetY = state.bonusRoad.targetPlayerY ?? state.player.y;
    const currentY = state.bonusRoad.playerVisualY ?? state.player.y;
    const laneSpeed = (12 + (getRoadTripNosLevel(performance.now()) * 4)) * delta;
    const difference = targetY - currentY;

    if (Math.abs(difference) <= laneSpeed) {
        state.bonusRoad.playerVisualY = targetY;
        state.player.y = targetY;
        state.bonusRoad.currentLane = state.bonusRoad.targetLane;
        return;
    }

    const nextY = currentY + Math.sign(difference) * laneSpeed;
    state.bonusRoad.playerVisualY = nextY;
    state.player.y = nextY;
}

function getRoadTripEntityConfig(type) {
    return {
        student: { width: 62, height: 84, speed: 1.58, removable: true, damage: 1, jumpClearance: 66, yOffset: 84 },
        boomer: { width: 74, height: 92, speed: 1.28, removable: true, damage: 1, jumpClearance: 72, yOffset: 92 },
        ultra: { width: 76, height: 92, speed: 1.48, removable: true, damage: 1, jumpClearance: 72, yOffset: 92 },
        pothole: { width: 132, height: 30, speed: 1.18, removable: false, damage: 1, jumpClearance: 34, yOffset: 14 },
        barrier: { width: 82, height: 58, speed: 1.46, removable: true, damage: 1, jumpClearance: 68, yOffset: 58 },
        scooter: { width: 108, height: 52, speed: 1.32, removable: true, damage: 1, jumpClearance: 58, yOffset: 52 },
        ramptruck: { width: 176, height: 92, speed: 1.08, removable: false, damage: 0, jumpClearance: 0, yOffset: 92, rampBoost: true, jumpHeightBoost: 214, jumpDurationBoost: 920 }
    }[type];
}

function spawnRoadTripEntityInstance(type, lane, xOffset = 0) {
    if (!isRoadTripActive()) {
        return null;
    }

    const config = getRoadTripEntityConfig(type);
    if (!config) {
        return null;
    }

    const y = getRoadTripLaneGround(lane) - config.yOffset;
    const element = document.createElement("div");
    element.className = `roadtrip-entity roadtrip-${type}`;
    element.innerHTML = getRoadTripEntityMarkup(type);
    element.dataset.lane = String(lane + 1);

    gameArea.appendChild(element);
    const entity = {
        type,
        speechType: {
            student: "roadtripPeroni",
            boomer: "roadtripTablet",
            ultra: "roadtripUltra"
        }[type] || type,
        lane,
        x: GAME.width + 40 + xOffset,
        y,
        width: config.width,
        height: config.height,
        speed: config.speed,
        removable: config.removable,
        damage: config.damage,
        canThrowBeer: type === "student",
        beerThrown: false,
        canSpeak: type === "student" || type === "boomer" || type === "ultra",
        speechTriggered: false,
        speechRoll: Math.random() < 0.58,
        speechTriggerX: state.player.x + randomBetween(120, 420),
        jumpClearance: config.jumpClearance,
        rampBoost: Boolean(config.rampBoost),
        rampConsumed: false,
        jumpHeightBoost: config.jumpHeightBoost || 0,
        jumpDurationBoost: config.jumpDurationBoost || 0,
        element
    };
    state.bonusRoad.entities.push(entity);
    return entity;
}

function getRoadTripWarningText() {
    if (!isRoadTripActive()) {
        return "";
    }

    const remainingMeters = Math.max(0, Math.ceil((state.bonusRoad.goalDistance - state.bonusRoad.distance) / 100));
    const nosLevel = getRoadTripNosLevel(performance.now());
    if (nosLevel === 2) {
        return "NOS doppio attivo";
    }
    if (nosLevel === 1) {
        return "NOS attivo";
    }
    if (remainingMeters <= 18) {
        return "Stand Aulab in vista";
    }
    if (remainingMeters <= 40) {
        return "Traffico SPID altissimo";
    }
    if (remainingMeters <= 70) {
        return "Boomer e OTP in aumento";
    }
    return "Verso Piazza del Ferrarese";
}

function getRoadTripStatusText() {
    if (!isRoadTripActive()) {
        return "";
    }

    const nosLevel = getRoadTripNosLevel(performance.now());
    if (nosLevel === 2) {
        return "Doppia spinta nitro";
    }
    if (nosLevel === 1) {
        return "Spinta nitro in corso";
    }
    return "3 corsie - nos - martello";
}

function spawnRoadTripPattern() {
    if (!isRoadTripActive()) {
        return;
    }

    const progress = state.bonusRoad.distance / state.bonusRoad.goalDistance;
    const lanes = [0, 1, 2];
    const pickLane = () => lanes[Math.floor(Math.random() * lanes.length)];
    const pickOtherLanes = (used) => lanes.filter((lane) => !used.includes(lane));
    const freeLane = pickLane();
    const blockedLanes = pickOtherLanes([freeLane]);

    const earlyPatterns = [
        () => spawnRoadTripEntityInstance(Math.random() < 0.5 ? "student" : "pothole", pickLane()),
        () => spawnRoadTripEntityInstance(Math.random() < 0.5 ? "scooter" : "boomer", pickLane()),
        () => {
            spawnRoadTripEntityInstance("ramptruck", pickLane());
        },
        () => {
            spawnRoadTripEntityInstance("student", blockedLanes[0]);
            spawnRoadTripEntityInstance("ultra", freeLane, 180);
        }
    ];

    const midPatterns = [
        () => {
            spawnRoadTripEntityInstance("pothole", blockedLanes[0]);
            spawnRoadTripEntityInstance("boomer", blockedLanes[1], 180);
        },
        () => {
            spawnRoadTripEntityInstance("ramptruck", freeLane);
            spawnRoadTripEntityInstance("barrier", blockedLanes[0], 170);
        },
        () => {
            spawnRoadTripEntityInstance("student", blockedLanes[0]);
            spawnRoadTripEntityInstance("scooter", blockedLanes[1], 140);
            spawnRoadTripEntityInstance("ultra", freeLane, 250);
        },
        () => {
            spawnRoadTripEntityInstance("boomer", blockedLanes[0]);
            spawnRoadTripEntityInstance("ultra", blockedLanes[1], 150);
        }
    ];

    const latePatterns = [
        () => {
            spawnRoadTripEntityInstance("ramptruck", freeLane);
            spawnRoadTripEntityInstance("barrier", blockedLanes[0], 120);
            spawnRoadTripEntityInstance("boomer", blockedLanes[1], 240);
        },
        () => {
            spawnRoadTripEntityInstance("pothole", blockedLanes[0]);
            spawnRoadTripEntityInstance("scooter", blockedLanes[1], 120);
            spawnRoadTripEntityInstance("ultra", freeLane, 220);
        },
        () => {
            spawnRoadTripEntityInstance("student", blockedLanes[0]);
            spawnRoadTripEntityInstance("boomer", blockedLanes[1], 120);
            spawnRoadTripEntityInstance("ultra", blockedLanes[0], 260);
        },
        () => {
            spawnRoadTripEntityInstance("ramptruck", blockedLanes[0]);
            spawnRoadTripEntityInstance("ultra", freeLane, 170);
        }
    ];

    const patternPool = progress < 0.28 ? earlyPatterns : progress < 0.72 ? midPatterns : latePatterns;
    const pattern = patternPool[Math.floor(Math.random() * patternPool.length)];
    pattern();
}

function getRoadTripEntityMarkup(type) {
    if (type === "student") {
        return `
            <span class="roadtrip-student-shadow"></span>
            <span class="roadtrip-student-legs left"></span>
            <span class="roadtrip-student-legs right"></span>
            <span class="roadtrip-student-body"></span>
            <span class="roadtrip-student-arm left"></span>
            <span class="roadtrip-student-arm right"></span>
            <span class="roadtrip-student-head"></span>
            <span class="roadtrip-student-hair"></span>
            <span class="roadtrip-student-brow"></span>
            <span class="roadtrip-student-eyes"></span>
            <span class="roadtrip-student-nose"></span>
            <span class="roadtrip-student-beer"></span>
        `;
    }
    if (type === "boomer") {
        return `
            <span class="roadtrip-boomer-shadow"></span>
            <span class="roadtrip-boomer-legs left"></span>
            <span class="roadtrip-boomer-legs right"></span>
            <span class="roadtrip-boomer-body"></span>
            <span class="roadtrip-boomer-arm left"></span>
            <span class="roadtrip-boomer-arm right"></span>
            <span class="roadtrip-boomer-head"></span>
            <span class="roadtrip-boomer-hair"></span>
            <span class="roadtrip-boomer-brow"></span>
            <span class="roadtrip-boomer-eyes"></span>
            <span class="roadtrip-boomer-glasses"></span>
            <span class="roadtrip-boomer-tablet"></span>
        `;
    }
    if (type === "ultra") {
        return `
            <span class="roadtrip-ultra-shadow"></span>
            <span class="roadtrip-ultra-legs left"></span>
            <span class="roadtrip-ultra-legs right"></span>
            <span class="roadtrip-ultra-body"></span>
            <span class="roadtrip-ultra-arm left"></span>
            <span class="roadtrip-ultra-arm right"></span>
            <span class="roadtrip-ultra-head"></span>
            <span class="roadtrip-ultra-hair"></span>
            <span class="roadtrip-ultra-brow"></span>
            <span class="roadtrip-ultra-eyes"></span>
            <span class="roadtrip-ultra-scarf"></span>
            <span class="roadtrip-ultra-badge"></span>
        `;
    }
    if (type === "barrier") {
        return `<span class="roadtrip-barrier-plank"></span>`;
    }
    if (type === "scooter") {
        return `<span class="roadtrip-scooter-seat"></span><span class="roadtrip-scooter-wheel front"></span><span class="roadtrip-scooter-wheel rear"></span>`;
    }
    if (type === "ramptruck") {
        return `
            <span class="roadtrip-ramptruck-bed"></span>
            <span class="roadtrip-ramptruck-cab"></span>
            <span class="roadtrip-ramptruck-window"></span>
            <span class="roadtrip-ramptruck-ramp"></span>
            <span class="roadtrip-ramptruck-wheel rear"></span>
            <span class="roadtrip-ramptruck-wheel front"></span>
        `;
    }
    return "";
}

function spawnRoadTripEntity() {
    spawnRoadTripPattern();
}

function fireRoadTripHammer() {
    const projectile = {
        x: state.player.x + state.player.width - 34,
        y: state.player.y + 24,
        width: 28,
        height: 28,
        velocityX: GAME.projectileSpeed * 2.95,
        velocityY: 0,
        ownerId: "road-hammer",
        element: document.createElement("div")
    };

    projectile.element.className = "teacher-projectile roadtrip-hammer-projectile";
    projectile.element.textContent = "🔨";
    gameArea.appendChild(projectile.element);
    syncEntity(projectile);
    state.teacherProjectiles.push(projectile);
    playHammerSound();
    playPlayerRangedAttackAnimation();
}

function isRoadTripNosActive(timestamp = performance.now()) {
    return getRoadTripNosLevel(timestamp) > 0;
}

function getRoadTripNosLevel(timestamp = performance.now()) {
    if (!isRoadTripActive() || !state.player) {
        return 0;
    }

    if (timestamp < state.player.speedBoostUntil) {
        return state.player.roadTripNosLevel || 0;
    }

    if (state.player.speedBoostUntil || state.player.roadTripNosLevel) {
        state.player.speedBoostUntil = 0;
        state.player.roadTripNosLevel = 0;
    }
    return 0;
}

function activateRoadTripNos(timestamp = performance.now()) {
    if (!isRoadTripActive() || !state.player || state.player.isDodging) {
        return false;
    }

    const currentLevel = getRoadTripNosLevel(timestamp);
    if (state.player.stamina < GAME.staminaPerDodge || currentLevel >= 2) {
        return false;
    }

    state.player.stamina -= GAME.staminaPerDodge;
    state.player.lastStaminaUse = timestamp;
    state.player.roadTripNosLevel = currentLevel + 1;
    state.player.speedBoostUntil = timestamp + 1100;
    state.player.element.classList.add("speed-boosted");
    playRoadTripNosSound(currentLevel + 1);
    return true;
}

function applyPlayerWeaponAppearance(player) {
    if (!player?.element) {
        return;
    }

    const weapon = player.element.querySelector(".player-hammer");
    if (!weapon) {
        return;
    }

    weapon.className = `player-hammer tool-${getPlayerWeaponToolStyle()}`;
}

function updateAttackButtonAppearance() {
    const attackButton = document.getElementById("touchAttackBtn");
    const dodgeButton = document.getElementById("touchDodgeBtn");
    if (!attackButton) {
        return;
    }

    if (isRoadTripActive()) {
        attackButton.textContent = "🔨";
        attackButton.setAttribute("aria-label", "Lancia martello");
        if (dodgeButton) {
            dodgeButton.textContent = "⚡";
            dodgeButton.setAttribute("aria-label", "Attiva NOS");
        }
    } else if (isLevelSixMachineGunActive()) {
        attackButton.textContent = "🔫";
        attackButton.setAttribute("aria-label", "Spara");
        if (dodgeButton) {
            dodgeButton.textContent = "💨";
            dodgeButton.setAttribute("aria-label", "Schivata");
        }
    } else {
        attackButton.textContent = "🔨";
        attackButton.setAttribute("aria-label", "Attacca");
        if (dodgeButton) {
            dodgeButton.textContent = "💨";
            dodgeButton.setAttribute("aria-label", "Schivata");
        }
    }
}

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

const speechProfiles = {
    "politically-correct": {
        studentMessages: [
            "non studio!",
            "che schifo Aulab",
            "quando c'era lui",
            "Faccio tutto con l'AI"
        ],
        teacherHitMessages: [
            "Meno ChatGPT!",
            "Torna a studiare",
            "Fallo fare all'AI adesso!"
        ],
        teacherHitMessagesByLevel: {
            4: [
                "Tieni la corsia, stiamo andando in piazza!",
                "Via dalla strada, devo arrivare all'evento!",
                "Il martello oggi si lancia dal finestrino!",
                "Occhio alle buche, il viaggio non e' finito!",
                "Niente imboscate, devo raggiungere il gazebo!"
            ],
            5: [
                "Signori, lo SPID non si attiva lanciando pietre!",
                "Uno alla volta al gazebo, grazie!",
                "L'evento Aulab non e' un CAF improvvisato!",
                "Niente panico digitale, prego!",
                "Le richieste in piazza si fanno senza assaltare il docente!"
            ],
            6: [
                "Giu' le mani dal gazebo Aulab!",
                "I vocali da tre minuti non accelerano la coda!",
                "Il ticket si ritira, non si urla!",
                "Niente assalto allo stand, grazie!",
                "Le OTP non si risolvono prendendo a sassate il docente!"
            ],
            7: [
                "Il Signore dello SPID finisce qui!",
                "Niente OTP infinite oggi!",
                "Autenticazione o no, ti spengo io!",
                "Questo palco non cade per colpa tua!",
                "Basta caos digitale, boss!"
            ]
        },
        typeMessages: {
            fast: [
                "TikTok > studio!",
                "vado a 100 all'ora!",
                "non mi prendi!",
                "vado di fretta!",
                "sono altrove...",
                "Faccio tutto con l'AI"
            ],
            shooter: [
                "prendi questo!",
                "pioggia di pietre!",
                "non mi fermo!",
                "ti colpisco!",
                "tieni!",
                "Faccio tutto con l'AI"
            ],
            dodger: [
                "schivato!",
                "liscio!",
                "copio e scappo!",
                "quasi preso!",
                "ti piacerebbe!",
                "Faccio tutto con l'AI"
            ],
            cheater: [
                "fammi copiare!",
                "passami il codice!",
                "quasi finito di copiare...",
                "copiato tutto!",
                "cheat activated!",
                "Faccio tutto con l'AI"
            ],
            zombie: [
                "Uhhhh... codice...",
                "Deploy... alle 3 di notte...",
                "Caffè... finito...",
                "Bug... infiniti...",
                "Stack overflow..."
            ],
            panicked: [
                "mi aiuta un secondo?!",
                "ho toccato qualcosa!",
                "si e' bloccato tutto!",
                "non trovo piu' la password!",
                "la NASpI mi ha sconfitto!",
                "dov'e' il tasto per uscire?!"
            ],
            boomer: [
                "mi serve lo SPID subito!",
                "mi sente?!",
                "il telefono fa cose strane!",
                "mi hanno detto di chiedere qui!",
                "dove arriva il codice?!",
                "non mi legge la faccia!"
            ],
            roadtripPeroni: [
                "Una bella Peroni sudata",
                "Prendila al volo",
                "Il pooooolpo"
            ],
            roadtripTablet: [
                "Stu tablet non funzion",
                "Teng la pression a 180",
                "Baaar ie' Baaar"
            ],
            roadtripUltra: [
                "Forza Bari",
                "La strad ie' la nost",
                "A do ste a sci'?"
            ],
            spid: [
                "mi serve l'OTP!",
                "ho perso il PIN!",
                "non parte il riconoscimento!",
                "mi dice accesso negato!",
                "non trovo la PEC!",
                "mi aiuta con la CIE?!"
            ],
            passacarte: [
                "ho qui tutti i moduli!",
                "mi manca solo una firma!",
                "glielo stampo subito!",
                "prenda questo foglio!",
                "ho portato tutte le carte!",
                "mi hanno detto di compilare tutto!"
            ],
            vocal: [
                "le mando un vocale!",
                "ascolti questo audio!",
                "gliel'ho spiegato in cinque minuti di messaggio!",
                "ora inoltro tutto sul gruppo!",
                "mi sente? la nota vocale parte da sola!",
                "aspetti che le faccio sentire mio cugino!"
            ],
            caf: [
                "glielo spiego io!",
                "mio cugino al CAF fa prima!",
                "serve un modulo in triplice copia!",
                "tranquilli, so tutto io!",
                "basta cliccare qualcosa!",
                "passi da me con i documenti!"
            ]
        },
        chantMessages: {
            greatSlacker: [
                "Sorgi, o Grande Svogliato!",
                "Evoca il potere dello svacco!",
                "Niente studio oggi!",
                "Grande Svogliato, ascoltaci!",
                "Vieni a liberarci!",
                "La procrastinazione trionferà!"
            ],
            spidOverlord: [
                "Apri il portale dello SPID!",
                "Convalidaci, o signore dei codici!",
                "OTP, sorgi dalla nube!",
                "Grande autenticatore, ascoltaci!",
                "Facci accedere subito!",
                "Che la burocrazia digitale trionfi!"
            ]
        },
        bossMessages: {
            greatSlacker: [
                "SKIBIDIBOPPI"
            ],
            spidOverlord: [
                "Mi serve il codice di verifica!",
                "Chi ha preso il mio OTP?!",
                "Nessuno esce senza autenticazione!",
                "Io sono il Signore dello SPID!",
                "Riconoscimento facciale fallito!"
            ]
        },
        teacherContextMessages: {
            serverPower: [
                "Server power! Zombie offline!"
            ],
            studiaLaunched: [
                "STUDIA lanciato! Inseguira' il boss!"
            ],
            studiaQueued: [
                "Altro STUDIA pronto! Partira' subito dopo!"
            ],
            studiaReady: [
                "STUDIA pronto! Partira' appena arriva il boss!"
            ]
        },
        tts: {
            student: { rate: 1.02, pitch: 1.18, volume: 0.85 },
            teacher: { rate: 1.15, pitch: 0.5, volume: 0.95 },
            boss: { rate: 1.0, pitch: 0.3, volume: 1.0 }
        }
    },
    "explicit-content": {
        studentMessages: [
            "col cazzo che studio!",
            "che merda Aulab!",
            "oggi non faccio un cazzo!",
            "sto progetto del cazzo lo fa l'AI!"
        ],
        teacherHitMessages: [
            "testa di cazzo, torna a studiare!",
            "meno ChatGPT, stronzetto!",
            "falla fare all'AI adesso, merda!"
        ],
        teacherHitMessagesByLevel: {
            4: [
                "Levatevi dal cazzo, sto andando in piazza!",
                "Fuori dalla strada, bestie!",
                "Il martello oggi vola dal finestrino, stronzi!",
                "Se becco un'altra buca mi incazzo sul serio!",
                "Niente agguati, devo arrivare al gazebo intero!"
            ],
            5: [
                "Lo SPID non si attiva rompendo i coglioni!",
                "Uno alla volta al gazebo, porca miseria!",
                "Questo non e' un cazzo di CAF abusivo!",
                "Niente panico di merda, in fila!",
                "Se tirate ancora, vi disinstallo io!"
            ],
            6: [
                "Giu' dal gazebo, bestie!",
                "I vocali del cazzo non vi fanno passare prima!",
                "La coda non si salta urlando come disperati!",
                "State sfondando lo stand, stronzi!",
                "L'OTP non si sblocca a sassate, geni del cazzo!"
            ],
            7: [
                "Tu e il tuo SPID del cazzo finite adesso!",
                "Mo' ti spengo io, boss di merda!",
                "Basta OTP, PIN e troiate digitali!",
                "Scendi dal palco, cesso autenticato!",
                "Il Signore dello SPID oggi va offline!"
            ]
        },
        typeMessages: {
            fast: [
                "non mi prendi manco per il cazzo!",
                "sono troppo veloce, stronzo!",
                "corro come un bastardo!",
                "suca, non mi becchi!",
                "sono gia' dall'altra parte, coglione!",
                "vado a cannone, pezzo di merda!"
            ],
            shooter: [
                "prendi sto sasso, bastardo!",
                "ti sfondo la faccia, prof!",
                "pioggia di pietre, coglione!",
                "tieni questa, pezzo di merda!",
                "mo' ti apro il cranio!",
                "beccati sta sassata del cazzo!"
            ],
            dodger: [
                "schivato, fesso di merda!",
                "liscio come il culo tuo!",
                "copio e scappo, stronzo!",
                "quasi preso un cazzo!",
                "ti piacerebbe, coglione!",
                "suca, non mi tocchi!"
            ],
            cheater: [
                "fammi copiare, testa di minchia!",
                "passami quel codice del cazzo!",
                "sto copiando tutto, stronzo!",
                "copiato tutto, sucate!",
                "cheat attivato, merde!",
                "ctrl c ctrl v e andate affanculo!"
            ],
            zombie: [
                "uhhhh... codice di merda...",
                "deploy del cazzo... alle tre...",
                "caffe' finito... porca troia...",
                "bug infiniti... che inculata...",
                "stack overflow... e fanculo..."
            ],
            panicked: [
                "mi si e' inculato tutto!",
                "ho schiacciato una roba del cazzo!",
                "aiutami che non funziona un cazzo!",
                "non trovo piu' sta password di merda!",
                "la NASpI mi sta massacrando!",
                "dimmi dove devo cliccare, cristo!"
            ],
            boomer: [
                "voglio lo SPID adesso, cazzo!",
                "mi sente o no?!",
                "sto telefono di merda fa come vuole!",
                "mi hanno detto di rompere qui!",
                "dov'e' il cazzo di codice?!",
                "sta faccia non me la legge, merda!"
            ],
            roadtripPeroni: [
                "Awa' sta Peron ghiacciat",
                "A do ste a sci'? A u ciringhit?",
                "Stu baccala'"
            ],
            roadtripTablet: [
                "Angor non ue'",
                "U apparecchj non funzion",
                "L spaghitt c l'angild"
            ],
            roadtripUltra: [
                "Mo ti a da' nu carton",
                "U bombon perchiaaat",
                "Ste a parl o a mov l recchij"
            ],
            spid: [
                "ridammi l'OTP, bastardo!",
                "ho perso il PIN del cazzo!",
                "sto riconoscimento di merda non parte!",
                "mi dice accesso negato, infami!",
                "chi cazzo mi ha nascosto la PEC?!",
                "fammi entrare con sta CIE!"
            ],
            passacarte: [
                "beccati sti moduli del cazzo!",
                "mi manca una firma di merda!",
                "te lo stampo in faccia!",
                "prendi sto foglio, stronzo!",
                "ho una cartella piena di scartoffie!",
                "compila tutto e non rompere i coglioni!"
            ],
            vocal: [
                "ti mando un vocale di otto minuti!",
                "ascolta sto audio del cazzo!",
                "te lo spiego con trentadue messaggi!",
                "ora inoltro tutto al gruppo, merde!",
                "la nota vocale parte e non si ferma piu'!",
                "aspetta che senti mio cugino, bastardo!"
            ],
            caf: [
                "ve la spiego io, minchioni!",
                "mio cugino al CAF ve la chiude in due minuti!",
                "ci vuole un modulo del cazzo in triplice copia!",
                "tranquilli, so tutto io, stronzi!",
                "basta cliccare a caso, no?!",
                "passa da me con tutti i documenti, coglione!"
            ]
        },
        chantMessages: {
            greatSlacker: [
                "sorgi, bestione del cazzo!",
                "evocalo, porca troia!",
                "niente studio, solo casino!",
                "grande svogliato, spaccagli il culo!",
                "vieni a salvarci da sto prof di merda!",
                "la procrastinazione vince, stronzi!"
            ],
            spidOverlord: [
                "apri sto portale del cazzo!",
                "evoca il signore dello SPID, merde!",
                "OTP di merda, materializzati!",
                "grande autenticatore, facci entrare subito!",
                "vieni a devastare sto gazebo del cazzo!",
                "che la burocrazia ci asfalti tutti!"
            ]
        },
        bossMessages: {
            greatSlacker: [
                "SKIBIDIBOPPI, teste di cazzo!",
                "non studio un cazzo!",
                "vi mando tutti affanculo!",
                "sono il boss dei fancazzisti, merde!",
                "fallite tutti, stronzi!"
            ],
            spidOverlord: [
                "dov'e' il cazzo di codice?!",
                "chi mi ha inculato l'OTP?!",
                "nessuno passa senza autenticazione, stronzi!",
                "io sono il Signore dello SPID, merde!",
                "sta procedura di merda e' fallita di nuovo!"
            ]
        },
        teacherContextMessages: {
            serverPower: [
                "server del cazzo, zombie asfaltato!"
            ],
            studiaLaunched: [
                "STUDIA lanciato! Mo' ti entra nel cranio, stronzo!"
            ],
            studiaQueued: [
                "altro STUDIA pronto! mo' sono cazzi tuoi!"
            ],
            studiaReady: [
                "STUDIA pronto! appena arriva quel cesso lo sfondo!"
            ]
        },
        tts: {
            student: { rate: 1.12, pitch: 1.3, volume: 0.95 },
            teacher: { rate: 1.28, pitch: 0.42, volume: 1.0 },
            boss: { rate: 0.88, pitch: 0.24, volume: 1.0 }
        }
    }
};

const musicLeadPattern = [
    261.63, 329.63, 392.0, 329.63,
    293.66, 349.23, 440.0, 349.23
];

const musicBassPattern = [
    130.81, 130.81, 146.83, 146.83,
    164.81, 164.81, 146.83, 146.83
];

const roadTripLeadPattern = [
    659.25, 783.99, 880.0, 783.99,
    698.46, 783.99, 987.77, 783.99
];

const roadTripBassPattern = [
    164.81, 164.81, 164.81, 164.81,
    220.0, 220.0, 196.0, 196.0
];

function showToast(message) {
    const toast = document.getElementById("mapEditorToast");
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function showStoryOverlay() {
    unlockAudio();
    primeSpeechSynthesis();
    attemptImmersiveMode();
    if (storyOverlay) {
        storyOverlay.classList.remove("d-none");
    }
    renderStoryParagraphs(miniStoryParagraphs);
}

function renderStoryParagraphs(paragraphs) {
    if (!storyContent) return;

    storyContent.innerHTML = "";
    paragraphs.forEach((text, index) => {
        const pElement = document.createElement("p");
        pElement.className = "story-paragraph";
        if (index === 0 || text.startsWith("[SISTEMA]")) {
            pElement.classList.add("text-neon-cyan");
        }
        pElement.textContent = text;
        storyContent.appendChild(pElement);
    });
    storyContent.scrollTop = 0;
}

function skipStory() {
    unlockAudio();
    primeSpeechSynthesis();
    attemptImmersiveMode();
    
    if (storyOverlay) {
        storyOverlay.classList.add("d-none");
    }

    if (state.contentMode) {
        showStartSelection();
    } else {
        showModeSelection();
    }
}

function init() {
    // Load muted state
    const storedMuted = localStorage.getItem("aulab_rage_muted");
    audioState.muted = storedMuted === "true";

    loadTeachers();
    loadHackademies();
    updateViewportLayout();
    bindEvents();
    initTouchControls();
    resetGame();
    updateMuteButtonVisual();
    MapEditor.init();
    requestAnimationFrame(gameLoop);
    renderStoryParagraphs(miniStoryParagraphs);
}

function initTouchControls() {
    const joystickContainer = document.getElementById("joystickContainer");
    const joystickKnob = document.getElementById("joystickKnob");
    const touchAttackBtn = document.getElementById("touchAttackBtn");
    const touchDodgeBtn = document.getElementById("touchDodgeBtn");

    if (!joystickContainer || !joystickKnob || !touchAttackBtn || !touchDodgeBtn) return;

    let activeTouchId = null;
    let baseCenterX = 0;
    let baseCenterY = 0;
    const maxRadius = 40; // Max translation in pixels

    function getCenter() {
        const rect = joystickContainer.getBoundingClientRect();
        baseCenterX = rect.left + rect.width / 2;
        baseCenterY = rect.top + rect.height / 2;
    }

    joystickContainer.addEventListener("touchstart", (e) => {
        if (activeTouchId !== null) return;
        getCenter();
        const touch = e.changedTouches[0];
        activeTouchId = touch.identifier;
        handleTouchMove(touch);
        e.preventDefault();
    }, { passive: false });

    joystickContainer.addEventListener("touchmove", (e) => {
        if (activeTouchId === null) return;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === activeTouchId) {
                handleTouchMove(e.touches[i]);
                e.preventDefault();
                break;
            }
        }
    }, { passive: false });

    function handleTouchMove(touch) {
        const dx = touch.clientX - baseCenterX;
        const dy = touch.clientY - baseCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let targetX = dx;
        let targetY = dy;
        
        if (distance > maxRadius) {
            targetX = (dx / distance) * maxRadius;
            targetY = (dy / distance) * maxRadius;
        }
        
        joystickKnob.style.transform = `translate(${targetX}px, ${targetY}px)`;
        
        const normX = targetX / maxRadius;
        const normY = targetY / maxRadius;
        const threshold = 0.35;
        
        if (normX > threshold) {
            state.keys.add("right");
            state.keys.delete("left");
        } else if (normX < -threshold) {
            state.keys.add("left");
            state.keys.delete("right");
        } else {
            state.keys.delete("left");
            state.keys.delete("right");
        }
        
        if (normY > threshold) {
            state.keys.add("down");
            state.keys.delete("up");
        } else if (normY < -threshold) {
            state.keys.add("up");
            state.keys.delete("down");
        } else {
            state.keys.delete("up");
            state.keys.delete("down");
        }
    }

    function resetJoystick() {
        activeTouchId = null;
        joystickKnob.style.transform = "translate(0px, 0px)";
        state.keys.delete("left");
        state.keys.delete("right");
        state.keys.delete("up");
        state.keys.delete("down");
    }

    joystickContainer.addEventListener("touchend", (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouchId) {
                resetJoystick();
                e.preventDefault();
                break;
            }
        }
    });

    joystickContainer.addEventListener("touchcancel", (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouchId) {
                resetJoystick();
                e.preventDefault();
                break;
            }
        }
    });

    function bindTouchAction(button, action, options = {}) {
        const handler = (event) => {
            if (options.onPress) {
                options.onPress();
            }
            action();
            event.preventDefault();
        };

        if ("PointerEvent" in window) {
            button.addEventListener("pointerdown", handler, { passive: false });
            if (options.onRelease) {
                const releaseHandler = () => options.onRelease();
                button.addEventListener("pointerup", releaseHandler, { passive: true });
                button.addEventListener("pointercancel", releaseHandler, { passive: true });
                button.addEventListener("pointerleave", releaseHandler, { passive: true });
            }
        } else {
            button.addEventListener("touchstart", handler, { passive: false });
            if (options.onRelease) {
                const releaseHandler = () => options.onRelease();
                button.addEventListener("touchend", releaseHandler, { passive: true });
                button.addEventListener("touchcancel", releaseHandler, { passive: true });
            }
        }
    }

    bindTouchAction(touchAttackBtn, () => {
        attack();
    }, {
        onPress: () => {
            state.keys.add("attack");
        },
        onRelease: () => {
            state.keys.delete("attack");
        }
    });

    bindTouchAction(touchDodgeBtn, () => {
        if (isRoadTripActive()) {
            activateRoadTripNos(performance.now());
        } else {
            queuePlayerDodge(getPreferredDodgeVector());
        }
    }, {
        onPress: () => {
            if (isRoadTripActive()) {
                adjustRoadTripNosHeldCount(1);
            }
        },
        onRelease: () => {
            adjustRoadTripNosHeldCount(-1);
        }
    });
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
    if (politicallyCorrectModeBtn) {
        politicallyCorrectModeBtn.addEventListener("click", () => {
            selectContentMode("politically-correct");
        });
    }
    if (explicitContentModeBtn) {
        explicitContentModeBtn.addEventListener("click", () => {
            selectContentMode("explicit-content");
        });
    }
    if (finalWipMenuButton) {
        finalWipMenuButton.addEventListener("click", () => {
            closeFinalWipModal();
            resetGame();
        });
    }
    if (skipWeaponVisionBtn) {
        skipWeaponVisionBtn.addEventListener("click", () => {
            if (typeof state.activeCutsceneSkipHandler === "function") {
                state.activeCutsceneSkipHandler();
            }
        });
    }

    window.addEventListener("keydown", (event) => {
        const key = normalizeKey(event.key);

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key) || ["w", "a", "s", "d"].includes(key)) {
            event.preventDefault();
        }

        if (
            weaponVisionOverlay &&
            !weaponVisionOverlay.classList.contains("d-none") &&
            ["space", "enter", "escape"].includes(key)
        ) {
            if (typeof state.activeCutsceneSkipHandler === "function") {
                state.activeCutsceneSkipHandler();
            }
            return;
        }

        if (isRoadTripActive()) {
            if (key === "space") {
                state.keys.add("attack");
                if (!event.repeat) {
                    attack();
                }
                return;
            }
            if (!event.repeat && key === "up") {
                shiftRoadTripLane(-1);
                return;
            }
            if (!event.repeat && key === "down") {
                shiftRoadTripLane(1);
                return;
            }
            if (key === "left" || key === "right") {
                return;
            }
            if (key === "control") {
                if (!event.repeat) {
                    adjustRoadTripNosHeldCount(1);
                    activateRoadTripNos(performance.now());
                }
                return;
            }
        }

        // Gestione schivata con CTRL + direzione
        if (event.ctrlKey && !event.repeat && state.running) {
            let dodgeX = 0;
            let dodgeY = 0;

            if (key === "w" || key === "up") dodgeY = -1;
            if (key === "s" || key === "down") dodgeY = 1;
            if (key === "a" || key === "left") dodgeX = -1;
            if (key === "d" || key === "right") dodgeX = 1;

            // Se premi CTRL mentre ti stai gia muovendo, usa la direzione attuale.
            if (dodgeX === 0 && dodgeY === 0 && key === "control") {
                const movement = getInputVector();
                dodgeX = movement.x;
                dodgeY = movement.y;
            }

            if (dodgeX !== 0 || dodgeY !== 0) {
                // Normalizza il vettore diagonale
                const length = Math.sqrt(dodgeX * dodgeX + dodgeY * dodgeY);
                if (length > 0) {
                    dodgeX /= length;
                    dodgeY /= length;
                }

                // Memorizza la richiesta di schivata invece di eseguirla immediatamente
                state.pendingDodge = {
                    x: dodgeX,
                    y: dodgeY
                };
                return; // Non aggiungere il tasto al movimento normale
            }
        }

        if (key === "space") {
            state.keys.add("attack");
            if (!event.repeat) {
                attack();
            }
            return;
        }

        state.keys.add(key);
    });

    window.addEventListener("keyup", (event) => {
        const key = normalizeKey(event.key);
        state.keys.delete(key);
        if (key === "space") {
            state.keys.delete("attack");
        }
        if (key === "control") {
            adjustRoadTripNosHeldCount(-1);
        }
    });

    window.addEventListener("resize", updateViewportLayout);
    window.addEventListener("orientationchange", updateViewportLayout);
    document.addEventListener("fullscreenchange", updateViewportLayout);
    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", updateViewportLayout);
        window.visualViewport.addEventListener("scroll", updateViewportLayout);
    }

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

    if (resetCustomDataBtn) {
        resetCustomDataBtn.addEventListener("click", openResetConfirmModal);
    }
    if (cancelResetCustomDataBtn) {
        cancelResetCustomDataBtn.addEventListener("click", closeResetConfirmModal);
    }
    if (confirmResetCustomDataBtn) {
        confirmResetCustomDataBtn.addEventListener("click", resetCustomData);
    }

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

    // Story screen listeners
    if (closeStoryButton) {
        closeStoryButton.addEventListener("click", skipStory);
    }
    if (storyButton) {
        storyButton.addEventListener("click", showStoryOverlay);
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

        if (isDestructibleObstacle(config)) {
            element.classList.add("destructible-obstacle");
            const damageOverlay = document.createElement("span");
            damageOverlay.className = "obstacle-damage-overlay";
            element.appendChild(damageOverlay);
        }

        gameArea.appendChild(element);

        if (config.type === "scooter") {
            element.innerHTML = `
                <span class="roadtrip-scooter-seat"></span>
                <span class="roadtrip-scooter-wheel front"></span>
                <span class="roadtrip-scooter-wheel rear"></span>
            `;
        }

        // Decorate server obstacles with LED lights, flames, and flying sparks
        if (config.type === "server") {
            const ledsContainer = document.createElement("div");
            ledsContainer.className = "server-leds";
            for (let i = 0; i < 5; i++) {
                ledsContainer.appendChild(document.createElement("span"));
            }
            element.appendChild(ledsContainer);

            const fire = document.createElement("div");
            fire.className = "server-fire";
            element.appendChild(fire);

            const sparksContainer = document.createElement("div");
            sparksContainer.className = "server-sparks";
            const s1 = document.createElement("span");
            s1.className = "server-spark s1";
            const s2 = document.createElement("span");
            s2.className = "server-spark s2";
            const s3 = document.createElement("span");
            s3.className = "server-spark s3";
            sparksContainer.append(s1, s2, s3);
            element.appendChild(sparksContainer);
        }

        state.obstacles.push({
            ...config,
            element,
            maxHits: isDestructibleObstacle(config) ? 2 : 1,
            hitsTaken: 0
        });
    });
}

function clearObstacles() {
    state.obstacles.forEach((obstacle) => obstacle.element.remove());
    state.obstacles = [];
}

function clearDebris() {
    state.debris.forEach((entry) => entry.element?.remove());
    state.debris = [];
}

function resetGame() {
    deactivateRageMode();
    clearEntities();
    stopRoadTripEngineSound();
    stopStudentSpeech();
    state.roadTripNosHeldCount = 0;
    state.keys.delete("attack");

    state.running = false;
    state.gameOver = false;
    state.victory = false;
    state.currentLevel = 1;
    state.lastAttackAt = 0;
    state.gameTimeMs = 0;
    state.nextPowerUpAt = getPowerUpSpawnWindowDelay();
    state.nextHeartPowerUpAt = getHeartPowerUpRespawnDelay();
    state.levelSevenWeaponUnlocked = false;
    buildLevel(state.currentLevel, true);
    updateHud();

    if (state.contentMode) {
        showStartSelection();
    } else {
        hideStartSelection();
        closeModeOverlay();
    }
    endOverlay.classList.add("d-none");
    closeFinalWipModal();
    if (intermissionOverlay) {
        intermissionOverlay.classList.add("d-none");
    }
    updateResumeButton();
}

function resumeGame() {
    unlockAudio();
    primeSpeechSynthesis();
    attemptImmersiveMode();
    const savedLevel = localStorage.getItem("aulab_rage_saved_level");
    const parsedLevel = parseInt(savedLevel, 10);
    if (parsedLevel && parsedLevel > 1 && parsedLevel <= levelConfigs.length) {
        selectHackademy("standard", false);

        buildLevel(parsedLevel, true);
        state.running = true;
        state.gameOver = false;
        state.victory = false;
        state.lastFrame = performance.now();
        startOverlay.classList.add("d-none");
        endOverlay.classList.add("d-none");
        closeFinalWipModal();
        startBackgroundMusic();
    }
}

function updateResumeButton() {
    if (!resumeButton) return;
    const savedLevel = localStorage.getItem("aulab_rage_saved_level");
    const parsedLevel = parseInt(savedLevel, 10);
    if (parsedLevel && parsedLevel > 1 && parsedLevel <= levelConfigs.length) {
        if (savedLevelNum) {
            savedLevelNum.textContent = parsedLevel;
        }
        resumeButton.classList.remove("d-none");
    } else {
        resumeButton.classList.add("d-none");
    }
}

function clearEntities() {
    clearActiveCutscenes();
    clearBonusRoad();
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

    [state.player, ...state.students, ...state.projectiles, ...state.teacherProjectiles, ...state.effects, state.powerUp, state.heartPowerUp, state.dragonStrike, state.studiaStrike]
        .filter(Boolean)
        .forEach((entity) => entity.element.remove());

    state.students = [];
    state.projectiles = [];
    state.teacherProjectiles = [];
    state.effects = [];
    state.powerUp = null;
    state.heartPowerUp = null;
    state.dragonStrike = null;
    state.studiaStrike = null;
    state.pendingStudiaShots = 0;
    state.player = null; // Risolve il bug del riavvio ricreando l'elemento del player nel DOM
    if (intermissionOverlay) {
        intermissionOverlay.classList.add("d-none");
    }
}

function clearLevelActors(keepPlayer = true) {
    clearActiveCutscenes();
    clearBonusRoad();
    clearDebris();
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
        ...state.teacherProjectiles,
        ...state.effects,
        state.powerUp,
        state.heartPowerUp,
        state.dragonStrike,
        state.studiaStrike
    ];

    entitiesToRemove
        .filter(Boolean)
        .forEach((entity) => entity.element.remove());

    state.students = [];
    state.projectiles = [];
    state.teacherProjectiles = [];
    state.effects = [];
    state.powerUp = null;
    state.heartPowerUp = null;
    state.dragonStrike = null;
    state.studiaStrike = null;
    state.pendingStudiaShots = 0;
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

function resetCustomData() {
    localStorage.removeItem("aulab_rage_teachers");
    localStorage.removeItem("aulab_rage_hackademies");
    localStorage.removeItem("aulab_rage_saved_level");
    localStorage.setItem("aulab_rage_selected_teacher", "valerio");
    localStorage.setItem("aulab_rage_selected_hackademy", "standard");

    state.teachers = [...defaultTeachers];
    state.hackademies = [...defaultHackademies];
    state.selectedTeacherId = "valerio";
    state.selectedHackademyId = "standard";

    renderTeacherCards();
    renderHackademyPills();
    updateStartDescription();
    closeResetConfirmModal();
    resetGame();
}

function openResetConfirmModal() {
    if (!resetConfirmModal) {
        return;
    }

    resetConfirmModal.classList.remove("d-none");
}

function closeResetConfirmModal() {
    if (!resetConfirmModal) {
        return;
    }

    resetConfirmModal.classList.add("d-none");
}

function updateStartDescription() {
    if (startDescription) {
        startDescription.textContent = "";
    }
}

function getSelectedTeacher() {
    return state.teachers.find(t => t.id === state.selectedTeacherId) || state.teachers[0];
}

function getCurrentLevelConfig() {
    return levelConfigs.find((level) => level.id === state.currentLevel) || levelConfigs[0];
}

function overlapsBlockingActor(entity, actors = []) {
    const entityRect = expandRect(getCollisionRect(entity), 4);
    return actors.some((actor) => actor && rectsIntersect(entityRect, expandRect(getCollisionRect(actor), 4)));
}

function placeActorInSafeSpot(entity, actors = []) {
    const safeSpot = findNearestFreeSpot(entity, entity.x, entity.y, (testEntity) => !overlapsBlockingActor(testEntity, actors));
    entity.x = safeSpot.x;
    entity.y = safeSpot.y;
    syncEntity(entity);
}

function buildStudentsFromSpawns(studentSpawns) {
    const builtStudents = [];

    studentSpawns.forEach((spawn, index) => {
        const student = createStudent(spawn, index);
        placeActorInSafeSpot(student, [state.player, ...builtStudents]);
        student.lastSafeX = student.x;
        student.lastSafeY = student.y;
        builtStudents.push(student);
    });

    return builtStudents;
}

function setupSummoningSequence(levelNumber, level) {
    spawnSummoningFocus(level.bossKind || "greatSlacker");
    state.students.forEach((student) => {
        student.isChanting = true;
        student.element.classList.add("student-chanting");
    });
    state.summoningActive = true;
    state.summoningTimer = level.summoningDuration || 5000;
    state.lastRumbleAt = 0;

    const banner = document.getElementById("summoningBanner");
    const bannerText = banner?.querySelector(".summoning-text");
    if (banner) {
        banner.classList.remove("d-none");
    }
    if (bannerText) {
        bannerText.innerHTML = levelNumber === 7
            ? `Autenticazione del Caos... <span id="summoningTimer">${Math.ceil(state.summoningTimer / 1000)}</span>s`
            : `Evocazione in corso... <span id="summoningTimer">${Math.ceil(state.summoningTimer / 1000)}</span>s`;
    }

    window.setTimeout(() => {
        if (levelNumber === 3) {
            showToast("🎯 NUOVA ARMA DISPONIBILE! Cerca i power-up 'STUDIA' per ottenere l'arma a distanza che insegue il boss!");
        } else if (levelNumber === 7) {
            showToast("⚠️ Livello 7: il Signore dello SPID sta arrivando. Preparati al dono finale.");
        }
    }, 1000);
}

function buildLevel(levelNumber, resetPlayerLives = false) {
    clearLevelActors(true);
    state.currentLevel = levelNumber;
    state.levelSevenWeaponUnlocked = false;
    const level = getCurrentLevelConfig();

    // Toggle emergency red lights overlay for level 3
    if (levelNumber === 3 && state.selectedHackademyId === "standard") {
        gameArea.classList.add("emergency-mode");
    } else {
        gameArea.classList.remove("emergency-mode");
    }

    if (levelNumber >= 5 && state.selectedHackademyId === "standard") {
        gameArea.classList.add("city-mode");
    } else {
        gameArea.classList.remove("city-mode");
    }

    gameArea.classList.remove("roadtrip-mode");

    // Usa la mappa personalizzata dell'editor se disponibile, altrimenti usa il default
    const customObstacles = (typeof MapEditor !== "undefined" && level.mode !== "roadTrip")
        ? MapEditor.getObstaclesForLevel(levelNumber)
        : null;
    createObstacles(customObstacles || level.obstacles);

    if (!state.player) {
        state.player = createPlayer(level.playerSpawn, resetPlayerLives);
    } else {
        repositionPlayer(level.playerSpawn);
        if (resetPlayerLives) {
            state.player.lives = GAME.spawnLives;
            state.player.invulnerableUntil = 0;
        }
    }

    applyPlayerWeaponAppearance(state.player);
    updateAttackButtonAppearance();

    if (level.mode === "roadTrip" && state.selectedHackademyId === "standard") {
        state.students = [];
        state.projectiles = [];
        state.teacherProjectiles = [];
        setupRoadTripLevel();
        return;
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
        state.students = buildStudentsFromSpawns(studentSpawns);
    } else {
        state.students = buildStudentsFromSpawns(level.studentSpawns);

        if (level.bossKind) {
            setupSummoningSequence(levelNumber, level);
        }
    }
}

function spawnSummoningFocus(kind = "greatSlacker") {
    const focus = document.createElement("div");
    const portal = document.createElement("div");
    portal.className = "summoning-portal";

    if (kind === "spidOverlord") {
        focus.className = "spid-beacon";
        focus.style.left = "594px";
        focus.style.top = "302px";
        focus.dataset.rectWidth = "92";
        focus.dataset.rectHeight = "92";

        const screen = document.createElement("div");
        screen.className = "spid-beacon-screen";
        const ring = document.createElement("div");
        ring.className = "spid-beacon-ring";
        focus.append(screen, ring, portal);
    } else {
        focus.className = "campfire";
        focus.style.left = "600px";
        focus.style.top = "320px";
        focus.dataset.rectWidth = "80";
        focus.dataset.rectHeight = "80";

        const logs = document.createElement("div");
        logs.className = "campfire-logs";
        const flame = document.createElement("div");
        flame.className = "campfire-flame";
        focus.append(logs, flame, portal);
    }

    gameArea.appendChild(focus);
    state.campfireElement = focus;

    window.setTimeout(() => {
        portal.classList.add("active");
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
    const roadTripCar = document.createElement("div");

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
    hammer.className = `player-hammer tool-${getPlayerWeaponToolStyle()}`;
    hammerHead.className = "player-hammer-head";
    roadTripCar.className = "roadtrip-car";
    roadTripCar.innerHTML = `
        <span class="roadtrip-car-exhaust exhaust-back"></span>
        <span class="roadtrip-car-exhaust exhaust-front"></span>
        <span class="roadtrip-car-body"></span>
        <span class="roadtrip-car-window"></span>
        <span class="roadtrip-car-driver"></span>
        <span class="roadtrip-car-wheel front"></span>
        <span class="roadtrip-car-wheel rear"></span>
    `;
    const roadTripDriver = roadTripCar.querySelector(".roadtrip-car-driver");
    if (roadTripDriver) {
        roadTripDriver.style.backgroundImage = `url(${selectedTeacher.image})`;
        roadTripDriver.style.backgroundSize = "cover";
        roadTripDriver.style.backgroundPosition = "center";
    }

    hammer.appendChild(hammerHead);
    figure.append(face, torso, armLeft, armRight, legLeft, legRight, hammer);
    element.appendChild(figure);
    element.appendChild(roadTripCar);

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
        roadTripNosLevel: 0,
        superHammerUntil: 0,
        // Sistema di stamina e schivata
        stamina: GAME.maxStamina,
        lastStaminaUse: 0,
        isDodging: false,
        dodgeEndsAt: 0,
        dodgeDurationMs: GAME.dodgeDuration,
        dodgeStartX: 0,
        dodgeStartY: 0,
        dodgeTargetX: 0,
        dodgeTargetY: 0,
        carriedPlant: null,
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
    deactivateRageMode();
    teardownRoadTripPlayerState();
    state.player.x = spawn.x;
    state.player.y = spawn.y;
    state.player.direction = "right";
    state.player.attackEndsAt = 0;
    state.player.invulnerableUntil = 0;
    state.player.shieldHits = 0;
    state.player.speedBoostUntil = 0;
    state.player.roadTripNosLevel = 0;
    state.player.superHammerUntil = 0;
    state.player.dodgeDurationMs = GAME.dodgeDuration;
    state.player.carriedPlant = null;
    state.player.element.classList.remove("attacking", "flash-damage", "shield-active", "speed-boosted", "super-hammer-active");
    state.player.element.removeAttribute("data-shield-hits");
    placeEntityInFreeSpot(state.player);
    updateCarriedPlantVisual();
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

    const types = ["fast", "shooter", "dodger", "cheater"];
    const type = spawn.studentType || types[index % types.length];
    const speechType = spawn.speechType || type;
    const roleLabel = spawn.roleLabel || "";

    if (type === "cheater") {
        const copyUI = document.createElement("div");
        copyUI.className = "cheater-copy-ui";
        copyUI.innerHTML = `
            <div class="copy-bubble">📥 COPIA</div>
            <div class="copy-progress-bar">
                <div class="copy-progress-fill"></div>
            </div>
        `;
        element.appendChild(copyUI);
    }

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
        speechType,
        roleLabel,
        dodgeCooldown: 0,
        dashTimer: 0,
        dashVector: null,
        lastSafeX: spawn.x,
        lastSafeY: spawn.y,
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
    student.lastSafeX = student.x;
    student.lastSafeY = student.y;
    student.element.className = `entity student type-${type} role-${speechType}`;

    if (speechType === "vocal") {
        student.shotTimer = 8 + Math.random() * 18;
        student.talkTimer = randomBetween(1800, 3600);
    } else if (speechType === "panicked") {
        student.talkTimer = randomBetween(2200, 4200);
    } else if (speechType === "caf") {
        student.talkTimer = randomBetween(2600, 4600);
    }

    gameArea.appendChild(student.element);
    updateStudentVisual(student, false);
    syncEntity(student);
    return student;
}

function startGame() {
    if (!state.contentMode) {
        showModeSelection();
        return;
    }

    const devStartLevel = getDevelopmentStartLevelOverride();

    unlockAudio();
    primeSpeechSynthesis();
    attemptImmersiveMode();
    localStorage.removeItem("aulab_rage_saved_level");
    if (devStartLevel && devStartLevel !== state.currentLevel) {
        buildLevel(devStartLevel, true);
    } else if (!devStartLevel && state.currentLevel !== 1) {
        buildLevel(1, true);
    }
    state.running = true;
    state.gameOver = false;
    state.victory = false;
    state.lastFrame = performance.now();
    hideStartSelection();
    closeModeOverlay();
    endOverlay.classList.add("d-none");
    closeFinalWipModal();
    startBackgroundMusic();
}

function selectContentMode(mode) {
    unlockAudio();
    primeSpeechSynthesis();
    attemptImmersiveMode();
    state.contentMode = mode;
    document.body.dataset.contentMode = mode;
    closeModeOverlay();
    showStartSelection();
}

function showModeSelection() {
    if (modeOverlay) {
        modeOverlay.classList.remove("d-none");
    }
    hideStartSelection();
}

function closeModeOverlay() {
    if (!modeOverlay) {
        return;
    }

    modeOverlay.classList.add("d-none");
}

function showStartSelection() {
    closeModeOverlay();
    if (startOverlay) {
        startOverlay.classList.remove("d-none");
    }
}

function getActiveSpeechProfile() {
    return speechProfiles[state.contentMode] || speechProfiles["politically-correct"];
}

function getTeacherHitMessagePool() {
    const profile = getActiveSpeechProfile();
    const levelSpecificMessages = profile.teacherHitMessagesByLevel?.[state.currentLevel];
    if (Array.isArray(levelSpecificMessages) && levelSpecificMessages.length > 0) {
        return levelSpecificMessages;
    }
    return profile.teacherHitMessages;
}

function getCurrentBossKind() {
    return state.boss?.kind || getCurrentLevelConfig().bossKind || "greatSlacker";
}

function pickRandomLine(lines, fallback = "") {
    if (!Array.isArray(lines) || lines.length === 0) {
        return fallback;
    }

    return lines[Math.floor(Math.random() * lines.length)] || fallback;
}

function getProfileSectionLines(sectionName, variantKey) {
    const profile = getActiveSpeechProfile();
    const section = profile[sectionName];
    if (Array.isArray(section)) {
        return section;
    }
    if (section && Array.isArray(section[variantKey])) {
        return section[variantKey];
    }
    if (section && Array.isArray(section.default)) {
        return section.default;
    }
    return [];
}

function getStudentLinePool(studentOrType) {
    const profile = getActiveSpeechProfile();
    const messageKey = typeof studentOrType === "string"
        ? studentOrType
        : studentOrType?.speechType || studentOrType?.studentType;
    return profile.typeMessages[messageKey] || profile.studentMessages;
}

function isActiveSpeechEntity(entity) {
    if (!entity || !entity.element) {
        return false;
    }

    return state.students.includes(entity) || Boolean(state.bonusRoad?.entities?.includes(entity));
}

function hasQueuedOrActiveStudentSpeech(student) {
    if (!student) {
        return false;
    }

    if (state.activeStudentSpeech && state.activeStudentSpeech.student === student) {
        return true;
    }

    return state.studentSpeechQueue.some((entry) => entry.student === student);
}

function estimateStudentSpeechDurationMs(message, role = "student", minimumMs = 1500) {
    const tts = getSpeechTtsProfile(role);
    const safeRate = Math.max(tts.rate || 1, 0.6);
    const estimated = Math.round((message.length * 52) / safeRate);
    return Math.max(minimumMs, estimated);
}

function removeStudentSpeechBubble(student) {
    if (!student || !student.element) {
        return;
    }

    const bubble = student.element.querySelector(".speech-bubble");
    if (bubble) {
        bubble.remove();
    }

    student.element.classList.remove("speaking");
}

function finishActiveStudentSpeech() {
    const activeSpeech = state.activeStudentSpeech;
    if (!activeSpeech) {
        return;
    }

    const { student } = activeSpeech;
    if (student && student.speechTimeoutId) {
        window.clearTimeout(student.speechTimeoutId);
        student.speechTimeoutId = null;
    }

    removeStudentSpeechBubble(student);
    state.activeStudentSpeech = null;
    processStudentSpeechQueue();
}

function processStudentSpeechQueue() {
    if (state.activeStudentSpeech || !state.running) {
        return;
    }

    while (state.studentSpeechQueue.length > 0) {
        const nextSpeech = state.studentSpeechQueue.shift();
        const { student, message, bubbleClass, durationMs, onStart } = nextSpeech;

        if (!student || !student.element || student.element.classList.contains("burning") || !isActiveSpeechEntity(student)) {
            continue;
        }

        removeStudentSpeechBubble(student);

        const bubble = document.createElement("div");
        bubble.className = bubbleClass;
        bubble.textContent = message;
        student.element.appendChild(bubble);
        student.element.classList.add("speaking");

        if (typeof onStart === "function") {
            onStart();
        }

        speakStudentLine(message);
        state.activeStudentSpeech = nextSpeech;
        student.speechTimeoutId = window.setTimeout(() => {
            finishActiveStudentSpeech();
        }, durationMs);
        return;
    }
}

function queueStudentSpeech(student, message, options = {}) {
    if (!student || !student.element || student.element.classList.contains("burning") || hasQueuedOrActiveStudentSpeech(student)) {
        return false;
    }

    const bubbleClass = options.bubbleClass || "speech-bubble";
    const minimumMs = options.minimumMs || 1500;
    const role = options.role || "student";
    const durationMs = estimateStudentSpeechDurationMs(message, role, minimumMs);

    state.studentSpeechQueue.push({
        student,
        message,
        bubbleClass,
        durationMs,
        onStart: options.onStart || null
    });

    processStudentSpeechQueue();
    return true;
}

function clearSpeechForEntity(entity, resumeQueue = true) {
    if (!entity) {
        return;
    }

    let shouldResumeQueue = false;
    if (entity.speechTimeoutId) {
        window.clearTimeout(entity.speechTimeoutId);
        entity.speechTimeoutId = null;
    }

    state.studentSpeechQueue = state.studentSpeechQueue.filter((entry) => entry.student !== entity);
    if (state.activeStudentSpeech?.student === entity) {
        state.activeStudentSpeech = null;
        shouldResumeQueue = true;
    }

    removeStudentSpeechBubble(entity);

    if (resumeQueue && shouldResumeQueue) {
        processStudentSpeechQueue();
    }
}

function getTeacherHitLine() {
    return pickRandomLine(getTeacherHitMessagePool(), "Torna a studiare!");
}

function getTeacherContextLine(key, fallback = "") {
    return pickRandomLine(getActiveSpeechProfile().teacherContextMessages[key], fallback);
}

function getChantLine() {
    return pickRandomLine(getProfileSectionLines("chantMessages", getCurrentBossKind()), "Evocalo!");
}

function getBossSpeechLine() {
    return pickRandomLine(getProfileSectionLines("bossMessages", getCurrentBossKind()), "SKIBIDIBOPPI");
}

function getSpeechTtsProfile(role) {
    const profile = getActiveSpeechProfile();
    return profile.tts[role] || { rate: 1, pitch: 1, volume: 1 };
}

function hideStartSelection() {
    if (!startOverlay) {
        return;
    }

    startOverlay.classList.add("d-none");
}

function gameLoop(timestamp) {
    // Delta normalizzato per mantenere un movimento coerente anche se il frame rate varia.
    const frameDeltaMs = state.lastFrame ? Math.max(timestamp - state.lastFrame, 0) : 16.67;
    const delta = Math.min(frameDeltaMs / 16.67 || 1, 1.4);
    state.lastFrame = timestamp;

    if (state.running) {
        state.gameTimeMs += Math.min(frameDeltaMs, 50);

        if (isRoadTripActive()) {
            updateRoadTripLevel(delta, timestamp);
            updateStamina(delta, timestamp);
            updateRage(delta);
            updateHud();
            applyGameAreaTransform();
            requestAnimationFrame(gameLoop);
            return;
        }

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

                stopStudentSpeech();

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

                triggerBossIntro();
            }
        }

        // Aggiorna il Boss se presente
        if (state.boss) {
            updateBoss(delta, timestamp);
        }
        // ---------------------------------

        updatePlayer(delta, timestamp);
        updateStamina(delta, timestamp);
        updateRage(delta);
        updateStudents(delta, timestamp);
        updateSlidingChairs(delta);
        updateProjectiles(delta, timestamp);
        updateTeacherProjectiles(delta, timestamp);
        updatePowerUps(delta);
        checkEndConditions();
        updateHud();
    }

    applyGameAreaTransform();
    requestAnimationFrame(gameLoop);
}

function updatePlayer(delta, timestamp) {
    let speedMult = 1.0;
    const speedBoostActive = isPlayerSpeedBoostActive(timestamp);
    if (state.rageActive) {
        speedMult = 2.0;
    } else if (speedBoostActive) {
        speedMult = 2.0;
    }

    state.player.element.classList.toggle("speed-boosted", speedBoostActive);

    if (state.player.superHammerUntil && timestamp >= state.player.superHammerUntil) {
        state.player.superHammerUntil = 0;
        state.player.element.classList.remove("super-hammer-active");
    }


    // Gestione schivata pendente
    if (state.pendingDodge && !state.player.isDodging) {
        if (performDodge(state.pendingDodge.x, state.pendingDodge.y, timestamp)) {
            state.pendingDodge = null; // Reset della richiesta
        } else {
            state.pendingDodge = null; // Reset anche se fallisce
        }
    }

    // Il movimento è gestito separatamente dalla schivata
    if (!state.player.isDodging) {
        const movement = getInputVector();
        const stepX = movement.x * GAME.playerSpeed * speedMult * delta;
        const stepY = movement.y * GAME.playerSpeed * speedMult * delta;
        const isMoving = movement.x !== 0 || movement.y !== 0;

        if (isMoving) {
            state.player.direction = getDirectionFromVector(movement);
        }

        updatePlayerVisual(state.player, isMoving);
        moveWithCollisions(state.player, stepX, stepY);
    }

    if (timestamp < state.player.invulnerableUntil) {
        state.player.element.classList.add("flash-damage");
    } else {
        state.player.element.classList.remove("flash-damage");
    }

    if (state.player.attackEndsAt && timestamp >= state.player.attackEndsAt) {
        state.player.attackEndsAt = 0;
        state.player.element.classList.remove("attacking");
    }

    if (isLevelSixMachineGunActive() && state.keys.has("attack") && !state.player.isDodging) {
        attack();
    }
}

// Sistema di stamina e schivata
function updateStamina(delta, timestamp) {
    if (!state.player) return;

    const isHoldingRoadTripNos = isRoadTripActive() && state.keys.has("control");

    // Rigenerazione stamina se non è stata usata di recente
    if (!isHoldingRoadTripNos && timestamp - state.player.lastStaminaUse >= GAME.staminaRegenDelay) {
        state.player.stamina = Math.min(GAME.maxStamina,
            state.player.stamina + (GAME.staminaRegenRate * delta));
    }

    // Gestione animazione schivata
    if (state.player.isDodging) {
        // Controllo più semplice: se è passato abbastanza tempo, termina la schivata
        if (timestamp >= state.player.dodgeEndsAt) {
            // Fine schivata
            state.player.isDodging = false;
            state.player.element.classList.remove("dodging");
            state.player.dodgeDurationMs = GAME.dodgeDuration;
            return; // Esci dalla funzione per evitare ulteriori modifiche
        }

        // Calcola progresso con sicurezza
        const dodgeDuration = state.player.dodgeDurationMs || GAME.dodgeDuration;
        const dodgeStartTime = state.player.dodgeEndsAt - dodgeDuration;
        const elapsed = Math.max(0, timestamp - dodgeStartTime);
        const progress = Math.min(1, elapsed / dodgeDuration);

        // Interpolazione lineare più semplice per ora
        const currentX = state.player.dodgeStartX +
            (state.player.dodgeTargetX - state.player.dodgeStartX) * progress;
        const currentY = state.player.dodgeStartY +
            (state.player.dodgeTargetY - state.player.dodgeStartY) * progress;

        // Applica la posizione della schivata
        state.player.x = Math.max(40, Math.min(GAME.width - 40, currentX));
        state.player.y = Math.max(40, Math.min(GAME.height - 40, currentY));
        syncEntity(state.player);
    }
}

function canDodge() {
    if (!state.player || state.player.isDodging) return false;
    if (state.player.stamina < GAME.staminaPerDodge) return false;
    return true;
}

function performDodge(directionX, directionY, timestamp) {
    if (!canDodge()) return false;

    // Calcola una destinazione sicura per evitare che la schivata finisca dentro gli ostacoli.
    const dodgeDistance = GAME.dodgeDistance;
    const startX = state.player.x;
    const startY = state.player.y;
    const rawTargetX = startX + (directionX * dodgeDistance);
    const rawTargetY = startY + (directionY * dodgeDistance);
    const clampedTargetX = Math.max(40, Math.min(GAME.width - 40, rawTargetX));
    const clampedTargetY = Math.max(40, Math.min(GAME.height - 40, rawTargetY));
    const safeTarget = getSafeDodgeTarget(state.player, clampedTargetX, clampedTargetY);

    if (Math.abs(safeTarget.x - startX) < 0.5 && Math.abs(safeTarget.y - startY) < 0.5) {
        return false;
    }

    // Consuma stamina
    state.player.stamina -= GAME.staminaPerDodge;
    state.player.lastStaminaUse = timestamp;

    state.player.dodgeStartX = startX;
    state.player.dodgeStartY = startY;
    state.player.dodgeTargetX = safeTarget.x;
    state.player.dodgeTargetY = safeTarget.y;
    state.player.dodgeDurationMs = getPlayerDodgeDuration(timestamp);

    // Attiva schivata
    state.player.isDodging = true;
    state.player.dodgeEndsAt = timestamp + state.player.dodgeDurationMs;
    state.player.element.classList.add("dodging");

    // Effetto sonoro della schivata
    playDodgeSound();

    return true;
}

function isPlayerSpeedBoostActive(timestamp) {
    if (!state.player || !state.player.speedBoostUntil) {
        return false;
    }

    if (timestamp < state.player.speedBoostUntil) {
        return true;
    }

    state.player.speedBoostUntil = 0;
    return false;
}

function getPlayerDodgeDuration(timestamp) {
    if (isPlayerSpeedBoostActive(timestamp)) {
        return GAME.dodgeDuration / 2;
    }

    return GAME.dodgeDuration;
}

function getSafeDodgeTarget(entity, targetX, targetY) {
    const startX = entity.x;
    const startY = entity.y;
    const totalDistance = Math.hypot(targetX - startX, targetY - startY);
    const steps = Math.max(1, Math.ceil(totalDistance / 6));
    const testEntity = {
        ...entity,
        isPlayerCollisionProbe: entity === state.player
    };

    let safeX = startX;
    let safeY = startY;

    for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;
        testEntity.x = startX + (targetX - startX) * progress;
        testEntity.y = startY + (targetY - startY) * progress;

        if (hitsObstacle(testEntity)) {
            break;
        }

        safeX = testEntity.x;
        safeY = testEntity.y;
    }

    return { x: safeX, y: safeY };
}

function getPreferredDodgeVector() {
    const movement = getInputVector();
    if (movement.x !== 0 || movement.y !== 0) {
        return movement;
    }

    if (!state.player) {
        return { x: 0, y: 0 };
    }

    const facingVectors = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
    };

    return facingVectors[state.player.direction] || facingVectors.right;
}

function queuePlayerDodge(vector) {
    if (!state.running || !state.player) return false;

    const normalized = normalizeVector(vector.x, vector.y);
    if (normalized.x === 0 && normalized.y === 0) {
        return false;
    }

    state.pendingDodge = normalized;
    return true;
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
        rememberStudentSafePosition(student);

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
            stabilizeStudentPosition(student);
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

        if (student.studentType === "cheater" && !student.codeCopied) {
            // Check if current copyTarget is still alive and is still a valid target (not chanting)
            if (student.copyTarget && (!state.students.includes(student.copyTarget) || student.copyTarget.isChanting)) {
                student.copyTarget = null;
                student.isCopying = false;
                student.copyProgress = 0;
                student.element.classList.remove("copying");
            }

            // Find nearest target if none selected
            if (!student.copyTarget) {
                let bestTarget = null;
                let minDistance = Infinity;
                state.students.forEach((other) => {
                    if (other === student || other.studentType === "cheater" || other.isChanting) return;
                    const dist = Math.hypot(other.x - student.x, other.y - student.y);
                    if (dist < minDistance) {
                        minDistance = dist;
                        bestTarget = other;
                    }
                });
                student.copyTarget = bestTarget;
            }

            if (student.copyTarget) {
                const targetDx = student.copyTarget.x - student.x;
                const targetDy = student.copyTarget.y - student.y;
                const targetDist = Math.hypot(targetDx, targetDy);

                if (targetDist < 65) {
                    // In copying range! Stop moving and copy.
                    vector = { x: 0, y: 0 };
                    student.isCopying = true;
                    student.element.classList.add("copying");
                    student.copyProgress = (student.copyProgress || 0) + delta * 16.67;

                    // Update UI progress bar
                    const fill = student.element.querySelector(".copy-progress-fill");
                    if (fill) {
                        fill.style.width = `${Math.min(100, (student.copyProgress / 2000) * 100)}%`;
                    }

                    if (student.copyProgress >= 2000) {
                        // Success! Apply "Codice Copiato" to both
                        student.codeCopied = true;
                        student.element.classList.add("code-copied");
                        student.element.classList.remove("copying");
                        
                        student.copyTarget.codeCopied = true;
                        student.copyTarget.element.classList.add("code-copied");

                        playCodeCopiedSound();
                        
                        // Spawn success effects on both
                        createHitEffect(student.x + student.width / 2 - 18, student.y + student.height / 2 - 18);
                        createHitEffect(student.copyTarget.x + student.copyTarget.width / 2 - 18, student.copyTarget.y + student.copyTarget.height / 2 - 18);

                        student.copyTarget = null;
                        student.isCopying = false;
                        student.copyProgress = 0;
                    }
                } else {
                    // Walk towards the target
                    vector = normalizeVector(targetDx, targetDy);
                    if (student.isCopying) {
                        student.isCopying = false;
                        student.copyProgress = 0;
                        student.element.classList.remove("copying");
                    }
                }

                // Update visual animation
                student.direction = getDirectionFromVector(vector);
                updateStudentVisual(student, vector.x !== 0 || vector.y !== 0);

                // Move cheater (base speed: 0.95x studentSpeed, stealthy)
                const cheaterSpeed = GAME.studentSpeed * 0.95;
                moveWithCollisions(student, vector.x * cheaterSpeed * delta, vector.y * cheaterSpeed * delta);
            } else {
                // No target available: just wander or flee Valerio normally
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
            }
        } else if (student.studentType === "zombie") {
            // Zombie AI - lento, immune ai colpi normali, attratto dalle luci

            // Gli zombie si muovono lentamente verso il giocatore
            if (distance < 400) {
                // Inseguimento lento del giocatore
                vector = normalizeVector(-dx, -dy);
                student.element.classList.add("zombie-hunting");
            } else {
                // Vagano lentamente
                vector = getStudentWanderVector(student);
                student.element.classList.remove("zombie-hunting");
            }

            student.direction = getDirectionFromVector(vector);
            updateStudentVisual(student, vector.x !== 0 || vector.y !== 0);

            // Velocità molto ridotta per i zombie
            const zombieSpeed = GAME.studentSpeed * 0.3;
            moveWithCollisions(student, vector.x * zombieSpeed * delta, vector.y * zombieSpeed * delta);

            // I zombie non lanciano pietre normalmente, ma emettono suoni ocasionalmente
            if (student.talkTimer <= 0) {
                student.talkTimer = randomBetween(GAME.studentTalkMin * 2, GAME.studentTalkMax * 2);
                speakZombie(student);
            }
        } else {
            // Normal student AI (fast, shooter, dodger, or buffed cheater)
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
                if (student.speechType === "panicked") {
                    speedMult *= 1.12;
                } else if (student.speechType === "spid") {
                    speedMult *= 0.88;
                } else if (student.speechType === "vocal") {
                    speedMult *= 0.82;
                }
                if (student.codeCopied) {
                    speedMult *= 2.0;
                }
                
                moveWithCollisions(student, vector.x * GAME.studentSpeed * speedMult * delta, vector.y * GAME.studentSpeed * speedMult * delta);
            }
        }

        student.fleeTimer -= delta;
        let shotDelta = student.codeCopied ? delta * 2.2 : delta;
        if (student.speechType === "vocal") {
            shotDelta *= 1.55;
        } else if (student.speechType === "passacarte") {
            shotDelta *= 1.15;
        }
        student.shotTimer -= shotDelta;
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

        const canThrow = student.studentType !== "fast" && (student.studentType !== "cheater" || student.codeCopied);
        if (canThrow && !student.isThrowing && student.shotTimer <= 0 && hasLineOfSight(student, state.player)) {
            beginThrow(student, now);
        }

        if (student.fleeTimer <= 0) {
            student.fleeTimer = 30 + Math.random() * 50;
            student.wanderTimer = 0;
        }

        if (student.talkTimer <= 0) {
            if (student.speechType === "vocal") {
                student.talkTimer = randomBetween(1500, 3200);
            } else if (student.speechType === "panicked") {
                student.talkTimer = randomBetween(2200, 4200);
            } else {
                student.talkTimer = randomBetween(GAME.studentTalkMin, GAME.studentTalkMax);
            }
            speakStudent(student);
        }

        stabilizeStudentPosition(student);
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
        const { outsideArena, hitsObstacle } = advanceProjectile(projectile, delta);

        if (outsideArena || hitsObstacle) {
            projectile.element.remove();
            return;
        }

        const playerCanBeHit = timestamp >= state.player.invulnerableUntil && !state.player.isDodging;
        const playerProjectileHurtRect = getPlayerProjectileHurtRect();
        if (
            playerCanBeHit &&
            playerProjectileHurtRect &&
            rectsIntersect(projectile, playerProjectileHurtRect) &&
            !isProjectileBlockedByObstacle(projectile, playerProjectileHurtRect)
        ) {
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

function updateTeacherProjectiles(delta, timestamp) {
    if (isRoadTripActive()) {
        updateRoadTripTeacherProjectiles(delta, timestamp);
        return;
    }

    const nextTeacherProjectiles = [];

    state.teacherProjectiles.forEach((projectile) => {
        const { outsideArena, hitsObstacle } = advanceProjectile(projectile, delta);
        const projectileHitRect = getCollisionRect(projectile);

        if (outsideArena || hitsObstacle) {
            projectile.element.remove();
            return;
        }

        // Controlla collisione con studenti
        let hitStudent = false;
        const survivors = [];
        state.students.forEach((student) => {
            if (rectsIntersect(projectileHitRect, student)) {
                if (student.isChanting) {
                    createHitEffect(student.x - 18, student.y - 18);
                    playShieldSound();
                    hitStudent = true;
                    survivors.push(student);
                    return;
                }

                // Colpito studente
                createHitEffect(student.x - 18, student.y - 18);
                student.element.remove();
                increaseRage(15);
                hitStudent = true;
                return;
            }
            survivors.push(student);
        });
        state.students = survivors;

        // Controlla collisione con il boss
        if (state.boss && rectsIntersect(projectileHitRect, state.boss)) {
            createHitEffect(projectile.x - 18, projectile.y - 18);
            projectile.element.remove();
            damageBoss();
            increaseRage(20);
            return;
        }

        if (hitStudent) {
            projectile.element.remove();
            return;
        }

        nextTeacherProjectiles.push(projectile);
    });

    state.teacherProjectiles = nextTeacherProjectiles;
}

function updateRoadTripTeacherProjectiles(delta) {
    const survivors = [];

    state.teacherProjectiles.forEach((projectile) => {
        projectile.x += projectile.velocityX * delta;
        syncEntity(projectile);

        if (projectile.x > GAME.width + 40) {
            projectile.element.remove();
            return;
        }

        let removed = false;
        state.bonusRoad.entities = state.bonusRoad.entities.filter((entity) => {
            if (removed || !entity.removable) {
                return true;
            }

            if (rectsIntersect(projectile, entity)) {
                createHitEffect(entity.x + entity.width / 2 - 18, entity.y + entity.height / 2 - 18);
                clearSpeechForEntity(entity);
                entity.element.remove();
                removed = true;
                projectile.element.remove();
                increaseRage(10);
                return false;
            }

            return true;
        });

        if (!removed) {
            survivors.push(projectile);
        }
    });

    state.teacherProjectiles = survivors;
}

function launchRoadTripBeer(entity) {
    if (!state.bonusRoad || !state.player || !entity?.element) {
        return false;
    }

    const startX = entity.x + 10;
    const startY = entity.y + 20;
    const projectile = {
        x: startX,
        y: startY,
        width: 28,
        height: 40,
        velocityX: -(GAME.projectileSpeed * 2.9),
        velocityY: 0,
        gravity: 0,
        renderRotation: -0.4,
        rotationSpeed: -0.28,
        element: document.createElement("div")
    };

    projectile.element.className = "projectile roadtrip-beer-projectile";
    gameArea.appendChild(projectile.element);
    syncEntity(projectile);
    state.bonusRoad.projectiles.push(projectile);
    entity.beerThrown = true;
    entity.element.classList.add("beer-thrown");
    return true;
}

function maybeSpeakRoadTripEntity(entity) {
    if (!entity?.canSpeak || entity.speechTriggered || !entity.speechRoll || !entity.element) {
        return;
    }

    const triggerX = entity.speechTriggerX ?? (state.player.x + 320);
    if (entity.x > triggerX || entity.x < state.player.x - 24) {
        return;
    }

    const fallbackByType = {
        student: "Prendila al volo",
        boomer: "Stu tablet non funzion",
        ultra: "Forza Bari"
    };
    const message = pickRandomLine(getStudentLinePool(entity), fallbackByType[entity.type] || "Ue'");
    const queued = queueStudentSpeech(entity, message, {
        bubbleClass: "speech-bubble",
        minimumMs: 1300,
        role: "student"
    });

    if (queued) {
        entity.speechTriggered = true;
    }
}

function updateRoadTripBeerProjectiles(delta, roadPlayerRect, canTakeHit, jumpOffset) {
    if (!state.bonusRoad?.projectiles?.length) {
        return;
    }

    const survivors = [];
    state.bonusRoad.projectiles.forEach((projectile) => {
        projectile.x += projectile.velocityX * delta;
        projectile.y += projectile.velocityY * delta;
        projectile.velocityY += projectile.gravity * delta * 16.67;
        projectile.renderRotation += projectile.rotationSpeed * delta;
        syncEntity(projectile);

        const outsideArena =
            projectile.x + projectile.width < -40 ||
            projectile.y > GAME.height + 40 ||
            projectile.x > GAME.width + 40;

        if (outsideArena) {
            projectile.element.remove();
            return;
        }

        const clearsProjectile = jumpOffset >= 52;
        if (canTakeHit && !clearsProjectile && rectsIntersect(projectile, roadPlayerRect)) {
            damagePlayer();
            createHitEffect(projectile.x - 18, projectile.y - 18);
            projectile.element.remove();
            return;
        }

        survivors.push(projectile);
    });

    state.bonusRoad.projectiles = survivors;
}

function updateRoadTripLevel(delta, timestamp) {
    if (!state.bonusRoad || !state.player) {
        return;
    }

    const progress = clamp(state.bonusRoad.distance / state.bonusRoad.goalDistance, 0, 1);
    const rampRushBoost = timestamp < (state.bonusRoad.rampRushUntil || 0) ? 1.55 : 0;
    const nosLevel = getRoadTripNosLevel(timestamp);
    const nosActive = nosLevel > 0;
    state.player.element.classList.toggle("speed-boosted", nosActive);
    state.bonusRoad.scrollSpeed = state.bonusRoad.baseScrollSpeed + progress * 0.85 + (nosLevel * 0.82) + rampRushBoost;
    const distanceMultiplier = 1 + (nosLevel * 0.58);
    state.bonusRoad.distance += state.bonusRoad.scrollSpeed * delta * 1.06 * distanceMultiplier;
    gameArea.style.setProperty("--road-shift", `${-(state.bonusRoad.distance * 1.25)}px`);

    if (state.keys.has("up") && !state.bonusRoad.laneInputLatched) {
        shiftRoadTripLane(-1);
        state.bonusRoad.laneInputLatched = true;
    } else if (state.keys.has("down") && !state.bonusRoad.laneInputLatched) {
        shiftRoadTripLane(1);
        state.bonusRoad.laneInputLatched = true;
    } else if (!state.keys.has("up") && !state.keys.has("down")) {
        state.bonusRoad.laneInputLatched = false;
    }

    if (timestamp >= state.bonusRoad.jumpEndsAt) {
        state.player.element.classList.remove("bonus-jumping");
    }
    updateRoadTripPlayerLane(delta);
    syncRoadTripPlayer();

    if (state.keys.has("attack")) {
        attack();
    }

    state.bonusRoad.spawnTimer -= delta * 16.67;
    if (state.bonusRoad.spawnTimer <= 0) {
        spawnRoadTripEntity();
        const baseDelay = progress < 0.22
            ? 1180
            : progress < 0.68
                ? 980
                : 760;
        state.bonusRoad.spawnTimer = randomBetween(baseDelay, baseDelay + 560);
    }

    const canTakeHit = timestamp >= state.player.invulnerableUntil;
    const roadTripRageTruckActive = state.rageActive && state.player?.element?.classList.contains("roadtrip-rage-truck");
    const jumpOffset = getRoadTripJumpOffset();
    const roadPlayerRect = {
        x: state.player.x + (roadTripRageTruckActive ? 8 : 18),
        y: state.player.y + (roadTripRageTruckActive ? 24 : 34),
        width: state.player.width - (roadTripRageTruckActive ? 16 : 38),
        height: state.player.height - (roadTripRageTruckActive ? 28 : 50)
    };

    const remainingEntities = [];
    state.bonusRoad.entities.forEach((entity) => {
        entity.x -= entity.speed * delta * 4.35 * (0.94 + progress * 0.36 + (rampRushBoost * 0.58));
        entity.element.style.transform = `translate(${entity.x}px, ${entity.y}px)`;

        if (entity.x + entity.width < -60) {
            clearSpeechForEntity(entity, false);
            entity.element.remove();
            return;
        }

        if (!entity.rampConsumed && entity.rampBoost && isRoadTripEntityInPlayerLane(entity) && rectsIntersect(roadPlayerRect, entity)) {
            const boosted = triggerRoadTripJumpWithOptions({
                force: true,
                rampBoost: true,
                height: entity.jumpHeightBoost || 214,
                duration: entity.jumpDurationBoost || 920
            });
            createHitEffect(entity.x + entity.width / 2 - 18, entity.y + 10);
            if (boosted) {
                entity.rampConsumed = true;
                entity.element.classList.add("used");
            }
        }

        if (entity.rampBoost && entity.rampConsumed) {
            remainingEntities.push(entity);
            return;
        }

        maybeSpeakRoadTripEntity(entity);

        if (
            entity.canThrowBeer &&
            !entity.beerThrown &&
            isRoadTripEntityInPlayerLane(entity) &&
            entity.x <= state.player.x + state.player.width + 320 &&
            entity.x >= state.player.x + state.player.width + 40
        ) {
            launchRoadTripBeer(entity);
        }

        if (roadTripRageTruckActive && isRoadTripEntityInPlayerLane(entity) && rectsIntersect(roadPlayerRect, entity)) {
            createHitEffect(entity.x + entity.width / 2 - 18, entity.y + entity.height / 2 - 18);
            playRageHitSound();
            if (entity.removable) {
                clearSpeechForEntity(entity);
                entity.element.remove();
                return;
            }
            remainingEntities.push(entity);
            return;
        }

        const clearsEntity = jumpOffset >= (entity.jumpClearance || 999);
        if (canTakeHit && isRoadTripEntityInPlayerLane(entity) && !clearsEntity && rectsIntersect(roadPlayerRect, entity)) {
            damagePlayer();
            createHitEffect(entity.x + entity.width / 2 - 18, entity.y + entity.height / 2 - 18);
            if (entity.removable) {
                clearSpeechForEntity(entity);
                entity.element.remove();
                return;
            }
        }

        remainingEntities.push(entity);
    });
    state.bonusRoad.entities = remainingEntities;
    updateRoadTripBeerProjectiles(delta, roadPlayerRect, canTakeHit, jumpOffset);

    const remainingMeters = Math.max(0, Math.ceil((state.bonusRoad.goalDistance - state.bonusRoad.distance) / 100));
    if (state.bonusRoad.warningStage < 1 && remainingMeters <= 70) {
        state.bonusRoad.warningStage = 1;
        showToast("📲 Traffico SPID in aumento: scegli bene le corsie e usa il NOS nei momenti giusti.");
    } else if (state.bonusRoad.warningStage < 2 && remainingMeters <= 35) {
        state.bonusRoad.warningStage = 2;
        gameArea.classList.add("roadtrip-finale");
        showToast("📣 Piazza del Ferrarese vicina! Lo stand Aulab e' ormai davanti.");
    }

    updateRoadTripTeacherProjectiles(delta);
    updateHud();

    if (state.player.lives <= 0) {
        finishGame(false);
        return;
    }

    if (state.bonusRoad.distance >= state.bonusRoad.goalDistance && !state.bonusRoad.arrivalTriggered) {
        state.bonusRoad.distance = state.bonusRoad.goalDistance;
        state.bonusRoad.arrivalTriggered = true;
        state.running = false;
        showToast("🎪 Arrivo epico in piazza: lo stand Aulab e' assediato!");
        localStorage.setItem("aulab_rage_saved_level", state.currentLevel);
        registerCutsceneTimeout(() => {
            advanceToNextLevel();
        }, 900);
    }
}

function getPlayerAimVector() {
    const movement = getInputVector();
    if (movement.x !== 0 || movement.y !== 0) {
        return movement;
    }
    return getPreferredDodgeVector();
}

function fireMachineGun() {
    const aim = getPlayerAimVector();
    const muzzle = centerOf(state.player);
    const spreadAngle = (Math.random() - 0.5) * 0.045;
    const baseAngle = Math.atan2(aim.y, aim.x) + spreadAngle;
    const speed = GAME.projectileSpeed * 2.65;

    const projectile = {
        x: muzzle.x - 14,
        y: muzzle.y - 5,
        width: 28,
        height: 10,
        velocityX: Math.cos(baseAngle) * speed,
        velocityY: Math.sin(baseAngle) * speed,
        renderRotation: baseAngle,
        collisionWidth: 18,
        collisionHeight: 5,
        ownerId: "player-machinegun",
        element: document.createElement("div")
    };

    projectile.element.className = "teacher-projectile machinegun-projectile";
    gameArea.appendChild(projectile.element);
    syncEntity(projectile);
    state.teacherProjectiles.push(projectile);

    playTeacherRangedSound();
    playPlayerRangedAttackAnimation();
}

function advanceProjectile(projectile, delta) {
    const totalStepX = projectile.velocityX * delta;
    const totalStepY = projectile.velocityY * delta;
    const maxStep = Math.max(Math.abs(totalStepX), Math.abs(totalStepY));
    const steps = Math.max(1, Math.ceil(maxStep / 4));
    const stepX = totalStepX / steps;
    const stepY = totalStepY / steps;

    for (let i = 0; i < steps; i += 1) {
        projectile.x += stepX;
        projectile.y += stepY;

        const outsideArena =
            projectile.x < 0 ||
            projectile.y < 0 ||
            projectile.x + projectile.width > GAME.width ||
            projectile.y + projectile.height > GAME.height;

        if (outsideArena) {
            syncEntity(projectile);
            return { outsideArena: true, hitsObstacle: false };
        }

        const collidesWithObstacle = hitsObstacle(projectile);
        if (collidesWithObstacle) {
            syncEntity(projectile);
            return { outsideArena: false, hitsObstacle: true };
        }
    }

    syncEntity(projectile);
    return { outsideArena: false, hitsObstacle: false };
}

function updatePowerUps(delta) {
    const hasActiveCombatTargets = state.students.length > 0 || Boolean(state.boss) || Boolean(state.summoningActive);

    if (!state.powerUp && !state.dragonStrike && !state.studiaStrike && state.gameTimeMs >= state.nextPowerUpAt && hasActiveCombatTargets) {
        if (!spawnPowerUp()) {
            state.nextPowerUpAt = state.gameTimeMs + 900;
        }
    }

    if (
        state.player.lives < GAME.spawnLives &&
        !state.heartPowerUp &&
        state.gameTimeMs >= state.nextHeartPowerUpAt
    ) {
        if (!spawnHeartPowerUp()) {
            state.nextHeartPowerUpAt = state.gameTimeMs + 900;
        }
    }

    if (state.powerUp && canCollectPickup(state.powerUp)) {
        collectPowerUp();
    } else if (state.powerUp) {
        const remainingMs = Math.max(0, state.powerUp.expiresAt - state.gameTimeMs);
        const secondsLeft = Math.ceil(remainingMs / 1000);
        state.powerUp.counter.textContent = `${secondsLeft}`;

        if (remainingMs <= 0) {
            expirePowerUp();
        }
    }

    if (state.heartPowerUp && canCollectPickup(state.heartPowerUp)) {
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

    if (state.studiaStrike) {
        updateStudiaStrike(delta);
    }
}

function attack() {
    const now = performance.now();
    if (!state.running || now - state.lastAttackAt < getPlayerAttackCooldown()) {
        return;
    }

    if (isRoadTripActive()) {
        state.lastAttackAt = now;
        fireRoadTripHammer();
        return;
    }

    if (isLevelSixMachineGunActive()) {
        state.lastAttackAt = now;
        state.player.attackEndsAt = 0;
        state.player.element.classList.remove("attacking");
        fireMachineGun();
        return;
    }

    const attackZone = getAttackZone();
    if (state.player?.carriedPlant) {
        state.lastAttackAt = now;
        state.player.attackEndsAt = 0;
        throwCarriedPlant();
        return;
    }

    const pickupPlant = findPickupPlantInZone(attackZone);
    if (pickupPlant) {
        state.lastAttackAt = now;
        state.player.attackEndsAt = 0;
        pickupPlantObstacle(pickupPlant);
        return;
    }

    playHammerSound();
    state.lastAttackAt = now;
    state.player.attackEndsAt = now + 220;
    state.player.element.classList.add("attacking");
    createSwingEffect(attackZone);

    // Gestione colpi al Boss
    if (state.boss && rectsIntersect(attackZone, state.boss)) {
        createHitEffect(state.boss.x + state.boss.width / 2 - 18, state.boss.y + state.boss.height / 2 - 18);
        damageBoss();
        increaseRage(15);
    }

    let studentHit = false;
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

            if (student.studentType === "zombie") {
                // Zombie immune al martello normale - rimbalza
                playShieldSound();
                createHitEffect(student.x - 18, student.y - 18);
                // Effetto di respinta del zombie
                const dx = student.x - state.player.x;
                const dy = student.y - state.player.y;
                const pushVector = normalizeVector(dx, dy);
                pushZombieAndCheckServer(student, pushVector);
                survivors.push(student);
                speakZombie(student);
                return;
            }

            createHitEffect(student.x - 18, student.y - 18);
            student.element.remove();
            increaseRage(20);
            studentHit = true;
            return;
        }

        survivors.push(student);
    });

    state.students = survivors;

    if (studentHit) {
        speakTeacher(getTeacherHitLine());
    }

    // Gestione colpi agli oggetti lanciabili e ai cestini
    const remainingObstacles = [];
    state.obstacles.forEach((obstacle) => {
        if (isLaunchableObstacle(obstacle) && rectsIntersect(attackZone, obstacle)) {
            obstacle.sliding = true;
            obstacle.smokeTimer = 0;
            
            // Determina la direzione in base a dove guarda il giocatore
            const pushSpeed = 16;
            if (state.player.direction === "up") {
                obstacle.vx = 0;
                obstacle.vy = -pushSpeed;
            } else if (state.player.direction === "down") {
                obstacle.vx = 0;
                obstacle.vy = pushSpeed;
            } else if (state.player.direction === "left") {
                obstacle.vx = -pushSpeed;
                obstacle.vy = 0;
            } else {
                obstacle.vx = pushSpeed;
                obstacle.vy = 0;
            }
            
            playChairSlideSound();
            createHitEffect(obstacle.x + obstacle.width / 2 - 18, obstacle.y + obstacle.height / 2 - 18);
        } else if (obstacle.type === "bin" && rectsIntersect(attackZone, obstacle)) {
            if (obstacle.element) {
                obstacle.element.remove();
            }
            
            const type = getRandomBinPowerUpType();
            
            const spawnX = obstacle.x + obstacle.width / 2 - 16;
            const spawnY = obstacle.y + obstacle.height / 2 - 16;
            spawnPowerUpAt(spawnX, spawnY, type, {
                animateFromBin: true,
                sourceRect: {
                    x: obstacle.x,
                    y: obstacle.y,
                    width: obstacle.width,
                    height: obstacle.height
                },
                emergeFromX: obstacle.x + obstacle.width / 2 - 16,
                emergeFromY: obstacle.y + obstacle.height / 2 - 12
            });
            
            playChairBounceSound();
            createHitEffect(obstacle.x + obstacle.width / 2 - 18, obstacle.y + obstacle.height / 2 - 18);
            return;
        } else if (isDestructibleObstacle(obstacle) && rectsIntersect(attackZone, obstacle)) {
            obstacle.hitsTaken = (obstacle.hitsTaken || 0) + 1;
            createHitEffect(obstacle.x + obstacle.width / 2 - 18, obstacle.y + obstacle.height / 2 - 18);
            playChairBounceSound();

            if (obstacle.hitsTaken < (obstacle.maxHits || 2)) {
                markObstacleDamaged(obstacle);
                remainingObstacles.push(obstacle);
                return;
            }

            obstacle.element?.remove();
            createDestructionBurst(obstacle);
            createEnvironmentalDebris(obstacle);
            playEnvironmentBreakSound(obstacle.type);
            return;
        }
        remainingObstacles.push(obstacle);
    });
    state.obstacles = remainingObstacles;
}

function pushZombieAndCheckServer(zombie, pushVector) {
    const pushDistance = 50;
    const newX = zombie.x + pushVector.x * pushDistance;
    const newY = zombie.y + pushVector.y * pushDistance;

    // Controlla se il nuovo posto ha un server
    let hitServer = false;
    state.obstacles.forEach((obstacle) => {
        if (obstacle.type === "server") {
            const testZombie = { ...zombie, x: newX, y: newY };
            if (rectsIntersect(testZombie, obstacle)) {
                hitServer = true;
            }
        }
    });

    if (hitServer) {
        // Zombie colpisce un server - viene stordito e rimosso
        createHitEffect(zombie.x + zombie.width / 2 - 18, zombie.y + zombie.height / 2 - 18);
        playPowerUpSound(); // Suono di successo
        zombie.element.remove();
        state.students = state.students.filter(s => s !== zombie);
        speakTeacher(getTeacherContextLine("serverPower", "Server power! Zombie offline!"));
        increaseRage(30); // Bonus rage per lo stordimento strategico
    } else {
        moveWithCollisions(zombie, pushVector.x * pushDistance, pushVector.y * pushDistance);
        stabilizeStudentPosition(zombie);
    }
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

function createSlideSmokeEffect(x, y) {
    const effect = {
        element: document.createElement("div")
    };

    effect.element.className = "effect slide-smoke-effect";
    effect.element.style.left = `${x}px`;
    effect.element.style.top = `${y}px`;
    gameArea.appendChild(effect.element);
    state.effects.push(effect);

    window.setTimeout(() => {
        effect.element.remove();
        state.effects = state.effects.filter((entry) => entry !== effect);
    }, 350);
}

function isLaunchableObstacle(obstacle) {
    return obstacle?.type === "chair" || obstacle?.type === "scooter" || Boolean(obstacle?.carriedThrowable);
}

function isDestructibleObstacle(obstacle) {
    if (!obstacle?.type) {
        return false;
    }

    const destructibleTypes = new Set([
        "desk",
        "computer",
        "board",
        "plant",
        "server",
        "bench",
        "sign",
        "kiosk",
        "speaker",
        "planter",
        "terminal",
        "barrier"
    ]);

    return destructibleTypes.has(obstacle.type);
}

function markObstacleDamaged(obstacle) {
    if (!obstacle?.element) {
        return;
    }

    obstacle.element.classList.add("damaged");
    obstacle.element.dataset.damageStage = "1";
}

function updateCarriedPlantVisual() {
    if (!state.player?.element) {
        return;
    }

    state.player.element.classList.toggle("carrying-plant", Boolean(state.player.carriedPlant));
}

function pickupPlantObstacle(obstacle) {
    if (!state.player || !obstacle || state.player.carriedPlant) {
        return false;
    }

    obstacle.element?.remove();
    state.obstacles = state.obstacles.filter((entry) => entry !== obstacle);
    state.player.carriedPlant = {
        type: "plant",
        width: obstacle.width,
        height: obstacle.height
    };
    updateCarriedPlantVisual();
    playPowerUpSound();
    return true;
}

function findPickupPlantInZone(zone) {
    if (!state.player || state.player.carriedPlant) {
        return null;
    }

    return state.obstacles.find((obstacle) => obstacle.type === "plant" && rectsIntersect(zone, obstacle)) || null;
}

function throwCarriedPlant() {
    if (!state.player?.carriedPlant) {
        return false;
    }

    const direction = getPreferredDodgeVector();
    const pushSpeed = 16;
    const plant = {
        type: "plant",
        x: state.player.x + state.player.width / 2 - 23 + direction.x * 22,
        y: state.player.y + state.player.height / 2 - 29 + direction.y * 22,
        width: 46,
        height: 58,
        carriedThrowable: true,
        sliding: true,
        smokeTimer: 0,
        vx: direction.x * pushSpeed,
        vy: direction.y * pushSpeed,
        element: document.createElement("div")
    };

    plant.element.className = "obstacle plant thrown-plant";
    setRectStyles(plant.element, plant);
    gameArea.appendChild(plant.element);
    state.obstacles.push(plant);
    state.player.carriedPlant = null;
    updateCarriedPlantVisual();
    playChairSlideSound();
    createHitEffect(plant.x + plant.width / 2 - 18, plant.y + plant.height / 2 - 18);
    return true;
}

function createDestructionBurst(obstacle) {
    const burst = document.createElement("div");
    burst.className = `environment-burst burst-${obstacle.type}`;
    burst.style.left = `${obstacle.x + obstacle.width / 2 - 28}px`;
    burst.style.top = `${obstacle.y + obstacle.height / 2 - 28}px`;

    for (let i = 0; i < 6; i += 1) {
        const shard = document.createElement("span");
        shard.className = "environment-burst-shard";
        shard.style.setProperty("--burst-angle", `${(360 / 6) * i}deg`);
        shard.style.setProperty("--burst-distance", `${18 + Math.random() * 22}px`);
        shard.style.setProperty("--burst-delay", `${Math.random() * 40}ms`);
        burst.appendChild(shard);
    }

    gameArea.appendChild(burst);
    window.setTimeout(() => burst.remove(), 440);
}

function createEnvironmentalDebris(obstacle) {
    const element = document.createElement("div");
    element.className = `environment-debris debris-${obstacle.type}`;
    element.style.left = `${obstacle.x}px`;
    element.style.top = `${obstacle.y}px`;
    element.style.width = `${obstacle.width}px`;
    element.style.height = `${obstacle.height}px`;

    for (let i = 0; i < 5; i += 1) {
        const chunk = document.createElement("span");
        chunk.className = "debris-chunk";
        chunk.style.left = `${8 + Math.random() * Math.max(10, obstacle.width - 20)}px`;
        chunk.style.top = `${Math.max(0, obstacle.height * 0.25) + Math.random() * Math.max(8, obstacle.height * 0.6)}px`;
        chunk.style.width = `${8 + Math.random() * 14}px`;
        chunk.style.height = `${5 + Math.random() * 9}px`;
        chunk.style.setProperty("--chunk-rot", `${-28 + Math.random() * 56}deg`);
        element.appendChild(chunk);
    }

    gameArea.appendChild(element);
    state.debris.push({ element });
}

function updateSlidingChairs(delta) {
    state.obstacles.forEach((chair) => {
        if (!isLaunchableObstacle(chair) || !chair.sliding) return;

        const prevX = chair.x;
        const prevY = chair.y;

        // Apply friction/drag
        const drag = Math.pow(0.97, delta);
        chair.vx *= drag;
        chair.vy *= drag;

        const speed = Math.sqrt(chair.vx * chair.vx + chair.vy * chair.vy);
        if (speed < 0.2) {
            chair.vx = 0;
            chair.vy = 0;
            chair.sliding = false;
            return;
        }

        // Emit smoke trail
        chair.smokeTimer = (chair.smokeTimer || 0) + delta * 16.67;
        if (chair.smokeTimer > 50) {
            chair.smokeTimer = 0;
            createSlideSmokeEffect(
                chair.x + chair.width / 2 - 12,
                chair.y + chair.height / 2 - 12
            );
        }

        // Move horizontally and check collisions
        chair.x += chair.vx * delta;
        let collideX = false;
        for (const other of state.obstacles) {
            if (other === chair) continue;
            if (rectsIntersect(chair, other)) {
                collideX = true;
                if (isLaunchableObstacle(other)) {
                    other.sliding = true;
                    other.vx = chair.vx * 0.9;
                    other.vy = chair.vy * 0.9;
                    other.x += other.vx * delta;
                    playChairSlideSound();
                }
                break;
            }
        }
        if (collideX) {
            chair.x = prevX;
            chair.vx = -chair.vx * 0.85;
            playChairBounceSound();
            createHitEffect(chair.x + chair.width / 2 - 18, chair.y + chair.height / 2 - 18);
        }

        // Move vertically and check collisions
        chair.y += chair.vy * delta;
        let collideY = false;
        for (const other of state.obstacles) {
            if (other === chair) continue;
            if (rectsIntersect(chair, other)) {
                collideY = true;
                if (isLaunchableObstacle(other)) {
                    other.sliding = true;
                    other.vx = chair.vx * 0.9;
                    other.vy = chair.vy * 0.9;
                    other.y += other.vy * delta;
                    playChairSlideSound();
                }
                break;
            }
        }
        if (collideY) {
            chair.y = prevY;
            chair.vy = -chair.vy * 0.85;
            playChairBounceSound();
            createHitEffect(chair.x + chair.width / 2 - 18, chair.y + chair.height / 2 - 18);
        }

        // Apply position to DOM
        setRectStyles(chair.element, chair);

        // Check if the sliding chair hits the Boss
        if (state.boss && rectsIntersect(chair, state.boss)) {
            createHitEffect(state.boss.x + state.boss.width / 2 - 18, state.boss.y + state.boss.height / 2 - 18);
            damageBoss();
            increaseRage(25);
            
            chair.x = prevX;
            chair.y = prevY;
            chair.vx = -chair.vx * 0.9;
            chair.vy = -chair.vy * 0.9;
            playChairBounceSound();
        }

        // Check if the sliding chair hits students
        const survivors = [];
        state.students.forEach((student) => {
            if (rectsIntersect(chair, student)) {
                createHitEffect(student.x - 18, student.y - 18);
                student.element.remove();
                increaseRage(30);
                playChairBounceSound();
                
                chair.vx *= 0.85;
                chair.vy *= 0.85;
                return;
            }
            survivors.push(student);
        });
        state.students = survivors;
    });
}

function damagePlayer() {
    state.player.lives -= 1;
    state.player.invulnerableUntil = performance.now() + 1000;
    playPlayerHitSound();
    triggerScreenShake(300, 6);
}

function moveWithCollisions(entity, stepX, stepY) {
    const originX = entity.x;
    const originY = entity.y;
    const maxStep = Math.max(Math.abs(stepX), Math.abs(stepY));
    const steps = Math.max(1, Math.ceil(maxStep / 6));
    const deltaX = stepX / steps;
    const deltaY = stepY / steps;

    for (let i = 0; i < steps; i += 1) {
        const previousX = entity.x;
        entity.x += deltaX;
        entity.x = clamp(entity.x, 24, GAME.width - entity.width - 24);

        if (hitsObstacle(entity)) {
            entity.x = previousX;
        }

        const previousY = entity.y;
        entity.y += deltaY;
        entity.y = clamp(entity.y, 24, GAME.height - entity.height - 24);

        if (hitsObstacle(entity)) {
            entity.y = previousY;
        }
    }

    if (hitsObstacle(entity)) {
        entity.x = originX;
        entity.y = originY;
    }

    entity.x = clamp(entity.x, 24, GAME.width - entity.width - 24);
    entity.y = clamp(entity.y, 24, GAME.height - entity.height - 24);
    syncEntity(entity);
}

function isEntityInsideArena(entity) {
    return (
        entity.x >= 24 &&
        entity.y >= 24 &&
        entity.x <= GAME.width - entity.width - 24 &&
        entity.y <= GAME.height - entity.height - 24
    );
}

function isFreePositionForEntity(entity, x, y) {
    const testEntity = {
        ...entity,
        x: clamp(x, 24, GAME.width - entity.width - 24),
        y: clamp(y, 24, GAME.height - entity.height - 24)
    };

    return isEntityInsideArena(testEntity) && !hitsObstacle(testEntity);
}

function findNearestFreeSpot(entity, originX = entity.x, originY = entity.y, extraValidator = null) {
    const clampedOriginX = clamp(originX, 24, GAME.width - entity.width - 24);
    const clampedOriginY = clamp(originY, 24, GAME.height - entity.height - 24);
    const maxRadius = 220;
    const step = 12;
    const isValid = (testEntity, x, y) => {
        if (!isFreePositionForEntity(testEntity, x, y)) {
            return false;
        }

        if (typeof extraValidator === "function" && !extraValidator({
            ...testEntity,
            x: clamp(x, 24, GAME.width - testEntity.width - 24),
            y: clamp(y, 24, GAME.height - testEntity.height - 24)
        })) {
            return false;
        }

        return true;
    };

    if (isValid(entity, clampedOriginX, clampedOriginY)) {
        return { x: clampedOriginX, y: clampedOriginY };
    }

    for (let radius = step; radius <= maxRadius; radius += step) {
        for (let angle = 0; angle < 360; angle += 30) {
            const radians = angle * (Math.PI / 180);
            const testX = clampedOriginX + Math.cos(radians) * radius;
            const testY = clampedOriginY + Math.sin(radians) * radius;

            if (isValid(entity, testX, testY)) {
                return {
                    x: clamp(testX, 24, GAME.width - entity.width - 24),
                    y: clamp(testY, 24, GAME.height - entity.height - 24)
                };
            }
        }
    }

    return { x: clampedOriginX, y: clampedOriginY };
}

function placeEntityInFreeSpot(entity) {
    if (isEntityInsideArena(entity) && !hitsObstacle(entity)) {
        return;
    }

    const safeSpot = findNearestFreeSpot(entity, entity.x, entity.y);
    entity.x = safeSpot.x;
    entity.y = safeSpot.y;
}

function rememberBossSafePosition() {
    if (!state.boss) {
        return;
    }

    if (isEntityInsideArena(state.boss) && !hitsObstacle(state.boss)) {
        state.boss.lastSafeX = state.boss.x;
        state.boss.lastSafeY = state.boss.y;
    }
}

function stabilizeBossPosition(originX = state.boss?.x, originY = state.boss?.y) {
    if (!state.boss) {
        return;
    }

    state.boss.x = clamp(state.boss.x, 24, GAME.width - state.boss.width - 24);
    state.boss.y = clamp(state.boss.y, 24, GAME.height - state.boss.height - 24);

    if (isEntityInsideArena(state.boss) && !hitsObstacle(state.boss)) {
        rememberBossSafePosition();
        syncEntity(state.boss);
        return;
    }

    const hasSafeMemory =
        Number.isFinite(state.boss.lastSafeX) &&
        Number.isFinite(state.boss.lastSafeY) &&
        isFreePositionForEntity(state.boss, state.boss.lastSafeX, state.boss.lastSafeY);

    const fallback = hasSafeMemory
        ? { x: state.boss.lastSafeX, y: state.boss.lastSafeY }
        : findNearestFreeSpot(state.boss, originX, originY, (candidate) => {
            if (!state.player) {
                return true;
            }
            return !rectsIntersect(candidate, state.player);
        });

    state.boss.x = fallback.x;
    state.boss.y = fallback.y;
    state.boss.lastSafeX = fallback.x;
    state.boss.lastSafeY = fallback.y;
    syncEntity(state.boss);
}

function rememberStudentSafePosition(student) {
    if (!student || student.studentType === undefined) {
        return;
    }

    if (isEntityInsideArena(student) && !hitsObstacle(student)) {
        student.lastSafeX = student.x;
        student.lastSafeY = student.y;
    }
}

function stabilizeStudentPosition(student) {
    if (!student || student.studentType === undefined) {
        return;
    }

    student.x = clamp(student.x, 24, GAME.width - student.width - 24);
    student.y = clamp(student.y, 24, GAME.height - student.height - 24);

    if (isEntityInsideArena(student) && !hitsObstacle(student)) {
        student.lastSafeX = student.x;
        student.lastSafeY = student.y;
        syncEntity(student);
        return;
    }

    const hasSafeMemory =
        Number.isFinite(student.lastSafeX) &&
        Number.isFinite(student.lastSafeY) &&
        isFreePositionForEntity(student, student.lastSafeX, student.lastSafeY);

    const fallback = hasSafeMemory
        ? { x: student.lastSafeX, y: student.lastSafeY }
        : findNearestFreeSpot(student, student.x, student.y);

    student.x = fallback.x;
    student.y = fallback.y;
    student.lastSafeX = fallback.x;
    student.lastSafeY = fallback.y;
    syncEntity(student);
}

function isSafePickupSpot(testEntity, options = {}) {
    const ignoreOtherPowerUps = Boolean(options.ignoreOtherPowerUps);
    const overlapsActor =
        (state.player && rectsIntersect(testEntity, state.player)) ||
        state.students.some((student) => rectsIntersect(testEntity, student));
    const overlapsOtherPowerUp =
        !ignoreOtherPowerUps &&
        (
            (state.powerUp && rectsIntersect(testEntity, state.powerUp)) ||
            (state.heartPowerUp && rectsIntersect(testEntity, state.heartPowerUp))
        );
    const overlapsBossOrCampfire = isPickupBlockedByBossOrCampfire(testEntity);

    return !hitsObstacle(testEntity) && !overlapsActor && !overlapsOtherPowerUp && !overlapsBossOrCampfire;
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

        if (isSafePickupSpot(entity)) {
            return true;
        }
    }

    for (let y = minY; y <= maxY; y += 18) {
        for (let x = minX; x <= maxX; x += 18) {
            entity.x = x;
            entity.y = y;
            if (isSafePickupSpot(entity)) {
                return true;
            }
        }
    }

    const fallbackSpot = findNearestFreeSpot(entity, minX, minY, isSafePickupSpot);
    entity.x = fallbackSpot.x;
    entity.y = fallbackSpot.y;
    return isSafePickupSpot(entity);
}

function placePowerUpNearPosition(entity, originX, originY, options = {}) {
    const allowOrigin = options.allowOrigin !== false;
    const localOnly = Boolean(options.localOnly);
    const maxDistance = Number.isFinite(options.maxDistance) ? options.maxDistance : Infinity;
    const offsets = [
        { x: 0, y: -26 },
        { x: 26, y: 0 },
        { x: -26, y: 0 },
        { x: 0, y: 26 },
        { x: 32, y: -20 },
        { x: -32, y: -20 },
        { x: 32, y: 20 },
        { x: -32, y: 20 },
        { x: 0, y: -40 },
        { x: 40, y: 0 },
        { x: -40, y: 0 },
        { x: 0, y: 40 },
        { x: 52, y: -14 },
        { x: -52, y: -14 },
        { x: 52, y: 14 },
        { x: -52, y: 14 },
        { x: 18, y: -48 },
        { x: -18, y: -48 }
    ];

    if (allowOrigin) {
        offsets.unshift({ x: 0, y: 0 });
    }

    for (const offset of offsets) {
        entity.x = clamp(originX + offset.x, 24, GAME.width - entity.width - 24);
        entity.y = clamp(originY + offset.y, 24, GAME.height - entity.height - 24);
        const withinRadius = Math.hypot(entity.x - originX, entity.y - originY) <= maxDistance;
        if (!withinRadius) {
            continue;
        }
        if (isSafePickupSpot(entity, { ignoreOtherPowerUps: true })) {
            return true;
        }
    }

    if (localOnly) {
        return false;
    }

    const fallbackSpot = findNearestFreeSpot(
        entity,
        originX,
        originY,
        (candidate) => isSafePickupSpot(candidate, { ignoreOtherPowerUps: true })
    );
    entity.x = fallbackSpot.x;
    entity.y = fallbackSpot.y;
    return isSafePickupSpot(entity, { ignoreOtherPowerUps: true });
}

function placePowerUpAroundRect(entity, sourceRect, options = {}) {
    if (!sourceRect) {
        return false;
    }

    const maxDistance = Number.isFinite(options.maxDistance) ? options.maxDistance : 72;
    const padding = Number.isFinite(options.padding) ? options.padding : 10;
    const originX = sourceRect.x + sourceRect.width / 2 - entity.width / 2;
    const originY = sourceRect.y + sourceRect.height / 2 - entity.height / 2;
    const candidates = [
        { x: sourceRect.x + (sourceRect.width - entity.width) / 2, y: sourceRect.y - entity.height - padding },
        { x: sourceRect.x + sourceRect.width + padding, y: sourceRect.y + (sourceRect.height - entity.height) / 2 },
        { x: sourceRect.x - entity.width - padding, y: sourceRect.y + (sourceRect.height - entity.height) / 2 },
        { x: sourceRect.x + (sourceRect.width - entity.width) / 2, y: sourceRect.y + sourceRect.height + padding },
        { x: sourceRect.x + sourceRect.width + padding, y: sourceRect.y - entity.height * 0.35 },
        { x: sourceRect.x - entity.width - padding, y: sourceRect.y - entity.height * 0.35 },
        { x: sourceRect.x + sourceRect.width + padding, y: sourceRect.y + sourceRect.height - entity.height * 0.65 },
        { x: sourceRect.x - entity.width - padding, y: sourceRect.y + sourceRect.height - entity.height * 0.65 }
    ];

    for (const candidate of candidates) {
        entity.x = clamp(candidate.x, 24, GAME.width - entity.width - 24);
        entity.y = clamp(candidate.y, 24, GAME.height - entity.height - 24);
        if (Math.hypot(entity.x - originX, entity.y - originY) > maxDistance) {
            continue;
        }
        if (isSafePickupSpot(entity, { ignoreOtherPowerUps: true })) {
            return true;
        }
    }

    return false;
}

function getCampfireRect() {
    if (!state.campfireElement) return null;

    const left = parseFloat(state.campfireElement.style.left || "0");
    const top = parseFloat(state.campfireElement.style.top || "0");
    const width = parseFloat(state.campfireElement.dataset.rectWidth || "80");
    const height = parseFloat(state.campfireElement.dataset.rectHeight || "80");

    return {
        x: left,
        y: top,
        width,
        height
    };
}

function isPickupBlockedByBossOrCampfire(entity) {
    const pickupRect = expandRect(entity, 10);
    const campfireRect = getCampfireRect();

    if (campfireRect && rectsIntersect(pickupRect, expandRect(campfireRect, 6))) {
        return true;
    }

    if (state.boss && rectsIntersect(pickupRect, expandRect(state.boss, 12))) {
        return true;
    }

    return false;
}

function canCollectPickup(pickup) {
    if (!state.player) return false;
    if (pickup.collectibleAt && state.gameTimeMs < pickup.collectibleAt) return false;

    const playerPickupRect = expandRect(getCollisionRect(state.player), pickup.spawnedFromBin ? 10 : 34);
    const playerBodyRect = expandRect(state.player, pickup.spawnedFromBin ? 4 : 10);
    const pickupRect = expandRect(pickup, pickup.spawnedFromBin ? 8 : 20);

    if (pickup.spawnedFromBin) {
        return rectsIntersect(playerPickupRect, pickupRect) || rectsIntersect(playerBodyRect, pickupRect);
    }

    const playerCenter = centerOf(state.player);
    const pickupCenter = centerOf(pickup);
    const nearEnough = Math.hypot(playerCenter.x - pickupCenter.x, playerCenter.y - pickupCenter.y) <= 74;
    return nearEnough || rectsIntersect(playerPickupRect, pickupRect) || rectsIntersect(playerBodyRect, pickupRect);
}

function getPlayerProjectileHurtRect() {
    if (!state.player) {
        return null;
    }

    return {
        x: state.player.x + 12,
        y: state.player.y + 24,
        width: 38,
        height: 42
    };
}

function isProjectileBlockedByObstacle(projectile, targetRect) {
    if (!projectile || !targetRect) {
        return false;
    }

    const source = centerOf(projectile);
    const target = centerOf(targetRect);
    const distance = Math.hypot(target.x - source.x, target.y - source.y);
    const steps = Math.max(1, Math.ceil(distance / 6));

    for (let i = 1; i < steps; i += 1) {
        const progress = i / steps;
        const probe = {
            x: source.x + (target.x - source.x) * progress - 3,
            y: source.y + (target.y - source.y) * progress - 3,
            width: 6,
            height: 6
        };

        if (hitsObstacle(probe)) {
            return true;
        }
    }

    return false;
}

function getCollisionRect(entity) {
    if (entity === state.player || entity.isPlayerCollisionProbe) {
        // Docente (Player): visual 62x74. Shrink physics to bottom 20px (feet), 30px width (centered)
        return {
            x: entity.x + 16,
            y: entity.y + 54,
            width: 30,
            height: 20
        };
    } else if (entity === state.boss) {
        // Boss: use a dynamic feet hitbox so both boss variants collide consistently.
        const hitboxWidth = Math.round(entity.width * 0.58);
        return {
            x: entity.x + (entity.width - hitboxWidth) / 2,
            y: entity.y + entity.height - 30,
            width: hitboxWidth,
            height: 30
        };
    } else if (entity && entity.studentType !== undefined) {
        // Studenti: hitbox dei piedi un po' piu' larga per evitare compenetrazioni visive con ostacoli/bordi.
        return {
            x: entity.x + 10,
            y: entity.y + 42,
            width: 32,
            height: 18
        };
    } else if (entity && Number.isFinite(entity.collisionWidth) && Number.isFinite(entity.collisionHeight)) {
        return {
            x: entity.x + (entity.width - entity.collisionWidth) / 2,
            y: entity.y + (entity.height - entity.collisionHeight) / 2,
            width: entity.collisionWidth,
            height: entity.collisionHeight
        };
    }
    return entity;
}

function hitsObstacle(entity) {
    const colRect = getCollisionRect(entity);
    return state.obstacles.some((obstacle) => {
        // Ignora gli oggetti lanciabili che stanno scivolando per evitare blocchi o incastri
        if (isLaunchableObstacle(obstacle) && obstacle.sliding) {
            return false;
        }
        return rectsIntersect(colRect, obstacle);
    });
}

function getPowerUpSpawnWindowDelay() {
    return randomBetween(5000, 10000);
}

function getPowerUpRespawnDelay() {
    return getPowerUpSpawnWindowDelay();
}

function getHeartPowerUpRespawnDelay() {
    return getPowerUpSpawnWindowDelay();
}

function getRandomBinPowerUpType() {
    let types = ["coffee", "shield", "speed", "super_hammer"];

    if (state.currentLevel >= 5) {
        types = ["coffee", "shield", "speed", "super_hammer", "coffee", "speed"];
    }

    if ((state.currentLevel === 3 && state.boss) || state.currentLevel >= 7) {
        types.push("studia");
    }

    return types[Math.floor(Math.random() * types.length)];
}

function checkEndConditions() {
    if (state.player.lives <= 0) {
        finishGame(false);
        return;
    }

    if (state.students.length === 0) {
        if (state.selectedHackademyId === "standard") {
            if (getCurrentLevelConfig().bossKind && (state.boss || state.summoningActive)) {
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
    state.nextPowerUpAt = getPowerUpSpawnWindowDelay();
    state.nextHeartPowerUpAt = getHeartPowerUpRespawnDelay();
    
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
            intermissionMessage.textContent = "Attento! Nel Livello 3 gli studenti si raduneranno attorno al fuoco per evocare qualcosa di spaventoso. Per fermarli e colpire anche da lontano, comparira un nuovo power-up: STUDIA.";
            if (intermissionButton) {
                intermissionButton.textContent = "Affronta il Livello 3 (Boss Battle)";
            }
        } else if (state.currentLevel === 3) {
            intermissionTitle.textContent = "Verso Piazza del Ferrarese! 🚗";
            intermissionMessage.textContent = "Il boss e' crollato, ma adesso bisogna correre a Bari, in piazza del Ferrarese, per un evento Aulab. Lo stand e' gia' stato assalito da anziani e boomer in panico per SPID e OTP: nel tragitto dovrai cambiare tra 3 corsie, prendere le rampe dei camion, lanciare il martello con Space o col tasto attacco e usare il NOS con Ctrl.";
            if (intermissionButton) {
                intermissionButton.textContent = "Parti per il Livello Bonus";
            }
        } else if (state.currentLevel === 4) {
            intermissionTitle.textContent = "Arrivo in Piazza! 📣";
            intermissionMessage.textContent = "Hai raggiunto il centro citta'. Adesso inizia il vero caos digitale: stand Aulab, richieste di SPID e folla in panico.";
            if (intermissionButton) {
                intermissionButton.textContent = "Entra nel Livello 5: Piazza Digitale";
            }
        } else if (state.currentLevel === 5) {
            intermissionTitle.textContent = "Piazza Ripulita! 📢";
            intermissionMessage.textContent = "Il gazebo ha resistito, ma la folla cresce. Nel Livello 6 l'assedio all'evento sara' ancora piu' feroce e le note vocali inizieranno a volare.";
            if (intermissionButton) {
                intermissionButton.textContent = "Difendi il Livello 6";
            }
        } else if (state.currentLevel === 6) {
            intermissionTitle.textContent = "Gazebo Salvo... per ora. 📲";
            intermissionMessage.textContent = "Hai contenuto il caos, ma dietro tutto questo c'e' un'entita' digitale ancora peggiore. Nel Livello 7 verra' evocato il Signore dello SPID e riceverai una mitraglietta speciale poco prima dello scontro.";
            if (intermissionButton) {
                intermissionButton.textContent = "Entra nel Livello 7 (Boss Finale)";
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
    
    let types = ["coffee", "shield", "speed", "super_hammer"];

    // Nel livello 3, aumenta molto la probabilita' del power-up "studia" solo quando il boss e' presente.
    if (state.currentLevel === 3 && state.boss) {
        types = ["coffee", "shield", "speed", "super_hammer", "studia", "studia", "studia", "studia", "studia", "studia"];
    } else if (state.currentLevel >= 7 && (state.boss || state.summoningActive)) {
        types = ["coffee", "shield", "speed", "super_hammer", "studia", "studia", "studia", "studia"];
    } else if (state.currentLevel >= 5) {
        types = ["coffee", "shield", "speed", "super_hammer", "coffee", "speed"];
    }

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
    
    if (!placePowerUpInFreeSpot(powerUp)) {
        return false;
    }
    gameArea.appendChild(powerUp.element);
    syncEntity(powerUp);
    state.powerUp = powerUp;
    return true;
}

function spawnPowerUpAt(x, y, type, options = {}) {
    if (state.powerUp) {
        expirePowerUp();
    }
    
    const counter = document.createElement("span");
    const icon = document.createElement("span");
    
    const powerUp = {
        x: x,
        y: y,
        width: 32,
        height: 32,
        type,
        expiresAt: state.gameTimeMs + GAME.powerUpLifetime,
        collectibleAt: state.gameTimeMs,
        spawnedFromBin: Boolean(options.animateFromBin),
        counter,
        element: document.createElement("div")
    };

    powerUp.element.className = `game-powerup type-${type}`;
    icon.className = "powerup-icon";
    counter.className = "powerup-counter";
    counter.textContent = "3";
    powerUp.element.append(counter, icon);

    const overlapsActor =
        rectsIntersect(powerUp, state.player) ||
        state.students.some((student) => rectsIntersect(powerUp, student));

    const needsRelocation =
        hitsObstacle(powerUp) ||
        isPickupBlockedByBossOrCampfire(powerUp) ||
        overlapsActor;

    if (options.animateFromBin) {
        const placedNearBin = options.sourceRect
            ? placePowerUpAroundRect(powerUp, options.sourceRect, { maxDistance: 72, padding: 10 })
            : placePowerUpNearPosition(powerUp, x, y, { allowOrigin: false, localOnly: true, maxDistance: 64 });
        if (!placedNearBin) {
            return false;
        }
    } else if (needsRelocation) {
        if (!placePowerUpNearPosition(powerUp, x, y, { allowOrigin: true }) && !placePowerUpInFreeSpot(powerUp)) {
            return false;
        }
    }

    syncEntity(powerUp);
    gameArea.appendChild(powerUp.element);
    if (options.animateFromBin) {
        const emergeFromX = Number.isFinite(options.emergeFromX) ? options.emergeFromX : x;
        const emergeFromY = Number.isFinite(options.emergeFromY) ? options.emergeFromY : y;
        powerUp.collectibleAt = state.gameTimeMs + 650;
        powerUp.element.style.setProperty("--pickup-base-x", `${powerUp.x}px`);
        powerUp.element.style.setProperty("--pickup-base-y", `${powerUp.y}px`);
        powerUp.element.classList.add("bin-powerup-emerge");
        powerUp.element.style.setProperty("--pickup-emerge-x", `${emergeFromX - powerUp.x}px`);
        powerUp.element.style.setProperty("--pickup-emerge-y", `${emergeFromY - powerUp.y}px`);
        window.setTimeout(() => {
            if (!state.powerUp || state.powerUp !== powerUp) {
                return;
            }
            powerUp.element.classList.remove("bin-powerup-emerge");
            powerUp.element.style.removeProperty("--pickup-base-x");
            powerUp.element.style.removeProperty("--pickup-base-y");
            powerUp.element.style.removeProperty("--pickup-emerge-x");
            powerUp.element.style.removeProperty("--pickup-emerge-y");
        }, 620);
    }
    state.powerUp = powerUp;
    return true;
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
    if (!placePowerUpInFreeSpot(heartPowerUp)) {
        return false;
    }
    gameArea.appendChild(heartPowerUp.element);
    syncEntity(heartPowerUp);
    state.heartPowerUp = heartPowerUp;
    return true;
}

function collectPowerUp() {
    if (!state.powerUp) {
        return;
    }

    const type = state.powerUp.type;
    const origin = centerOf(state.powerUp);

    // Always remove the power-up element and clear state
    state.powerUp.element.remove();
    state.powerUp = null;

    const now = performance.now();

    if (type === "coffee") {
        playPowerUpSound();
        launchDragonStrike(origin);
        activateRageMode();
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
    } else if (type === "studia") {
        state.pendingStudiaShots += 1;
        if (tryLaunchStudiaStrike()) {
            speakTeacher(getTeacherContextLine("studiaLaunched", "STUDIA lanciato! Inseguira' il boss!"));
        } else if (state.boss) {
            speakTeacher(getTeacherContextLine("studiaQueued", "Altro STUDIA pronto! Partira' subito dopo!"));
        } else {
            speakTeacher(getTeacherContextLine("studiaReady", "STUDIA pronto! Partira' appena arriva il boss!"));
        }
    }

    state.nextPowerUpAt = state.gameTimeMs + getPowerUpRespawnDelay();
}

function expirePowerUp() {
    if (!state.powerUp) {
        return;
    }

    state.powerUp.element.remove();
    state.powerUp = null;
    state.nextPowerUpAt = state.gameTimeMs + getPowerUpRespawnDelay();
}

function collectHeartPowerUp() {
    if (!state.heartPowerUp || state.player.lives >= GAME.spawnLives) {
        return;
    }

    state.heartPowerUp.element.remove();
    state.heartPowerUp = null;
    state.player.lives = Math.min(GAME.spawnLives, state.player.lives + 1);
    playHealSound();
    state.nextHeartPowerUpAt = state.gameTimeMs + getHeartPowerUpRespawnDelay();
}

function expireHeartPowerUp() {
    if (!state.heartPowerUp) {
        return;
    }

    state.heartPowerUp.element.remove();
    state.heartPowerUp = null;
    state.nextHeartPowerUpAt = state.gameTimeMs + getHeartPowerUpRespawnDelay();
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
    let resumeQueuedSpeech = false;
    if (target.speechTimeoutId) {
        window.clearTimeout(target.speechTimeoutId);
        target.speechTimeoutId = null;
    }
    state.studentSpeechQueue = state.studentSpeechQueue.filter((entry) => entry.student !== target);
    if (state.activeStudentSpeech && state.activeStudentSpeech.student === target) {
        state.activeStudentSpeech = null;
        resumeQueuedSpeech = true;
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

    if (resumeQueuedSpeech) {
        processStudentSpeechQueue();
    }
}

function pickDragonTargetId() {
    const activeStudents = state.students.filter(s => !s.isChanting);
    if (activeStudents.length === 0) return "";
    const target = activeStudents[Math.floor(Math.random() * activeStudents.length)];
    return target ? target.id : "";
}

function launchStudiaStrike(origin) {
    const element = document.createElement("div");
    element.className = "teacher-projectile";
    element.textContent = "STUDIA";

    const strike = {
        x: origin.x - 30,
        y: origin.y - 12,
        width: 60,
        height: 24,
        angle: 0,
        element: element
    };

    gameArea.appendChild(element);
    syncStudiaStrike(strike);
    state.studiaStrike = strike;
}

function updateStudiaStrike(delta) {
    if (!state.boss || state.boss.lives <= 0) {
        state.studiaStrike.element.remove();
        state.studiaStrike = null;
        return;
    }

    const strikeCenter = centerOf(state.studiaStrike);
    const bossCenter = centerOf(state.boss);
    const vector = normalizeVector(bossCenter.x - strikeCenter.x, bossCenter.y - strikeCenter.y);
    state.studiaStrike.angle = Math.atan2(vector.y, vector.x);

    state.studiaStrike.x += vector.x * GAME.dragonSpeed * delta;
    state.studiaStrike.y += vector.y * GAME.dragonSpeed * delta;
    syncStudiaStrike(state.studiaStrike);

    if (rectsIntersect(expandRect(state.studiaStrike, -10), state.boss)) {
        createStudiaImpact(
            state.boss.x + state.boss.width / 2 - 30,
            state.boss.y + state.boss.height / 2 - 30
        );
        state.boss.element.classList.add("studia-hit");
        window.setTimeout(() => {
            state.boss?.element?.classList.remove("studia-hit");
        }, 260);
        createHitEffect(state.boss.x + state.boss.width / 2 - 18, state.boss.y + state.boss.height / 2 - 18);
        damageBoss();
        increaseRage(25);
        state.studiaStrike.element.remove();
        state.studiaStrike = null;
        tryLaunchStudiaStrike();
    }
}

function syncStudiaStrike(strike) {
    strike.element.style.transform = `translate(${strike.x}px, ${strike.y}px) rotate(${strike.angle || 0}rad)`;
}

function playPlayerRangedAttackAnimation() {
    if (!state.player?.element) return;

    state.player.element.classList.add("ranged-attacking");
    window.setTimeout(() => {
        state.player?.element?.classList.remove("ranged-attacking");
    }, 300);
}

function tryLaunchStudiaStrike() {
    if (!state.player || !state.boss || state.pendingStudiaShots <= 0 || state.studiaStrike) {
        return false;
    }

    state.pendingStudiaShots -= 1;
    playTeacherRangedSound();
    playPlayerRangedAttackAnimation();
    launchStudiaStrike(centerOf(state.player));
    return true;
}

function createStudiaImpact(x, y) {
    const effect = {
        element: document.createElement("div")
    };

    effect.element.className = "effect studia-impact";
    effect.element.textContent = "STUDIA!";
    effect.element.style.left = `${x}px`;
    effect.element.style.top = `${y}px`;
    gameArea.appendChild(effect.element);
    state.effects.push(effect);

    window.setTimeout(() => {
        effect.element.remove();
        state.effects = state.effects.filter((entry) => entry !== effect);
    }, 420);
}

function getStudentById(id) {
    return state.students.find((student) => student.id === id) || null;
}

function speakStudent(student) {
    if (!student || student.element.classList.contains("burning")) {
        return;
    }
    const message = pickRandomLine(getStudentLinePool(student), "non studio!");
    queueStudentSpeech(student, message, {
        bubbleClass: "speech-bubble",
        minimumMs: 1700,
        role: "student"
    });
}

function speakZombie(student) {
    if (!student || student.element.classList.contains("burning")) {
        return;
    }
    const message = pickRandomLine(getStudentLinePool("zombie"), "Uhhhh...");
    queueStudentSpeech(student, message, {
        bubbleClass: "speech-bubble zombie-bubble",
        minimumMs: 2500,
        role: "student",
        onStart: () => {
            playZombieGroan();
        }
    });
}

function finishGame(isVictory) {
    state.running = false;
    state.gameOver = !isVictory;
    state.victory = isVictory;
    stopRoadTripEngineSound();
    stopBackgroundMusic();
    stopStudentSpeech();
    if (!isVictory) {
        playGameOverSound();
    } else {
        localStorage.removeItem("aulab_rage_saved_level");
    }

    if (isVictory && state.selectedHackademyId === "standard" && state.currentLevel === levelConfigs.length) {
        selectHackademy("standard", false);
        showFinalWipModal();
        return;
    }

    endOverlay.classList.remove("d-none");
    endEyebrow.textContent = isVictory ? "Arena ripulita" : "Missione fallita";
    endTitle.textContent = isVictory ? "Vittoria" : "Game Over";
    
    if (restartButton) {
        restartButton.textContent = isVictory ? "Vai al livello successivo" : "Rigioca";
    }
    
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
        if (state.currentLevel === 4) {
            endMessage.textContent = `${teacher.name} non e' riuscito ad arrivare in piazza. Riprova il tragitto e schiva il caos sulla strada.`;
        } else {
            endMessage.textContent = state.currentLevel >= 5
            ? `Il caos digitale ha travolto ${teacher.name}. Riprova e salva l'evento Aulab dalla folla in panico.`
            : `Le pietre hanno fermato ${teacher.name}. Riprova e libera l'ufficio dagli studenti svogliati.`;
        }
    }
}

function showFinalWipModal() {
    if (!finalWipModal) {
        return;
    }

    endOverlay.classList.add("d-none");
    finalWipModal.classList.remove("d-none");
}

function closeFinalWipModal() {
    if (!finalWipModal) {
        return;
    }

    finalWipModal.classList.add("d-none");
}

function updateHud() {
    if (state.player) {
        renderLives(state.player.lives);
        updateStaminaHud();
    }
    if (studentsChip?.childNodes?.[0]) {
        studentsChip.childNodes[0].textContent = isRoadTripActive() ? "KM: " : "Studenti: ";
    }
    if (isRoadTripActive()) {
        const remaining = Math.max(0, Math.ceil((state.bonusRoad.goalDistance - state.bonusRoad.distance) / 100));
        studentsValue.textContent = `${remaining}m`;
        studentsChip?.classList.add("roadtrip-chip");
        levelChip?.classList.add("roadtrip-chip");
        if (studentsChip) {
            studentsChip.dataset.roadtripWarning = getRoadTripWarningText();
        }
        if (levelChip) {
            levelChip.dataset.roadtripWarning = getRoadTripStatusText();
        }
    } else {
        studentsValue.textContent = state.students.length;
        studentsChip?.classList.remove("roadtrip-chip");
        levelChip?.classList.remove("roadtrip-chip");
        if (studentsChip) {
            delete studentsChip.dataset.roadtripWarning;
        }
        if (levelChip) {
            delete levelChip.dataset.roadtripWarning;
        }
    }
    if (levelValue) {
        levelValue.textContent = state.selectedHackademyId === "standard" ? state.currentLevel : "Sandbox";
    }
}

function updateStaminaHud() {
    if (!state.player || !staminaBarFill) return;

    const staminaPct = Math.max(0, Math.min(100, (state.player.stamina / GAME.maxStamina) * 100));
    staminaBarFill.style.width = `${staminaPct}%`;
    if (hudStaminaLabel) {
        hudStaminaLabel.textContent = isRoadTripActive() ? "NOS" : "Stamina";
    }
    if (hudStamina) {
        hudStamina.classList.toggle("roadtrip-nos", isRoadTripActive());
    }

    // Aggiorna la classe CSS per lo stato di stamina bassa
    if (staminaPct < 50) {
        hudStamina.classList.add("stamina-low");
    } else {
        hudStamina.classList.remove("stamina-low");
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
    const viewportWidth = Math.max(1, gameViewport.clientWidth || getViewportMetrics().width);
    const viewportHeight = Math.max(1, gameViewport.clientHeight || getViewportMetrics().height);
    const scaleX = Math.max(viewportWidth / GAME.width, 0.1);
    const scaleY = Math.max(viewportHeight / GAME.height, 0.1);
    state.currentScale = Math.min(scaleX, scaleY);
    state.currentScaleX = scaleX;
    state.currentScaleY = scaleY;

    gameStage.style.width = `${viewportWidth}px`;
    gameStage.style.height = `${viewportHeight}px`;
    applyGameAreaTransform();
}

function syncEntity(entity) {
    const rotation = Number.isFinite(entity.renderRotation) ? ` rotate(${entity.renderRotation}rad)` : "";
    entity.element.style.transform = `translate(${entity.x}px, ${entity.y}px)${rotation}`;
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

function primeSpeechSynthesis() {
    if (!audioState.speechEnabled) {
        return;
    }

    const synth = window.speechSynthesis;
    if (!synth) {
        return;
    }

    try {
        if (typeof synth.getVoices === "function") {
            synth.getVoices();
        }

        if (audioState.speechPrimed) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(".");
        utterance.lang = "it-IT";
        utterance.volume = 0;
        utterance.rate = 1;
        utterance.pitch = 1;
        synth.speak(utterance);
        audioState.speechPrimed = true;

        window.setTimeout(() => {
            if (!state.running && (synth.speaking || synth.pending)) {
                synth.cancel();
            }
        }, 40);
    } catch (_error) {
        audioState.speechPrimed = false;
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

    if (isRoadTripActive()) {
        scheduleRoadTripMusicChunk(ctx, lookAhead);
        return;
    }

    const stepDuration = state.rageActive ? 0.22 : 0.34;
    const freqMult = state.rageActive ? 1.5 : 1.0;
    let stepIndex = Math.floor(audioState.nextMusicTime / stepDuration) % musicLeadPattern.length;

    while (audioState.nextMusicTime < ctx.currentTime + lookAhead) {
        scheduleLeadNote(audioState.nextMusicTime, musicLeadPattern[stepIndex] * freqMult);
        scheduleBassNote(audioState.nextMusicTime, musicBassPattern[stepIndex] * freqMult);
        audioState.nextMusicTime += stepDuration;
        stepIndex = (stepIndex + 1) % musicLeadPattern.length;
    }
}

function scheduleRoadTripMusicChunk(ctx, lookAhead) {
    const stepDuration = 0.17;
    let stepIndex = Math.floor(audioState.nextMusicTime / stepDuration) % roadTripLeadPattern.length;

    while (audioState.nextMusicTime < ctx.currentTime + lookAhead) {
        scheduleRoadTripLeadNote(audioState.nextMusicTime, roadTripLeadPattern[stepIndex]);

        if (stepIndex % 2 === 0) {
            scheduleRoadTripBassNote(audioState.nextMusicTime, roadTripBassPattern[stepIndex]);
        }

        scheduleRoadTripHiHat(audioState.nextMusicTime + 0.01);
        if (stepIndex % 4 === 0) {
            scheduleRoadTripPad(audioState.nextMusicTime, roadTripBassPattern[stepIndex] * 2);
        }

        audioState.nextMusicTime += stepDuration;
        stepIndex = (stepIndex + 1) % roadTripLeadPattern.length;
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

function scheduleRoadTripLeadNote(time, frequency) {
    const osc = audioState.context.createOscillator();
    const gain = audioState.context.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.075, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.145);
    osc.connect(gain);
    gain.connect(audioState.musicGain);
    osc.start(time);
    osc.stop(time + 0.16);
}

function scheduleRoadTripBassNote(time, frequency) {
    const osc = audioState.context.createOscillator();
    const gain = audioState.context.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.065, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    osc.connect(gain);
    gain.connect(audioState.musicGain);
    osc.start(time);
    osc.stop(time + 0.2);
}

function scheduleRoadTripPad(time, frequency) {
    const osc = audioState.context.createOscillator();
    const gain = audioState.context.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.018, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);
    osc.connect(gain);
    gain.connect(audioState.musicGain);
    osc.start(time);
    osc.stop(time + 0.34);
}

function scheduleRoadTripHiHat(time) {
    const osc = audioState.context.createOscillator();
    const gain = audioState.context.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(2600, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.012, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);
    osc.connect(gain);
    gain.connect(audioState.musicGain);
    osc.start(time);
    osc.stop(time + 0.04);
}

function scheduleHeartbeatMusic(ctx, lookAhead) {
    // Calcola la velocità del battito in base alla distanza dal zombie più vicino
    let closestZombieDistance = Infinity;
    if (state.player) {
        state.students.forEach(student => {
            if (student.studentType === "zombie") {
                const distance = Math.hypot(
                    centerOf(student).x - centerOf(state.player).x,
                    centerOf(student).y - centerOf(state.player).y
                );
                closestZombieDistance = Math.min(closestZombieDistance, distance);
            }
        });
    }

    // Velocità battito: da 1.5s (lontano) a 0.4s (vicino)
    const maxDistance = 300;
    const minHeartbeatInterval = 0.4;
    const maxHeartbeatInterval = 1.5;
    const normalizedDistance = Math.min(closestZombieDistance / maxDistance, 1);
    const heartbeatInterval = minHeartbeatInterval + (maxHeartbeatInterval - minHeartbeatInterval) * normalizedDistance;

    // Effetto visivo del battito
    if (closestZombieDistance < 150) {
        gameArea.classList.add("heartbeat");
        setTimeout(() => {
            gameArea.classList.remove("heartbeat");
        }, 200);
    }

    while (audioState.nextMusicTime < ctx.currentTime + lookAhead) {
        scheduleHeartbeat(audioState.nextMusicTime, normalizedDistance);
        audioState.nextMusicTime += heartbeatInterval;
    }
}

function scheduleHeartbeat(time, intensity) {
    // Primo battito (lub)
    const osc1 = audioState.context.createOscillator();
    const gain1 = audioState.context.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(60 - intensity * 20, time);
    gain1.gain.setValueAtTime(0.0001, time);
    gain1.gain.exponentialRampToValueAtTime(0.15, time + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);
    osc1.connect(gain1);
    gain1.connect(audioState.musicGain);
    osc1.start(time);
    osc1.stop(time + 0.2);

    // Secondo battito (dub)
    const osc2 = audioState.context.createOscillator();
    const gain2 = audioState.context.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(45 - intensity * 15, time + 0.15);
    gain2.gain.setValueAtTime(0.0001, time + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.12, time + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
    osc2.connect(gain2);
    gain2.connect(audioState.musicGain);
    osc2.start(time + 0.15);
    osc2.stop(time + 0.35);
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

function playZombieGroan() {
    playToneBurst({
        frequencies: [60, 90, 120],
        duration: 1.2,
        type: "sawtooth",
        peakGain: 0.08,
        stagger: 0.3
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

function playRoadTripNosSound(level = 1) {
    const boostLevel = clamp(level, 1, 2);
    playToneBurst({
        frequencies: boostLevel === 2 ? [196, 293.66, 440, 659.25] : [164.81, 246.94, 392, 587.33],
        duration: boostLevel === 2 ? 0.44 : 0.34,
        type: "sawtooth",
        peakGain: boostLevel === 2 ? 0.15 : 0.12,
        stagger: 0.028,
        slideTo: boostLevel === 2 ? 880 : 698.46
    });
    playToneBurst({
        frequencies: boostLevel === 2 ? [82.41, 123.47] : [98, 146.83],
        duration: boostLevel === 2 ? 0.3 : 0.24,
        type: "triangle",
        peakGain: 0.08,
        stagger: 0.018,
        slideTo: boostLevel === 2 ? 196 : 174.61
    });
}

function playRampBoostSound() {
    playToneBurst({
        frequencies: [220, 440, 880, 1174.66],
        duration: 0.42,
        type: "sawtooth",
        peakGain: 0.13,
        stagger: 0.03,
        slideTo: 1567.98
    });
    playToneBurst({
        frequencies: [98, 146.83],
        duration: 0.26,
        type: "triangle",
        peakGain: 0.08,
        stagger: 0.02,
        slideTo: 196
    });
}

function playRoadTripEnginePulse() {
    if (!audioState.context || audioState.muted || !isRoadTripActive()) {
        return;
    }

    const ctx = audioState.context;
    const now = ctx.currentTime;
    const phase = audioState.roadTripEnginePhase++;
    const speedFactor = clamp((state.bonusRoad?.scrollSpeed || 4.2) / 6, 0.65, 1.25);
    const wobble = phase % 2 === 0 ? -3.5 : 3.5;
    const baseFrequency = 54 + speedFactor * 22 + wobble;
    const growlOsc = ctx.createOscillator();
    const growlGain = ctx.createGain();
    const humOsc = ctx.createOscillator();
    const humGain = ctx.createGain();

    growlOsc.type = "sawtooth";
    humOsc.type = "triangle";
    growlOsc.frequency.setValueAtTime(baseFrequency, now);
    growlOsc.frequency.exponentialRampToValueAtTime(baseFrequency * 0.94, now + 0.2);
    humOsc.frequency.setValueAtTime(baseFrequency * 1.9, now);
    humOsc.frequency.exponentialRampToValueAtTime(baseFrequency * 1.6, now + 0.2);

    growlGain.gain.setValueAtTime(0.0001, now);
    growlGain.gain.exponentialRampToValueAtTime(0.055, now + 0.03);
    growlGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    humGain.gain.setValueAtTime(0.0001, now);
    humGain.gain.exponentialRampToValueAtTime(0.02, now + 0.02);
    humGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    growlOsc.connect(growlGain);
    humOsc.connect(humGain);
    growlGain.connect(audioState.sfxGain);
    humGain.connect(audioState.sfxGain);

    growlOsc.start(now);
    humOsc.start(now);
    growlOsc.stop(now + 0.24);
    humOsc.stop(now + 0.2);
}

function startRoadTripEngineSound() {
    if (!audioState.context || audioState.roadTripEngineIntervalId) {
        return;
    }

    playRoadTripEnginePulse();
    audioState.roadTripEngineIntervalId = window.setInterval(() => {
        playRoadTripEnginePulse();
    }, 180);
}

function stopRoadTripEngineSound() {
    if (!audioState.roadTripEngineIntervalId) {
        return;
    }

    window.clearInterval(audioState.roadTripEngineIntervalId);
    audioState.roadTripEngineIntervalId = null;
    audioState.roadTripEnginePhase = 0;
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

function playChairSlideSound() {
    playToneBurst({
        frequencies: [220, 110],
        duration: 0.22,
        type: "sawtooth",
        peakGain: 0.08,
        slideTo: 40
    });
}

function playChairBounceSound() {
    playToneBurst({
        frequencies: [440, 330],
        duration: 0.16,
        type: "triangle",
        peakGain: 0.15,
        slideTo: 80
    });
}

function playEnvironmentBreakSound(type = "generic") {
    const isWoodLike = ["desk", "bench", "kiosk", "board", "sign", "planter", "plant"].includes(type);
    const isMetalLike = ["computer", "server", "speaker", "terminal", "barrier"].includes(type);

    if (isWoodLike) {
        playToneBurst({
            frequencies: [240, 170, 120],
            duration: 0.22,
            type: "sawtooth",
            peakGain: 0.14,
            stagger: 0.03,
            slideTo: 70
        });
        return;
    }

    if (isMetalLike) {
        playToneBurst({
            frequencies: [520, 390, 180],
            duration: 0.26,
            type: "triangle",
            peakGain: 0.13,
            stagger: 0.03,
            slideTo: 90
        });
        return;
    }

    playToneBurst({
        frequencies: [320, 220, 120],
        duration: 0.2,
        type: "sawtooth",
        peakGain: 0.12,
        stagger: 0.02,
        slideTo: 60
    });
}

function playCodeCopiedSound() {
    playToneBurst({
        frequencies: [261.63, 329.63, 392.00, 523.25],
        duration: 0.45,
        type: "sine",
        peakGain: 0.16,
        stagger: 0.07,
        slideTo: 659.25
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

    const tts = getSpeechTtsProfile("student");
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "it-IT";
    utterance.rate = tts.rate;
    utterance.pitch = tts.pitch;
    utterance.volume = tts.volume;
    synth.speak(utterance);
}

function stopStudentSpeech() {
    state.studentSpeechQueue = [];

    if (state.activeStudentSpeech && state.activeStudentSpeech.student?.speechTimeoutId) {
        window.clearTimeout(state.activeStudentSpeech.student.speechTimeoutId);
        state.activeStudentSpeech.student.speechTimeoutId = null;
    }

    state.activeStudentSpeech = null;

    state.students.forEach((student) => {
        if (student.speechTimeoutId) {
            window.clearTimeout(student.speechTimeoutId);
            student.speechTimeoutId = null;
        }
        removeStudentSpeechBubble(student);
    });

    state.bonusRoad?.entities?.forEach((entity) => {
        if (entity.speechTimeoutId) {
            window.clearTimeout(entity.speechTimeoutId);
            entity.speechTimeoutId = null;
        }
        removeStudentSpeechBubble(entity);
    });

    if (audioState.speechEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

function speakTeacher(message) {
    if (!state.player || !state.running) return;

    const previousBubble = state.player.element.querySelector(".speech-bubble");
    if (previousBubble) {
        previousBubble.remove();
    }
    if (state.player.speechTimeoutId) {
        window.clearTimeout(state.player.speechTimeoutId);
    }

    const bubble = document.createElement("div");
    bubble.className = "speech-bubble teacher-bubble";
    bubble.textContent = message;
    state.player.element.appendChild(bubble);
    state.player.element.classList.add("speaking");

    state.player.speechTimeoutId = window.setTimeout(() => {
        bubble.remove();
        if (state.player && state.player.element) {
            state.player.element.classList.remove("speaking");
        }
        if (state.player) {
            state.player.speechTimeoutId = null;
        }
    }, 1500);

    if (!audioState.speechEnabled || audioState.muted) return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    if (synth.speaking || synth.pending) {
        synth.cancel();
    }

    const tts = getSpeechTtsProfile("teacher");
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "it-IT";
    utterance.rate = tts.rate;
    utterance.pitch = tts.pitch;
    utterance.volume = tts.volume;
    synth.speak(utterance);
}

// --- FUNZIONALITÀ BOSS E RITO DI EVOCAZIONE (LIVELLO 3) ---

function speakChant(student) {
    if (!student) return;
    const message = getChantLine();
    queueStudentSpeech(student, message, {
        bubbleClass: "speech-bubble",
        minimumMs: 1200,
        role: "student"
    });
}

function triggerScreenShake(durationMs, intensity) {
    const compactMobile = isCompactMobileViewport();
    const effectiveDuration = compactMobile ? durationMs * 0.75 : durationMs;
    const effectiveIntensity = compactMobile ? intensity * 0.55 : intensity;
    const startTime = performance.now();

    function shake() {
        const elapsed = performance.now() - startTime;
        if (elapsed < effectiveDuration && state.running) {
            state.shakeOffsetX = (Math.random() - 0.5) * effectiveIntensity;
            state.shakeOffsetY = (Math.random() - 0.5) * effectiveIntensity;
            applyGameAreaTransform();
            requestAnimationFrame(shake);
        } else {
            state.shakeOffsetX = 0;
            state.shakeOffsetY = 0;
            applyGameAreaTransform();
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

function playDodgeSound() {
    playToneBurst({
        frequencies: [600, 800, 1200],
        duration: 0.12,
        type: "sine",
        peakGain: 0.08,
        slideTo: 400,
        stagger: 0.02
    });
}

function playTeacherRangedSound() {
    playToneBurst({
        frequencies: [400, 800, 1600],
        duration: 0.2,
        type: "sawtooth",
        peakGain: 0.12,
        slideTo: 200,
        stagger: 0.03
    });
}

function getBossConfig(kind = getCurrentBossKind()) {
    const introSubtitle = state.contentMode === "explicit-content"
        ? '"DOV\'E\' IL CAZZO DI CODICE?!"'
        : '"MI SERVE IL CODICE DI VERIFICA!"';

    const bossConfigs = {
        greatSlacker: {
            kind: "greatSlacker",
            className: "boss-giant-student",
            introWarning: "⚠️ EMERGENCY: BOSS DETECTED ⚠️",
            introTitle: "STUDENTE GIGANTE SVOGLIATO",
            introSubtitle: '"SKIBIDIBOPPI!!!"',
            displayName: "Studente Gigante Svogliato",
            spawn: { x: 590, y: 300 },
            width: 104,
            height: 120,
            lives: 15,
            maxLives: 15,
            speed: 1.1,
            shootCooldown: 2200,
            speechCooldown: 3500,
            summonCooldown: 0,
            summonCharges: 0,
            leapDuration: 0,
            leapArcHeight: 0,
            leapImpactRadius: 0
        },
        spidOverlord: {
            kind: "spidOverlord",
            className: "boss-giant-student boss-spid-overlord",
            introWarning: "⚠️ ALLERTA DIGITALE TOTALE ⚠️",
            introTitle: "IL SIGNORE DELLO SPID",
            introSubtitle,
            displayName: "Il Signore dello SPID",
            spawn: { x: 582, y: 292 },
            width: 118,
            height: 132,
            lives: 20,
            maxLives: 20,
            speed: 0.82,
            shootCooldown: 2100,
            speechCooldown: 3000,
            summonCooldown: 9000,
            summonCharges: 2,
            leapDuration: 760,
            leapArcHeight: 150,
            leapImpactRadius: 112
        }
    };

    return bossConfigs[kind] || bossConfigs.greatSlacker;
}

function syncBossFigureVariant(rootElement, kind) {
    if (!rootElement) {
        return;
    }

    if (rootElement.classList.contains("entity")) {
        rootElement.classList.add("boss-giant-student");
        rootElement.classList.toggle("boss-spid-overlord", kind === "spidOverlord");
    } else {
        rootElement.className = kind === "spidOverlord"
            ? "boss-giant-student boss-spid-overlord"
            : "boss-giant-student";
    }

    const figure = rootElement.querySelector(".student-figure");
    if (!figure) {
        return;
    }

    figure.querySelectorAll(".boss-phone, .boss-lanyard").forEach((node) => node.remove());

    if (kind === "spidOverlord") {
        const lanyard = document.createElement("span");
        lanyard.className = "boss-lanyard";
        const phone = document.createElement("span");
        phone.className = "boss-phone";
        figure.append(lanyard, phone);
    }
}

function spawnBoss() {
    const config = getBossConfig();
    const element = document.createElement("div");
    element.className = `entity boss ${config.className} student`;
    
    const wrapper = document.createElement("div");
    wrapper.className = "boss-wrapper";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    
    // Costruisci la struttura visiva dello studente
    const figure = document.createElement("div");
    figure.className = "student-figure";
    
    const head = document.createElement("span");
    head.className = "student-head";
    
    const body = document.createElement("span");
    body.className = "student-body";
    
    const armLeft = document.createElement("span");
    armLeft.className = "student-arm arm-left";
    
    const armRight = document.createElement("span");
    armRight.className = "student-arm arm-right";
    
    const legLeft = document.createElement("span");
    legLeft.className = "student-leg leg-left";
    
    const legRight = document.createElement("span");
    legRight.className = "student-leg leg-right";
    
    const stone = document.createElement("span");
    stone.className = "student-hand-stone";
    
    figure.append(head, body, armLeft, armRight, legLeft, legRight, stone);
    wrapper.appendChild(figure);
    element.appendChild(wrapper);
    syncBossFigureVariant(element, config.kind);
    
    gameArea.appendChild(element);
    
    state.boss = {
        kind: config.kind,
        x: config.spawn.x,
        y: config.spawn.y,
        width: config.width,
        height: config.height,
        lives: config.lives,
        maxLives: config.maxLives,
        speed: config.speed,
        direction: "right",
        lastShotAt: 0,
        lastSpeechAt: 0,
        lastSummonAt: 0,
        blockedFrames: 0,
        summonCharges: config.summonCharges,
        speechTimeoutId: null,
        shootCooldown: config.shootCooldown,
        speechCooldown: config.speechCooldown,
        summonCooldown: config.summonCooldown,
        leapDuration: config.leapDuration,
        leapArcHeight: config.leapArcHeight,
        leapImpactRadius: config.leapImpactRadius,
        isLeaping: false,
        leapStartAt: 0,
        leapEndsAt: 0,
        leapStartX: config.spawn.x,
        leapStartY: config.spawn.y,
        leapTargetX: config.spawn.x,
        leapTargetY: config.spawn.y,
        element
    };
    
    placeEntityInFreeSpot(state.boss);
    rememberBossSafePosition();
    syncEntity(state.boss);
    const healthContainer = document.getElementById("bossHealthContainer");
    if (healthContainer) {
        healthContainer.classList.remove("d-none");
        const bossNameEl = document.getElementById("bossName");
        if (bossNameEl) {
            bossNameEl.textContent = config.displayName;
        }
    }
    updateBossHealthBar();
    
    triggerScreenShake(800, 8);
    playBossShotSound(true);
    tryLaunchStudiaStrike();
}

function playCelestialWeaponBlessingSound() {
    playToneBurst({
        frequencies: [262, 392, 523, 784],
        duration: 0.75,
        type: "sine",
        peakGain: 0.11,
        slideTo: 1046,
        stagger: 0.05
    });
}

function formatCutsceneTimecode(elapsedMs) {
    const framesPerSecond = 25;
    const totalFrames = Math.floor(elapsedMs / (1000 / framesPerSecond));
    const seconds = Math.floor(totalFrames / framesPerSecond) % 60;
    const frames = totalFrames % framesPerSecond;
    return `TC 00:00:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
}

function triggerSecondBossWeaponVision(onComplete) {
    if (!weaponVisionOverlay) {
        setLevelSevenWeaponUnlocked(true);
        onComplete();
        return;
    }

    clearCutsceneTimers();

    const teacher = getSelectedTeacher();
    const teacherName = teacher?.name || "Il docente";
    let finished = false;

    if (weaponVisionTeacherFace) {
        weaponVisionTeacherFace.style.backgroundImage = teacher?.image ? `url(${teacher.image})` : "";
    }
    if (weaponVisionCaption) {
        weaponVisionCaption.textContent = "Segnale dal cloud... upgrade in arrivo.";
    }
    if (weaponVisionProgress) {
        weaponVisionProgress.style.width = "8%";
    }
    if (weaponVisionTc) {
        weaponVisionTc.textContent = "TC 00:00:00:00";
    }

    weaponVisionOverlay.classList.remove("d-none");
    weaponVisionOverlay.classList.remove("playing");
    void weaponVisionOverlay.offsetWidth;
    weaponVisionOverlay.classList.add("playing");

    playCelestialWeaponBlessingSound();

    const finishSequence = () => {
        if (finished) {
            return;
        }

        finished = true;
        clearCutsceneTimers();
        state.activeCutsceneSkipHandler = null;

        weaponVisionOverlay.classList.add("d-none");
        weaponVisionOverlay.classList.remove("playing");

        if (weaponVisionProgress) {
            weaponVisionProgress.style.width = "0%";
        }
        if (weaponVisionTc) {
            weaponVisionTc.textContent = "TC 00:00:00:00";
        }

        setLevelSevenWeaponUnlocked(true);
        onComplete();
    };

    state.activeCutsceneSkipHandler = finishSequence;

    const startedAt = performance.now();
    registerCutsceneInterval(() => {
        if (weaponVisionTc) {
            weaponVisionTc.textContent = formatCutsceneTimecode(performance.now() - startedAt);
        }
    }, 80);

    registerCutsceneTimeout(() => {
        if (weaponVisionCaption) {
            weaponVisionCaption.textContent = "Una figura celestiale attraversa le nuvole sopra l'arena.";
        }
        if (weaponVisionProgress) {
            weaponVisionProgress.style.width = "28%";
        }
    }, 600);

    registerCutsceneTimeout(() => {
        if (weaponVisionCaption) {
            weaponVisionCaption.textContent = `${teacherName} viene chiamato al centro del campo di battaglia.`;
        }
        if (weaponVisionProgress) {
            weaponVisionProgress.style.width = "54%";
        }
        triggerScreenShake(260, 2);
    }, 1600);

    registerCutsceneTimeout(() => {
        if (weaponVisionCaption) {
            weaponVisionCaption.textContent = "Nuova arma ricevuta: pistola mitragliatrice anti-SPID.";
        }
        if (weaponVisionProgress) {
            weaponVisionProgress.style.width = "82%";
        }
        playTeacherRangedSound();
        triggerScreenShake(420, 4);
    }, 2550);

    registerCutsceneTimeout(() => {
        if (weaponVisionCaption) {
            weaponVisionCaption.textContent = `${teacherName} e' pronto per lo scontro finale.`;
        }
        if (weaponVisionProgress) {
            weaponVisionProgress.style.width = "100%";
        }
    }, 3350);

    registerCutsceneTimeout(finishSequence, 4300);
}

function playBossIntroOverlay() {
    const bossConfig = getBossConfig();

    const introOverlay = document.getElementById("bossIntroOverlay");
    if (introOverlay) {
        introOverlay.classList.remove("d-none");
    }

    const warningEl = document.querySelector(".boss-warning-badge");
    if (warningEl) {
        warningEl.textContent = bossConfig.introWarning;
    }
    const titleEl = document.querySelector(".boss-intro-title");
    if (titleEl) {
        titleEl.textContent = bossConfig.introTitle;
    }
    const subtitleEl = document.querySelector(".boss-intro-subtitles");
    if (subtitleEl) {
        subtitleEl.textContent = bossConfig.introSubtitle;
    }
    syncBossFigureVariant(document.querySelector(".boss-intro-avatar-container .boss-giant-student"), bossConfig.kind);

    const progressEl = document.getElementById("bossIntroProgress");
    if (progressEl) {
        progressEl.style.transition = "none";
        progressEl.style.width = "0%";
        progressEl.offsetHeight;
        progressEl.style.transition = "width 3.5s linear";
        progressEl.style.width = "100%";
    }

    let tcFrames = 0;
    let tcSeconds = 0;
    let tcMinutes = 0;
    let tcHours = 0;
    const tcEl = document.getElementById("bossVideoTc");

    const tcInterval = registerCutsceneInterval(() => {
        tcFrames++;
        if (tcFrames >= 30) {
            tcFrames = 0;
            tcSeconds++;
            if (tcSeconds >= 60) {
                tcSeconds = 0;
                tcMinutes++;
                if (tcMinutes >= 60) {
                    tcMinutes = 0;
                    tcHours++;
                }
            }
        }
        const pad = (num) => String(num).padStart(2, "0");
        if (tcEl) {
            tcEl.textContent = `TC ${pad(tcHours)}:${pad(tcMinutes)}:${pad(tcSeconds)}:${pad(tcFrames)}`;
        }
    }, 33);

    speakBossSkibidiboppi(true);

    registerCutsceneTimeout(() => {
        window.clearInterval(tcInterval);
        state.cutsceneIntervalIds = state.cutsceneIntervalIds.filter((id) => id !== tcInterval);
        if (introOverlay) {
            introOverlay.classList.add("d-none");
        }
        clearCutsceneTimers();
        spawnBoss();
        state.running = true;
    }, 3500);
}

function triggerBossIntro() {
    state.running = false;
    state.keys.clear();
    clearActiveCutscenes();

    if (getCurrentBossKind() === "spidOverlord") {
        triggerSecondBossWeaponVision(() => {
            playBossIntroOverlay();
        });
        return;
    }

    playBossIntroOverlay();
}

function speakBossSkibidiboppi(bypassRunning = false) {
    if (!bypassRunning && (!state.boss || state.boss.lives <= 0 || !state.running)) return;

    const message = getBossSpeechLine();

    // Gestione fumetto visivo a video
    if (state.boss && state.boss.element) {
        const previousBubble = state.boss.element.querySelector(".speech-bubble");
        if (previousBubble) {
            previousBubble.remove();
        }
        if (state.boss.speechTimeoutId) {
            window.clearTimeout(state.boss.speechTimeoutId);
        }

        const bubble = document.createElement("div");
        bubble.className = "speech-bubble boss-bubble";
        bubble.textContent = message;
        state.boss.element.appendChild(bubble);
        state.boss.element.classList.add("speaking");

        state.boss.speechTimeoutId = window.setTimeout(() => {
            bubble.remove();
            if (state.boss && state.boss.element) {
                state.boss.element.classList.remove("speaking");
            }
            if (state.boss) {
                state.boss.speechTimeoutId = null;
            }
        }, 2000);
    }

    // Gestione sintesi vocale (audio grave e veloce)
    if (!audioState.speechEnabled || audioState.muted) return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    // Cancella sintesi in corso per evitare ritardi accumulati
    if (synth.speaking || synth.pending) {
        synth.cancel();
    }

    const tts = getSpeechTtsProfile("boss");
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "it-IT";
    utterance.rate = tts.rate;
    utterance.pitch = tts.pitch; 
    utterance.volume = tts.volume;
    synth.speak(utterance);
}

function createBossLeapImpact(x, y, radius) {
    const impact = document.createElement("div");
    impact.className = "boss-stomp-impact";
    impact.style.left = `${x - radius}px`;
    impact.style.top = `${y - radius}px`;
    impact.style.width = `${radius * 2}px`;
    impact.style.height = `${radius * 2}px`;
    gameArea.appendChild(impact);
    window.setTimeout(() => impact.remove(), 420);
}

function startSpidOverlordLeap(timestamp) {
    if (!state.boss || !state.player) return;

    const boss = state.boss;
    const playerCenter = centerOf(state.player);
    const desiredX = playerCenter.x - boss.width / 2;
    const desiredY = playerCenter.y - boss.height / 2;
    const landingSpot = findNearestFreeSpot(boss, desiredX, desiredY, (candidate) => {
        const expandedCandidate = expandRect(candidate, 12);
        const expandedPlayer = expandRect(state.player, 12);
        return !rectsIntersect(expandedCandidate, expandedPlayer);
    });

    boss.lastShotAt = timestamp;
    boss.isLeaping = true;
    boss.leapStartAt = timestamp;
    boss.leapEndsAt = timestamp + (boss.leapDuration || 760);
    boss.leapStartX = boss.x;
    boss.leapStartY = boss.y;
    boss.leapTargetX = landingSpot.x;
    boss.leapTargetY = landingSpot.y;
    boss.element.classList.add("boss-leaping");
    playBossShotSound(true);
}

function resolveSpidOverlordLeapImpact(timestamp) {
    if (!state.boss || !state.player) {
        return;
    }

    const impactRadius = state.boss.leapImpactRadius || 112;
    const impactCenterX = state.boss.x + state.boss.width / 2;
    const impactCenterY = state.boss.y + state.boss.height - 12;
    const impactRect = {
        x: impactCenterX - impactRadius,
        y: impactCenterY - impactRadius,
        width: impactRadius * 2,
        height: impactRadius * 2
    };

    createBossLeapImpact(impactCenterX, impactCenterY, impactRadius);
    triggerScreenShake(340, 10);
    createHitEffect(impactCenterX - 18, impactCenterY - 18);

    const playerCanBeHit = timestamp >= state.player.invulnerableUntil && !state.player.isDodging;
    const playerHurtRect = getPlayerProjectileHurtRect();
    if (playerCanBeHit && playerHurtRect && rectsIntersect(playerHurtRect, impactRect)) {
        damagePlayer();
    }
}

function updateSpidOverlordBoss(delta, timestamp) {
    if (!state.boss || !state.player) {
        return;
    }

    const boss = state.boss;
    const bossCenter = centerOf(boss);
    const playerCenter = centerOf(state.player);
    const dx = playerCenter.x - bossCenter.x;
    const dy = playerCenter.y - bossCenter.y;
    const vector = normalizeVector(dx, dy);
    const wrapper = boss.element.querySelector(".boss-wrapper");

    if (boss.isLeaping) {
        const duration = Math.max(1, boss.leapEndsAt - boss.leapStartAt);
        const progress = Math.max(0, Math.min(1, (timestamp - boss.leapStartAt) / duration));
        const arcLift = Math.sin(progress * Math.PI) * (boss.leapArcHeight || 150);

        boss.x = boss.leapStartX + (boss.leapTargetX - boss.leapStartX) * progress;
        boss.y = boss.leapStartY + (boss.leapTargetY - boss.leapStartY) * progress - arcLift;
        syncEntity(boss);

        if (wrapper) {
            wrapper.style.transform = `${boss.leapTargetX < boss.leapStartX ? "scaleX(-1) " : ""}rotate(${(0.5 - progress) * 0.2}rad)`;
        }

        if (progress >= 1) {
            boss.isLeaping = false;
            boss.x = boss.leapTargetX;
            boss.y = boss.leapTargetY;
            boss.element.classList.remove("boss-leaping");
            syncEntity(boss);
            rememberBossSafePosition();
            resolveSpidOverlordLeapImpact(timestamp);
        }
    } else {
        const driftVector = normalizeVector(
            dx + Math.sin(timestamp / 360) * 26,
            dy + Math.cos(timestamp / 420) * 18
        );
        const previousX = boss.x;
        const previousY = boss.y;
        moveWithCollisions(boss, driftVector.x * boss.speed * delta * 0.55, driftVector.y * boss.speed * delta * 0.55);

        const movedDistance = Math.hypot(boss.x - previousX, boss.y - previousY);
        if (movedDistance < 0.25) {
            boss.blockedFrames = (boss.blockedFrames || 0) + 1;
        } else {
            boss.blockedFrames = 0;
        }

        if (boss.blockedFrames >= 10 || hitsObstacle(boss)) {
            stabilizeBossPosition(previousX + driftVector.x * 72, previousY + driftVector.y * 72);
            boss.blockedFrames = 0;
        } else {
            rememberBossSafePosition();
        }

        if (wrapper) {
            wrapper.style.transform = driftVector.x < 0 ? "scaleX(-1)" : "";
        }

        if (!boss.lastShotAt) {
            boss.lastShotAt = timestamp;
        }
        if (timestamp - boss.lastShotAt > boss.shootCooldown) {
            bossShoot(timestamp);
        }
    }

    if (
        boss.summonCharges > 0 &&
        !boss.isLeaping &&
        state.students.length < 5 &&
        timestamp - boss.lastSummonAt > boss.summonCooldown
    ) {
        bossSummonStudent(timestamp);
    }

    if (!boss.lastSpeechAt) {
        boss.lastSpeechAt = timestamp;
        speakBossSkibidiboppi();
    }
    if (timestamp - boss.lastSpeechAt > boss.speechCooldown) {
        boss.lastSpeechAt = timestamp;
        speakBossSkibidiboppi();
    }
}

function updateBoss(delta, timestamp) {
    if (!state.boss) return;

    if (state.boss.kind === "spidOverlord") {
        updateSpidOverlordBoss(delta, timestamp);
        return;
    }
    
    // Inseguimento player
    const previousX = state.boss.x;
    const previousY = state.boss.y;
    const bossCenter = centerOf(state.boss);
    const playerCenter = centerOf(state.player);
    const dx = playerCenter.x - bossCenter.x;
    const dy = playerCenter.y - bossCenter.y;
    let vector = normalizeVector(dx, dy);

    if (state.boss.kind === "spidOverlord") {
        vector = normalizeVector(
            dx + Math.sin(timestamp / 420) * 70,
            dy + Math.cos(timestamp / 520) * 55
        );
    }
    
    const stepX = vector.x * state.boss.speed * delta;
    const stepY = vector.y * state.boss.speed * delta;
    
    moveWithCollisions(state.boss, stepX, stepY);

    const movedDistance = Math.hypot(state.boss.x - previousX, state.boss.y - previousY);
    const wasTryingToMove = Math.abs(stepX) > 0.18 || Math.abs(stepY) > 0.18;

    if (wasTryingToMove && movedDistance < 0.35) {
        state.boss.blockedFrames = (state.boss.blockedFrames || 0) + 1;
    } else {
        state.boss.blockedFrames = 0;
    }

    if (state.boss.blockedFrames >= 10 || hitsObstacle(state.boss)) {
        stabilizeBossPosition(
            previousX + vector.x * 72,
            previousY + vector.y * 72
        );
        state.boss.blockedFrames = 0;
    } else {
        rememberBossSafePosition();
    }
    
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

    if (
        state.boss.kind === "spidOverlord" &&
        state.boss.summonCharges > 0 &&
        state.students.length < 5 &&
        timestamp - state.boss.lastSummonAt > state.boss.summonCooldown
    ) {
        bossSummonStudent(timestamp);
    }
    
    // Ripetizione frase "SKIBIDIBOPPI" a video e audio
    if (!state.boss.lastSpeechAt) {
        state.boss.lastSpeechAt = timestamp;
        speakBossSkibidiboppi();
    }
    if (timestamp - state.boss.lastSpeechAt > state.boss.speechCooldown) {
        state.boss.lastSpeechAt = timestamp;
        speakBossSkibidiboppi();
    }
}

function bossShoot(timestamp) {
    if (!state.boss) return;

    if (state.boss.kind === "spidOverlord") {
        startSpidOverlordLeap(timestamp);
        return;
    }

    state.boss.lastShotAt = timestamp;
    
    const source = centerOf(state.boss);
    const target = centerOf(state.player);
    const vector = normalizeVector(target.x - source.x, target.y - source.y);

    const isGiant = Math.random() < 0.35;
    playBossShotSound(isGiant);

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
    if (!state.boss || state.boss.kind !== "spidOverlord") return;
    if (state.students.length >= 6) return;

    state.boss.lastSummonAt = timestamp;
    state.boss.summonCharges -= 1;
    
    const range = 180;
    const angle = Math.random() * Math.PI * 2;
    const targetX = clamp(state.boss.x + state.boss.width / 2 + Math.cos(angle) * range - 26, 40, GAME.width - 92);
    const targetY = clamp(state.boss.y + state.boss.height / 2 + Math.sin(angle) * range - 30, 40, GAME.height - 110);
    
    const summons = [
        { studentType: "fast", speechType: "panicked", roleLabel: "AIUTO" },
        { studentType: "shooter", speechType: "boomer", roleLabel: "PIN" },
        { studentType: "shooter", speechType: "passacarte", roleLabel: "MODULI" },
        { studentType: "cheater", speechType: "caf", roleLabel: "CAF" }
    ];
    const summonConfig = summons[Math.floor(Math.random() * summons.length)];
    const index = Math.floor(Math.random() * 1000);
    const student = createStudent({ x: targetX, y: targetY, ...summonConfig }, index);
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

    if (state.boss.kind === "spidOverlord" && state.boss.lives === Math.floor(state.boss.maxLives / 2)) {
        state.boss.shootCooldown = Math.max(1350, state.boss.shootCooldown - 320);
        state.boss.speed += 0.12;
        state.boss.leapImpactRadius += 12;
        state.boss.leapDuration = Math.max(620, state.boss.leapDuration - 70);
        showToast("⚠️ Il Signore dello SPID e' entrato in modalita' escalation: salta piu' spesso e atterra ancora piu' forte!");
    }
    
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
    
    // Cancella timeout, bolla e sintesi vocale del boss
    if (state.boss.speechTimeoutId) {
        window.clearTimeout(state.boss.speechTimeoutId);
        state.boss.speechTimeoutId = null;
    }
    const bubble = state.boss.element.querySelector(".speech-bubble");
    if (bubble) {
        bubble.remove();
    }
    stopStudentSpeech();
    
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
    // Interrompe immediatamente qualsiasi sintesi vocale TTS in corso
    if (audioState.muted) {
        stopStudentSpeech();
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

// =====================================================
// MAP EDITOR MODULE
// =====================================================

const MapEditor = (() => {
    const STORAGE_KEY = "aulab_rage_custom_map_";
    const GAME_W = 1280;
    const GAME_H = 720;
    const SNAP = 12; // snap grid in game-pixels

    let editingLevel = 1;
    let editorObstacles = []; // { x, y, width, height, type, perimeter }
    let canvas = null;
    let toast = null;

    // Drag state for canvas obstacles (move existing)
    let draggingEl = null;
    let draggingObs = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // Drag state for palette → canvas (new element)
    let paletteDragType = null;
    let paletteDragW = 0;
    let paletteDragH = 0;
    let ghostEl = null;

    // ── localStorage helpers ──────────────────────────

    function storageKey(level) {
        return STORAGE_KEY + level;
    }

    function loadCustomMap(level) {
        try {
            const raw = localStorage.getItem(storageKey(level));
            if (raw) return JSON.parse(raw);
        } catch (e) { /* ignore */ }
        return null;
    }

    function saveCustomMap(level, obstacles) {
        const serializable = obstacles.map(({ x, y, width, height, type, perimeter }) =>
            ({ x, y, width, height, type, perimeter: perimeter || false })
        );
        localStorage.setItem(storageKey(level), JSON.stringify(serializable));
    }

    function clearCustomMap(level) {
        localStorage.removeItem(storageKey(level));
    }

    // ── Snap helper ───────────────────────────────────

    function snapVal(v) {
        return Math.round(v / SNAP) * SNAP;
    }

    function clampObstacle(obs) {
        obs.x = Math.max(0, Math.min(GAME_W - obs.width, obs.x));
        obs.y = Math.max(0, Math.min(GAME_H - obs.height, obs.y));
    }

    // ── Render editor canvas ──────────────────────────

    function renderCanvas() {
        canvas.innerHTML = "";
        editorObstacles.forEach((obs, idx) => {
            const el = document.createElement("div");
            el.className = `obstacle ${obs.type}${obs.perimeter ? " perimeter" : ""}`;
            el.style.left = obs.x + "px";
            el.style.top = obs.y + "px";
            el.style.width = obs.width + "px";
            el.style.height = obs.height + "px";
            el.dataset.idx = idx;

            if (!obs.perimeter) {
                // Move on mousedown
                el.addEventListener("mousedown", (e) => {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    e.stopPropagation();
                    draggingEl = el;
                    draggingObs = obs;
                    const canvasRect = canvas.getBoundingClientRect();
                    const scale = canvasRect.width / GAME_W;
                    dragOffsetX = (e.clientX - canvasRect.left) / scale - obs.x;
                    dragOffsetY = (e.clientY - canvasRect.top) / scale - obs.y;
                    el.style.zIndex = 20;
                    el.style.outline = "2px solid rgba(255,234,0,0.9)";
                });

                // Right-click → delete
                el.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    editorObstacles.splice(idx, 1);
                    renderCanvas();
                });

                // Hover tooltip
                el.title = "Trascina per spostare • Click destro per eliminare";
            }

            canvas.appendChild(el);
        });
    }

    // ── Palette drag (new element onto canvas) ────────

    function initPaletteDrag() {
        document.querySelectorAll(".palette-item").forEach((item) => {
            item.addEventListener("dragstart", (e) => {
                paletteDragType = item.dataset.type;
                paletteDragW = parseInt(item.dataset.w, 10);
                paletteDragH = parseInt(item.dataset.h, 10);
                e.dataTransfer.effectAllowed = "copy";
                // Create ghost
                ghostEl = document.createElement("div");
                ghostEl.className = `obstacle ${paletteDragType} map-editor-drag-ghost`;
                ghostEl.style.width = paletteDragW + "px";
                ghostEl.style.height = paletteDragH + "px";
                document.body.appendChild(ghostEl);
                e.dataTransfer.setDragImage(new Image(), 0, 0);
            });

            item.addEventListener("dragend", () => {
                if (ghostEl) { ghostEl.remove(); ghostEl = null; }
                paletteDragType = null;
            });
        });

        canvas.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            canvas.classList.add("drag-over");
            if (ghostEl && paletteDragType) {
                ghostEl.style.left = (e.clientX - paletteDragW / 2) + "px";
                ghostEl.style.top = (e.clientY - paletteDragH / 2) + "px";
            }
        });

        canvas.addEventListener("dragleave", () => {
            canvas.classList.remove("drag-over");
        });

        canvas.addEventListener("drop", (e) => {
            e.preventDefault();
            canvas.classList.remove("drag-over");
            if (!paletteDragType) return;
            const canvasRect = canvas.getBoundingClientRect();
            const scale = canvasRect.width / GAME_W;
            const rawX = (e.clientX - canvasRect.left) / scale - paletteDragW / 2;
            const rawY = (e.clientY - canvasRect.top) / scale - paletteDragH / 2;
            const obs = {
                x: snapVal(rawX),
                y: snapVal(rawY),
                width: paletteDragW,
                height: paletteDragH,
                type: paletteDragType,
                perimeter: false
            };
            clampObstacle(obs);
            editorObstacles.push(obs);
            renderCanvas();
        });
    }

    // ── Mouse move/up for repositioning canvas obstacles ──

    function initCanvasDrag() {
        window.addEventListener("mousemove", (e) => {
            if (!draggingEl || !draggingObs) return;
            const canvasRect = canvas.getBoundingClientRect();
            const scale = canvasRect.width / GAME_W;
            const rawX = (e.clientX - canvasRect.left) / scale - dragOffsetX;
            const rawY = (e.clientY - canvasRect.top) / scale - dragOffsetY;
            draggingObs.x = snapVal(rawX);
            draggingObs.y = snapVal(rawY);
            clampObstacle(draggingObs);
            draggingEl.style.left = draggingObs.x + "px";
            draggingEl.style.top = draggingObs.y + "px";
        });

        window.addEventListener("mouseup", () => {
            if (draggingEl) {
                draggingEl.style.zIndex = "";
                draggingEl.style.outline = "";
                draggingEl = null;
                draggingObs = null;
            }
        });
    }

    // ── Level selector ────────────────────────────────

    function initLevelBtns() {
        document.querySelectorAll(".map-level-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".map-level-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                editingLevel = parseInt(btn.dataset.level, 10);
                loadLevelIntoEditor(editingLevel);
            });
        });
    }

    // ── Load a level's obstacles into the editor ──────

    function loadLevelIntoEditor(level) {
        // Try custom first, fall back to default
        const custom = loadCustomMap(level);
        if (custom) {
            editorObstacles = custom.map(o => ({ ...o }));
        } else {
            const levelCfg = levelConfigs.find(l => l.id === level) || levelConfigs[0];
            editorObstacles = levelCfg.obstacles.map(o => ({ ...o, perimeter: isPerimeter(o) }));
        }
        renderCanvas();
    }

    // Identifies the 4 perimeter walls by checking if they span edge-to-edge
    function isPerimeter(obs) {
        return (
            (obs.y === 0 && obs.width >= GAME_W - 10) ||       // top wall
            (obs.y + obs.height >= GAME_H - 10 && obs.width >= GAME_W - 10) || // bottom wall
            (obs.x === 0 && obs.height >= GAME_H - 10) ||      // left wall
            (obs.x + obs.width >= GAME_W - 10 && obs.height >= GAME_H - 10)    // right wall
        );
    }

    // ── Toast notification ────────────────────────────

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2200);
    }

    // ── Public API ────────────────────────────────────

    function open() {
        editingLevel = 1;
        document.querySelectorAll(".map-level-btn").forEach(b => {
            b.classList.toggle("active", parseInt(b.dataset.level, 10) === 1);
        });
        loadLevelIntoEditor(1);
        document.getElementById("mapEditorOverlay").classList.remove("d-none");
    }

    function close() {
        document.getElementById("mapEditorOverlay").classList.add("d-none");
    }

    function save() {
        // Ensure perimeter walls are preserved
        const levelCfg = levelConfigs.find(l => l.id === editingLevel) || levelConfigs[0];
        const perimeterWalls = levelCfg.obstacles
            .filter(o => isPerimeter(o))
            .map(o => ({ ...o, perimeter: true }));

        // Remove any existing perimeter entries from editorObstacles and re-add canonical ones
        const withoutPerimeter = editorObstacles.filter(o => !o.perimeter);
        const finalObstacles = [...perimeterWalls, ...withoutPerimeter];

        saveCustomMap(editingLevel, finalObstacles);
        showToast("✔ Mappa salvata!");
    }

    function reset() {
        clearCustomMap(editingLevel);
        loadLevelIntoEditor(editingLevel);
        showToast("↺ Mappa ripristinata ai valori di default");
    }

    // ── getObstaclesForLevel (used by buildLevel) ─────

    function getObstaclesForLevel(level) {
        return loadCustomMap(level);
    }

    // ── Init ──────────────────────────────────────────

    function init() {
        canvas = document.getElementById("mapEditorCanvas");
        if (!canvas) return;

        // Toast
        toast = document.createElement("div");
        toast.className = "map-editor-toast";
        document.body.appendChild(toast);

        initPaletteDrag();
        initCanvasDrag();
        initLevelBtns();

        document.getElementById("openMapEditorBtn")?.addEventListener("click", open);
        document.getElementById("mapEditorCloseBtn")?.addEventListener("click", close);
        document.getElementById("mapEditorSaveBtn")?.addEventListener("click", save);
        document.getElementById("mapEditorResetBtn")?.addEventListener("click", reset);
    }

    return { init, getObstaclesForLevel };
})();

// --- FUNZIONALITÀ RAGE MODE (STATO DI FURIA) ---
function increaseRage(amount) {
    if (state.rageActive || !state.running || state.gameOver || state.victory) return;
    state.rageMeter = Math.min(100, state.rageMeter + amount);
    updateRageBarVisual();
    if (state.rageMeter >= 100) {
        activateRageMode();
    }
}

function activateRageMode() {
    if (!state.running || state.gameOver || state.victory) return;
    
    playRageStartSound();
    const isRoadTripRage = isRoadTripActive();
    const rageDuration = isRoadTripRage ? 5000 : 5000;
    
    state.rageActive = true;
    state.rageActiveUntil = state.gameTimeMs + rageDuration;
    state.rageDurationMs = rageDuration;
    state.rageMeter = isRoadTripRage ? 0 : 100;
    state.lastRageParticleSpawnAt = 0;
    updateRageBarVisual();
    
    if (gameArea) {
        gameArea.classList.add("rage-active");
    }
    
    if (state.player && state.player.element) {
        state.player.element.classList.add("rage-active-player");
        if (isRoadTripRage) {
            state.player.element.classList.add("roadtrip-rage-truck");
            state.player.invulnerableUntil = performance.now() + rageDuration;
        }
    }
    
    const hudRage = document.getElementById("hudRage");
    if (hudRage) {
        hudRage.classList.add("rage-active-hud");
    }
    
    triggerScreenShake(500, 8);
}

function deactivateRageMode() {
    state.rageActive = false;
    state.rageActiveUntil = 0;
    state.rageDurationMs = 5000;
    state.rageMeter = 0;
    
    updateRageBarVisual();
    
    if (gameArea) {
        gameArea.classList.remove("rage-active");
    }
    
    if (state.player && state.player.element) {
        state.player.element.classList.remove("rage-active-player");
        state.player.element.classList.remove("roadtrip-rage-truck");
    }
    
    const hudRage = document.getElementById("hudRage");
    if (hudRage) {
        hudRage.classList.remove("rage-active-hud");
    }
}

function updateRageBarVisual() {
    const barFill = document.getElementById("rageBarFill");
    if (barFill) {
        barFill.style.width = `${state.rageMeter}%`;
    }
}

function updateRage(delta) {
    if (!state.running || state.gameOver || state.victory) return;
    
    if (state.rageActive) {
        const roadTripRageActive = isRoadTripActive();
        const timeLeft = Math.max(0, state.rageActiveUntil - state.gameTimeMs);
        if (roadTripRageActive) {
            state.rageMeter = 0;
        } else {
            const rageDuration = Math.max(1, state.rageDurationMs || 5000);
            state.rageMeter = (timeLeft / rageDuration) * 100;
        }
        updateRageBarVisual();
        
        // Spawn particle trail if player is moving
        const movement = roadTripRageActive ? { x: 1, y: 0 } : getInputVector();
        const isMoving = roadTripRageActive || movement.x !== 0 || movement.y !== 0;
        if (isMoving && state.gameTimeMs - state.lastRageParticleSpawnAt > 90) {
            spawnRageParticle(state.player);
            state.lastRageParticleSpawnAt = state.gameTimeMs;
        }
        
        // Check collision with students to defeat them
        if (!roadTripRageActive) {
            const playerRect = state.player;
            state.students.forEach((student) => {
                if (rectsIntersect(playerRect, student)) {
                    if (!student.isChanting && !student.element.classList.contains("burning")) {
                        burnStudent(student);
                        playRageHitSound();
                    }
                }
            });
        }
        
        if (timeLeft <= 0) {
            deactivateRageMode();
        }
    }
}

function spawnRageParticle(player) {
    const px = player.x + player.width / 2 + randomBetween(-12, 12);
    const py = player.y + player.height - 15 + randomBetween(-6, 6);
    createFlameEffect(px - 32, py - 35);
}

function playRageStartSound() {
    if (!audioState.context || audioState.muted) return;
    
    const ctx = audioState.context;
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(120, now);
    osc1.frequency.exponentialRampToValueAtTime(600, now + 0.5);
    
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    
    osc1.connect(gain1);
    gain1.connect(audioState.sfxGain);
    
    osc1.start(now);
    osc1.stop(now + 0.5);
    
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(80, now);
    osc2.frequency.linearRampToValueAtTime(450, now + 0.4);
    
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    
    osc2.connect(gain2);
    gain2.connect(audioState.sfxGain);
    
    osc2.start(now);
    osc2.stop(now + 0.45);
}

function playRageHitSound() {
    if (!audioState.context || audioState.muted) return;
    const ctx = audioState.context;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(audioState.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.15);
}

init();
