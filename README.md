# Valerio The Banner (The Aulab Rage)

## Descrizione progetto

Versione 2D top-down arcade ambientata nell'ufficio Aulab. Il giocatore controlla Valerio The Banner e deve inseguire gli studenti che non studiano, evitarne le pietre e colpirli con un martello di gomma fino a liberare tutta l'arena attraverso tre livelli consecutivi, culminando nello scontro con il Boss finale.

---

## Tecnologie usate

- HTML5 & CSS3 (Vanilla, layout responsive e animazioni avanzate)
- Bootstrap 5 via CDN
- JavaScript Vanilla (Struttura ad oggetti e logica di gioco)
- DOM API (Rendering e gestione entità dinamiche)
- Web Audio API (Sintesi sonora arcade real-time per effetti e musica adattiva)
- Speech Synthesis API (Riproduzione vocale per i dialoghi degli studenti e del boss)

---

## Comandi

- **Desktop (WASD / Frecce)**: Muovi Valerio.
- **Desktop (Barra Spaziatrice)**: Colpisci col martello.
- **Mobile (Joystick virtuale)**: Trascina per muovere Valerio.
- **Mobile (Pulsante Martello 🔨)**: Colpisci col martello.
- **Power-up Caffè**: Raccoglilo per attivare l'attacco speciale "Charizard" e caricare istantaneamente lo **Stato di Furia**.

---

## Regole e Meccaniche di Gioco

- **Vite**: Valerio inizia con 3 vite. Colpire cuori che compaiono nell'arena ripristina 1 vita persa (fino a un massimo di 3).
- **Progressione Livelli**:
  - **Livello 1**: 5 studenti base.
  - **Livello 2**: 6 studenti in una disposizione ostacoli differente, con abilità di lanciare 2 pietre in contemporanea.
  - **Livello 3 (Boss Final Stage)**: Inizia con un rito di evocazione attorno al falò. Successivamente, compare il **Boss finale**: uno studente gigante e svogliato che lancia ondate di pietre e ripete ossessivamente sia a video che in audio *"SKIBIDIBOPPI"* (tramite sintesi vocale a timbro grave e lento).
- **Stato di Furia (Rage Mode)**:
  - Si carica raccogliendo il Caffè o colpendo ripetutamente gli studenti (riempiendo la barra della Furia).
  - All'attivazione (durata 5 secondi): l'arena riceve un filtro CSS neon/glitch viola/rosso pulsante, la musica accelera e sale di tonalità, e una scia di fiamme segue il giocatore.
  - Valerio si muove al doppio della velocità e sconfigge gli studenti semplicemente andandoci contro.
- **La Sedia Proiettile (Fisica delle Sedie)**:
  - Le sedie presenti nell'ufficio possono essere colpite con il martello per trasformarle in proiettili ad alta velocità nella direzione di impatto.
  - Lasciano una scia di fumo, rimbalzano su pareti/scrivanie con un suono metallico (biliardo-style) e mettono KO all'istante gli studenti sul loro percorso.
  - Colpire il Boss finale con una sedia scorrevole gli infligge danno e respinge la sedia indietro.
  - Le sedie che scorrono trasferiscono il 90% della loro quantità di moto alle altre sedie ferme in caso di collisione.
- **Lo Studente Copiatore (Homework Cheater)**:
  - Nuovo tipo di studente che indossa occhiali da sole e si muove con un'andatura furtiva/crescente.
  - Cerca attivamente di raggiungere un compagno per copiarne il codice. Quando è vicino, compare un indicatore `"📥 COPIA"` con barra di caricamento.
  - Se copia per 2 secondi senza interruzioni, entrambi gli studenti entrano in stato `"Codice Copiato"` (aura rossa rotante), raddoppiando la loro velocità e tirando pietre più frequentemente.

---

## Struttura file

- `index.html`: Layout responsive del gioco, HUD superiore, area di gioco scalata, controlli touch virtuali e pannelli overlay (Start, Pause, Intermezzo, End).
- `css/style.css`: Design system, stili responsive (mobile/desktop), warning di rotazione per schermi verticali, particelle di fumo, auree dei potenziamenti ed effetti speciali.
- `js/main.js`: Game Loop, IA studenti (fast, shooter, dodger, cheater), fisica delle sedie, logica del Boss finale, sintesi audio Web Audio API e sintesi vocale.

---

## Funzionalità Implementate

1. **Responsive Viewport Scaling**: Il gioco si adatta a smartphone, tablet e desktop. Su schermi verticali (portrait) viene mostrata una schermata che richiede di ruotare il dispositivo.
2. **Virtual Touchpad**: Joystick analogico virtuale e pulsante d'attacco integrati per dispositivi mobile.
3. **Fisica Ambientale Interattiva**: Sedie scorrevoli con collisioni asse-separate, rimbalzi elastici e trasmissione del moto.
4. **Intelligenza Artificiale Multi-Archetipo**:
   - *Fast*: Veloci, evitano il combattimento ravvicinato.
   - *Shooter*: Stazionari, lanciano pietre con traiettoria mirata.
   - *Dodger*: Eseguono scatti rapidi per schivare i colpi di martello.
   - *Cheater*: AI collaborativa che buffa se stessa e i compagni copiando codice.
5. **Rage Mode**: Effetti grafici dinamici, scia di fiamme e musica dinamica Web Audio API che segue l'intensità della furia.
6. **Boss Fight Finale**: Studente gigante dotato di indicatori di vita dedicati, scorta di alleati ed effetti audio-visivi legati al meme "SKIBIDIBOPPI" (Speech Synthesis impostata con pitch basso e tempo dimezzato).
7. **Schermata Narrativa Interattiva**: Un'introduzione retro-terminale (`PROGETTO_FINALE_BOOTCAMP.LOG`) all'avvio con animazione typewriter carattere per carattere, skippabile all'istante o consultabile tramite il pulsante "La Storia" del menu principale.

---

## Changelog Recente

- **Layout & Mobile**: Aggiunta responsività totale, joystick touch e overlay di avviso orientamento.
- **Chair Physics**: Implementato il movimento e i rimbalzi delle sedie colpite, con trasferimento di momento lineare e danni al Boss.
- **Homework Cheater**: Aggiunto lo studente copiatore con logica di inseguimento partner, cerchio di copia, progress bar, audio chiptune di successo e aura rossa con boost velocità/frequenza di lancio.
- **Rage Mode & Audio**: Ricalibrata la velocità della musica di sottofondo basata sui nodi AudioContext e aggiunti filtri glitch per la Rage Mode.
- **Interactive Story Screen**: Aggiunta introduzione log-terminale interattiva vecchio stile hacker all'avvio del gioco, skippabile e consultabile dal menu principale.

---

## Roadmap futura

- Salvataggio dei punteggi migliori (High Scores) in LocalStorage.
- Aggiunta di nuovi arredi e ostacoli distruttibili.
- Nuovi tipi di boss (es. tutor o docenti in preda al panico).
- Modalità editor mappe migliorata ed esportabile.
