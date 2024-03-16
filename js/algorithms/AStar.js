import { canUseAlgorithm } from '../helpers/utils.js';
import { Heap } from '../helpers/heap.js';
import { Instance } from '../helpers/instance.js';
import { Node } from '../helpers/node.js';
import PathFinder from './PathFinder.js';

export default class AStar extends PathFinder {
  STRAIGHT_COST = 1.0;
  DIAGONAL_COST = 0.1;
  CLOSED_LIST = 0;
  OPEN_LIST = 1;
  nextInstanceId = 1;

  constructor() {
    super();
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

  setTileCost(tileType, cost) {
    this.costMap[tileType] = cost;
  }

  setAditionalPointCost(x, y, cost) {
    if (!this.pointsToCost[y]) {
      this.pointsToCost[y] = {};
    }
    this.pointsToCost[y][x] = cost;
  }

  removeAditionalPointCost(x, y) {
    if (this.pointsToCost[y] && this.pointsToCost[y][x]) {
      delete this.pointsToCost[y][x];
    }
  }

  removeAllAdditionalPointCosts() {
    this.pointsToCost = {};
  }

  setDirectionalCondition(x, y, allowedDirections) {
    if (!this.directionalConditions[y]) {
      this.directionalConditions[y] = {};
    }
    this.directionalConditions[y][x] = allowedDirections;
  }

  removeAllDirectionalConditions() {
    this.directionalConditions = {};
  }

  setIterationsPerCalculation(iterations) {
    this.iterationsPerCalculation = iterations;
  }

  avoidAdditionalPoint(x, y) {
    if (this.pointsToAvoid[y] === undefined) {
      this.pointsToAvoid[y] = {};
    }
    this.pointsToAvoid[y][x] = 1;
  }

  stopAvoidingAdditionalPoint(x, y) {
    if (this.pointsToAvoid[y] && this.pointsToAvoid[y][x]) {
      delete this.pointsToAvoid[y][x];
    }
  }

  stopAvoidingAllAdditionalPoints() {
    this.pointsToAvoid = {};
  }

  findPath(startX, startY, endX, endY, callback) {
    const syncEnabled = this.syncEnabled;
    const callbackWrapper = function (result) {
      if (syncEnabled) {
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
        this.collisionGrid,
        startX,
        startY,
        endX,
        endY,
        callbackWrapper
      );
    } catch (error) {
      throw error;
    }

    // find path with A*
    const instance = new Instance();
    instance.openList = new Heap(function (nodeA, nodeB) {
      return nodeA.bestGuessDistance() - nodeB.bestGuessDistance();
    });
    instance.isDoneCalculating = false;
    instance.nodeHash = {};
    instance.startX = startX;
    instance.startY = startY;
    instance.endX = endX;
    instance.endY = endY;
    instance.callback = callbackWrapper;

    instance.openList.push(
      this.coordinateToNode(instance, startX, startY, null, this.STRAIGHT_COST)
    );

    const instanceId = this.nextInstanceId++;
    this.instances[instanceId] = instance;
    this.instanceQueue.push(instanceId);
    return instanceId;
  }

  coordinateToNode(instance, x, y, parent, cost) {
    if (instance.nodeHash[y] !== undefined) {
      if (instance.nodeHash[y][x] !== undefined) {
        return instance.nodeHash[y][x];
      }
    } else {
      instance.nodeHash[y] = {};
    }
    const simpleDistanceToTarget = this.getDistance(
      x,
      y,
      instance.endX,
      instance.endY
    );

    let costSoFar = 0;
    if (parent !== null) {
      costSoFar = parent.costSoFar + cost;
    }
    const node = new Node(parent, x, y, costSoFar, simpleDistanceToTarget);
    instance.nodeHash[y][x] = node;
    return node;
  }

  getDistance(x1, y1, x2, y2) {
    if (this.diagonalsEnabled) {
      // Octile distance
      const dx = Math.abs(x1 - x2);
      const dy = Math.abs(y1 - y2);
      if (dx < dy) {
        return this.DIAGONAL_COST * dx + dy;
      } else {
        return this.DIAGONAL_COST * dy + dx;
      }
    } else {
      // Manhattan distance
      const dx = Math.abs(x1 - x2);
      const dy = Math.abs(y1 - y2);
      return dx + dy;
    }
  }

  checkAdjacentNode(instance, searchNode, x, y, cost) {
    const adjacentCoordinateX = searchNode.x + x;
    const adjacentCoordinateY = searchNode.y + y;

    if (
      (this.pointsToAvoid[adjacentCoordinateY] === undefined ||
        this.pointsToAvoid[adjacentCoordinateY][adjacentCoordinateX] ===
          undefined) &&
      this.isTileWalkable(
        this.collisionGrid,
        this.acceptableTiles,
        adjacentCoordinateX,
        adjacentCoordinateY,
        searchNode
      )
    ) {
      const node = this.coordinateToNode(
        instance,
        adjacentCoordinateX,
        adjacentCoordinateY,
        searchNode,
        cost
      );

      if (node.list === undefined) {
        node.list = this.OPEN_LIST;
        instance.openList.push(node);
      } else if (searchNode.costSoFar + cost < node.costSoFar) {
        node.costSoFar = searchNode.costSoFar + cost;
        node.parent = searchNode;
        instance.openList.replace(node);
      }
    }
  }

  getTileCost(x, y) {
    return (
      (this.pointsToCost[y] && this.pointsToCost[y][x]) ||
      this.costMap[this.collisionGrid[y][x]]
    );
  }

  isTileWalkable(collisionGrid, acceptableTiles, x, y, sourceNode) {
    const directionalCondition =
      this.directionalConditions[y] && this.directionalConditions[y][x];
    if (directionalCondition) {
      const direction = calculateDirection(sourceNode.x - x, sourceNode.y - y);
      const directionIncluded = function () {
        for (let i = 0; i < directionalCondition.length; i++) {
          if (directionalCondition[i] === direction) return true;
        }
        return false;
      };
      if (!directionIncluded()) return false;
    }
    for (let i = 0; i < acceptableTiles.length; i++) {
      if (collisionGrid[y][x] === acceptableTiles[i]) {
        return true;
      }
    }

    return false;
  }

  calculate() {
    console.log('calculate');
    if (this.instanceQueue.length === 0) {
      return;
    }

    for (
      this.iterationsSoFar = 0;
      this.iterationsSoFar < this.iterationsPerCalculation;
      this.iterationsSoFar++
    ) {
      if (this.instanceQueue.length === 0) {
        return;
      }

      if (this.syncEnabled) {
        // If this is a sync instance, we want to make sure that it calculates synchronously.
        this.iterationsSoFar = 0;
      }

      const instanceId = this.instanceQueue[0];
      const instance = this.instances[instanceId];
      if (typeof instance == 'undefined') {
        // This instance was cancelled
        this.instanceQueue.shift();
        continue;
      }

      // Couldn't find a path.
      if (instance.openList.size() === 0) {
        instance.callback(null);
        delete this.instances[instanceId];
        this.instanceQueue.shift();
        continue;
      }

      const searchNode = instance.openList.pop();

      // Handles the case where we have found the destination
      if (instance.endX === searchNode.x && instance.endY === searchNode.y) {
        const path = [];
        path.push({ x: searchNode.x, y: searchNode.y });
        let parent = searchNode.parent;
        while (parent !== null) {
          path.push({ x: parent.x, y: parent.y });
          parent = parent.parent;
        }
        path.reverse();
        instance.callback(path);
        delete this.instances[instanceId];
        this.instanceQueue.shift();
        continue;
      }

      searchNode.list = this.CLOSED_LIST;

      if (searchNode.y > 0) {
        this.checkAdjacentNode(
          instance,
          searchNode,
          0,
          -1,
          this.STRAIGHT_COST * this.getTileCost(searchNode.x, searchNode.y - 1)
        );
      }
      if (searchNode.x < this.collisionGrid[0].length - 1) {
        this.checkAdjacentNode(
          instance,
          searchNode,
          1,
          0,
          this.STRAIGHT_COST * this.getTileCost(searchNode.x + 1, searchNode.y)
        );
      }
      if (searchNode.y < this.collisionGrid.length - 1) {
        this.checkAdjacentNode(
          instance,
          searchNode,
          0,
          1,
          this.STRAIGHT_COST * this.getTileCost(searchNode.x, searchNode.y + 1)
        );
      }
      if (searchNode.x > 0) {
        this.checkAdjacentNode(
          instance,
          searchNode,
          -1,
          0,
          this.STRAIGHT_COST * this.getTileCost(searchNode.x - 1, searchNode.y)
        );
      }
    }
  }
}
