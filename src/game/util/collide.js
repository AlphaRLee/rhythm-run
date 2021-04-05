import { edges } from "../Sprite";

// Check if sprite1 and sprite2 have collided
// Returns a boolean based on the collision
export const spriteCollide = (sprite1, sprite2) =>
  sprite1.left < sprite2.right &&
  sprite1.right > sprite2.left &&
  sprite1.top < sprite2.bottom &&
  sprite1.bottom > sprite2.top;

// Calculate which edge of sprite1 has collided with sprite2
// To get which edge sprite2 has collided with, use #opposite on the returned edge
export const collidedEdge = (sprite1, sprite2) => {
  const distances = [
    { edge: edges.NONE, dist: Infinity },
    { edge: edges.LEFT, dist: Math.abs(sprite1.left - sprite2.right) },
    { edge: edges.RIGHT, dist: Math.abs(sprite1.right - sprite2.left) },
    { edge: edges.TOP, dist: Math.abs(sprite1.top - sprite2.bottom) },
    { edge: edges.BOTTOM, dist: Math.abs(sprite1.bottom - sprite2.top) },
  ];

  return distances.reduce((nearestEntry, entry) => (entry.dist < nearestEntry.dist ? entry : nearestEntry)).edge;
};
