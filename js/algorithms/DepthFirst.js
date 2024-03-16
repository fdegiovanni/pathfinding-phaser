import { Node } from '../helpers/node.js';
import { Instance } from '../helpers/instance.js';
import { canUseAlgorithm } from '../helpers/utils.js';
import PathFinder from './PathFinder.js';

export default class DepthFirst extends PathFinder {
  constructor() {
    super();
  }

  setGrid(map) {
    this.grid = [];
    for (let y = 0; y < map.length; y++) {
      var col = [];
      for (let x = 0; x < map[0].length; x++) {
        col.push(map[y][x]);
      }
      this.grid.push(col);
    }
  }

  findPath(fromX, fromY, toX, toY, callback) {
    const callbackWrapper = (result) => {
      if (this.syncEnabled) {
        callback(result);
      } else {
        setTimeout(() => {
          callback(result);
        }, 0);
      }
    };

    try {
      canUseAlgorithm(
        this.acceptableTiles,
        this.grid,
        fromX,
        fromY,
        toX,
        toY,
        callbackWrapper
      );
    } catch (error) {
      throw error;
    }

    // find path with depth first
    const instance = new Instance();
    instance.startX = fromX;
    instance.startY = fromY;
    instance.endX = toX;
    instance.endY = toY;
    instance.callback = callbackWrapper;
    instance.grid = this.grid;
    instance.acceptableTiles = this.acceptableTiles;
    instance.nodeHash = {};
    instance.pointsToAvoid = {};

    this._checkNeighbors(instance, instance.startX, instance.startY);

    return;
  }

  getNeighbors(node, map) {
    const neighbors = [];
    const x = node.x;
    const y = node.y;

    if (map[y - 1] && this.acceptableTiles.includes(map[y - 1][x])) {
      neighbors.push({ x, y: y - 1 });
    }
    if (map[y + 1] && this.acceptableTiles.includes(map[y + 1][x])) {
      neighbors.push({ x, y: y + 1 });
    }
    if (this.acceptableTiles.includes(map[y][x - 1])) {
      neighbors.push({ x: x - 1, y });
    }
    if (this.acceptableTiles.includes(map[y][x + 1])) {
      neighbors.push({ x: x + 1, y });
    }

    return neighbors;
  }

  _backtrace(node) {
    const path = [node];
    while (node.parent) {
      node = node.parent;
      path.push(node);
    }
    return path.reverse();
  }

  _checkNeighbors(instance, x, y) {
    const map = instance.grid;
    const neighbors = this.getNeighbors({ x, y }, map);
    for (const neighbor of neighbors) {
      const node = new Node(
        null,
        neighbor.x,
        neighbor.y,
        0,
        Math.abs(neighbor.x - instance.endX) +
          Math.abs(neighbor.y - instance.endY)
      );
      if (instance.nodeHash[`${node.x},${node.y}`]) {
        continue;
      }
      instance.nodeHash[`${node.x},${node.y}`] = node;
      node.parent = instance.nodeHash[`${x},${y}`];
      if (node.x === instance.endX && node.y === instance.endY) {
        const path = this._backtrace(node);
        instance.callback(path);
        return;
      }
      this._checkNeighbors(instance, node.x, node.y); // Depth First
    }
    instance.callback(null); // No path found
  }
}
