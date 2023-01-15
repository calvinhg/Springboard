-- PART THREE
\c products_db

-- Q1
INSERT INTO products (name, price, can_be_returned)
  VALUES ('chair', 44.00, false);
-- Q2
INSERT INTO products (name, price, can_be_returned)
  VALUES ('stool', 25.99, true);
-- Q3
INSERT INTO products (name, price, can_be_returned)
  VALUES ('table', 124.0, false);
-- Q4
SELECT * FROM products;
-- Q5
SELECT name FROM products;
-- Q6
SELECT name, price FROM products;
-- Q7
INSERT INTO products (name, price, can_be_returned)
  VALUES ('bench', 29.00, true);
-- Q8
SELECT * FROM products
  WHERE can_be_returned;
-- Q9
SELECT * FROM products
  WHERE price < 44.00;
-- Q10
SELECT * FROM products
  WHERE price BETWEEN 22.50 AND 99.99;
-- Q11
UPDATE products SET price = price-20;
-- Q12
DELETE FROM products WHERE price < 25;
-- Q13
UPDATE products SET price = price+20;
-- Q14
UPDATE products SET can_be_returned = true;

-- PART FOUR
\c playstore

-- Q1
SELECT * FROM analytics WHERE id = 1880;
-- Q2
SELECT id, app_name FROM analytics
  WHERE last_updated = '2018-08-01'
  LIMIT 100; -- limited so it doesn't spam
-- Q3
SELECT genres, COUNT(*) FROM analytics
  GROUP BY genres
  ORDER BY COUNT(*) DESC;
-- Q4
SELECT app_name, reviews FROM analytics
  ORDER BY reviews DESC
  LIMIT 5;
-- Q5
SELECT * FROM analytics
  WHERE rating >= 4.8
  ORDER BY reviews DESC
  LIMIT 1;
-- Q6
SELECT genres, AVG(rating) FROM analytics
  GROUP BY genres
  HAVING AVG(rating) != 0
  ORDER BY AVG(rating) DESC;
-- Q7
SELECT app_name, price, rating FROM analytics
  WHERE rating < 3
  ORDER BY price DESC
  LIMIT 1;
-- Q8
SELECT app_name, rating, min_installs FROM analytics
  WHERE min_installs <= 50
  AND rating > 0
  ORDER BY rating DESC;
-- Q9
SELECT app_name, rating, reviews FROM analytics
  WHERE rating < 3 AND reviews >= 10000;
-- Q10
SELECT app_name, price, reviews FROM analytics
  WHERE price BETWEEN .10 AND 1.00
  ORDER BY reviews DESC
  LIMIT 10;
-- Q11
SELECT app_name, last_updated FROM analytics
  ORDER BY last_updated
  LIMIT 1;
-- Q12
SELECT app_name, price FROM analytics
  ORDER BY price DESC
  LIMIT 1;
-- Q13
SELECT SUM(reviews) AS sum_reviews FROM analytics;
-- Q14
SELECT genres, COUNT(*) FROM analytics
  GROUP BY genres
  HAVING COUNT(*) > 300;
-- Q15
SELECT app_name, reviews, min_installs, min_installs/reviews AS prop
  FROM analytics
  WHERE min_installs > 100000
  ORDER BY prop DESC
  LIMIT 1;
-- FS2
SELECT app_name, rating FROM analytics
  WHERE app_name ILIKE '%facebook%';