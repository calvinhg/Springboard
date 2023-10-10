import React from "react";
import "./Pokedex.css";
import Pokecard from "./Pokecard";

const Pokedex = ({ pokelist }) => (
  <div className="Pokedex">
    <h1 className="Pokedex-h1">Pokedex</h1>
    <div className="Pokedex-list">
      {pokelist.map((p) => (
        <Pokecard pokecard={p} key={p.id} />
      ))}
    </div>
  </div>
);

export default Pokedex;
