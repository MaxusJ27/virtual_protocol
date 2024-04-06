export const NEXT = 'NEXT';
export const PREV = 'PREV';

export type Direction = typeof PREV | typeof NEXT;

export type CarouselAction =
| { type: Direction, numItems: number }
| { type: 'updateNumber', numItems: number }
| { type: 'stopSliding' };