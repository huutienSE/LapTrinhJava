DROP DATABASE IF EXISTS aesp_database;
CREATE DATABASE IF NOT EXISTS aesp_database;
USE aesp_database;

DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(50) UNIQUE KEY NOT NULL,
	status ENUM ('ACTIVE' , 'DISABLE') ,
    created_date DATETIME DEFAULT(NOW())
);

DROP TABLE IF EXISTS role;
CREATE TABLE IF NOT EXISTS role(
	role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name ENUM('LEARNER' , 'MENTOR' , 'ADMIN')
);

DROP TABLE IF EXISTS user_role;
CREATE TABLE user_role(
	role_id INT,
	user_id INT,
    PRIMARY KEY (role_id , user_id),
    FOREIGN KEY (role_id)
        REFERENCES role(role_id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES user(user_id)
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS plan;
CREATE TABLE IF NOT EXISTS plan(
	plan_id INT PRIMARY KEY AUTO_INCREMENT,
    plan_name ENUM('FREE' , 'PRO' , 'MENTOR'),
    price INT ,
    duration_day INT ,
    description VARCHAR(200)
);

DROP TABLE IF EXISTS subscription;
CREATE TABLE IF NOT EXISTS subscription (
	subscription_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plan_id INT,
    started_date DATE DEFAULT CURRENT_TIMESTAMP,
    end_date DATE ,
    status ENUM('ACTIVE' , 'NOTACTIVE'),
    FOREIGN KEY (user_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (plan_id)
		REFERENCES plan(plan_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS profile;
CREATE TABLE IF NOT EXISTS profile (
	profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT ,
    email VARCHAR(50) UNIQUE KEY ,
	full_name VARCHAR(50),
    birth_date DATE,
    level ENUM('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    target_goal VARCHAR(50),
    occupation VARCHAR(50),
    FOREIGN KEY (user_id) 
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS assessment;
CREATE TABLE IF NOT EXISTS assessment(
	assessment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT ,
    score INT CHECK ( score BETWEEN 0 AND 100),
    level_assigned ENUM('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    taken_date DATETIME DEFAULT(NOW()),
    FOREIGN KEY (user_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS topic;
CREATE TABLE IF NOT EXISTS topic(
	topic_id INT PRIMARY KEY AUTO_INCREMENT,
	creator_id INT ,
    topic_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    diffculty_level ENUM('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    created_date DATETIME DEFAULT(NOW()),
    FOREIGN KEY (creator_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS practice_session;
CREATE TABLE IF NOT EXISTS practice_session(
	session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    topic_id INT,
    started_time DATETIME DEFAULT(now()),
    ended_time DATETIME,
    score INT CHECK(score BETWEEN 0 AND 100),
    FOREIGN KEY (user_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (topic_id)
		REFERENCES topic(topic_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS practice_question;
CREATE TABLE IF NOT EXISTS practice_question(
	question_id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT,
    creator_id INT,
    diffculty_level ENUM('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    created_date DATETIME DEFAULT (NOW()),
    FOREIGN KEY (topic_id)
		REFERENCES topic(topic_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (creator_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS practice_answer;
CREATE TABLE IF NOT EXISTS practice_answer(
	answer_id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT ,
    question_id INT ,
    user_answer VARCHAR(100) ,
    created_date DATETIME DEFAULT (NOW()),
    FOREIGN KEY (session_id)
		REFERENCES practice_session(session_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (question_id)
		REFERENCES practice_question(question_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS feedback;
CREATE TABLE IF NOT EXISTS feedback(
	feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    answer_id INT,
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    feedback_text VARCHAR(200),
    created_date DATETIME DEFAULT(NOW()),
    FOREIGN KEY (answer_id)
		REFERENCES practice_answer(answer_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS admin_log;
CREATE TABLE IF NOT EXISTS admin_log(
	log_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT ,
    action ENUM ('ENABLE_USER', 'DISABLE_USER'),
    target_user_id INT ,
    target_type ENUM('USER', 'TOPIC', 'PLAN'),
    created_date DATETIME DEFAULT (NOW()),
    FOREIGN KEY (admin_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

DESCRIBE user;

INSERT INTO role (role_name) VALUES 
('LEARNER'),
('MENTOR'),
('ADMIN');