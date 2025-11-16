# CLAUDE.md - AI Assistant Guide for Frontlines-Continuous

> **Status:** Active development - Core game implemented and playable

## Overview

This document serves as a comprehensive guide for AI assistants (like Claude) working on the Frontlines-Continuous repository. This is a two-player turn-based strategy game built with vanilla JavaScript, HTML5 Canvas, and CSS3. Players deploy force vectors along a continuous frontline using Gaussian distribution mechanics.

---

## Repository Information

- **Repository:** Frontlines-Continuous
- **Owner:** michaelgg1234
- **Project Type:** Browser-based strategy game
- **Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Current State:** Core game implemented - v1.0.0
- **Git Configuration:**
  - Commit signing: Enabled (SSH)
  - Remote origin: Configured and ready

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Development Workflow](#development-workflow)
3. [Git Workflow](#git-workflow)
4. [Coding Conventions](#coding-conventions)
5. [Testing Guidelines](#testing-guidelines)
6. [AI Assistant Guidelines](#ai-assistant-guidelines)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Project Structure

### Current Structure
```
Frontlines-Continuous/
├── .git/              # Git repository metadata
├── index.html         # Main game page and UI structure
├── styles.css         # Visual styling, layouts, and color palette
├── game.js           # Core game logic, rendering, and physics
├── README.md         # Player-facing documentation
└── CLAUDE.md         # This file - AI assistant guide
```

### File Descriptions

**index.html** (Main Game Page)
- Canvas element (1600x900px)
- Three-panel layout: Player info | Game canvas | Controls
- UI elements: Timer, force meters, territory bars, control buttons
- Victory modal overlay

**styles.css** (Styling & Layout)
- Color palette: Red (#dc2626), Blue (#3b82f6), Dark theme (#0f172a)
- Grid layout (250px | 1fr | 250px)
- Force bars with vertical gradient fills
- Responsive design for different screen sizes
- Animations: Pulse effects, transitions, victory effects

**game.js** (Game Logic - ~900 lines)
- `GameState` class: Central state management
- Canvas rendering with requestAnimationFrame
- Gaussian force calculations
- Catmull-Rom spline frontline smoothing
- Combat resolution and territory calculation
- Mouse input handling for vector deployment
- Timer and turn management
- Victory condition checks

---

## Development Workflow

### Branch Strategy

**Development Branches:**
- AI-generated feature branches follow pattern: `claude/claude-md-<session-id>`
- Current branch: `claude/claude-md-mi28qvir9k9tsa37-01UjokYfGiUkboLUCNJ12doU`

**Important Rules:**
1. Always develop on the designated Claude branch
2. Never push to main/master without explicit permission
3. Create pull requests for merging changes

### Environment Setup

**No build process or dependencies required!** This is a pure vanilla JavaScript project.

**Requirements:**
- ✅ Modern web browser (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- ✅ HTML5 Canvas support
- ✅ ES6+ JavaScript support
- ✅ Local file server (optional, recommended for development)

**Local Development Setup:**
```bash
# Option 1: Python simple server
python -m http.server 8000

# Option 2: Node http-server (if installed)
npx http-server

# Option 3: Just open index.html directly in browser
# (May have limitations with some browsers)
```

Then navigate to: `http://localhost:8000`

**No package manager, no build step, no transpilation needed!**

---

## Git Workflow

### Commit Guidelines

**Commit Message Format:**
```
<type>: <short description>

<optional detailed description>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Maintenance tasks
- `style`: Code style changes (formatting, etc.)

**Best Practices:**
1. Write clear, descriptive commit messages
2. Keep commits focused and atomic
3. Reference issue numbers when applicable
4. Sign commits (automatically configured)

### Push Protocol

**Standard Push:**
```bash
git push -u origin <branch-name>
```

**Retry Logic for Network Issues:**
- Retry up to 4 times with exponential backoff
- Wait times: 2s, 4s, 8s, 16s between retries

**Critical Requirements:**
- Branch must start with `claude/`
- Branch must end with matching session ID
- Push will fail with 403 if naming convention is violated

### Pull Request Process

1. **Before Creating PR:**
   - Ensure all tests pass
   - Review your changes
   - Update documentation if needed
   - Check for merge conflicts

2. **PR Title Format:**
   ```
   [Type] Brief description of changes
   ```

3. **PR Description Should Include:**
   - Summary of changes
   - Motivation and context
   - Testing performed
   - Related issue numbers
   - Breaking changes (if any)

---

## Coding Conventions

### General Principles

1. **Code Quality:**
   - Write self-documenting code
   - Use meaningful variable and function names
   - Keep functions small and focused
   - Follow DRY (Don't Repeat Yourself)
   - Apply SOLID principles where applicable

2. **Security:**
   - Never commit secrets or credentials
   - Sanitize user inputs
   - Avoid common vulnerabilities (SQL injection, XSS, CSRF, etc.)
   - Follow OWASP Top 10 guidelines

3. **Performance:**
   - Optimize for readability first, performance second
   - Profile before optimizing
   - Document performance-critical sections

### JavaScript-Specific Guidelines

**Code Style:**
- Use `const` for constants, `let` for variables, avoid `var`
- Use arrow functions for callbacks and short functions
- Use template literals for string interpolation
- Prefer destructuring when appropriate
- Use ES6+ features (classes, spread operator, etc.)

**Naming Conventions:**
- Classes: PascalCase (`GameState`, `Vector`)
- Functions: camelCase (`resolveCombat`, `drawFrontline`)
- Constants: UPPER_SNAKE_CASE (`MAX_FORCE`, `CANVAS_WIDTH`)
- Variables: camelCase (`currentPlayer`, `forceRemaining`)

**Game-Specific Patterns:**
- All game state centralized in `GameState` class
- Canvas rendering in `render()` function called by requestAnimationFrame
- Event handlers prefixed with `handle` (`handleMouseDown`)
- UI updates in dedicated `updateUI()` function
- Math utilities use clear, descriptive names

**Performance Considerations:**
- Minimize allocations in render loop
- Use const for loop bounds to help optimizer
- Avoid Array.push in hot paths (use pre-allocated arrays)
- Cache frequently accessed DOM elements
- Use requestAnimationFrame for smooth 60 FPS

**Canvas Best Practices:**
- Save/restore context state when changing properties
- Use globalAlpha for transparency effects
- Batch similar draw operations
- Minimize state changes (strokeStyle, fillStyle, etc.)

---

## Testing Guidelines

### Current Testing Approach

**Manual Testing:** Currently the primary testing method
- Open game in browser
- Test deployment for both players
- Verify force calculations
- Check frontline movement
- Confirm victory conditions
- Test edge cases (timer expiry, force limits, etc.)

### Testing Checklist

When making changes, manually verify:
- [ ] Game starts correctly with centered frontline
- [ ] Mouse input works (click, drag, release)
- [ ] Force meters update correctly
- [ ] Timer counts down and auto-confirms at 0
- [ ] Both players can deploy forces
- [ ] Combat resolution moves frontline appropriately
- [ ] Territory percentages calculate correctly
- [ ] Victory conditions trigger properly
- [ ] New game button resets state
- [ ] No console errors
- [ ] Maintains 60 FPS (check DevTools)

### Future Testing

**Recommended additions:**
- Unit tests for Gaussian calculations (`getForceAtPoint`)
- Unit tests for frontline smoothing algorithms
- Unit tests for territory calculation
- Integration tests for combat resolution
- Visual regression tests for rendering
- Framework options: Jest, Vitest, or Mocha + Chai

---

## AI Assistant Guidelines

### Core Principles

1. **Understanding Before Action:**
   - Always read relevant files before editing
   - Understand the context and existing patterns
   - Ask clarifying questions when requirements are ambiguous

2. **Code Exploration:**
   - Use specialized tools (Read, Grep, Glob) for file operations
   - Use Task tool with Explore agent for broad codebase exploration
   - Avoid guessing file locations - search systematically

3. **Task Management:**
   - Always use TodoWrite for multi-step tasks
   - Mark tasks in_progress before starting
   - Mark tasks completed immediately after finishing
   - Only one task should be in_progress at a time

4. **Safety First:**
   - Never run destructive commands without confirmation
   - Review security implications of code changes
   - Test changes before committing
   - Never skip git hooks or force push without explicit permission

### Tool Usage Preferences

**File Operations:**
- `Read` - for reading files (not `cat`)
- `Edit` - for editing files (not `sed`/`awk`)
- `Write` - for creating new files (not `echo >`)
- `Grep` - for searching file contents (not `grep`/`rg` via Bash)
- `Glob` - for finding files by pattern (not `find`/`ls`)

**Code Exploration:**
- Use `Task` tool with `subagent_type: Explore` for understanding codebase structure
- Use parallel tool calls when operations are independent
- Use sequential calls when operations have dependencies

### Communication Style

1. **Concise and Clear:**
   - Keep responses focused and actionable
   - Use markdown for formatting
   - Avoid unnecessary emojis unless requested

2. **Technical Accuracy:**
   - Prioritize correctness over validation
   - Provide objective, factual information
   - Disagree respectfully when necessary

3. **Progress Visibility:**
   - Keep user informed of progress
   - Use todos to show task breakdown
   - Explain decisions and trade-offs

### Common Patterns

#### Investigating Issues
```markdown
1. Reproduce the issue (if applicable)
2. Use Grep/Glob to locate relevant code
3. Read affected files
4. Analyze root cause
5. Propose solution
6. Implement fix
7. Test fix
8. Commit changes
```

#### Adding New Features
```markdown
1. Understand requirements (ask questions if needed)
2. Explore existing similar features
3. Plan implementation using TodoWrite
4. Implement incrementally
5. Test thoroughly
6. Update documentation
7. Commit and push
8. Create pull request
```

#### Refactoring
```markdown
1. Understand current implementation
2. Identify improvement opportunities
3. Plan refactoring steps
4. Make changes incrementally
5. Ensure tests still pass
6. Verify no behavior changes
7. Commit with clear description
```

---

## Common Tasks

### Starting Work on a New Feature

```bash
# Ensure you're on the correct Claude branch
git status

# Pull latest changes
git fetch origin claude/claude-md-mi28qvir9k9tsa37-01UjokYfGiUkboLUCNJ12doU
git pull origin claude/claude-md-mi28qvir9k9tsa37-01UjokYfGiUkboLUCNJ12doU

# Start implementation
# (Use TodoWrite to plan your work)
```

### Creating a Commit

```bash
# Stage relevant files
git add <files>

# Check what will be committed
git status
git diff --staged

# Create commit with descriptive message
git commit -m "$(cat <<'EOF'
feat: Add feature description

Detailed explanation of changes and why they were made.
EOF
)"

# Verify commit
git log -1
```

### Pushing Changes

```bash
# Push to your Claude branch
git push -u origin claude/claude-md-mi28qvir9k9tsa37-01UjokYfGiUkboLUCNJ12doU
```

---

## Troubleshooting

### Git Issues

**Problem:** Push fails with 403 error
**Solution:** Verify branch name starts with `claude/` and ends with correct session ID

**Problem:** Merge conflicts
**Solution:**
```bash
git fetch origin
git status
# Resolve conflicts manually in affected files
git add <resolved-files>
git commit
```

**Problem:** Network timeout during push/pull
**Solution:** Retry with exponential backoff (automated in workflow)

### Game Issues

**Problem:** Frontline moves erratically
**Solution:** Check Gaussian calculations in `getForceAtPoint()`. Verify GAUSSIAN_SIGMA constant is set correctly (50px).

**Problem:** Low FPS / stuttering
**Solution:**
- Check requestAnimationFrame is being used (not setInterval)
- Profile with Chrome DevTools Performance tab
- Reduce number of frontline control points if needed
- Check for memory leaks in event handlers

**Problem:** Mouse input not working
**Solution:**
- Verify canvas getBoundingClientRect() scaling calculation
- Check that click is within 30px of frontline
- Ensure game.phase === 'deployment'

**Problem:** Territory percentages incorrect
**Solution:**
- Verify `calculateTerritory()` sample interval (20px)
- Check `isPointInRedTerritory()` logic
- Ensure frontline doesn't have gaps

---

## Project-Specific Notes

### Key Architectural Decisions

✅ **Technology Stack:**
- Vanilla JavaScript (no frameworks) - for simplicity and performance
- HTML5 Canvas - for high-performance rendering
- Pure CSS3 - no preprocessors needed
- No build process - easy deployment and modification

✅ **State Management:**
- Single `GameState` class holds all game state
- No external state library (Redux, MobX) - unnecessary for this scope
- Direct DOM manipulation for UI updates

✅ **Physics Engine:**
- Gaussian distribution for force spread
- Catmull-Rom splines for smooth frontline curves
- Explicit Euler integration for frontline movement

✅ **Rendering:**
- Canvas 2D context (not WebGL) - sufficient for 2D game
- 60 FPS target with requestAnimationFrame
- Offscreen rendering not needed (good performance without it)

✅ **Game Balance:**
- 100 force per turn (tuned for ~3-5 arrows typical)
- 30 second deployment phase (enough time for strategy)
- Gaussian sigma = 50px (creates meaningful force overlap)
- Movement constant = 10 (prevents too-fast territory changes)

### Dependencies and Services

**None!** This project has zero external dependencies.

- No npm packages
- No CDN libraries
- No backend services
- No database
- No authentication system
- Pure client-side game

This makes deployment trivial: just serve the three files.

### Known Issues and Limitations

**Current Limitations:**
1. **No Envelopment Detection:** Full pocket detection for enclosed territories not yet implemented
2. **Local Only:** No online multiplayer - both players share same screen
3. **No Mobile Optimization:** Touch controls not implemented (desktop mouse only)
4. **No Save/Load:** Game state cannot be saved between sessions
5. **No AI Opponent:** Only supports 2 human players
6. **No Sound:** No audio feedback or music

**Known Bugs:**
- Frontline can sometimes have small self-intersections at extreme force concentrations
- Timer might drift slightly on slow devices
- Very long arrows (close to max) can clip out of gaussian preview circle slightly

**Performance Notes:**
- Should maintain 60 FPS on modern hardware
- May drop to 30-40 FPS on older devices or low-end laptops
- Mobile browsers not tested thoroughly

---

## Updates and Maintenance

**Last Updated:** 2025-11-16
**Updated By:** Claude (Initial creation)

### Change Log

- **2025-11-16:** Core game implementation (v1.0.0)
  - Created complete playable game with all core features
  - Implemented Gaussian force distribution system
  - Built smooth frontline rendering with Catmull-Rom splines
  - Added turn management and combat resolution
  - Created comprehensive UI with force meters and territory tracking
  - Implemented victory conditions (territory, edge, turn limit)
  - Updated CLAUDE.md with actual project information
  - Added README.md with player documentation

- **2025-11-16:** Initial CLAUDE.md created
  - Established document structure
  - Defined git workflow conventions
  - Created AI assistant guidelines

---

## Future Enhancements

**High Priority:**
- [ ] Implement full envelopment detection with flood-fill algorithm
- [ ] Add touch controls for mobile/tablet support
- [ ] Optimize performance for mobile browsers
- [ ] Add visual particle effects at conflict zones
- [ ] Implement sound effects and background music

**Medium Priority:**
- [ ] Add game mode variants (Blitz, Chaos)
- [ ] Create AI opponent with difficulty levels
- [ ] Implement save/load game state
- [ ] Add replay system to review past games
- [ ] Create statistics tracking (wins, average territory, etc.)
- [ ] Add zoom and pan controls for large displays

**Low Priority:**
- [ ] Online multiplayer with WebSocket
- [ ] Matchmaking and lobby system
- [ ] Leaderboards and rankings
- [ ] Custom frontline starting shapes
- [ ] Map editor for custom battlefields
- [ ] Team mode (2v2, etc.)
- [ ] Tournament bracket system

**Polish & QA:**
- [ ] Add unit tests for core calculations
- [ ] Set up ESLint and Prettier
- [ ] Add pre-commit hooks for code quality
- [ ] Create contribution guidelines
- [ ] Add license file
- [ ] Set up GitHub Pages deployment
- [ ] Add analytics to track player behavior

---

## Resources

### Documentation Links

- **Game Files:**
  - `index.html` - UI structure and layout
  - `styles.css` - Visual design and styling
  - `game.js` - Core game logic (~900 lines)
  - `README.md` - Player-facing documentation

### Related Repositories

None - this is a standalone project with no dependencies

### Useful References

**Canvas API:**
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Canvas Performance](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

**Mathematics:**
- [Gaussian Distribution](https://en.wikipedia.org/wiki/Gaussian_function)
- [Catmull-Rom Splines](https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline)
- [Curve Smoothing Algorithms](https://en.wikipedia.org/wiki/Smoothing_spline)

**Game Design:**
- Strategy game balance
- Turn-based mechanics
- Territory control systems

---

**Note to AI Assistants:** This document should be treated as the source of truth for working with this repository. When in doubt, refer to these guidelines. If you discover patterns or conventions not documented here, suggest updates to keep this file current and useful.
