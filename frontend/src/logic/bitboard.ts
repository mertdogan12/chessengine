export type Bitboard = bigint;

/**
 * Count leading zeroes in a 64-bit integer
 *
 * @param bitboard the bitboard to count leading zeroes in
 * @returns leading zeroes
 */
const ctz64 = (bitboard: Bitboard): number => {
  const lo = Number(bitboard & 0xffffffffn);
  if (lo !== 0) return Math.clz32(lo) + 32;

  const hi = Number((bitboard >> 32n) & 0xffffffffn);
  return Math.clz32(hi);
};

/**
 * Get the least significant bit of a bitboard
 *
 * @param bb the bitboard to get the least significant bit from
 * @returns the least significant bit
 */
export const get_lastbit = (bb: Bitboard): Bitboard => bb & -bb;

/**
 * Get the x and y coordinates of the least significant bit in a bitboard
 *
 * @param bb the bitboard to get the coordinates from
 * @returns the x and y coordinates of the least significant bit
 */
export const get_xy = (bb: Bitboard): [number, number] => {
  const lastbit = get_lastbit(bb);

  const tailingZeros = ctz64(lastbit) ^ 63;

  const x = tailingZeros % 8;
  const y = Math.floor(tailingZeros / 8);

  return [x, y];
};

/**
 * Get the x and y coordinates of all the bits in a bitboard
 *
 * @param bb the bitboard to get the coordinates from
 * @returns an array of x and y coordinates
 */
export const get_xys = (bb: Bitboard): [number, number][] => {
  const xys: [number, number][] = [];
  let remaining = bb;

  while (remaining !== 0n) {
    xys.push(get_xy(remaining));
    remaining &= ~get_lastbit(remaining);
  }

  return xys;
};

/**
 * Get the bitboard representation of a position given its x and y coordinates
 *
 * @param x
 * @param y
 * @returns the bitboard representation of the position
 */
export const get_bitboard = (x: number, y: number): Bitboard =>
  1n << BigInt((y * 8 + x));
