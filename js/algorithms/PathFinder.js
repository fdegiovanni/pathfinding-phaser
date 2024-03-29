export default class PathFinder {
  constructor() {
    this.syncEnabled = false;
    this.pointsToAvoid = {};
    this.collisionGrid = [];
    this.costMap = {};
    this.pointsToCost = {};
    this.directionalConditions = {};
    this.allowCornerCutting = true;
    this.iterationsSoFar = null;
    this.instances = {};
    this.instanceQueue = [];
    this.iterationsPerCalculation = Number.MAX_VALUE;
    this.acceptableTiles = [];
    this.diagonalsEnabled = false;
  }

  enableSync() {
    this.syncEnabled = true;
  }

  disableSync() {
    this.syncEnabled = false;
  }

  setAcceptableTiles(tiles) {
    if (tiles instanceof Array) {
      this.acceptableTiles = tiles;
    } else {
      if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
        this.acceptableTiles = [tiles];
      }
    }
  }

  enableDiagonals() {
    this.diagonalsEnabled = true;
  }

  disableDiagonals() {
    this.diagonalsEnabled = false;
  }

  setGrid(grid) {
    this.collisionGrid = grid;

    for (let y = 0; y < this.collisionGrid.length; y++) {
      for (let x = 0; x < this.collisionGrid[0].length; x++) {
        if (!this.costMap[this.collisionGrid[y][x]]) {
          this.costMap[this.collisionGrid[y][x]] = 1;
        }
      }
    }
  }

  findPath(startX, startY, endX, endY, callback) {
    console.log('PathFinder.findPath() is not implemented');
    console.log('startX', startX);
    console.log('startY', startY);
    console.log('endX', endX);
    console.log('endY', endY);
    console.log('callback', callback);
  }

  calculate() {
    console.log('calculate');
  }

  resumen(path) {
    console.log('resumen');
    const result = {
      path: path,
      iterations: this.iterationsSoFar,
      points: path.length,
      cost: this.getCostForPath(path),
    };

    return result;
  }

  getCostForPath(path) {
    let totalCost = 0;
    for (let i = 0; i < path.length; i++) {
      totalCost += this.getTileCost(path[i].x, path[i].y);
    }
    return totalCost;
  }

  getTileCost(x, y) {
    if (this.collisionGrid.length > 0) {
      return (
        (this.pointsToCost[y] && this.pointsToCost[y][x]) ||
        this.costMap[this.collisionGrid[y][x]]
      );
    } else {
      return 1;
    }
  }
}
