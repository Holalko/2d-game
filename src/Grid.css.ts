import { style } from '@vanilla-extract/css';

export const TILE_SIZE = 16;
export const VISIBLE_WIDTH = 48;
export const VISIBLE_HEIGHT = 20;
export const BUFFER = 2;

export const container = style({
    width: (VISIBLE_WIDTH + BUFFER) * TILE_SIZE,
    height: (VISIBLE_HEIGHT + BUFFER) * TILE_SIZE,
    display: 'grid',
    gridTemplateColumns: `repeat(${VISIBLE_WIDTH + BUFFER}, 1fr)`,
    gridTemplateRows: `repeat(${VISIBLE_HEIGHT + BUFFER}, 1fr)`,
    marginLeft: -(BUFFER / 2) * TILE_SIZE,
    marginTop: -(BUFFER / 2) * TILE_SIZE,
    background: 'black'
});

export const world = style({
    width: VISIBLE_WIDTH * TILE_SIZE,
    height: VISIBLE_HEIGHT * TILE_SIZE,
    position: 'relative',
    overflow: 'hidden',
})

export const body = style({
    margin: 0,
    padding: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'black',
})