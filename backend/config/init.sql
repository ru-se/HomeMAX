
CREATE DATABASE IF NOT EXISTS Homemax;
USE Homemax;


CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(200) NOT NULL,
  password TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS letters (
  letter_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message VARCHAR(500)  NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS homemax (
  happiness_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL ,
  letter_id INT NOT NULL,
  compliment TEXT NOT NULL,
  positive_aspects TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (letter_id) REFERENCES letters(letter_id)
);


CREATE TABLE IF NOT EXISTS tasks (
   task_id INT AUTO_INCREMENT PRIMARY KEY,
   task_name VARCHAR(100) NOT NULL,
   task_type VARCHAR(100) NOT NULL,
   status VARCHAR(100) NOT NULL,
   user_id INT,
   FOREIGN KEY (user_id) REFERENCES users(user_id)
 );




CREATE TABLE IF NOT EXISTS analysis (
  analysis_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  average_compliments_per_day INT NOT NULL,
  compliment_focus_area TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);


-- 初期データを挿入
INSERT INTO users (username, email, password) VALUES
('田中', '58hack@kindai.ac.jp', '5858'),
('佐藤', '59hack@kindai.ac.jp', '5959');