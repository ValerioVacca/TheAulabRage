# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Aulab Rage** is a 2D top-down arcade game built with vanilla HTML5, CSS3, and JavaScript. The player controls "Valerio The Banner" who must chase lazy students around the Aulab office, avoiding stones and hitting them with a rubber hammer through three consecutive levels, culminating in a boss fight.

## Development Commands

```bash
# Start development server
npm run dev

# Start production server
npm start
```

Both commands start an http-server on port 5502. The game runs entirely in the browser - no build process required.

## Core Architecture

### File Structure
- `index.html` - Main game layout with responsive design, HUD, overlays, and touch controls
- `js/main.js` - Single ~4100 line JavaScript file containing all game logic
- `css/style.css` - Complete styling including responsive design and mobile support
- `package.json` - Basic Node.js setup with http-server for development

### Game Architecture (js/main.js)

The codebase follows a functional programming approach with global state management:

**Core Systems:**
- **Game Loop**: Main `gameLoop()` function handles updates and rendering
- **Entity Management**: Students, projectiles, items, and environmental objects
- **Physics Engine**: Chair collision system with momentum transfer and elastic bounces
- **AI System**: Multiple student archetypes (fast, shooter, dodger, cheater) with distinct behaviors
- **Audio System**: Web Audio API for dynamic music and Speech Synthesis API for dialogue
- **Input System**: Combined keyboard/mouse and touch controls with virtual joystick

**Key Game Features:**
- **Rage Mode**: Visual effects, speed boost, and dynamic music when fury bar is full
- **Chair Physics**: Interactive furniture that can be launched as projectiles
- **Student AI Types**:
  - Fast: High-speed evasive movement
  - Shooter: Stationary stone throwers with aimed trajectories
  - Dodger: Rapid dash attacks to avoid hammer strikes
  - Cheater: Collaborative AI that buffs other students by "copying code"
- **Boss System**: Level 3 giant boss with summoning ritual and "SKIBIDIBOPPI" audio
- **Map Editor**: Built-in level editor for customizing object placement
- **Story System**: Interactive terminal-style narrative introduction

**Configuration Systems:**
- **Teacher Customization**: Add custom teachers with images, names, and tool types
- **Hackademy Classes**: Configure student count and class names
- **Map Editor**: Drag-and-drop level editing with object palette

### Key Technical Details

- **Responsive Design**: Automatic viewport scaling for mobile/desktop with orientation detection
- **Touch Controls**: Virtual joystick and attack button for mobile gameplay
- **Dynamic Audio**: Real-time music tempo changes based on game state
- **Visual Effects**: CSS-based particle systems, auras, and screen filters
- **Local Storage**: Saves game progress, custom teachers, and map configurations

### Code Organization

The main.js file is organized in these functional sections:
- DOM element references (lines 1-100)
- Game configuration and constants (lines 100-400)
- Entity management and AI logic (lines 400-2000)
- Physics and collision systems (lines 2000-2800)
- Audio and visual effects (lines 2800-3600)
- Map editor functionality (lines 3600-3900)
- Rage mode and special effects (lines 3900-4100)

## Game Content Notes

This is a humorous parody game set in a coding bootcamp environment. All violence is cartoonish (rubber hammer, students just get "knocked out" temporarily). The game includes Italian dialogue and memes like "SKIBIDIBOPPI" as boss catchphrases.

## Development Notes

- No transpilation or build tools - edit files directly
- Use browser DevTools for debugging
- Game state is managed through global variables
- Mobile testing requires actual device or browser simulation
- Audio requires user interaction to start due to browser autoplay policies