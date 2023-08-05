import { Grid } from "./Grid.tsx";
import {body} from "./Grid.css.ts";
import {Inventory} from "./Inventory.tsx";

function App() {
  return <div className={body}>
    <Grid />
    <Inventory />
  </div>;
}

export default App;
