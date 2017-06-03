CREATE TABLE todoTable (
    user_id serial PRIMARY KEY,
    todo text,
    completed boolean
);

SELECT * FROM todoTable;

INSERT INTO todoTable (todo, completed)
VALUES ('Wash the Cars', false);

DROP TABLE students;
