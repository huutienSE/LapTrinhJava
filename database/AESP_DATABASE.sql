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
    created_date DATETIME DEFAULT(CURRENT_TIMESTAMP())
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

CREATE INDEX idx_user_role_user ON user_role(user_id);

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
    started_date DATE DEFAULT (CURRENT_TIMESTAMP()),
    end_date DATE ,
    status ENUM('ACTIVE' , 'NOTACTIVE'),
    
    FOREIGN KEY (user_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
        
	FOREIGN KEY (plan_id)
		REFERENCES plan(plan_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_subscription_user ON subscription(user_id);

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

CREATE INDEX idx_profile_user ON profile(user_id);

DROP TABLE IF EXISTS assessment;
CREATE TABLE IF NOT EXISTS assessment(
	assessment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT ,
    score INT CHECK (score BETWEEN 0 AND 100),
    level_assigned ENUM('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    taken_date DATETIME DEFAULT(CURRENT_TIMESTAMP()),
    
    FOREIGN KEY (user_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_assessment_user ON assessment(user_id);

DROP TABLE IF EXISTS topic;
CREATE TABLE IF NOT EXISTS topic(
	topic_id INT PRIMARY KEY AUTO_INCREMENT,
	creator_id INT ,
    topic_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    difficulty_level ENUM('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    created_date DATETIME DEFAULT(CURRENT_TIMESTAMP()),
    
    FOREIGN KEY (creator_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_topic_creator ON topic(creator_id);

DROP TABLE IF EXISTS practice_session;
CREATE TABLE IF NOT EXISTS practice_session(
	session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    topic_id INT,
    started_time DATETIME DEFAULT(CURRENT_TIMESTAMP()),
    ended_time DATETIME,
    score INT CHECK(score BETWEEN 0 AND 100),
    
    FOREIGN KEY (user_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
        
	FOREIGN KEY (topic_id)
		REFERENCES topic(topic_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_session_user ON practice_session(user_id);
CREATE INDEX idx_session_topic ON practice_session(topic_id);

DROP TABLE IF EXISTS practice_question;
CREATE TABLE IF NOT EXISTS practice_question(
	question_id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT,
    creator_id INT,
    description VARCHAR(200),
    created_date DATETIME DEFAULT (CURRENT_TIMESTAMP()),
    
    FOREIGN KEY (topic_id)
		REFERENCES topic(topic_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
        
	FOREIGN KEY (creator_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE INDEX idx_question_topic ON practice_question(topic_id);
CREATE INDEX idx_question_creator ON practice_question(creator_id);

DROP TABLE IF EXISTS practice_answer;
CREATE TABLE IF NOT EXISTS practice_answer(
	answer_id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT ,
    question_id INT ,
    user_answer VARCHAR(100) ,
    created_date DATETIME DEFAULT (CURRENT_TIMESTAMP()),
    FOREIGN KEY (session_id)
		REFERENCES practice_session(session_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (question_id)
		REFERENCES practice_question(question_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_answer_session ON practice_answer(session_id);
CREATE INDEX idx_answer_question ON practice_answer(question_id);

DROP TABLE IF EXISTS feedback;
CREATE TABLE IF NOT EXISTS feedback(
	feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    answer_id INT,
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    feedback_text VARCHAR(200),
    created_date DATETIME DEFAULT(CURRENT_TIMESTAMP()),
    FOREIGN KEY (answer_id)
		REFERENCES practice_answer(answer_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_feedback_answer ON feedback(answer_id);

DROP TABLE IF EXISTS admin_log;
CREATE TABLE IF NOT EXISTS admin_log(
	log_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT ,
    action ENUM ('ENABLE_USER', 'DISABLE_USER'),
    target_user_id INT ,
    target_type ENUM('USER', 'TOPIC', 'PLAN'),
    created_date DATETIME DEFAULT (CURRENT_TIMESTAMP()),
    FOREIGN KEY (admin_id)
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_admin_log_admin ON admin_log(admin_id);
CREATE INDEX idx_admin_log_target ON admin_log(target_user_id);

DROP PROCEDURE IF EXISTS procedure_insert;
DELIMITER \\
CREATE PROCEDURE procedure_insert()
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        RESIGNAL;
	END;
	START TRANSACTION;
		INSERT INTO user (user_name , password_hash , email , status)
		VALUES 			
		('huutienSE' , '12345678910' , 'huutien@gmail.com' , 'ACTIVE'),
		('nhandeptrai' , '12345678910' , 'nhannguyen@gmail.com' , 'ACTIVE'),
		('tientuiteen' , '12345678910' , 'tientuiteen@gmail.com' , 'ACTIVE'),
		('benten' , '12345678910' , 'benten@gmail.com' , 'ACTIVE'),
		('nguoidungvip' , '12345678910' , 'siuvipro@gmail.com' , 'ACTIVE'),
		('dunghoianhtaisao' , '12345678910' , 'khondunghoi@gmail.com' , 'ACTIVE'),
		('nhaanhodauthe' , '12345678910' , 'timvenoianh@gmail.com' , 'ACTIVE'),
		('j97' , '12345678910' , 'jack5cu@gmail.com' , 'ACTIVE'),
		('skibidi' , '12345678910' , 'skibidi@gmail.com' , 'ACTIVE'),
		('toilet' , '12345678910' , 'toilet@gmail.com' , 'ACTIVE');
						 

		INSERT INTO role (role_name)
		VALUES 
		('LEARNER'),
		('MENTOR'),
		('ADMIN');
			   

		INSERT INTO user_role (role_id , user_id)
		VALUES				  
		(3 , 1),
		(3 , 2),
		(3 , 3),
		(3 , 4),
		(1 , 5),
		(1 , 6),
		(1 , 7),
		(1 , 8),
		(2 , 9),
		(2 , 10);

		INSERT INTO plan (plan_name , price , description)
		VALUES			 
		('FREE' , 0 , 'sử dụng được các dịch vụ cơ bản và có thể truy cập AI 5 lần / ngày'),
		('PRO' , 1000000 , 'Sử dụng được các dịch vụ cao cấp và truy cập AI không giới hạn'),
		('MENTOR' , 3000000 , 'Sử dụng được tất cả dịch vụ và có mentor 1 : 1');


		INSERT INTO subscription (user_id , plan_id , end_date , status)
		VALUES 					 
		(5 , 3 , CURRENT_DATE + INTERVAL 30 DAY , 'ACTIVE'),
		(6 , 2 , CURRENT_DATE + INTERVAL 30 DAY , 'ACTIVE'),
		(7 , 2 , CURRENT_DATE + INTERVAL 30 DAY , 'ACTIVE'),
		(8 , 3 , CURRENT_DATE + INTERVAL 30 DAY , 'ACTIVE');

		INSERT INTO profile(user_id , email , full_name , birth_date , level)
		VALUES 
		(1 , 'huutien@gmail.com' , 'Huynh Phan Huu Tien', '2001-01-01' , 'ADVANCED'),
		(2 , 'nhannguyen@gmail.com' , 'Nguyen Thien Nhan' ,'2002-02-02' , 'ADVANCED'),
		(3 , 'tientuiteen@gmail.com' , 'Phan Van Tien' , '1999-05-14' , 'ADVANCED'),
		(4 , 'benten@gmail.com' , 'Nhan Tre Trau' , '2000-05-14' , 'ADVANCED'),
		(5 , 'siuvipro@gmail.com' , 'sieu vip promax' ,'2003-03-03' , 'BEGINNER'),
		(6 , 'khondunghoi@gmail.com' , 'Dung Hoi Anh Tai Sao' , '2020-04-04' , 'INTERMEDIATE'),
		(7 , 'timvenoianh@gmail.com' , 'Tim Ve Noi Anh' ,'2015-06-06' , 'BEGINNER'),
		(8 , 'jack5cu@gmail.com' , 'Phuong Tuan' ,'1997-07-07' , 'INTERMEDIATE'),
		(9 , 'skibidi@gmail.com' , 'Nguyen Van Skibidi' , '2015-06-06' , 'ADVANCED'),
		(10 , 'toilet@gmail.com' , 'Nguyen Van Toilet' ,'2012-05-02' , 'ADVANCED');


		INSERT INTO assessment (user_id , score , level_assigned)
		VALUES
		(5 , 20 , 'BEGINNER'),
		(6 , 60 , 'INTERMEDIATE'),
		(7 , 30 , 'BEGINNER'),
		(8 , 50 , 'INTERMEDIATE'),
		(9 , 80 , 'ADVANCED'),
		(10 , 90 , 'ADVANCED');


		INSERT INTO topic (creator_id, topic_name, description, difficulty_level)
		VALUES
		(2, 'daily life', 'Topics about everyday conversations', 'BEGINNER');


		INSERT INTO practice_session(user_id , topic_id , ended_time , score)
		VALUES 
		(5 , 1 , CURRENT_TIME - INTERVAL 30 MINUTE , 20),
		(5 , 1 , CURRENT_TIME - INTERVAL 30 MINUTE , 50),
		(5 , 1 , CURRENT_TIME - INTERVAL 30 MINUTE , 20),
		(5 , 1 , CURRENT_TIME - INTERVAL 30 MINUTE , 50),
		(8 , 1 , CURRENT_TIME - INTERVAL 30 MINUTE , 80),
		(6 , 1 , CURRENT_TIME - INTERVAL 30 MINUTE , 90),
		(7 , 1 , CURRENT_TIME - INTERVAL 30 MINUTE , 60);


		INSERT INTO practice_question(topic_id , creator_id , description)
		VALUES
		(1 , 2 , "What do you usually do in the morning ?"),
		(1 , 2 , "What time do you wake up every day ?"),
		(1 , 2 , "Do you like cooking at home ?"),
		(1 , 2 , "What do you do in your free time ?"),
		(1 , 2 , "Do you prefer coffee or tea ?"),
		(1 , 2 , "How do you go to school or work ?"),
		(1 , 2 , "What is your favorite food ?"),
		(1 , 2 , "Do you like listening to music ?");

		INSERT INTO practice_answer (session_id, question_id, user_answer)
		VALUES
		(1, 1, 'I usually wake up early and brush my teeth.'),
		(1, 2, 'I wake up at 7 AM every day.'),
		(1, 3, 'Yes, I like cooking simple meals.'),
		(1, 4, 'I watch YouTube in my free time.'),
		(2, 1, 'I check my phone after waking up.'),
		(2, 2, 'Around 6:30 AM.'),
		(2, 5, 'I prefer coffee.'),
		(2, 6, 'I go to school by motorbike.'),
		(3, 1, 'I usually exercise in the morning.'),
		(3, 7, 'My favorite food is fried chicken.'),
		(4, 3, 'Yes, I cook sometimes.'),
		(4, 8, 'Yes, I love listening to music.'),
		(5, 1, 'I wake up and go jogging.'),
		(5, 2, 'At 5:30 AM.'),
		(6, 4, 'I read books when I am free.'),
		(6, 5, 'I prefer tea.'),
		(7, 6, 'I go to school by bus.'),
		(7, 7, 'I like pizza.');

		INSERT INTO feedback (answer_id, overall_score, feedback_text)
		VALUES
		(1, 70, 'Good answer but grammar needs improvement.'),
		(2, 80, 'Clear and correct sentence structure.'),
		(3, 60, 'Vocabulary is basic, try to expand more.'),
		(4, 70, 'Nice answer but could be more detailed.'),
		(5, 60, 'Sentence is understandable but has grammar mistakes.'),
		(6, 90, 'Very natural response, well done.'),
		(7, 80, 'Good fluency but minor pronunciation issues.'),
		(8, 80, 'Well structured and easy to understand.'),
		(9, 80, 'Excellent answer with strong vocabulary.'),
		(10, 70, 'Good attempt but needs more clarity.'),
		(11, 60, 'Simple but correct. Try longer sentences.'),
		(12, 90, 'Very fluent and natural speaking style.'),
		(13, 90, 'Confident answer with good grammar.'),
		(14, 80, 'Nice response but can add more details.'),
		(15, 90, 'Excellent! Very close to native level.'),
		(16, 70, 'Understandable but lacks variety.'),
		(17, 70, 'Good but a bit repetitive.'),
		(18, 80, 'Clear and confident speaking.');

		INSERT INTO admin_log(admin_id , action , target_user_id , target_type)
		VALUES
		(1 , 'DISABLE_USER' , 11 , 'USER');
	COMMIT;
END \\
DELIMITER ;

CALL procedure_insert();
