export class Node {
  constructor(parent, x, y, costSoFar, simpleDistanceToTarget) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.costSoFar = costSoFar;
    this.simpleDistanceToTarget = simpleDistanceToTarget;

    /**
     * @return {Number} Best guess distance of a cost using this node.
     **/
    this.bestGuessDistance = function () {
      return this.costSoFar + this.simpleDistanceToTarget;
    };
  }
}
