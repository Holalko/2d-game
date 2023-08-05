import { inventoryCss, itemCss, selectedItem } from "./Inventory.css.ts";
import { useGameEngine } from "./store.ts";
import grassImg from "./assets/grass.png";
import dirtImg from "./assets/dirt.jpg";
import { useEffect } from "react";

export const Inventory = () => {
  const inventory = useGameEngine((s) => s.inventory);
  const index = useGameEngine((s) => s.inventoryIndex);
  const setInventoryIndex = useGameEngine((s) => s.inventoryActions.select);

  useEffect(() => {
    const listener = (event) => {
      const code = event.code;

      if (code.startsWith("Digit")) {
        const index = parseInt(code.replace("Digit", "")) - 1;
        setInventoryIndex(index);
      }
    };
    document.addEventListener("keydown", listener, false);
    return () => {
      document.removeEventListener("keydown", listener, false);
    };
  }, [setInventoryIndex]);

  return (
    <div className={inventoryCss}>
      {inventory.map((item, i) => (
        <div
          key={i}
          onClick={() => setInventoryIndex(i)}
          className={`${itemCss} ${index === i ? selectedItem : ""}`}
        >
            {item ? <><img src={item.type === "grass" ? grassImg : dirtImg} />

            <span>{item.count}</span></> : null}
        </div>
      ))}

    </div>
  );
};
