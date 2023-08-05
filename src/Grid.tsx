import {
  BUFFER,
  container,
  VISIBLE_WIDTH,
  VISIBLE_HEIGHT,
  world,
} from "./Grid.css.ts";
import { useGameEngine } from "./store.ts";
import { Block } from "./Block.tsx";
import { Player } from "./Player.tsx";

const WIDTH = VISIBLE_WIDTH + BUFFER;
const HEIGHT = VISIBLE_HEIGHT + BUFFER;
const MAP_ARRAY = Array.from({ length: WIDTH * HEIGHT });

export const Grid = () => {
  const player = useGameEngine((s) => s.player);

  return (
    <>
      <div className={world}>
        <Player />

        <div className={container}>
          {MAP_ARRAY.map((_, i) => {
            const x = (i % WIDTH) + (player.x - VISIBLE_WIDTH / 2);
            const y = Math.floor(i / WIDTH) + (player.y - VISIBLE_HEIGHT / 2);

            const chunkX = Math.floor(x / 16) * 16;

            return <Block key={`${x}-${y}`} x={x} y={y} chunkX={chunkX} />;
          })}
        </div>
      </div>
    </>
  );
};
