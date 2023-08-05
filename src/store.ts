import { create } from "zustand";

type Chunk = Array<
  Array<{
    type: "grass" | "dirt";
    x: number;
    y: number;
  } | null>
>;

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const transpose = (matrix: any[][]) => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};

const generateChunk = (chunkX: number, size = 16): Chunk => {
  const height = size * 3;
  let nextY = 0;

  const grid = [];

  for (let i = -16; i < height; i++) {
    const column = Array.from({ length: height }, (_v, idx) => {
      if (idx === nextY) {
        return { type: "grass", x: chunkX + i, y: idx };
      } else if (idx > nextY) {
        return { type: "dirt", x: chunkX + i, y: idx };
      }

      return null;
    });

    grid.push(column);
    nextY = Math.max(0, nextY + random(-1, 1));
  }

  return transpose(grid);
};

const DEFAULT_CHUNKS: Record<string, Chunk> = {
  "-32": structuredClone(generateChunk(-32)),
  "-16": structuredClone(generateChunk(-16)),
  "0": structuredClone(generateChunk(0)),
  "16": structuredClone(generateChunk(16)),
  "32": structuredClone(generateChunk(32)),
};

type GameEngine = {
  chunks: typeof DEFAULT_CHUNKS;
  player: {
    x: number;
    y: number;
  };
  inventory: Array<{ type: "grass" | "dirt"; count: number } | null>;
  inventoryIndex: number;
  actions: {
    getChunk: (x: number) => Chunk;
    getTileInChunk: (
      chunkX: number,
      tileX: number,
      tileY: number,
    ) => Chunk[0][0] | null;
    breakTile: (chunkX: number, tileX: number, tileY: number) => void;
    putTile: (
      chunkX: number,
      tileX: number,
      tileY: number,
      type: "grass" | "dirt",
    ) => void;
    isTooFarFromPlayer: (tileX: number, tileY: number) => boolean;
  };
  playerActions: {
    move: (deltaX: number, deltaY: number) => void;
  };
  inventoryActions: {
    select: (index: number) => void;
  };
};

const getInChunk = (chunk: Chunk, x: number, y: number) => {
  for (let foundY = 0; foundY < chunk.length; foundY++) {
    for (let foundX = 0; foundX < chunk[foundY].length; foundX++) {
      const tile = chunk[foundY][foundX];

      if (tile && tile.x === x && tile.y === y) {
        return [tile, foundX, foundY] as const;
      }
    }
  }
  return [];
};

const getFirstSolidTile = (chunk: Chunk) => {
  for (let foundY = 0; foundY < chunk.length; foundY++) {
    for (let foundX = 0; foundX < chunk[foundY].length; foundX++) {
      const tile = chunk[foundY][foundX];

      if (tile) {
        return [tile, tile.x, tile.y] as const;
      }
    }
  }
  return [];
};

const [, playerX, playerY] = getFirstSolidTile(DEFAULT_CHUNKS["0"]);

