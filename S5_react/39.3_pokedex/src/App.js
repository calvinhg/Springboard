import Pokedex from "./Pokedex";
import pokelist from "./pokelist";

const App = () => (
  <div className="App">
    <Pokedex pokelist={pokelist} />
  </div>
);

export default App;
