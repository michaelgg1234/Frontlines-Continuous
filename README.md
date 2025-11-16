# Frontlines Continuous

A two-player turn-based strategy game where players deploy force vectors along a smooth, continuous battlefield frontline. Players draw attack arrows to allocate forces with Gaussian distribution effects, creating fluid and dynamic territorial changes.

![Game Status](https://img.shields.io/badge/status-playable-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## Features

### Core Gameplay
- **Continuous Battlefield**: 1600x900 pixel canvas with smooth, non-grid-based territory control
- **Dynamic Frontline**: Smooth Bezier curve that shifts based on force deployment
- **Gaussian Force Distribution**: Each force vector creates a realistic spread of influence
- **Turn-Based Strategy**: 30-second deployment phases for each player
- **Real-Time Combat Resolution**: Watch the frontline shift with smooth animations

### Game Mechanics
- **Force Pool**: 100 force points per turn per player
- **Multiple Vectors**: Deploy up to 5 arrows per turn
- **Force Allocation**: 1-25 force per arrow with visual feedback
- **Territory Control**: Real-time territory percentage tracking
- **Victory Conditions**:
  - Territory Domination (75%+)
  - Edge Elimination
  - Turn Limit (50 turns - highest territory wins)

### Visual Features
- Color-coded territories (Red vs Blue)
- Smooth frontline animations
- Gaussian distribution previews
- Force vector visualizations
- Real-time UI updates
- Victory screen with game statistics

## How to Play

### Setup
1. Open `index.html` in a modern web browser
2. The game starts with RED player's turn
3. The frontline begins as a vertical line in the center

### Deployment Phase (30 seconds)

1. **Click** on or near the white frontline
2. **Drag** away from the frontline to create a force vector (arrow)
   - Longer arrows = more force (max 25)
   - Arrow direction determines attack angle
   - A transparent circle shows the Gaussian effect radius
3. **Release** to place the arrow
4. Repeat up to 5 times or until force is depleted
5. **Confirm** deployment or wait for timer to expire

### Controls

**Mouse:**
- Click & Drag: Create force vectors
- Click Undo: Remove last arrow
- Click Clear: Remove all arrows
- Click Confirm: Finalize deployment

**UI Buttons:**
- **Undo Last Arrow**: Remove the most recent arrow and refund force
- **Clear All**: Remove all arrows and reset force pool
- **Confirm Deployment**: Lock in your moves and pass to next player/phase

### Combat Resolution

After both players deploy:
1. Force vectors from both sides appear simultaneously
2. Gaussian force fields overlay the battlefield
3. The frontline smoothly shifts based on net force calculations
4. Territory percentages update
5. Next turn begins with RED player

### Strategy Tips

1. **Concentration vs Spread**: Use one powerful arrow or spread force across multiple points
2. **Defensive Positions**: Deploy near your territory edge to stop enemy advances
3. **Breakthrough Attacks**: Focus force on weak points in the frontline
4. **Force Economy**: You don't need to use all 100 force - save some for defense
5. **Gaussian Overlap**: Multiple arrows near each other create stronger combined effects

## Technical Details

### Force Calculation
Each force vector uses a Gaussian distribution:
```
Effect at distance d = Force × e^(-(d²)/(2σ²))
```
Where:
- Force = magnitude of the vector (0-25)
- d = distance from arrow endpoint
- σ = 50 pixels (standard deviation)
- Effect radius = 150 pixels (3σ)

### Frontline Movement
```
Movement distance = k × |net force|^0.5
```
Where:
- k = 10 pixels per force unit^0.5
- Maximum movement = 100 pixels per turn at any point
- Net force = Red total - Blue total at each frontline point

### Smoothing Algorithm
- Catmull-Rom spline interpolation for smooth curves
- Moving average filter to prevent sharp angles
- C1 continuity maintained throughout

## File Structure

```
Frontlines-Continuous/
├── index.html          # Main game page
├── styles.css          # Visual styling and layout
├── game.js            # Game logic and rendering
├── README.md          # This file
└── CLAUDE.md          # AI assistant guidelines
```

## Browser Compatibility

**Recommended:**
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

**Requirements:**
- HTML5 Canvas support
- ES6 JavaScript support
- Modern CSS3 support

## Game Constants

You can modify these in `game.js` to customize gameplay:

```javascript
MAX_FORCE = 100                 // Force points per turn
MAX_FORCE_PER_ARROW = 25       // Max force per single arrow
MAX_ARROW_LENGTH = 200         // Max arrow length in pixels
MAX_ARROWS_PER_TURN = 5        // Max arrows per turn
GAUSSIAN_SIGMA = 50            // Gaussian spread (larger = wider effect)
MOVEMENT_CONSTANT = 10         // Frontline movement multiplier
MAX_MOVEMENT_PER_TURN = 100    // Max pixels frontline can move
TURN_TIME_LIMIT = 30           // Seconds per deployment phase
```

## Game Modes (Future)

Currently implemented: **Classic Mode**

Planned:
- **Blitz Mode**: 15 seconds per turn, 3 arrows max
- **Chaos Mode**: Increasing force pools and wider Gaussian spreads each turn

## Development

### Adding Features

1. Modify `game.js` for game logic
2. Update `styles.css` for visual changes
3. Adjust `index.html` for UI structure

### Key Classes and Functions

**GameState Class**: Manages all game state
- `initializeFrontline()`: Creates starting frontline
- `reset()`: Resets game to initial state

**Core Functions**:
- `resolveCombat()`: Calculates new frontline positions
- `getForceAtPoint()`: Computes Gaussian force at coordinates
- `calculateTerritory()`: Determines territory percentages
- `checkVictory()`: Evaluates win conditions

**Rendering**:
- `render()`: Main rendering loop
- `drawFrontline()`: Renders smooth frontline curve
- `drawForceVectors()`: Renders arrows
- `drawGaussianOverlays()`: Shows force distribution

## Performance

- Runs at 60 FPS on modern hardware
- Canvas-based rendering for optimal performance
- Efficient Gaussian calculations with radius limiting
- Smooth animations using requestAnimationFrame

## Known Limitations

1. **Envelopment**: Full pocket detection not yet implemented (planned feature)
2. **Self-Intersection**: Frontline prevented from crossing itself by design
3. **Mobile Support**: Touch controls not yet optimized (best on desktop)
4. **Multiplayer**: Currently local hot-seat only

## Credits

Created as a demonstration of continuous field-based strategy mechanics.

**Technologies Used:**
- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- CSS3

## License

This project is provided as-is for educational and entertainment purposes.

## Future Enhancements

- [ ] Touch/mobile controls
- [ ] Online multiplayer
- [ ] Replay system
- [ ] Sound effects and music
- [ ] Particle effects at conflict zones
- [ ] Multiple game modes
- [ ] AI opponent
- [ ] Save/load game state
- [ ] Statistics and leaderboards
- [ ] Zoom and pan controls
- [ ] Custom frontline shapes (not just vertical start)

## Contributing

To contribute:
1. Review `CLAUDE.md` for development guidelines
2. Test changes thoroughly
3. Ensure 60 FPS performance
4. Follow existing code style

## Version History

**1.0.0** (2025-11-16)
- Initial release
- Core gameplay implemented
- Gaussian force distribution
- Smooth frontline animations
- Territory tracking
- Victory conditions
- Turn timer system

---

**Enjoy commanding your forces on the Frontlines!**

For questions or issues, please refer to the repository documentation.
