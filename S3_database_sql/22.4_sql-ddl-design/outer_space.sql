-- from the terminal run:
-- psql < outer_space.sql

DROP DATABASE IF EXISTS outer_space;

CREATE DATABASE outer_space;

\c outer_space

CREATE TABLE planets_old
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  orbital_period_in_years FLOAT NOT NULL,
  orbits_around TEXT NOT NULL,
  galaxy TEXT NOT NULL,
  moons TEXT[]
);

INSERT INTO planets_old
  (name, orbital_period_in_years, orbits_around, galaxy, moons)
VALUES
  ('Earth', 1.00, 'The Sun', 'Milky Way', '{"The Moon"}'),
  ('Mars', 1.88, 'The Sun', 'Milky Way', '{"Phobos", "Deimos"}'),
  ('Venus', 0.62, 'The Sun', 'Milky Way', '{}'),
  ('Neptune', 164.8, 'The Sun', 'Milky Way', '{"Naiad", "Thalassa", "Despina", "Galatea", "Larissa", "S/2004 N 1", "Proteus", "Triton", "Nereid", "Halimede", "Sao", "Laomedeia", "Psamathe", "Neso"}'),
  ('Proxima Centauri b', 0.03, 'Proxima Centauri', 'Milky Way', '{}'),
  ('Gliese 876 b', 0.23, 'Gliese 876', 'Milky Way', '{}');

SELECT * FROM planets_old;

CREATE TABLE planets (
  id SERIAL PRIMARY KEY,
  planet TEXT NOT NULL,
  orbital_period FLOAT NOT NULL
);
CREATE TABLE moons (
  id SERIAL PRIMARY KEY,
  moon TEXT NOT NULL
);
CREATE TABLE stars (
  id SERIAL PRIMARY KEY,
  star TEXT NOT NULL
);
CREATE TABLE galaxies (
  id SERIAL PRIMARY KEY,
  galaxy TEXT NOT NULL
);

CREATE TABLE planets_moons (
  id SERIAL PRIMARY KEY,
  planet INT NOT NULL REFERENCES planets ON DELETE CASCADE,
  moon INT NOT NULL REFERENCES moons ON DELETE CASCADE
);
CREATE TABLE planets_stars (
  id SERIAL PRIMARY KEY,
  planet INT NOT NULL REFERENCES planets ON DELETE CASCADE,
  star INT NOT NULL REFERENCES stars ON DELETE CASCADE
);
CREATE TABLE stars_galaxies (
  id SERIAL PRIMARY KEY,
  star INT NOT NULL REFERENCES stars ON DELETE CASCADE,
  galaxy INT NOT NULL REFERENCES galaxies ON DELETE CASCADE
);

INSERT INTO planets (planet, orbital_period) VALUES
  ('Earth', 1.00), ('Mars', 1.88), ('Venus', 0.62),
  ('Neptune', 164.8), ('Proxima Centauri b', 0.03),
  ('Gliese 876 b', 0.23);

INSERT INTO moons (moon) VALUES
  ('The Moon'), ('Phobos'), ('Deimos'), ('Naiad'),
  ('Thalassa'), ('Despina'), ('Galatea'), ('Larissa'),
  ('S/2004 N 1'), ('Proteus'), ('Triton'), ('Nereid'),
  ('Halimede'), ('Sao'), ('Laomedeia'), ('Psamathe'),
  ('Neso');

INSERT INTO stars (star) VALUES
  ('The Sun'), ('Proxima Centauri'), ('Gliese 876');

INSERT INTO galaxies (galaxy) VALUES
  ('Milky Way');

INSERT INTO planets_moons (planet, moon) VALUES
  (1, 1), (2, 2), (2, 3), (4, 4), (4, 5),
  (4, 6), (4, 7), (4, 8), (4, 9), (4, 10),
  (4, 11), (4, 12), (4, 14), (4, 14),
  (4, 15), (4, 16), (4, 17);

INSERT INTO planets_stars (planet, star) VALUES
  (1, 1), (2, 1), (3, 1), (4, 1), (5, 2), (6, 3);

INSERT INTO stars_galaxies (star, galaxy) VALUES
  (1, 1), (2, 1), (3, 1);

-- WORKS EXCEPT IT SHOWS 1 MOON FOR PLANETS THAT DON'T HAVE ANY
  
SELECT p.id, p.planet, p.orbital_period,
       s.star as orbits_around, g.galaxy,
       COUNT(*) AS moon_count FROM planets p
  LEFT JOIN planets_moons pm  ON pm.planet = p.id
  LEFT JOIN moons m           ON pm.moon = m.id
  LEFT JOIN planets_stars ps  ON ps.planet = p.id
  LEFT JOIN stars s           ON ps.star = s.id
  LEFT JOIN stars_galaxies sg ON sg.star = s.id
  LEFT JOIN galaxies g        ON sg.galaxy = g.id
  GROUP BY p.id, s.star, g.galaxy
  ORDER BY p.id;