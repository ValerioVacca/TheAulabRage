# Valerio The Banner

## Descrizione progetto

Versione 2D top-down arcade ambientata nell'ufficio Aulab. Il giocatore controlla Valerio The Banner e deve inseguire gli studenti che non studiano, evitarne le pietre e colpirli con un martello di gomma fino a liberare tutta l'arena attraverso due livelli consecutivi.

## Tecnologie usate

- HTML5
- CSS3
- Bootstrap 5 via CDN
- JavaScript Vanilla
- DOM API
- Web Audio API
- Speech Synthesis API

## Comandi

- `W / A / S / D` per muoversi
- `Frecce direzionali` per muoversi
- `Barra spaziatrice` per colpire con il martello di gomma
- Raccogli il `caffe'` per attivare il power-up che lancia `Charizard`

## Regole

- Valerio parte con 3 vite.
- Gli studenti si muovono autonomamente nell'arena.
- Se Valerio colpisce uno studente con il martello, lo elimina.
- Gli studenti lanciano periodicamente pietre verso Donato.
- Ogni tanto compare un power-up caffe' in una posizione casuale libera.
- Il primo caffe' compare dopo 5 secondi di gioco e resta disponibile per 3 secondi con countdown visibile.
- Se il caffe' non viene raccolto, scompare e ricompare 10 secondi dopo.
- Se Valerio raccoglie il caffe', il power-up scompare e viene evocato Charizard, che vola nell'arena ed elimina uno studente.
- Se Valerio raccoglie un cuore comparso nell'arena, recupera 1 vita persa.
- Se una pietra colpisce Valerio, Valerio perde una vita.
- Dopo aver eliminato tutti gli studenti del primo livello, si accede automaticamente al secondo livello.
- Nel secondo livello gli studenti diventano 6 e ciascuno puo' lanciare 2 pietre contemporaneamente.
- Quando le vite arrivano a 0, la partita termina con Game Over.
- Quando tutti gli studenti di entrambi i livelli vengono eliminati, il giocatore vince.

## Struttura file

- `index.html`: layout dell'applicazione, HUD, overlay e area di gioco.
- `index.html`: layout full-screen del gioco con HUD in overlay e overlay di stato.
- `css/style.css`: stile dell'interfaccia, arena top-down, personaggi, ostacoli ed effetti.
- `js/main.js`: logica di gioco, movimento, IA studenti, collisioni, attacchi e stato partita.
- `README.md`: documentazione tecnica e funzionale del progetto.

## Funzionalita implementate

- Arena 2D top-down interamente renderizzata con elementi DOM assoluti.
- Progressione su 2 livelli con passaggio automatico dal primo al secondo stage.
- Palette grafica ispirata al branding Aulab con contrasto giallo e blu notte.
- Movimento del player con `WASD` e frecce direzionali.
- Player ridisegnato come omino CSS animato con martello visibile e attacco melee animato.
- Volto del player alimentato da asset reale locale invece che da sola ricostruzione CSS.
- Animazioni del player attive solo durante il movimento, con posa ferma in idle.
- Swing del martello ulteriormente ricalibrato e sollevato in idle, per un colpo dall'alto verso il basso piu' leggibile.
- Testa grigia del martello ripulita con una forma piu' leggibile e piu' vicina a un vero mallet.
- Studenti rappresentati come omini CSS top-down animati, con corsa, fuga, presa della pietra e gesto di lancio.
- Studenti rifiniti con volto e capelli per risultare piu' leggibili come personaggi.
- Ogni studente ha ora una palette diversa per abiti, gambe e capelli, per evitare duplicati visivi.
- Gli studenti pronunciano periodicamente brevi frasi casuali tramite balloon sopra la testa.
- I balloon e la sintesi vocale degli studenti usano frasi corrette e coerenti con i dialoghi previsti.
- Lancio di pietre da parte degli studenti.
- Power-up caffe' con spawn periodico in posizione casuale libera.
- Countdown visivo sopra il caffe' e ciclo di comparsa/scomparsa basato sul tempo di gioco.
- Spawn del caffe' limitato alla zona bianca interna realmente raggiungibile dal player.
- Tazza del caffe' ridisegnata in CSS con resa piu' leggibile e piu' vicina a una vera mug.
- Attacco speciale volante evocato dal caffe' che lancia Charizard contro uno studente.
- Attacco speciale volante realizzato con l'asset reale `assets/charizard.png`.
- Power-up cuore con spawn casuale e recupero di una vita persa.
- Eliminazione con effetto bruciatura e fiamme CSS sugli studenti colpiti dall'attacco speciale.
- Musica di sottofondo generata via Web Audio API durante la partita.
- Effetti sonori per colpo di martello, raccolta del power-up, danno ricevuto e Game Over.
- Frasi degli studenti mostrate a schermo e riprodotte anche via sintesi vocale del browser.
- Collisioni rettangolari con ostacoli e bordi della stanza.
- Correzione automatica degli spawn per evitare personaggi incastrati dentro gli ostacoli.
- HUD in overlay con cuori per le vite e numero studenti rimasti.
- Overlay iniziale, schermata di vittoria e schermata di Game Over.
- Overlay iniziale e finale con banner scuro, testo chiaro e sezione comandi piu' leggibile.
- Scenario ufficio Aulab con scrivanie, sedie, computer, lavagna, pareti e insegna.
- Scenario ufficio arricchito con dettagli ambientali aggiuntivi come piantina e cestino.
- Secondo livello con disposizione alternativa e piu' ariosa degli arredi, per compensare il lancio doppio delle pietre.
- Arena full-screen scalata automaticamente per restare interamente visibile nella finestra senza scroll.
- Sfondo globale della pagina in tema scuro per valorizzare il contrasto con l'area di gioco.
- Pavimento dell'arena scaldato e leggermente scurito per ridurre l'effetto troppo bianco.
- Arredi della zona destra riallineati nelle proporzioni per combaciare meglio con il blocco di sinistra.
- Avvio diretto da browser senza build step o backend.

