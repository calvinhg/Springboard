const App = () => (
  <div>
    <Person
      name="Bob"
      age={9}
      hobbies={["bicycles", "fire trucks", "race cars"]}
    />
    <Person
      name="Susan"
      age={10}
      hobbies={["mcdonald's", "eat hot chip", "lie"]}
    />
    <Person
      name="Bill"
      age={21}
      hobbies={["vooooting", "race cars", "coffee"]}
    />
  </div>
);

ReactDOM.render(<App />, document.querySelector("#root"));
