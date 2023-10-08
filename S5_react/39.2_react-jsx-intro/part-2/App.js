const App = () => (
  <div>
    <Tweet
      username="bob123"
      name="Bob Ross"
      message="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, dignissimos."
      date="today"
    />
    <Tweet
      username="bill456"
      name="Bill Eyelash"
      message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, accusamus!"
      date="yesterday"
    />
    <Tweet
      username="susan789"
      name="Susan Wojack"
      message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, recusandae?"
      date="tomorrow"
    />
  </div>
);

ReactDOM.render(<App />, document.querySelector("#root"));
