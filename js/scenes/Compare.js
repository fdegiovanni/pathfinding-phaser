import AStar from '../algorithms/AStar.js';
import BreadthFirst from '../algorithms/BreadthFirst.js';
import DepthFirst from '../algorithms/DepthFirst.js';
import Dijkstra from '../algorithms/Dijkstra.js';
import { getColor } from '../helpers/utils.js';

export default class Compare extends Phaser.Scene {
  constructor() {
    super('compare');
  }

  create() {
    document.getElementById('algorithm').remove();
    this.camera = this.cameras.main.setBounds(0, 0, 20 * 32, 20 * 32);

    this.playerBreadthFirst = this.add
      .image(32, 32, 'phaserguy')
      .setDepth(1)
      .setOrigin(0, 0.5)
      .setTint(getColor('breadthfirst'));

    this.playerDepthFirst = this.add
      .image(32, 32, 'phaserguy')
      .setDepth(1)
      .setOrigin(0, 0.5)
      .setTint(getColor('depthfirst'));

    this.playerDijkstra = this.add
      .image(32, 32, 'phaserguy')
      .setDepth(1)
      .setOrigin(0, 0.5)
      .setTint(getColor('dijkstra'));

    this.playerAStar = this.add
      .image(32, 32, 'phaserguy')
      .setDepth(1)
      .setOrigin(0, 0.5)
      .setTint(getColor('astar'));

    // Display map
    this.map = this.make.tilemap({ key: 'map' });
    this.tiles = this.map.addTilesetImage('tiles', 'tileset');

    this.map.createLayer('ground', this.tiles, 0, 0);

    // Marker that will follow the mouse
    this.marker = this.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);

    // Pathfinding - setup node grid
    this.grid = [];
    for (let y = 0; y < this.map.height; y++) {
      var col = [];
      for (let x = 0; x < this.map.width; x++) {
        col.push(this.getTileID(x, y));
      }
      this.grid.push(col);
    }

    const tileset = this.map.tilesets[0];
    const properties = tileset.tileProperties;
    this.acceptableTiles = [];

    for (let i = tileset.firstgid - 1; i < this.tiles.total; i++) {
      if (!properties.hasOwnProperty(i)) {
        this.acceptableTiles.push(i + 1);
        continue;
      }
      if (!properties[i].collide) this.acceptableTiles.push(i + 1);
    }

    console.log('acceptableTiles:', this.acceptableTiles);
    console.log('grid:', this.grid);

