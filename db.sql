-- How I made my db 
-- Don't forget to sign in and then \c assignments_db

-- -- CREATE DATABASE assignments_db;

-- CREATE TABLE IF NOT EXISTS users (
--     user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     name varchar(50) NOT NULL UNIQUE,
--     discipline_type varchar(50) NOT NULL,
--     email varchar(255) NOT NULL UNIQUE

-- );

-- INSERT INTO users(name,discipline_type,email) VALUES ('Shawn', 'Software', 'placeholder');

-- CREATE TABLE IF NOT EXISTS assignments (
--     id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     user_id int REFERENCES users(user_id) ON DELETE CASCADE,    
--     course_name TEXT,
--     assignment_title TEXT,
--     due_date TIMESTAMP,
--     url TEXT,
--     weight NUMERIC,
--     description TEXT,
--     scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- ALTER TABLE assignments
-- -- ADD CONSTRAINT unique_assignment
-- -- UNIQUE(user_id, course_name, assignment_title, due_date);

-- -- SELECT * FROM assignments INNER JOIN users ON assignments.user_id = users.user_id;

-- -- user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE


-- USE THIS TO MAKE THE OUTPUT LOOK ORGANISED.
-- SELECT
--     assignment_title,
--     course_name,
--     due_date
-- FROM assignments;