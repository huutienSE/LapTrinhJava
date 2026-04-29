INSERT INTO role (role_name)
VALUES
    ('LEARNER'),
    ('MENTOR'),
    ('ADMIN');

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

INSERT INTO profile(user_id , email , first_name , last_name , birth_date , level)
VALUES
    (1 , 'huutien@gmail.com' , 'Huynh Phan Huu' , 'Tien', '2001-01-01' , 'ADVANCED'),
    (2 , 'nhannguyen@gmail.com' , 'Nguyen Thien' , 'Nhan' ,'2002-02-02' , 'ADVANCED'),
    (3 , 'tientuiteen@gmail.com' , 'Phan Van' ,  'Tien' , '1999-05-14' , 'ADVANCED'),
    (4 , 'benten@gmail.com' , 'Nhan Tre' , 'Trau' , '2000-05-14' , 'ADVANCED'),
    (5 , 'siuvipro@gmail.com' , 'sieu vip' , 'promax' ,'2003-03-03' , 'BEGINNER'),
    (6 , 'khondunghoi@gmail.com' , 'Dung Hoi Anh' , 'Tai Sao' , '2020-04-04' , 'INTERMEDIATE'),
    (7 , 'timvenoianh@gmail.com' , 'Tim Ve Noi' , 'Anh' ,'2015-06-06' , 'BEGINNER'),
    (8 , 'jack5cu@gmail.com' , 'Trinh Tran Phuong' , 'Tuan' ,'1997-07-07' , 'INTERMEDIATE'),
    (9 , 'skibidi@gmail.com' , 'Nguyen Van' , 'Skibidi' , '2015-06-06' , 'ADVANCED'),
    (10 , 'toilet@gmail.com' , 'Nguyen Van' , 'Toilet' ,'2012-05-02' , 'ADVANCED');


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


INSERT INTO practice_session(user_id , topic_id , session_type, ended_time , score)
VALUES
    (5 , 1 , 'ASSESSMENT' ,CURRENT_TIME - INTERVAL 30 MINUTE , 20),
    (5 , 1 , 'PRACTICE' ,CURRENT_TIME - INTERVAL 30 MINUTE , 50),
    (5 , 1 , 'PRACTICE' ,CURRENT_TIME - INTERVAL 30 MINUTE , 20),
    (5 , 1 , 'PRACTICE' ,CURRENT_TIME - INTERVAL 30 MINUTE , 50),
    (8 , 1 , 'PRACTICE' ,CURRENT_TIME - INTERVAL 30 MINUTE , 80),
    (6 , 1 , 'PRACTICE' ,CURRENT_TIME - INTERVAL 30 MINUTE , 90),
    (7 , 1 , 'PRACTICE' ,CURRENT_TIME - INTERVAL 30 MINUTE , 60);


INSERT INTO question (topic_id, creator_id, description, difficulty_level)
VALUES
    (1,2,'What do you usually do on weekends?','BEGINNER'),
    (1,2,'Do you like watching movies?','BEGINNER'),
    (1,2,'What kind of music do you like?','BEGINNER'),
    (1,2,'How often do you exercise?','BEGINNER'),

    (1,2,'Do you like studying English?','INTERMEDIATE'),
    (1,2,'What is your favorite place?','INTERMEDIATE'),
    (1,2,'Do you prefer city or countryside?','INTERMEDIATE'),

    (1,2,'What do you do after school?','ADVANCED'),
    (1,2,'Do you use social media every day?','ADVANCED'),
    (1,2,'What is your dream job?','ADVANCED'),

    (1,2,'Do you like traveling abroad?','BEGINNER'),
    (1,2,'What is your daily routine?','BEGINNER'),
    (1,2,'Do you like reading books?','INTERMEDIATE'),
    (1,2,'How do you relax?','INTERMEDIATE'),
    (1,2,'What do you do in the evening?','ADVANCED'),
    (1,2,'Do you like fast food?','BEGINNER'),
    (1,2,'What is your favorite drink?','INTERMEDIATE'),
    (1,2,'Do you like sports?','ADVANCED'),
    (1,2,'What do you usually eat for breakfast?','BEGINNER'),
    (1,2,'Do you like coffee?','INTERMEDIATE');

INSERT INTO practice_question (session_id, question_id)
VALUES
    (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),
    (2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),
    (3,1),(3,11),(3,12),(3,13),(3,14),(3,15),(3,16),
    (4,2),(4,3),(4,17),(4,18),(4,19),(4,20),
    (5,1),(5,4),(5,7),(5,10),(5,13),(5,16),
    (6,2),(6,5),(6,8),(6,11),(6,14),(6,17),
    (7,3),(7,6),(7,9),(7,12),(7,15),(7,18);

INSERT INTO practice_answer (session_id, question_id, user_answer)
VALUES
    (1,1,'I wake up early'),
    (1,2,'7 AM'),
    (1,3,'Yes I like cooking'),
    (1,4,'I watch YouTube'),
    (1,5,'Coffee'),
    (1,6,'At home'),
    (1,7,'City'),
    (1,8,'I study'),
    (1,9,'Yes'),
    (1,10,'Engineer'),
    (2,5,'Yes I love English'),
    (2,6,'My house'),
    (2,7,'City'),
    (2,8,'I relax'),
    (2,9,'Yes every day'),
    (2,10,'Doctor'),
    (2,11,'Yes I do'),
    (2,12,'Wake up, go to school'),
    (3,1,'Exercise'),
    (3,11,'Yes'),
    (3,12,'Study'),
    (3,13,'Yes I read books'),
    (3,14,'Watch movies'),
    (3,15,'I relax'),
    (3,16,'Yes I like fast food'),
    (4,2,'Yes'),
    (4,3,'Pop music'),
    (4,17,'Water'),
    (4,18,'Football'),
    (4,19,'Bread'),
    (4,20,'Yes'),
    (5,1,'Jogging'),
    (5,4,'3 times a week'),
    (5,7,'City'),
    (5,10,'Developer'),
    (5,13,'Yes'),
    (5,16,'Sometimes'),
    (6,2,'6 AM'),
    (6,5,'Yes'),
    (6,8,'Play game'),
    (6,11,'No'),
    (6,14,'Listen music'),
    (6,17,'Tea'),
    (7,3,'Rock'),
    (7,6,'Park'),
    (7,9,'Yes'),
    (7,12,'Study'),
    (7,15,'Watch TV'),
    (7,18,'Basketball');

INSERT INTO feedback (answer_id, overall_score, feedback_text)
VALUES
    (19,75,'Good but short answer'),
    (20,80,'Clear answer'),
    (21,65,'Need better grammar'),
    (22,70,'Understandable'),
    (23,85,'Very good'),
    (24,60,'Too simple'),
    (25,90,'Excellent'),
    (26,88,'Great answer'),
    (27,70,'Ok but improve vocabulary'),
    (28,92,'Very fluent');

INSERT INTO admin_log(admin_id , action , target_user_id , target_type)
VALUES
    (1 , 'DISABLE_USER' , 11 , 'USER');