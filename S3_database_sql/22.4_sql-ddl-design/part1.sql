-- DROP DATABASE IF EXISTS medical_center;
-- CREATE DATABASE medical_center;
-- \c medical_center;

-- CREATE TABLE doctors (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   phone INT
-- );

-- CREATE TABLE patients (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   phone INT,
--   address TEXT
-- );

-- CREATE TABLE diseases (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL
-- );

-- CREATE TABLE doctors_patients (
--   id SERIAL PRIMARY KEY,
--   doc_id INT REFERENCES doctors ON DELETE CASCADE,
--   patient_id INT REFERENCES patients ON DELETE CASCADE
-- );

-- CREATE TABLE patients_diseases (
--   id SERIAL PRIMARY KEY,
--   patient_id INT REFERENCES patients ON DELETE CASCADE,
--   disease_id INT REFERENCES diseases ON DELETE CASCADE
-- );


-- DROP DATABASE IF EXISTS craigslist;
-- CREATE DATABASE craigslist;
-- \c craigslist;

-- CREATE TABLE regions (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL
-- );

-- CREATE TABLE categories (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL
-- );

-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   username VARCHAR(15) UNIQUE NOT NULL,
--   name TEXT NOT NULL,
--   phone INT,
--   email TEXT,
--   region_id INT REFERENCES regions ON DELETE SET NULL
-- );

-- CREATE TABLE posts (
--   id SERIAL PRIMARY KEY,
--   owner_id INT REFERENCES users ON DELETE CASCADE,
--   category_id INT REFERENCES categories ON DELETE SET NULL,
--   region_id INT REFERENCES regions ON DELETE SET NULL,

--   title VARCHAR(50) NOT NULL,
--   content TEXT,
--   location TEXT,
--   date_posted TIMESTAMP
-- );

-- CREATE TABLE pictures (
--   id SERIAL PRIMARY KEY,
--   post_id INT REFERENCES posts ON DELETE CASCADE,
--   href TEXT NOT NULL,
--   ord INT NOT NULL
-- );

DROP DATABASE IF EXISTS soccer_league;
CREATE DATABASE soccer_league;
\c soccer_league;

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  age int NOT NULL
);

CREATE table teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  home TEXT NOT NULL
);

CREATE TABLE teams_players (
  id SERIAL PRIMARY KEY,
  player_id INT REFERENCES players ON DELETE CASCADE,
  team_id INT REFERENCES teams ON DELETE CASCADE
);

CREATE TABLE seasons (
  id SERIAL PRIMARY KEY,
  start_date date NOT NULL,
  end_date date NOT NULL
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  win_team INT REFERENCES teams ON DELETE SET NULL,
  win_pts INT NOT NULL,
  lost_team INT REFERENCES teams ON DELETE SET NULL,
  lost_pts INT NOT NULL,

  season_id INT REFERENCES seasons ON DELETE SET NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  player_id INT REFERENCES players ON DELETE SET NULL,
  team_id INT REFERENCES teams ON DELETE CASCADE,
  match_id INT REFERENCES matches ON DELETE CASCADE
);

CREATE TABLE referees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INT NOT NULL
);

CREATE TABLE matches_referees (
  id SERIAL PRIMARY KEY,
  match_id INT REFERENCES matches ON DELETE CASCADE,
  ref_id INT REFERENCES referees ON DELETE CASCADE
);