## Bug noti

- La linea di tiro degli studenti e' semplificata con controlli rettangolari, quindi in alcuni angoli puo' sembrare conservativa.
- Il passaggio al secondo livello e' immediato e non mostra ancora una schermata dedicata di intermezzo.
- Gli effetti visivi del martello sono stilizzati e non usano sprite dedicati.
- La sintesi vocale dipende dalle voci disponibili nel browser e nel sistema operativo, quindi timbro e pronuncia possono variare.
- In alcuni browser l'audio parte solo dopo l'interazione iniziale dell'utente, per via delle policy autoplay.

## Changelog

### 2026-05-21

- Sostituito l'approccio 3D/2.5D con una versione 2D top-down arcade.
- Implementata un'arena DOM-based senza Canvas, WebGL o framework.
- Aggiunte IA base per studenti, lancio pietre, attacco melee, HUD e schermate finali.
- Applicata la palette visiva Aulab e inserito il logo stilizzato sulla lavagna e nell'HUD ambientale.
- Rimossi i riquadri laterali e resa la scritta sulla lavagna piu' integrata nel contesto.
- Rimossi i loghi Aulab dalla scena di gioco.
- Eliminati gli scroll dell'area di gioco con adattamento automatico dell'arena al viewport.
- Reso scuro lo sfondo globale dell'interfaccia.
- Ridisegnati gli studenti come piccoli personaggi CSS animati con corpo visibile e lancio della pietra piu' leggibile.
- Spostato tutto il gioco a piena finestra con HUD direttamente sopra la scena e cuori per le vite.
- Corretti gli spawn dei personaggi per evitare blocchi iniziali sopra rettangoli e arredi.
- Ridisegnato il player come personaggio animato con martello in mano e swing visibile in attacco.
- Aggiunto il power-up caffe' con evocazione di un attacco speciale volante e morte bruciata degli studenti colpiti.
- Introdotti musica di sottofondo, effetti sonori contestuali e voce sintetica per le frasi degli studenti.
- Rinominato il protagonista nei testi di gioco e nella schermata iniziale da Donato a Valerio.
- Aggiunta progressione a due livelli con seconda arena, 6 studenti e lancio doppio delle pietre nel livello finale.
- Aggiunto un cuore come power-up curativo con comparsa casuale e recupero vite.
- Aggiornata la documentazione per riflettere la nuova architettura del progetto.

## Roadmap futura

- Aggiungere piu' tipi di studenti con velocita' e comportamento differenti.
- Introdurre livelli multipli aggiuntivi o ondate progressive oltre ai primi due stage.
- Inserire altri power-up temporanei per Valerio oltre al caffe'.
- Migliorare feedback audio e animazioni CSS.
- Aggiungere una schermata iniziale con selezione difficolta'.