    this.input.on('pointerup', this.handleClick, this);
  }

  update() {
    var worldPoint = this.input.activePointer.positionToCamera(
      this.cameras.main
    );

    // Rounds down to nearest tile
    var pointerTileX = this.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.map.worldToTileY(worldPoint.y);
    this.marker.x = this.map.tileToWorldX(pointerTileX);
    this.marker.y = this.map.tileToWorldY(pointerTileY);
    this.marker.setVisible(!this.checkCollision(pointerTileX, pointerTileY));
  }

  handleClick(pointer) {
    const x = this.camera.scrollX + pointer.x;
    const y = this.camera.scrollY + pointer.y;
    const toX = Math.floor(x / 32);
    const toY = Math.floor(y / 32);
    const fromX = Math.floor(this.playerAStar.x / 32);
    const fromY = Math.floor(this.playerAStar.y / 32);
    console.log(
      'going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')'
    );

    this.getPath(fromX, fromY, toX, toY);
  }

  checkCollision(x, y) {
    const tile = this.map.getTileAt(x, y);
    return tile?.properties?.collide == true;
  }

  moveCharacter(path, player) {
    const tweens = [];
    for (let i = 0; i < path.length - 1; i++) {
      const ex = path[i + 1].x;
      const ey = path[i + 1].y;
      tweens.push({
        targets: player,
        x: { value: ex * this.map.tileWidth, duration: 200 },
        y: { value: ey * this.map.tileHeight, duration: 200 },
      });
    }

    this.tweens.chain({
      tweens: tweens,
    });
  }

  getTileID(x, y) {
    const tile = this.map.getTileAt(x, y);
    return tile.index;
  }

  addInformation(finder) {
    const tileset = this.map.tilesets[0];
    const properties = tileset.tileProperties;

    for (let i = tileset.firstgid - 1; i < this.tiles.total; i++) {
      if (properties[i]?.cost) {
        finder.setTileCost(i + 1, properties[i].cost); // If there is a cost attached to the tile, let's register it
      }
    }
  }

  getPath(fromX, fromY, toX, toY) {
    this.getPathBreadthFirst(fromX, fromY, toX, toY);
    this.getPathDepthFirst(fromX, fromY, toX, toY);
    this.getPathDijkstra(fromX, fromY, toX, toY);
    this.getPathAStar(fromX, fromY, toX, toY);
  }

  getPathBreadthFirst(fromX, fromY, toX, toY) {
    const color = getColor('breadthfirst');
    const breadthFirst = new BreadthFirst();
    breadthFirst.setGrid(this.grid);
    breadthFirst.setAcceptableTiles(this.acceptableTiles);
    breadthFirst.findPath(fromX, fromY, toX, toY, (path) => {
      if (path === null) {
        console.warn('Path was not found.');
      } else {
        console.log(path);
        this.moveCharacter(path, this.playerBreadthFirst);
        this.pathLayerBreadthFirst?.destroy(true, true);
        this.pathLayerBreadthFirst = this.add.group();
        this.fillPath(path, color, this.pathLayerBreadthFirst);
      }
    });
    breadthFirst.calculate();
  }

  getPathDepthFirst(fromX, fromY, toX, toY) {
    const color = getColor('depthfirst');
    const depthFirst = new DepthFirst();
    depthFirst.setGrid(this.grid);
    depthFirst.setAcceptableTiles(this.acceptableTiles);
    depthFirst.findPath(fromX, fromY, toX, toY, (path) => {
      if (path === null) {
        console.warn('Path was not found.');
      } else {
        console.log(path);
        this.moveCharacter(path, this.playerDepthFirst);
        this.pathLayerDepthFirst?.destroy(true, true);
        this.pathLayerDepthFirst = this.add.group();
        this.fillPath(path, color, this.pathLayerDepthFirst);
      }
    });
    depthFirst.calculate();
  }

  getPathDijkstra(fromX, fromY, toX, toY) {
    const color = getColor('dijkstra');
    const dijkstra = new Dijkstra();
    dijkstra.setGrid(this.grid);
    dijkstra.setAcceptableTiles(this.acceptableTiles);
    dijkstra.findPath(fromX, fromY, toX, toY, (path) => {
      if (path === null) {
        console.warn('Path was not found.');
      } else {
        console.log(path);
        this.moveCharacter(path, this.playerDijkstra);
        this.pathLayerDijkstra?.destroy(true, true);
        this.pathLayerDijkstra = this.add.group();
        this.fillPath(path, color, this.pathLayerDijkstra);
      }
    });
    dijkstra.calculate();
  }

  getPathAStar(fromX, fromY, toX, toY) {
    const color = getColor('astar');
    const aStar = new AStar();
    aStar.setGrid(this.grid);
    aStar.setAcceptableTiles(this.acceptableTiles);
    aStar.enableDiagonals();
    this.addInformation(aStar);
    aStar.findPath(fromX, fromY, toX, toY, (path) => {
      if (path === null) {
        console.warn('Path was not found.');
      } else {
        console.log(path);
        this.moveCharacter(path, this.playerAStar);
        this.pathLayerAStar?.destroy(true, true);
        this.pathLayerAStar = this.add.group();
        this.fillPath(path, color, this.pathLayerAStar);
      }
    });
    aStar.calculate();
  }

  fillPath(path, color, pathLayer) {
    let pathIndex = 0;

    path.forEach((tile) => {
      const tileX = tile.x * this.map.tileWidth;
      const tileY = tile.y * this.map.tileHeight;

      const rect = this.add.rectangle(
        tileX + this.map.tileWidth / 2,
        tileY + this.map.tileHeight / 2,
        this.map.tileWidth,
        this.map.tileHeight,
        color,
        0.5
      );

      const number = this.add
        .text(
          tileX + this.map.tileWidth / 2,
          tileY + this.map.tileHeight / 2,
          pathIndex,
          {
            fontSize: '10px',
            fill: '#000',
          }
        )
        .setOrigin(0.5, 0.5);

      pathLayer.add(number);
      pathLayer.add(rect);
      pathIndex++;
    });
  }
}
