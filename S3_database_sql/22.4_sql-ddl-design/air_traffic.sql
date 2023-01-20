-- from the terminal run:
-- psql < air_traffic.sql

DROP DATABASE IF EXISTS air_traffic;

CREATE DATABASE air_traffic;

\c air_traffic

CREATE TABLE tickets_old
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  seat TEXT NOT NULL,
  departure TIMESTAMP NOT NULL,
  arrival TIMESTAMP NOT NULL,
  airline TEXT NOT NULL,
  from_city TEXT NOT NULL,
  from_country TEXT NOT NULL,
  to_city TEXT NOT NULL,
  to_country TEXT NOT NULL
);

INSERT INTO tickets_old
  (first_name, last_name, seat, departure, arrival, airline, from_city, from_country, to_city, to_country)
VALUES
  ('Jennifer', 'Finch', '33B', '2018-04-08 09:00:00', '2018-04-08 12:00:00', 'United', 'Washington DC', 'United States', 'Seattle', 'United States'),
  ('Thadeus', 'Gathercoal', '8A', '2018-12-19 12:45:00', '2018-12-19 16:15:00', 'British Airways', 'Tokyo', 'Japan', 'London', 'United Kingdom'),
  ('Sonja', 'Pauley', '12F', '2018-01-02 07:00:00', '2018-01-02 08:03:00', 'Delta', 'Los Angeles', 'United States', 'Las Vegas', 'United States'),
  ('Jennifer', 'Finch', '20A', '2018-04-15 16:50:00', '2018-04-15 21:00:00', 'Delta', 'Seattle', 'United States', 'Mexico City', 'Mexico'),
  ('Waneta', 'Skeleton', '23D', '2018-08-01 18:30:00', '2018-08-01 21:50:00', 'TUI Fly Belgium', 'Paris', 'France', 'Casablanca', 'Morocco'),
  ('Thadeus', 'Gathercoal', '18C', '2018-10-31 01:15:00', '2018-10-31 12:55:00', 'Air China', 'Dubai', 'UAE', 'Beijing', 'China'),
  ('Berkie', 'Wycliff', '9E', '2019-02-06 06:00:00', '2019-02-06 07:47:00', 'United', 'New York', 'United States', 'Charlotte', 'United States'),
  ('Alvin', 'Leathes', '1A', '2018-12-22 14:42:00', '2018-12-22 15:56:00', 'American Airlines', 'Cedar Rapids', 'United States', 'Chicago', 'United States'),
  ('Berkie', 'Wycliff', '32B', '2019-02-06 16:28:00', '2019-02-06 19:18:00', 'American Airlines', 'Charlotte', 'United States', 'New Orleans', 'United States'),
  ('Cory', 'Squibbes', '10D', '2019-01-20 19:30:00', '2019-01-20 22:45:00', 'Avianca Brasil', 'Sao Paolo', 'Brazil', 'Santiago', 'Chile');

SELECT * FROM tickets_old;

CREATE TABLE airlines (
  id SERIAL PRIMARY KEY,
  airline TEXT NOT NULL
);

CREATE TABLE nations (
  id SERIAL PRIMARY KEY,
  nation TEXT NOT NULL
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  nation_id INT NOT NULL REFERENCES nations ON DELETE SET NULL
);

CREATE TABLE flights (
  id SERIAL PRIMARY KEY,
  departure TIMESTAMP NOT NULL,
  arrival TIMESTAMP NOT NULL,
  airline INT NOT NULL REFERENCES airlines ON DELETE CASCADE,
  from_city INT NOT NULL REFERENCES cities ON DELETE CASCADE,
  to_city INT NOT NULL REFERENCES cities ON DELETE CASCADE
);

CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  seat VARCHAR(4) NOT NULL,
  flight INT NOT NULL REFERENCES flights ON DELETE CASCADE
);


INSERT INTO airlines (airline) VALUES
  ('Air China'), ('American Airlines'), ('Avianca Brasil'),
  ('British Airways'), ('Delta'), ('TUI Fly Belgium'), ('United');

INSERT INTO nations (nation) VALUES
  ('Brazil'), ('Chile'), ('China'), ('France'), ('Japan'), ('Mexico'),
  ('Morocco'), ('UAE'), ('United Kingdom'), ('United States');

INSERT INTO cities (city, nation_id) VALUES
  ('Beijing', 3), ('Casablanca', 7), ('Cedar Rapids', 10),
  ('Charlotte', 10), ('Chicago', 10), ('Dubai', 8),
  ('Las Vegas', 10), ('London', 9), ('Los Angeles', 10),
  ('Mexico City', 6), ('New Orleans', 10), ('New York', 10),
  ('Paris', 4), ('Santiago', 2), ('Sao Paulo', 1),
  ('Seattle', 10), ('Tokyo', 5), ('Washington DC', 10);

INSERT INTO flights
  (departure, arrival, airline, from_city, to_city) VALUES
    ('2018-04-08 09:00:00', '2018-04-08 12:00:00', 7, 18, 16),
    ('2018-12-19 12:45:00', '2018-12-19 16:15:00', 4, 17, 8),
    ('2018-01-02 07:00:00', '2018-01-02 08:03:00', 5, 9, 7),
    ('2018-04-15 16:50:00', '2018-04-15 21:00:00', 5, 16, 10),
    ('2018-08-01 18:30:00', '2018-08-01 21:50:00', 6, 13, 2),
    ('2018-10-31 01:15:00', '2018-10-31 12:55:00', 1, 6, 1),
    ('2019-02-06 06:00:00', '2019-02-06 07:47:00', 7, 12, 4),
    ('2018-12-22 14:42:00', '2018-12-22 15:56:00', 2, 3, 5),
    ('2019-02-06 16:28:00', '2019-02-06 19:18:00', 2, 4, 11),
    ('2019-01-20 19:30:00', '2019-01-20 22:45:00', 3, 15, 14);

INSERT INTO tickets (first_name, last_name, seat, flight) VALUES
  ('Jennifer', 'Finch', '33B', 1),
  ('Thadeus', 'Gathercoal', '8A', 2),
  ('Sonja', 'Pauley', '12F', 3),
  ('Jennifer', 'Finch', '20A', 4),
  ('Waneta', 'Skeleton', '23D', 5),
  ('Thadeus', 'Gathercoal', '18C', 6),
  ('Berkie', 'Wycliff', '9E', 7),
  ('Alvin', 'Leathes', '1A', 8),
  ('Berkie', 'Wycliff', '32B', 9),
  ('Cory', 'Squibbes', '10D', 10);


SELECT t.id, t.first_name, t.last_name, t.seat,
       f.departure, f.arrival, a.airline, 
       c1.city as from_city, n1.nation as from_country,
       c2.city as to_city, n2.nation as to_country
FROM flights f
  JOIN airlines a ON f.airline = a.id
  JOIN cities c1 ON f.from_city = c1.id
  JOIN nations n1 ON n1.id = c1.nation_id
  JOIN cities c2 ON f.to_city = c2.id
  JOIN nations n2 ON n2.id = c2.nation_id
  JOIN tickets t ON f.id = t.flight;