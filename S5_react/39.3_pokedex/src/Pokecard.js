import React from "react";
import "./Pokecard.css";

const Pokecard = ({ pokecard: p }) => {
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
  return (
    <div className="Pokecard" id={`pokecard-${p.id}`}>
      <h3 className="Pokecard-name">{p.name}</h3>
      <img className="Pokecard-img" src={img} alt={p.name} />
      <div className="Pokecard-info">
        <p>Type: {p.type}</p>
        <p>EXP: {p.base_experience}</p>
      </div>
    </div>
  );
};

export default Pokecard;
