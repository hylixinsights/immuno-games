// v is the texture coordinate from the top edge to the bottom edge, in tiles.
export function groundCenter(v) {
  const angle = 2 * Math.PI * v;
  return 0.5 + (58 * Math.sin(angle) + 20 * Math.sin(2 * angle)) / 768;
}
