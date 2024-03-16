import Preload from './js/scenes/Preload.js';
import Game from './js/scenes/Game.js';
import Compare from './js/scenes/Compare.js';

// Create a new Phaser config object
const config = {
  parent: 'game-container',
  type: Phaser.AUTO,
  width: 20 * 32,
  height: 20 * 32,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 20 * 32,
      height: 20 * 32,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  scene: [Preload, Game, Compare],
};

window.game = new Phaser.Game(config);
