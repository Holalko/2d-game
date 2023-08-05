import { style } from "@vanilla-extract/css";
import { TILE_SIZE, VISIBLE_WIDTH } from "./Grid.css.ts";

export const inventoryCss = style({
  marginTop: "20px",
  width: VISIBLE_WIDTH * TILE_SIZE * 0.66,
  border: "1px solid white",
  display: "grid",
  gridTemplateColumns: `repeat(10, 1fr)`,
});

export const selectedItem = style({
    border: "4px solid white !important",
})

export const itemCss = style({
  border: "1px solid white",
  aspectRatio: "1/1",
  padding: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  "> img": {
    width: "100%",
    height: "100%",
  },
  "> span": {
    position: "absolute",
    color: "white",
    fontSize: "32px",
  },
});
