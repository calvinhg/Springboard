DROP DATABASE IF EXISTS biztime;

CREATE DATABASE biztime;

\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS comps_inds;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE comps_inds (
  id serial PRIMARY KEY,
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
  ind_code text NOT NULL REFERENCES industries ON DELETE CASCADE,
  UNIQUE (comp_code, ind_code)
);

INSERT INTO companies VALUES
  ('apple', 'Apple Computer', 'Maker of OSX.'),
  ('ibm', 'IBM', 'Big blue.'),
  ('google', 'Alphabet', 'Ruler of the underworld.'),
  ('dell', 'Dell Computers', 'We''ll DELLete Mac.'),
  ('samsung', 'Samsung', 'Certified no suicide nets.'),
  ('tesla', 'Tesla', 'Loves government contracts.'),
  ('yamaha', 'Yamaha', 'Vroom vroom strum strum beep beep.'),
  ('nissan', 'Nissan', 'Datsun was a better name.');

INSERT INTO industries VALUES
  ('pc', 'Personal Computers'),
  ('phone', 'Smartphones'),
  ('software', 'Software'),
  ('auto', 'Automotive'),
  ('music', 'Musical instruments');

INSERT INTO comps_inds (comp_code, ind_code) VALUES
  ('apple', 'pc'), ('apple', 'phone'),
  ('apple', 'software'), ('ibm', 'pc'),
  ('ibm', 'software'), ('google', 'pc'),
  ('google', 'phone'), ('google', 'software'),
  ('dell', 'pc'), ('samsung', 'phone'),
  ('samsung', 'software'), ('tesla', 'software'),
  ('tesla', 'auto'), ('yamaha', 'auto'),
  ('yamaha', 'music'), ('nissan', 'auto');


INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES
  ('apple', 100, false, null),
  ('apple', 200, false, null),
  ('apple', 300, true, '2018-01-01'),
  ('ibm', 400, false, null);
