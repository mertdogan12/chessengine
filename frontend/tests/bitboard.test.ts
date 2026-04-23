import { expect, test } from 'vitest';
import { get_lastbit, get_xy, get_xys, get_bitboard } from '../src/bitboard';

test("get_lastbit returns the last set bit", () => 
    expect(get_lastbit(0b0101n)).toEqual(BigInt(0b0001n)));

test("get_xy returns the correct coordinates", () => 
  expect(get_xy(0b00100000_00000000n)).toEqual([2, 1] as [number, number]));

test("get_xys returns the correct coordinates", () => 
    expect(get_xys(0b00100000_00000100n)).toEqual([[5, 0], [2, 1]] as [number, number][]));
    
test("get_bitboard returns the correct bitboard", () => 
    expect(get_bitboard(2, 1)).toEqual(0b00100000_00000000n));