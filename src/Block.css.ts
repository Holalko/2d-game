import {createVar, keyframes, style} from '@vanilla-extract/css';


const breakingAnimation = keyframes({
    "0%": { transform: "translate(0, 0) rotate(0deg)" },
    "25%": { transform: "translate(3px, 3px) rotate(2deg)" },
    "50%": { transform: "translate(0, 0) rotate(0eg)" },
    "75%": { transform: "translate(-3px, 3px) rotate(-2deg)" },
    "100%": { transform: "translate(0, 0) rotate(0deg)" },
});

export const blockBreaking = style({
  animationName: breakingAnimation,
    animationDuration: '250ms',
    animationIterationCount: 'infinite',
})


export const block = style({
    objectFit: 'cover',
    width: '100%',
    height: '100%',


});

export const blockInDistanceStyle = style({
    ":hover": {
        filter: 'brightness(1.2)',
        cursor: 'pointer'
    }
})


export const playerX = createVar()
export const playerY = createVar()

export const player = style({
    position: 'absolute',
    marginBottom: '-6px',
    width: 32,
    height: 48,
    left: '50%',
    bottom: '50%',
    pointerEvents: 'none',
})