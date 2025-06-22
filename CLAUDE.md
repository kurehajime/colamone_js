# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Colamone is a two-player strategy board game similar to chess, built as a React web application with Rust/WebAssembly for AI computations. The game is deployed to Firebase Hosting and GitHub Pages.

## Development Commands

```bash
# Start development server
npm start

# Build for production (includes TypeScript check and date update)
npm run build

# Preview production build locally  
npm serve

# Run tests
npm test

# Update dependencies
npm run uplib

# TypeScript type checking (run before committing)
tsc --noEmit
```

## Architecture Overview

### Core Structure
- **React + TypeScript** frontend with Vite build system
- **React Context API** for component-level state management
- **Rust/WebAssembly** module for AI computation (fallback to JavaScript AI)
- **i18next** for internationalization (8 languages supported)
- **Canvas-based rendering** for game board and pieces

### Key Components
- `src/components/Colamone.tsx` - Main game component orchestrating all game logic
- `src/model/GameState.ts` - Central game state class containing all game data and logic
- `src/reducer/GameStateManager.ts` - Redux-style reducer for state updates
- `src/contexts/HoverContext.tsx` - React Context for UI state management
- `src/static/game/` - Core game logic (AI, evaluation, rules)
- `wasm/` - Rust implementation of AI for better performance

### State Management Pattern
The app uses a combination of:
- **useReducer** with GameStateManager for game state transitions
- **React Context API** with HoverContext for UI state (hover states, touch handling)
- **GameState class** as the single source of truth for game logic

### AI System
- Primary AI implementation in Rust (wasm/src/ai.rs)
- JavaScript fallback AI in src/static/game/Ai.ts
- Multiple difficulty levels with dynamic depth adjustment
- Performance optimization for endgame positions

### UI State Management (HoverContext)
The `HoverContext` manages interactive UI states:
- **Touch state**: Boolean indicating touch vs mouse interaction
- **Hover pointer**: Current pointer coordinates for piece dragging
- **Hover number**: Cell number currently being hovered over
- Custom `useHover` hook provides clean access to state and setters

### Canvas Rendering
Game board is rendered using HTML5 Canvas with separate layers for:
- Background (static grid)
- Pieces (game pieces with directional indicators)
- Hover/selection states
- Messages and UI overlays

## Testing

Tests are located in `test/` directory using Vitest framework. Core game logic tests include:
- Piece movement validation
- Win condition detection  
- AI deterministic behavior verification

## Build System

- **Vite** for development and bundling
- **vite-plugin-singlefile** creates single HTML file for easy deployment
- Builds output to `docs/` directory for GitHub Pages hosting
- TypeScript compilation check runs before build
- Automated date update via `update-date.js`

## Deployment

The project supports dual deployment:
- **GitHub Pages**: Builds to `docs/` directory
- **Firebase Hosting**: Uses same build output

## WebAssembly Integration

The Rust WASM module provides:
- Optimized AI thinking algorithm
- Compiled to `wasm/pkg/` directory
- Graceful fallback to JavaScript if WASM fails
- Integration via `__wbg_init()` in index.tsx

## Internationalization

Supports 8 languages with JSON files in `src/i18n/`:
- English, Japanese, Korean, Chinese (Simplified/Traditional), German, Portuguese, Hindi
- Language selection via URL parameters