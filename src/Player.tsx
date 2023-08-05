import { player as playerStyle, playerX, playerY } from "./Block.css.ts";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { TILE_SIZE } from "./Grid.css.ts";

import Run1 from "./assets/Run-1.png";
import Run2 from "./assets/Run-2.png";
import Run3 from "./assets/Run-3.png";
import Run4 from "./assets/Run-4.png";
import Run5 from "./assets/Run-5.png";
import Run6 from "./assets/Run-6.png";
import Run7 from "./assets/Run-7.png";
import Run8 from "./assets/Run-8.png";
import Run9 from "./assets/Run-9.png";
import Run10 from "./assets/Run-10.png";
import Run11 from "./assets/Run-11.png";
import Run12 from "./assets/Run-12.png";
import Run13 from "./assets/Run-13.png";
import Run14 from "./assets/Run-14.png";
import Run15 from "./assets/Run-15.png";
import { useGameEngine } from "./store.ts";
import { useEffect, useRef, useState } from "react";

const runSprites = [
  Run1,
  Run2,
  Run3,
  Run4,
  Run5,
  Run6,
  Run7,
  Run8,
  Run9,
  Run10,
  Run11,
  Run12,
  Run13,
  Run14,
  Run15,
];

export const Player = () => {
  const runIdx = useRef(0);
  const [sprite, setSprite] = useState(runSprites[runIdx.current]);
  const [rotate, setRotate] = useState(false);
  const movePlayer = useGameEngine((s) => s.playerActions.move);

  useEffect(() => {
    const listener = (event) => {
      const code = event.code;

      if (
        code === "KeyW" ||
        code === "KeyS" ||
        code === "KeyA" ||
        code === "KeyD"
      ) {
        runIdx.current = (runIdx.current + 1) % runSprites.length;
        setSprite(runSprites[runIdx.current]);
      }

      if (code === "KeyA") {
        movePlayer(-1, 0);
        setRotate(true);
      } else if (code === "KeyD") {
        movePlayer(1, 0);
        setRotate(false);
      }
    };
    document.addEventListener("keydown", listener, false);
    return () => {
      document.removeEventListener("keydown", listener, false);
    };
  }, [movePlayer]);

  return (
    <img
      src={sprite}
      className={playerStyle}
      style={{
        scale: rotate ? "-1 1" : "1 1",
        translate: rotate ? "-50% 0" : "-50% 0",
        marginLeft: rotate ? String(-TILE_SIZE) + "px" : "0px",
      }}
    />
  );
};
