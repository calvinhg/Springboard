const App = () => (
  <div>
    <FirstComponent />
    <NamedComponent name="Bob" />
  </div>
);

ReactDOM.render(<App />, document.querySelector("#root"));
