// A minimal sprite class loosely inspired by Pygame implementation of sprites
class Sprite {
  constructor({ game, x, y, width, height }) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }
}

export default Sprite;

// Edges enum
function createEdges() {
  const edges = {
    NONE: { name: "NONE" },
    LEFT: { name: "LEFT" },
    RIGHT: { name: "RIGHT" },
    TOP: { name: "TOP" },
    BOTTOM: { name: "BOTTOM" },
  };
  edges.NONE.opposite = edges.NONE;
  edges.LEFT.opposite = edges.RIGHT;
  edges.RIGHT.opposite = edges.LEFT;
  edges.TOP.opposite = edges.BOTTOM;
  edges.BOTTOM.opposite = edges.TOP;
  return edges;
}

export const edges = createEdges();
