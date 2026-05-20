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

INSERT INTO role (role_name)
VALUES ('LEARNER'),
       ('MENTOR'),
       ('ADMIN');

