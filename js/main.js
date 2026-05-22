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

// Elementi DOM per la Storia
const storyOverlay = document.getElementById("storyOverlay");
const closeStoryButton = document.getElementById("closeStoryButton");
const storyContent = document.getElementById("storyContent");
const storyButton = document.getElementById("storyButton");
const modeOverlay = document.getElementById("modeOverlay");
const politicallyCorrectModeBtn = document.getElementById("politicallyCorrectModeBtn");
const explicitContentModeBtn = document.getElementById("explicitContentModeBtn");

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
const resumeButton = document.getElementById("resumeButton");
const savedLevelNum = document.getElementById("savedLevelNum");
const menuButton = document.getElementById("menuButton");
const finalWipModal = document.getElementById("finalWipModal");
const finalWipMenuButton = document.getElementById("finalWipMenuButton");

// Elementi DOM per la stamina
const hudStamina = document.getElementById("hudStamina");
const staminaBarFill = document.getElementById("staminaBarFill");

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

const storyParagraphs = [
    "[SISTEMA] Rilevata anomalia Hackademy - Ore 03:00 AM...",
    "È la notte prima della consegna del progetto finale. L'aria è densa di disperazione, lattine di energy drink vuote e righe di codice scritte a caso.",
    "La stanchezza ha preso il sopravvento: gli studenti si rifiutano di programmare e lanciano pietre! I più subdoli, gli \"Studenti Copiatori\", si muovono furtivamente con gli occhiali da sole per passare codice buggato ai compagni, scatenando il panico.",
    "Nel caos dell'aula, attento alle Sedie Scorrevoli: se colpite col martello, schizzeranno come proiettili travolgendo chiunque sul loro percorso!",
    "E se non bastasse, nelle profondità dell'Aulab si aggira il leggendario BOSS finale: uno Studente Gigante ed estremamente svogliato che urla a ripetizione la sua formula magica: \"SKIBIDIBOPPI!\".",
    "Solo tu, nei panni del Docente, puoi ripristinare l'ordine col mitico \"Martello di Gomma della Motivazione\". Raccogli il Caffè per scatenare la Rage Mode ed evocare Charizard, ferma i copiatori, e sconfiggi il Grande Svogliato!",
    "La classe ti aspetta. Non c'è tempo da perdere..."
];

let storyTimeouts = [];
let typingActive = false;

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
    rageActive: false,
    pendingDodge: null,
    rageMeter: 0,
    rageActiveUntil: 0,
    contentMode: null,
    lastRageParticleSpawnAt: 0
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
    speechPrimed: false,
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
            ]
        },
        chantMessages: [
            "Sorgi, o Grande Svogliato!",
            "Evoca il potere dello svacco!",
            "Niente studio oggi!",
            "Grande Svogliato, ascoltaci!",
            "Vieni a liberarci!",
            "La procrastinazione trionferà!"
        ],
        bossMessages: [
            "SKIBIDIBOPPI"
        ],
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
            ]
        },
        chantMessages: [
            "sorgi, bestione del cazzo!",
            "evocalo, porca troia!",
            "niente studio, solo casino!",
            "grande svogliato, spaccagli il culo!",
            "vieni a salvarci da sto prof di merda!",
            "la procrastinazione vince, stronzi!"
        ],
        bossMessages: [
            "SKIBIDIBOPPI, teste di cazzo!",
            "non studio un cazzo!",
            "vi mando tutti affanculo!",
            "sono il boss dei fancazzisti, merde!",
            "fallite tutti, stronzi!"
        ],
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

function showStoryOverlay() {
    unlockAudio();
    primeSpeechSynthesis();
    if (storyOverlay) {
        storyOverlay.classList.remove("d-none");
    }
    showStoryText();
}

