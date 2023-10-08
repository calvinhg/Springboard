const Tweet = ({ username, name, date, message }) => (
  <div className="tweet">
    <h4>
      Tweet by {name} (@{username})
    </h4>
    <p>{message}</p>
    <small>{date}</small>
    <hr />
  </div>
);
