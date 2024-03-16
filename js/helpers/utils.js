const canUseAlgorithm = (
  acceptableTiles,
  grid,
  fromX,
  fromY,
  toX,
  toY,
  callbackWrapper
) => {
  // no acceptable tiles were set
  if (!acceptableTiles || acceptableTiles.length === 0) {
    throw new Error(
      "You can't set a path without first calling setAcceptableTiles()"
    );
  }
  // No grid was set
  if (!grid || grid.length === 0) {
    throw new Error("You can't set a path without first calling setGrid()");
  }
  // Start or endpoint outside of scope
  if (
    fromX < 0 ||
    fromY < 0 ||
    toX < 0 ||
    toY < 0 ||
    fromX >= grid[0].length ||
    fromY >= grid.length ||
    toX >= grid[0].length ||
    toY >= grid.length
  ) {
    throw new Error(
      'Your start or end point is outside the scope of your grid'
    );
  }
  // Start and end are the same
  if (fromX === toX && fromY === toY) {
    callbackWrapper([]);
    return;
  }
  // End point is not an acceptable tile
  if (!acceptableTiles.includes(grid[toY][toX])) {
    callbackWrapper(null);
    return;
  }
};

const getColor = (algorithm) => {
  const colors = {
    breadthfirst: 0xff0000,
    depthfirst: 0x00ff00,
    dijkstra: 0x0000ff,
    astar: 0xffff00,
  };
  return colors[algorithm];
};

export { canUseAlgorithm, getColor };