function showStoryText() {
    if (!storyContent) return;
    
    // Clear any previous typewriter timeouts
    storyTimeouts.forEach(t => clearTimeout(t));
    storyTimeouts = [];
    storyContent.innerHTML = "";
    typingActive = true;
    
    let pIndex = 0;
    
    function typeParagraph() {
        if (pIndex >= storyParagraphs.length || !typingActive) {
            typingActive = false;
            return;
        }
        
        const pText = storyParagraphs[pIndex];
        const pElement = document.createElement("p");
        pElement.className = "story-paragraph";
        
        if (pText.startsWith("[SISTEMA]") || pText.startsWith("È la notte")) {
            pElement.classList.add("text-neon-cyan");
        }
        
        storyContent.appendChild(pElement);
        
        let charIndex = 0;
        
        function typeChar() {
            if (!typingActive) return;
            
            if (charIndex < pText.length) {
                pElement.textContent += pText.charAt(charIndex);
                charIndex++;
                storyContent.scrollTop = storyContent.scrollHeight;
                
                const t = setTimeout(typeChar, 10);
                storyTimeouts.push(t);
            } else {
                pIndex++;
                const t = setTimeout(typeParagraph, 350);
                storyTimeouts.push(t);
            }
        }
        
        typeChar();
    }
    
    typeParagraph();
}

