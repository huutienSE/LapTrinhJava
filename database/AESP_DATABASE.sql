DROP DATABASE IF EXISTS aesp_database;
CREATE DATABASE IF NOT EXISTS aesp_database;
USE aesp_database;

DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user
(
    user_id       INT PRIMARY KEY AUTO_INCREMENT,
    user_name     VARCHAR(50)            NOT NULL,
    password_hash VARCHAR(255)           NOT NULL,
    email         VARCHAR(50) UNIQUE KEY NOT NULL,
    status        ENUM ('ACTIVE' , 'DISABLE'),
    created_date  DATETIME DEFAULT (CURRENT_TIMESTAMP())
);

DROP TABLE IF EXISTS role;
CREATE TABLE IF NOT EXISTS role
(
    role_id   INT PRIMARY KEY AUTO_INCREMENT,
    role_name ENUM ('LEARNER' , 'MENTOR' , 'ADMIN')
);

DROP TABLE IF EXISTS user_role;
CREATE TABLE user_role
(
    role_id INT DEFAULT 1,
    user_id INT,

    PRIMARY KEY (role_id, user_id),

    FOREIGN KEY (role_id)
        REFERENCES role (role_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_role_user ON user_role (user_id);

DROP TABLE IF EXISTS plan;
CREATE TABLE IF NOT EXISTS plan
(
    plan_id      INT PRIMARY KEY AUTO_INCREMENT,
    plan_name    ENUM ('FREE' , 'PRO' , 'MENTOR'),
    price        INT,
    duration_day INT,
    description  VARCHAR(200)
);

DROP TABLE IF EXISTS subscription;
CREATE TABLE IF NOT EXISTS subscription
(
    subscription_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id         INT,
    plan_id         INT,
    started_date    DATE DEFAULT (CURRENT_TIMESTAMP()),
    end_date        DATE,
    status          ENUM ('ACTIVE' , 'NOTACTIVE'),

    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (plan_id)
        REFERENCES plan (plan_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_subscription_user ON subscription (user_id);

DROP TABLE IF EXISTS profile;
CREATE TABLE IF NOT EXISTS profile
(
    profile_id  INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT UNIQUE,
    first_name  VARCHAR(50),
    last_name   VARCHAR(50),
    birth_date  DATE,
    level       ENUM ('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    target_goal VARCHAR(50),
    occupation  VARCHAR(50),

    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_profile_user ON profile (user_id);

DROP TABLE IF EXISTS topic;
CREATE TABLE IF NOT EXISTS topic
(
    topic_id         INT PRIMARY KEY AUTO_INCREMENT,
    creator_id       INT,
    topic_name       VARCHAR(50) NOT NULL,
    description      VARCHAR(200),
    difficulty_level ENUM ('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    created_date     DATETIME DEFAULT (CURRENT_TIMESTAMP()),

    FOREIGN KEY (creator_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_topic_creator ON topic (creator_id);

DROP TABLE IF EXISTS practice_session;
CREATE TABLE IF NOT EXISTS practice_session
(
    session_id   INT PRIMARY KEY AUTO_INCREMENT,
    user_id      INT,
    topic_id     INT,
    session_type ENUM ('PRACTICE' , 'ASSESSMENT'),
    started_time DATETIME DEFAULT (CURRENT_TIMESTAMP()),
    ended_time   DATETIME,
    score        INT CHECK (score BETWEEN 0 AND 100),

    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (topic_id)
        REFERENCES topic (topic_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_session_user ON practice_session (user_id);
CREATE INDEX idx_session_topic ON practice_session (topic_id);

DROP TABLE IF EXISTS assessment;
CREATE TABLE IF NOT EXISTS assessment
(
    assessment_id  INT PRIMARY KEY AUTO_INCREMENT,
    user_id        INT,
    session_id     INT UNIQUE,
    score          INT CHECK (score BETWEEN 0 AND 100),
    level_assigned ENUM ('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    taken_date     DATETIME DEFAULT (CURRENT_TIMESTAMP()),

    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (session_id)
        REFERENCES practice_session (session_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_assessment_user ON assessment (user_id);

DROP TABLE IF EXISTS question;
CREATE TABLE IF NOT EXISTS question
(
    question_id      INT PRIMARY KEY AUTO_INCREMENT,
    topic_id         INT,
    creator_id       INT,
    description      VARCHAR(200),
    difficulty_level ENUM ('BEGINNER' , 'INTERMEDIATE' , 'ADVANCED'),
    created_date     DATETIME DEFAULT (CURRENT_TIMESTAMP()),

    FOREIGN KEY (topic_id)
        REFERENCES topic (topic_id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (creator_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_question_topic ON question (topic_id);

DROP TABLE IF EXISTS practice_question;
CREATE TABLE IF NOT EXISTS practice_question
(
    session_id  INT,
    question_id INT,

    PRIMARY KEY (session_id, question_id),

    FOREIGN KEY (session_id)
        REFERENCES practice_session (session_id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    FOREIGN KEY (question_id)
        REFERENCES question (question_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE INDEX idx_question_creator ON question (creator_id);

CREATE TABLE practice_answer
(
    answer_id    INT PRIMARY KEY AUTO_INCREMENT,
    session_id   INT NOT NULL,
    question_id  INT NOT NULL,
    user_answer  VARCHAR(100),
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP(),

    FOREIGN KEY (session_id, question_id)
        REFERENCES practice_question (session_id, question_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_answer_session_question ON practice_answer (session_id, question_id);

DROP TABLE IF EXISTS feedback;
CREATE TABLE IF NOT EXISTS feedback
(
    feedback_id   INT PRIMARY KEY AUTO_INCREMENT,
    answer_id     INT UNIQUE,
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    feedback_text VARCHAR(200),
    created_date  DATETIME DEFAULT (CURRENT_TIMESTAMP()),
    FOREIGN KEY (answer_id)
        REFERENCES practice_answer (answer_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_feedback_answer ON feedback (answer_id);

DROP TABLE IF EXISTS admin_log;
CREATE TABLE IF NOT EXISTS admin_log
(
    log_id         INT PRIMARY KEY AUTO_INCREMENT,
    admin_id       INT,
    action         ENUM ('ENABLE_USER', 'DISABLE_USER'),
    target_user_id INT,
    target_type    ENUM ('USER', 'TOPIC', 'PLAN'),
    created_date   DATETIME DEFAULT (CURRENT_TIMESTAMP()),
    FOREIGN KEY (admin_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_admin_log_admin ON admin_log (admin_id);
CREATE INDEX idx_admin_log_target ON admin_log (target_user_id);

DROP PROCEDURE IF EXISTS procedure_insert;
DELIMITER //
CREATE PROCEDURE procedure_insert()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            RESIGNAL;
        END;
    START TRANSACTION;

    INSERT INTO role (role_name)
    VALUES ('LEARNER'),
           ('MENTOR'),
           ('ADMIN');

    INSERT INTO user (user_name, password_hash, email, status)
    VALUES ('huutienSE', '12345678910', 'huutien@gmail.com', 'ACTIVE'),
           ('nhandeptrai', '12345678910', 'nhannguyen@gmail.com', 'ACTIVE'),
           ('tientuiteen', '12345678910', 'tientuiteen@gmail.com', 'ACTIVE'),
           ('benten', '12345678910', 'benten@gmail.com', 'ACTIVE'),
           ('nguoidungvip', '12345678910', 'siuvipro@gmail.com', 'ACTIVE'),
           ('dunghoianhtaisao', '12345678910', 'khondunghoi@gmail.com', 'ACTIVE'),
           ('nhaanhodauthe', '12345678910', 'timvenoianh@gmail.com', 'ACTIVE'),
           ('skibidi', '12345678910', 'skibidi@gmail.com', 'ACTIVE'),
           ('toilet', '12345678910', 'toilet@gmail.com', 'ACTIVE');

    INSERT INTO user_role (role_id, user_id)
    VALUES (3, 1),
           (3, 2),
           (3, 3),
           (3, 4),
           (1, 5),
           (1, 6),
           (1, 7),
           (2, 8),
           (2, 9);

    INSERT INTO plan (plan_name, price, description)
    VALUES ('FREE', 0, 'sử dụng được các dịch vụ cơ bản và có thể truy cập AI 5 lần / ngày'),
           ('PRO', 1000000, 'Sử dụng được các dịch vụ cao cấp và truy cập AI không giới hạn'),
           ('MENTOR', 3000000, 'Sử dụng được tất cả dịch vụ và có mentor 1 : 1');


    INSERT INTO subscription (user_id, plan_id, end_date, status)
    VALUES (5, 3, CURRENT_DATE + INTERVAL 30 DAY, 'ACTIVE'),
           (6, 2, CURRENT_DATE + INTERVAL 30 DAY, 'ACTIVE'),
           (7, 2, CURRENT_DATE + INTERVAL 30 DAY, 'ACTIVE'),
           (9, 3, CURRENT_DATE + INTERVAL 30 DAY, 'ACTIVE');

    INSERT INTO profile(user_id, first_name, last_name, birth_date, level)
    VALUES (1, 'Huynh Phan Huu', 'Tien', '2001-01-01', 'ADVANCED'),
           (2, 'Nguyen Thien', 'Nhan', '2002-02-02', 'ADVANCED'),
           (3, 'Phan Van', 'Tien', '1999-05-14', 'ADVANCED'),
           (4, 'Nhan Tre', 'Trau', '2000-05-14', 'ADVANCED'),
           (5, 'sieu vip', 'promax', '2003-03-03', 'BEGINNER'),
           (6, 'Dung Hoi Anh', 'Tai Sao', '2020-04-04', 'INTERMEDIATE'),
           (7, 'Tim Ve Noi', 'Anh', '2015-06-06', 'BEGINNER'),
           (8, 'Nguyen Van', 'Skibidi', '2015-06-06', 'ADVANCED'),
           (9, 'Nguyen Van', 'Toilet', '2012-05-02', 'ADVANCED');


    INSERT INTO topic (creator_id, topic_name, description, difficulty_level)
    VALUES (2, 'daily life', 'Topics about everyday conversations', 'BEGINNER');


    INSERT INTO practice_session(user_id, topic_id, session_type, ended_time, score)
    VALUES (5, 1, 'PRACTICE', CURRENT_TIME - INTERVAL 30 MINUTE, 50),
           (5, 1, 'PRACTICE', CURRENT_TIME - INTERVAL 30 MINUTE, 20),
           (5, 1, 'PRACTICE', CURRENT_TIME - INTERVAL 30 MINUTE, 50),
           (6, 1, 'PRACTICE', CURRENT_TIME - INTERVAL 30 MINUTE, 90),
           (7, 1, 'PRACTICE', CURRENT_TIME - INTERVAL 30 MINUTE, 60),
           (8, 1, 'PRACTICE', CURRENT_TIME - INTERVAL 30 MINUTE, 80);


    INSERT INTO question (topic_id, creator_id, description, difficulty_level)
    VALUES (1, 2, 'What do you usually do on weekends?', 'BEGINNER'),
           (1, 2, 'Do you like watching movies?', 'BEGINNER'),
           (1, 2, 'What kind of music do you like?', 'BEGINNER'),
           (1, 2, 'How often do you exercise?', 'BEGINNER'),

           (1, 2, 'Do you like studying English?', 'INTERMEDIATE'),
           (1, 2, 'What is your favorite place?', 'INTERMEDIATE'),
           (1, 2, 'Do you prefer city or countryside?', 'INTERMEDIATE'),

           (1, 2, 'What do you do after school?', 'ADVANCED'),
           (1, 2, 'Do you use social media every day?', 'ADVANCED'),
           (1, 2, 'What is your dream job?', 'ADVANCED'),

           (1, 2, 'Do you like traveling abroad?', 'BEGINNER'),
           (1, 2, 'What is your daily routine?', 'BEGINNER'),
           (1, 2, 'Do you like reading books?', 'INTERMEDIATE'),
           (1, 2, 'How do you relax?', 'INTERMEDIATE'),
           (1, 2, 'What do you do in the evening?', 'ADVANCED'),
           (1, 2, 'Do you like fast food?', 'BEGINNER'),
           (1, 2, 'What is your favorite drink?', 'INTERMEDIATE'),
           (1, 2, 'Do you like sports?', 'ADVANCED'),
           (1, 2, 'What do you usually eat for breakfast?', 'BEGINNER'),
           (1, 2, 'Do you like coffee?', 'INTERMEDIATE');


    INSERT INTO practice_question (session_id, question_id)
    VALUES (1, 5),
           (1, 6),
           (1, 7),
           (1, 8),
           (1, 9),
           (1, 10),
           (1, 11),
           (1, 12),
           (2, 1),
           (2, 11),
           (2, 12),
           (2, 13),
           (2, 14),
           (2, 15),
           (2, 16),
           (3, 2),
           (3, 3),
           (3, 17),
           (3, 18),
           (3, 19),
           (3, 20),
           (4, 1),
           (4, 4),
           (4, 7),
           (4, 10),
           (4, 13),
           (4, 16),
           (5, 2),
           (5, 5),
           (5, 8),
           (5, 11),
           (5, 14),
           (5, 17),
           (6, 3),
           (6, 6),
           (6, 9),
           (6, 12),
           (6, 15),
           (6, 18);

    INSERT INTO practice_answer (session_id, question_id, user_answer)
    VALUES (1, 5, 'Yes I love English'),
           (1, 6, 'My house'),
           (1, 7, 'City'),
           (1, 8, 'I relax'),
           (1, 9, 'Yes every day'),
           (1, 10, 'Doctor'),
           (1, 11, 'Yes I do'),
           (1, 12, 'Wake up, go to school'),
           (2, 1, 'Exercise'),
           (2, 11, 'Yes'),
           (2, 12, 'Study'),
           (2, 13, 'Yes I read books'),
           (2, 14, 'Watch movies'),
           (2, 15, 'I relax'),
           (2, 16, 'Yes I like fast food'),
           (3, 2, 'Yes'),
           (3, 3, 'Pop music'),
           (3, 17, 'Water'),
           (3, 18, 'Football'),
           (3, 19, 'Bread'),
           (3, 20, 'Yes'),
           (4, 1, 'Jogging'),
           (4, 4, '3 times a week'),
           (4, 7, 'City'),
           (4, 10, 'Developer'),
           (4, 13, 'Yes'),
           (4, 16, 'Sometimes'),
           (5, 2, '6 AM'),
           (5, 5, 'Yes'),
           (5, 8, 'Play game'),
           (5, 11, 'No'),
           (5, 14, 'Listen music'),
           (5, 17, 'Tea'),
           (6, 3, 'Rock'),
           (6, 6, 'Park'),
           (6, 9, 'Yes'),
           (6, 12, 'Study'),
           (6, 15, 'Watch TV'),
           (6, 18, 'Basketball');

    INSERT INTO feedback (answer_id, overall_score, feedback_text)
    VALUES (1, 78, 'Good answer with understandable grammar'),
           (2, 65, 'Answer is understandable but too short'),
           (3, 82, 'Nice sentence structure and clear meaning'),
           (4, 74, 'Good communication but vocabulary is basic'),
           (5, 70, 'Simple answer with acceptable grammar'),
           (6, 76, 'Clear response and easy to understand'),
           (7, 80, 'Good confidence and natural expression'),
           (8, 73, 'Answer is fine but needs more details'),
           (9, 67, 'Short answer with limited vocabulary'),
           (10, 85, 'Very good answer and natural speaking'),
           (11, 88, 'Strong answer with good vocabulary'),
           (12, 72, 'Clear answer but grammar can improve'),
           (13, 79, 'Good communication and understandable'),
           (14, 75, 'Good response but lacks sentence variety'),
           (15, 83, 'Very natural answer with fluent expression'),
           (16, 68, 'Understandable but too simple'),
           (17, 77, 'Nice answer with acceptable grammar'),
           (18, 84, 'Good fluency and clear pronunciation'),
           (19, 75, 'Good but short answer'),
           (20, 80, 'Clear answer'),
           (21, 65, 'Need better grammar'),
           (22, 70, 'Understandable'),
           (23, 85, 'Very good'),
           (24, 60, 'Too simple'),
           (25, 90, 'Excellent'),
           (26, 88, 'Great answer'),
           (27, 70, 'Ok but improve vocabulary'),
           (28, 92, 'Very fluent'),
           (29, 69, 'Answer is understandable but not detailed'),
           (30, 74, 'Good response with simple vocabulary'),
           (31, 81, 'Clear answer and good sentence flow'),
           (32, 63, 'Need more vocabulary and grammar practice'),
           (33, 79, 'Good communication overall'),
           (34, 87, 'Excellent answer with fluent style'),
           (35, 71, 'Acceptable response but could be longer'),
           (36, 76, 'Clear and natural answer'),
           (37, 82, 'Good vocabulary and sentence structure'),
           (38, 66, 'Basic answer with minor grammar mistakes'),
           (39, 78, 'Good overall communication');

    INSERT INTO admin_log(admin_id, action, target_user_id, target_type)
    VALUES (1, 'DISABLE_USER', 11, 'USER');
    COMMIT;
END //
DELIMITER ;

CALL procedure_insert();
/*
DELIMITER //

CREATE TRIGGER after_user_insert
    AFTER INSERT ON user
    FOR EACH ROW
BEGIN
    -- Mặc định gán role_id = 1 (LEARNER) cho mỗi user mới
    INSERT INTO user_role (user_id, role_id)
    VALUES (NEW.user_id, 1);
END //

DELIMITER ;
*/

/* JSON CALL
	{
		"userName": "j97",
		"email": "jack5cu@gmail.com",
		"password": "12345678910"
	}
*/
DROP PROCEDURE IF EXISTS seed_assessment_data;
DELIMITER //
CREATE PROCEDURE seed_assessment_data(IN p_email VARCHAR(50))
BEGIN

    DECLARE v_user_id INT;
    DECLARE v_session_id INT;

    SELECT user_id
    INTO v_user_id
    FROM user
    WHERE email = p_email;

    -- profile
    INSERT INTO profile(user_id, first_name, last_name, birth_date, level)
    VALUES (v_user_id, 'Trinh Tran Phuong', 'Tuan', '1997-07-07', 'INTERMEDIATE');

    -- practice session
    INSERT INTO practice_session(user_id, topic_id, session_type, ended_time, score)
    VALUES (v_user_id, 1, 'ASSESSMENT', CURRENT_TIMESTAMP - INTERVAL 30 MINUTE, 20);

    SET v_session_id = LAST_INSERT_ID();

    -- assessment
    INSERT INTO assessment(user_id, session_id, score, level_assigned)
    VALUES (v_user_id, v_session_id, 20, 'BEGINNER');

    -- practice question
    INSERT INTO practice_question(session_id, question_id)
    VALUES (v_session_id, 1),
           (v_session_id, 2),
           (v_session_id, 3),
           (v_session_id, 4),
           (v_session_id, 5),
           (v_session_id, 6),
           (v_session_id, 7),
           (v_session_id, 8),
           (v_session_id, 9),
           (v_session_id, 10);

    -- practice answer
    INSERT INTO practice_answer(session_id, question_id, user_answer)
    VALUES (v_session_id, 1, 'I wake up early'),
           (v_session_id, 2, '7 AM'),
           (v_session_id, 3, 'Yes I like cooking'),
           (v_session_id, 4, 'I watch YouTube'),
           (v_session_id, 5, 'Coffee'),
           (v_session_id, 6, 'At home'),
           (v_session_id, 7, 'City'),
           (v_session_id, 8, 'I study'),
           (v_session_id, 9, 'Yes'),
           (v_session_id, 10, 'Engineer');

    INSERT INTO feedback(answer_id, feedback_text, overall_score)
    VALUES (40, 'Good sentence structure and grammar.', 9),
           (41, 'Clear answer but could be more complete.', 7),
           (42, 'Good expression and understandable.', 8),
           (43, 'Simple but correct response.', 7),
           (44, 'Very short answer, add more detail.', 6),
           (45, 'Correct answer with acceptable grammar.', 8),
           (46, 'Too short and lacks context.', 5),
           (47, 'Basic but understandable.', 7),
           (48, 'Valid answer but should be expanded.', 6),
           (49, 'Correct profession answer.', 8);

END //

DELIMITER ;

-- CALL seed_assessment_data('jack5cu@gmail.com');

