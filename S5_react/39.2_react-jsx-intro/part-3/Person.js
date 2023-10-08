const Person = ({ name, age, hobbies }) => (
  <div className="Person">
    <p>Learn some info about this person</p>
    <ul>
      <li>Name: {name}</li>
      <li>Age: {age}</li>
    </ul>

    <h3>{age < 18 ? "Don't worry about it" : "NOoo You MUsT Go VOTe"}</h3>

    <h4>Hobbies</h4>
    <p>
      {hobbies.map((h) => (
        <li>{h}</li>
      ))}
    </p>
    <hr />
  </div>
);