export const useGameEngine = create<GameEngine>((set, get) => ({
  chunks: DEFAULT_CHUNKS,
  player: {
    x: playerX,
    y: playerY,
  },
  inventory: Array.from({ length: 10 }, () => null),
  inventoryIndex: 0,
  inventoryActions: {
    select: (index) => {
      set({ inventoryIndex: index });
    },
  },
  playerActions: {
    move: (deltaX) => {
      const { x, y } = get().player;

      const futureX =
        deltaX > 0 ? Math.ceil(x + deltaX) : Math.floor(x + deltaX);
      const futureXChunk = Math.floor(futureX / 16) * 16;

      const tileOnNextStep = get().actions.getTileInChunk(
        futureXChunk,
        futureX,
        y,
      );
      if (tileOnNextStep) {
        const tileAboveNextStep = get().actions.getTileInChunk(
          futureXChunk,
          futureX,
          y - 1,
        );
        if (!tileAboveNextStep) {
          set({ player: { x: x + deltaX, y: y - 1 } });
        }
        return;
      }

      const getDepth = (y: number, depth = 0): number => {
        const tileUnderNextStep = get().actions.getTileInChunk(
          futureXChunk,
          futureX,
          y + 1,
        );

        if (tileUnderNextStep) {
          return depth;
        }
        return getDepth(y + 1, depth + 1);
      };

      const depth = getDepth(y);

      set({ player: { x: x + deltaX, y: y + depth } });
    },
  },
  actions: {
    isTooFarFromPlayer: (tileX, tileY) => {
        const { x, y } = get().player;
        return Math.abs(tileX - x) > 4 || Math.abs(tileY - y) > 4;
    },
    getChunk: (x) => {
      const key = `${x}` as keyof typeof DEFAULT_CHUNKS;
      const chunk = get().chunks[key];

      if (chunk) {
        return chunk;
      }

      const newChunk = generateChunk(x);
      set({ chunks: { ...get().chunks, [key]: newChunk } });
      return newChunk;
    },
    getTileInChunk: (chunkX, tileX, tileY) => {
      const chunk = get().actions.getChunk(chunkX);

      if (!chunk) return null;

      const [current] = getInChunk(chunk, tileX, tileY);
      if (!current) {
        return null;
      }

      return current;
    },
    breakTile: (chunkX, tileX, tileY) => {
      if(get().actions.isTooFarFromPlayer(tileX, tileY)) return;
      const chunk = get().actions.getChunk(chunkX);

      if (!chunk) return null;

      const [current, idxX, idxY] = getInChunk(chunk, tileX, tileY);

      if (!current) return;

      chunk[idxY][idxX] = null;
      set({ chunks: { ...get().chunks, [`${chunkX}`]: chunk } });

      const inventory = get().inventory;
      const inventoryItemIdx = inventory.findIndex(
        (item) => item?.type === current.type,
      );
      if (inventoryItemIdx >= 0) {
        set({
          inventory: [
            ...inventory.slice(0, inventoryItemIdx),
            {
              type: current.type,
              count: inventory[inventoryItemIdx]!.count + 1,
            },
            ...inventory.slice(inventoryItemIdx + 1),
          ],
        });
      } else {
        const firstNullIdx = inventory.findIndex((item) => item === null);
        if (firstNullIdx >= 0) {
          set({
            inventory: [
              ...inventory.slice(0, firstNullIdx),
              { type: current.type, count: 1 },
              ...inventory.slice(firstNullIdx + 1),
            ],
          });
          return;
        }
      }

      return current;
    },
    putTile: (chunkX, tileX, tileY) => {
      if(get().actions.isTooFarFromPlayer(tileX, tileY)) return;

      const { inventory, inventoryIndex } = get();
      const inventoryItem = inventory[inventoryIndex];

      if (!inventoryItem || inventoryItem.count <= 0) {
        return;
      }

      const chunk = get().actions.getChunk(chunkX);

      if (!chunk) return null;

      const [current, idxX, idxY] = getInChunk(chunk, tileX, tileY);

      if (current) return;

      const oneBlockToTheLeft = tileX - 1;
      const chunkToTheLeft = Math.floor(oneBlockToTheLeft / 16) * 16;

      const tileUnderNextStepToTheLeft = get().actions.getTileInChunk(
        chunkToTheLeft,
        oneBlockToTheLeft,
        tileY,
      );

      const oneBlockToTheRight = tileX + 1;
      const chunkToTheRight = Math.floor(oneBlockToTheRight / 16) * 16;

      const tileUnderNextStepToTheRight = get().actions.getTileInChunk(
        chunkToTheRight,
        oneBlockToTheRight,
        tileY,
      );

      const tileUnderNextStep = get().actions.getTileInChunk(
        chunkX,
        tileX,
        tileY + 1,
      );

      // dont allow placing blocks in the air
      if (
        !tileUnderNextStep &&
        !tileUnderNextStepToTheLeft &&
        !tileUnderNextStepToTheRight
      ) {
        return;
      }

      if (!chunk[idxY]) {
        chunk.push([]);
        chunk[chunk.length - 1].push({
          type: inventoryItem.type,
          x: tileX,
          y: tileY,
        });
      } else if (!chunk[idxY][idxX]) {
        chunk[idxY].push({ type: inventoryItem.type, x: tileX, y: tileY });
      } else {
        chunk[idxY][idxX] = { type: inventoryItem.type, x: tileX, y: tileY };
      }

      set({ chunks: { ...get().chunks, [`${chunkX}`]: chunk } });
      set({
        inventory: [
          ...inventory.slice(0, inventoryIndex),
          {
            type: inventoryItem.type,
            count: inventory[inventoryIndex]!.count - 1,
          },
          ...inventory.slice(inventoryIndex + 1),
        ].map((item) => (item?.count === 0 ? null : item)),
      });
    },
  },
}));
