export default class Preload extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  preload() {
    this.load.image('tileset', './assets/gridtiles.png');
    this.load.tilemapTiledJSON('map', './assets/map.json');
    this.load.image('phaserguy', './assets/phaserguy.png');
  }

  create() {
    // add 2 buttons to start scene game o compare
    this.add
      .text(200, 200, 'Start Game', {
        fill: '#ffffff',
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('game');
      });

    this.add
      .text(200, 250, 'Compare Algorithms', {
        fill: '#ffffff',
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('compare');
      });
  }
}
