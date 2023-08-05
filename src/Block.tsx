import { useGameEngine } from "./store.ts";

import dirtImg from "./assets/dirt.jpg";
import dirtBreakingImg from "./assets/dirt-breaking.jpg";
import grassImg from "./assets/grass.png";
import {block as blockStyle, blockBreaking, blockInDistanceStyle} from "./Block.css.ts";
import { memo, useCallback, useRef, useState } from "react";

type Props = {
  x: number;
  y: number;
  chunkX: number;
};

export const Block = memo(({ y, x, chunkX }: Props) => {
  const breakingTimeout = useRef<number | null>(null);
  const [breaking, setBreaking] = useState(false);
  const block = useGameEngine((s) => s.actions.getTileInChunk(chunkX, x, y));
  const isInPlayerDistance = useGameEngine((s) => !s.actions.isTooFarFromPlayer(x, y));

  const breakTile = useGameEngine((s) => s.actions.breakTile);
  const putTile = useGameEngine((s) => s.actions.putTile);

  const onImgMouseUp = useCallback(() => {
    if (breakingTimeout.current) {
      clearTimeout(breakingTimeout.current);
    }
    setBreaking(false);
  }, []);

  const breakCurrentTile = () => {
    breakTile(chunkX, x, y);
  };

  const putDirt = () => {
    putTile(chunkX, x, y, "dirt");
  };

  if (!block) {
    return (
      <div
        data-test={`${x}-${y}`}
        data-chunk={`${chunkX}`}
        onClick={putDirt}
        style={{ background: "darkblue" }}
        className={`${blockStyle} ${isInPlayerDistance ? blockInDistanceStyle : ''}`}
      />
    );
  }

  return (
    <img
      data-test={`${x}-${y}`}
      data-chunk={`${chunkX}`}
      onMouseDown={() => {
        breakingTimeout.current = setTimeout(breakCurrentTile, 500);
        setBreaking(true);
      }}
      onMouseUp={onImgMouseUp}
      onMouseLeave={onImgMouseUp}
      src={block.type === "grass" ? grassImg : breaking ? dirtBreakingImg : dirtImg}
      className={`${blockStyle} ${isInPlayerDistance ? blockInDistanceStyle : ''} ${breaking ? blockBreaking : ""}`}
    />
  );
});