function skipStory() {
    unlockAudio();
    primeSpeechSynthesis();
    typingActive = false;
    storyTimeouts.forEach(t => clearTimeout(t));
    storyTimeouts = [];
    
    if (storyContent) {
        storyContent.innerHTML = "";
        storyParagraphs.forEach(pText => {
            const pElement = document.createElement("p");
            pElement.className = "story-paragraph";
            if (pText.startsWith("[SISTEMA]") || pText.startsWith("È la notte")) {
                pElement.classList.add("text-neon-cyan");
            }
            pElement.textContent = pText;
            storyContent.appendChild(pElement);
        });
        storyContent.scrollTop = storyContent.scrollHeight;
    }
    
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
    bindEvents();
    initTouchControls();
    resetGame();
    updateGameScale();
    updateMuteButtonVisual();
    MapEditor.init();
    requestAnimationFrame(gameLoop);
    
    // Start narrative screen typewriter
    showStoryText();
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

    function bindTouchAction(button, action) {
        const handler = (event) => {
            action();
            event.preventDefault();
        };

        if ("PointerEvent" in window) {
            button.addEventListener("pointerdown", handler, { passive: false });
        } else {
            button.addEventListener("touchstart", handler, { passive: false });
        }
    }

    bindTouchAction(touchAttackBtn, () => {
        attack();
    });

    bindTouchAction(touchDodgeBtn, () => {
        queuePlayerDodge(getPreferredDodgeVector());
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

    window.addEventListener("keydown", (event) => {
        const key = normalizeKey(event.key);

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key) || ["w", "a", "s", "d"].includes(key)) {
            event.preventDefault();
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
        gameArea.appendChild(element);

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

        state.obstacles.push({ ...config, element });
    });
}

function clearObstacles() {
    state.obstacles.forEach((obstacle) => obstacle.element.remove());
    state.obstacles = [];
}

function resetGame() {
    deactivateRageMode();
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
        closeFinalWipModal();
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

    [state.player, ...state.students, ...state.projectiles, ...state.effects, state.powerUp, state.heartPowerUp, state.dragonStrike, state.studiaStrike]
        .filter(Boolean)
        .forEach((entity) => entity.element.remove());

    state.students = [];
    state.projectiles = [];
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
    const teacher = getSelectedTeacher();
    if (startDescription) {
        let targetText = "l'ufficio Aulab";
        if (state.selectedHackademyId !== "standard") {
            const hackademy = state.hackademies.find(h => h.id === state.selectedHackademyId);
            if (hackademy) {
                targetText = `la classe ${hackademy.name}`;
            }
        }
        startDescription.innerHTML = `I docenti devono liberare ${targetText} inseguendo gli studenti che non studiano, schivando le pietre e colpendoli con la loro arma... hem, sì... volevo dire "arma giocattolo".`;
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

function buildLevel(levelNumber, resetPlayerLives = false) {
    clearLevelActors(true);
    state.currentLevel = levelNumber;
    const level = getCurrentLevelConfig();

    // Toggle emergency red lights overlay for level 3
    if (levelNumber === 3 && state.selectedHackademyId === "standard") {
        gameArea.classList.add("emergency-mode");
    } else {
        gameArea.classList.remove("emergency-mode");
    }

    // Usa la mappa personalizzata dell'editor se disponibile, altrimenti usa il default
    const customObstacles = (typeof MapEditor !== "undefined")
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

            // Mostra notifica dell'arma STUDIA
            setTimeout(() => {
                showToast("🎯 NUOVA ARMA DISPONIBILE! Cerca i power-up 'STUDIA' per ottenere l'arma a distanza che insegue il boss!");
            }, 1000);
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
    state.player.x = spawn.x;
    state.player.y = spawn.y;
    state.player.direction = "right";
    state.player.attackEndsAt = 0;
    state.player.invulnerableUntil = 0;
    state.player.shieldHits = 0;
    state.player.speedBoostUntil = 0;
    state.player.superHammerUntil = 0;
    state.player.dodgeDurationMs = GAME.dodgeDuration;
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

    let types = ["fast", "shooter", "dodger", "cheater"];
    let type = types[index % types.length];

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
    student.element.className = `entity student type-${type}`;
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

    unlockAudio();
    primeSpeechSynthesis();
    localStorage.removeItem("aulab_rage_saved_level");
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

function pickRandomLine(lines, fallback = "") {
    if (!Array.isArray(lines) || lines.length === 0) {
        return fallback;
    }

    return lines[Math.floor(Math.random() * lines.length)] || fallback;
}

function getStudentLinePool(studentType) {
    const profile = getActiveSpeechProfile();
    return profile.typeMessages[studentType] || profile.studentMessages;
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

        if (!student || !student.element || student.element.classList.contains("burning") || !state.students.includes(student)) {
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

function getTeacherHitLine() {
    return pickRandomLine(getActiveSpeechProfile().teacherHitMessages, "Torna a studiare!");
}

function getTeacherContextLine(key, fallback = "") {
    return pickRandomLine(getActiveSpeechProfile().teacherContextMessages[key], fallback);
}

function getChantLine() {
    return pickRandomLine(getActiveSpeechProfile().chantMessages, "Evocalo!");
}

function getBossSpeechLine() {
    return pickRandomLine(getActiveSpeechProfile().bossMessages, "SKIBIDIBOPPI");
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
}

// Sistema di stamina e schivata
function updateStamina(delta, timestamp) {
    if (!state.player) return;

    // Rigenerazione stamina se non è stata usata di recente
    if (timestamp - state.player.lastStaminaUse >= GAME.staminaRegenDelay) {
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
                if (student.codeCopied) {
                    speedMult *= 2.0;
                }
                
                moveWithCollisions(student, vector.x * GAME.studentSpeed * speedMult * delta, vector.y * GAME.studentSpeed * speedMult * delta);
            }
        }

        student.fleeTimer -= delta;
        student.shotTimer -= student.codeCopied ? delta * 2.2 : delta;
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
            student.talkTimer = randomBetween(GAME.studentTalkMin, GAME.studentTalkMax);
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

function updateTeacherProjectiles(delta, timestamp) {
    const nextTeacherProjectiles = [];

    state.teacherProjectiles.forEach((projectile) => {
        const { outsideArena, hitsObstacle } = advanceProjectile(projectile, delta);

        if (outsideArena || hitsObstacle) {
            projectile.element.remove();
            return;
        }

        // Controlla collisione con studenti
        let hitStudent = false;
        const survivors = [];
        state.students.forEach((student) => {
            if (rectsIntersect(projectile, student)) {
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
        if (state.boss && rectsIntersect(projectile, state.boss)) {
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

function advanceProjectile(projectile, delta) {
    const totalStepX = projectile.velocityX * delta;
    const totalStepY = projectile.velocityY * delta;
    const maxStep = Math.max(Math.abs(totalStepX), Math.abs(totalStepY));
    const steps = Math.max(1, Math.ceil(maxStep / 6));
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

        const hitsObstacle = state.obstacles.some((obstacle) => rectsIntersect(projectile, obstacle));
        if (hitsObstacle) {
            syncEntity(projectile);
            return { outsideArena: false, hitsObstacle: true };
        }
    }

    syncEntity(projectile);
    return { outsideArena: false, hitsObstacle: false };
}

function updatePowerUps(delta) {
    if (!state.powerUp && !state.dragonStrike && !state.studiaStrike && state.gameTimeMs >= state.nextPowerUpAt && state.students.length > 0) {
        spawnPowerUp();
    }

    if (
        state.player.lives < GAME.spawnLives &&
        !state.heartPowerUp &&
        state.gameTimeMs >= state.nextHeartPowerUpAt
    ) {
        spawnHeartPowerUp();
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

    // Gestione colpi alle sedie scorrevoli e ai cestini
    const remainingObstacles = [];
    state.obstacles.forEach((obstacle) => {
        if (obstacle.type === "chair" && rectsIntersect(attackZone, obstacle)) {
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
            
            let type = "speed";
            if (state.selectedHackademyId === "standard") {
                if (state.currentLevel === 1) {
                    type = "speed";
                } else if (state.currentLevel === 2) {
                    type = "shield";
                } else {
                    type = "super_hammer";
                }
            } else {
                const types = ["coffee", "shield", "speed", "super_hammer"];
                type = types[Math.floor(Math.random() * types.length)];
            }
            
            const spawnX = obstacle.x + obstacle.width / 2 - 16;
            const spawnY = obstacle.y + obstacle.height / 2 - 16;
            spawnPowerUpAt(spawnX, spawnY, type);
            
            playChairBounceSound();
            createHitEffect(obstacle.x + obstacle.width / 2 - 18, obstacle.y + obstacle.height / 2 - 18);
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

function updateSlidingChairs(delta) {
    state.obstacles.forEach((chair) => {
        if (chair.type !== "chair" || !chair.sliding) return;

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
                if (other.type === "chair") {
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
                if (other.type === "chair") {
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

function placePowerUpInFreeSpot(entity) {
    const safeMargin = 58;
    const minX = safeMargin;
    const minY = safeMargin;
    const maxX = GAME.width - entity.width - safeMargin;
    const maxY = GAME.height - entity.height - safeMargin;
    const isSafePickupSpot = (testEntity) => {
        const overlapsActor =
            (state.player && rectsIntersect(testEntity, state.player)) ||
            state.students.some((student) => rectsIntersect(testEntity, student));
        const overlapsOtherPowerUp =
            (state.powerUp && rectsIntersect(testEntity, state.powerUp)) ||
            (state.heartPowerUp && rectsIntersect(testEntity, state.heartPowerUp));
        const overlapsBossOrCampfire = isPickupBlockedByBossOrCampfire(testEntity);

        return !hitsObstacle(testEntity) && !overlapsActor && !overlapsOtherPowerUp && !overlapsBossOrCampfire;
    };

    for (let attempts = 0; attempts < 80; attempts += 1) {
        entity.x = Math.random() * (maxX - minX) + minX;
        entity.y = Math.random() * (maxY - minY) + minY;

        if (isSafePickupSpot(entity)) {
            return;
        }
    }

    for (let y = minY; y <= maxY; y += 18) {
        for (let x = minX; x <= maxX; x += 18) {
            entity.x = x;
            entity.y = y;
            if (isSafePickupSpot(entity)) {
                return;
            }
        }
    }

    const fallbackSpot = findNearestFreeSpot(entity, minX, minY, isSafePickupSpot);
    entity.x = fallbackSpot.x;
    entity.y = fallbackSpot.y;
}

function getCampfireRect() {
    if (!state.campfireElement) return null;

    const left = parseFloat(state.campfireElement.style.left || "0");
    const top = parseFloat(state.campfireElement.style.top || "0");

    return {
        x: left,
        y: top,
        width: 80,
        height: 80
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

    const playerPickupRect = expandRect(getCollisionRect(state.player), 24);
    const playerBodyRect = expandRect(state.player, 4);
    const pickupRect = expandRect(pickup, 14);
    const playerCenter = centerOf(state.player);
    const pickupCenter = centerOf(pickup);
    const nearEnough = Math.hypot(playerCenter.x - pickupCenter.x, playerCenter.y - pickupCenter.y) <= 58;

    return nearEnough || rectsIntersect(playerPickupRect, pickupRect) || rectsIntersect(playerBodyRect, pickupRect);
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
        // Boss: visual 104x120. Shrink physics to bottom 30px, 60px width (centered)
        return {
            x: entity.x + 22,
            y: entity.y + 90,
            width: 60,
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
    }
    return entity;
}

function hitsObstacle(entity) {
    const colRect = getCollisionRect(entity);
    return state.obstacles.some((obstacle) => {
        // Ignora le sedie che stanno scivolando per evitare blocchi o incastri
        if (obstacle.type === "chair" && obstacle.sliding) {
            return false;
        }
        return rectsIntersect(colRect, obstacle);
    });
}

// Ritorna il delay (ms) tra un power-up e il successivo, scalato per livello:
// Livello 1 → 10 s, Livello 2 → 6 s, Livello 3 → 4 s
function getPowerUpRespawnDelay() {
    if (state.currentLevel >= 3) return 4000;
    if (state.currentLevel >= 2) return 6000;
    return GAME.powerUpRespawnDelay; // 10000 ms
}

// Ritardo cuore scalato: Livello 1 → 10 s, Livello 2 → 7 s, Livello 3 → 5 s
function getHeartPowerUpRespawnDelay() {
    if (state.currentLevel >= 3) return 5000;
    if (state.currentLevel >= 2) return 7000;
    return GAME.heartPowerUpRespawnDelay; // 10000 ms
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
            intermissionMessage.textContent = "Attento! Nel Livello 3 gli studenti si raduneranno attorno al fuoco per evocare qualcosa di spaventoso. Per fermarli e colpire anche da lontano, comparira un nuovo power-up: STUDIA.";
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
    
    let types = ["coffee", "shield", "speed", "super_hammer"];

    // Nel livello 3, aumenta molto la probabilita' del power-up "studia" solo quando il boss e' presente.
    if (state.currentLevel === 3 && state.boss) {
        types = ["coffee", "shield", "speed", "super_hammer", "studia", "studia", "studia", "studia", "studia", "studia"];
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
    
    placePowerUpInFreeSpot(powerUp);
    gameArea.appendChild(powerUp.element);
    syncEntity(powerUp);
    state.powerUp = powerUp;
}

function spawnPowerUpAt(x, y, type) {
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

    if (hitsObstacle(powerUp) || isPickupBlockedByBossOrCampfire(powerUp) || overlapsActor) {
        placePowerUpInFreeSpot(powerUp);
    }

    syncEntity(powerUp);
    gameArea.appendChild(powerUp.element);
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
    const message = pickRandomLine(getStudentLinePool(student.studentType), "non studio!");
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
        endMessage.textContent = `Le pietre hanno fermato ${teacher.name}. Riprova e libera l'ufficio dagli studenti svogliati.`;
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
    studentsValue.textContent = state.students.length;
    if (levelValue) {
        levelValue.textContent = state.selectedHackademyId === "standard" ? state.currentLevel : "Sandbox";
    }
}

function updateStaminaHud() {
    if (!state.player || !staminaBarFill) return;

    const staminaPct = Math.max(0, Math.min(100, (state.player.stamina / GAME.maxStamina) * 100));
    staminaBarFill.style.width = `${staminaPct}%`;

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

function spawnBoss() {
    const element = document.createElement("div");
    element.className = "entity boss boss-giant-student student";
    
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
    
    gameArea.appendChild(element);
    
    state.boss = {
        x: 590,
        y: 300,
        width: 104,
        height: 120,
        lives: 15,
        maxLives: 15,
        speed: 1.1,
        direction: "right",
        lastShotAt: 0,
        lastSpeechAt: 0,
        speechTimeoutId: null,
        shootCooldown: 2200,
        element
    };
    
    syncEntity(state.boss);
    const healthContainer = document.getElementById("bossHealthContainer");
    if (healthContainer) {
        healthContainer.classList.remove("d-none");
        const bossNameEl = document.getElementById("bossName");
        if (bossNameEl) {
            bossNameEl.textContent = "Studente Gigante Svogliato";
        }
    }
    updateBossHealthBar();
    
    triggerScreenShake(800, 8);
    playBossShotSound(true);
    tryLaunchStudiaStrike();
}

function triggerBossIntro() {
    state.running = false;
    state.keys.clear();

    const introOverlay = document.getElementById("bossIntroOverlay");
    if (introOverlay) {
        introOverlay.classList.remove("d-none");
    }

    const progressEl = document.getElementById("bossIntroProgress");
    if (progressEl) {
        progressEl.style.transition = "none";
        progressEl.style.width = "0%";
        // Force reflow
        progressEl.offsetHeight;
        progressEl.style.transition = "width 3.5s linear";
        progressEl.style.width = "100%";
    }

    let tcFrames = 0;
    let tcSeconds = 0;
    let tcMinutes = 0;
    let tcHours = 0;
    const tcEl = document.getElementById("bossVideoTc");

    const tcInterval = setInterval(() => {
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

    setTimeout(() => {
        clearInterval(tcInterval);
        if (introOverlay) {
            introOverlay.classList.add("d-none");
        }
        spawnBoss();
        state.running = true;
    }, 3500);
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
    
    // Ripetizione frase "SKIBIDIBOPPI" a video e audio
    if (!state.boss.lastSpeechAt) {
        state.boss.lastSpeechAt = timestamp;
        speakBossSkibidiboppi();
    }
    if (timestamp - state.boss.lastSpeechAt > 3500) {
        state.boss.lastSpeechAt = timestamp;
        speakBossSkibidiboppi();
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
    
    state.rageActive = true;
    state.rageActiveUntil = state.gameTimeMs + 5000;
    state.rageMeter = 100;
    state.lastRageParticleSpawnAt = 0;
    
    if (gameArea) {
        gameArea.classList.add("rage-active");
    }
    
    if (state.player && state.player.element) {
        state.player.element.classList.add("rage-active-player");
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
    state.rageMeter = 0;
    
    updateRageBarVisual();
    
    if (gameArea) {
        gameArea.classList.remove("rage-active");
    }
    
    if (state.player && state.player.element) {
        state.player.element.classList.remove("rage-active-player");
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
        const timeLeft = Math.max(0, state.rageActiveUntil - state.gameTimeMs);
        state.rageMeter = (timeLeft / 5000) * 100;
        updateRageBarVisual();
        
        // Spawn particle trail if player is moving
        const movement = getInputVector();
        const isMoving = movement.x !== 0 || movement.y !== 0;
        if (isMoving && state.gameTimeMs - state.lastRageParticleSpawnAt > 90) {
            spawnRageParticle(state.player);
            state.lastRageParticleSpawnAt = state.gameTimeMs;
        }
        
        // Check collision with students to defeat them
        const playerRect = state.player;
        state.students.forEach((student) => {
            if (rectsIntersect(playerRect, student)) {
                if (!student.isChanting && !student.element.classList.contains("burning")) {
                    burnStudent(student);
                    playRageHitSound();
                }
            }
        });
        
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
