-- write your queries here

\c joins_exercise

SELECT * FROM owners o
  LEFT JOIN vehicles v
    ON o.id = v.owner_id;


SELECT o.first_name, o.last_name, COUNT(*) FROM owners o
  JOIN vehicles v
    ON o.id = v.owner_id
  GROUP BY o.id
  ORDER BY first_name;


SELECT o.first_name, o.last_name, ROUND(AVG(price)) AS average_price, COUNT(*)
  FROM owners o
  JOIN vehicles v
    ON o.id = v.owner_id
  GROUP BY o.id
  HAVING COUNT(*) > 1 AND AVG(PRICE) > 10000
  ORDER BY o.first_name DESC;